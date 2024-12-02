from typing import Dict, Any
from django.conf import settings
from django.db.models.query import QuerySet
from django.db import transaction
from domain_driven_api.application.file.services import FileAppServices

from domain_driven_api.domain.document.models import Document
from domain_driven_api.domain.document.services import DocumentServices
from domain_driven_api.domain.user.models import User
from domain_driven_api.application.direct_report.services import DirectReportAppServices
from domain_driven_api.application.user.services import UserAppServices
from domain_driven_api.application.roles.services import UserRolesAppServices
from domain_driven_api.application.company.services import CompanyDivisionAppServices
from utils.django.exceptions import (
    DoNotHavePermissionException,
    DocumentException,
    DocumentNotExistsException,
    FileExtensionNotAllowedException,
    NotFromSameCompanyException,
    UserNotExistException,
)

from utils.global_methods.global_value_objects import UserID
from utils.global_methods.check_instance_permissions import (
    InstanceAccessPermission,
    ModuleInstanceType,
)
from utils.global_methods.instance_permissions_generator import (
    generate_instance_permissions,
    generate_permissions_for_all_users,
)
from domain_driven_api.infrastructure.logger.models import AttributeLogger


class DocumentAppServices:
    def __init__(self, log: AttributeLogger) -> None:
        self.log = log
        self.document_services = DocumentServices()
        self.user_app_services = UserAppServices(log=self.log)
        self.file_app_services = FileAppServices(
            log=self.log, user_app_service=self.user_app_services
        )
        self.user_roles_app_service = UserRolesAppServices(log=self.log)
        self.direct_report_app_services = DirectReportAppServices(log=self.log)
        self.company_division_app_service = CompanyDivisionAppServices(log=self.log)
        self.instance_access_permission = InstanceAccessPermission(log=self.log)

    def _generate_document_permission_as_per_owner_role(
        self, user_is_ceo: bool, owner: User, document_obj_id: str
    ) -> None:
        """
        Generates document permissions based on the owner's role.

        Parameters:
            user_is_ceo (bool): Flag indicating if the user is a CEO.
            owner (User): The owner of the document.
            document_obj_id (str): The ID of the document object.

        Returns:
            None
        """
        if user_is_ceo:
            all_reportee_of_ceo = self.user_app_services.reportee_tracker_app_services.get_reportee_trackers_from_senior_id(
                senior_id=str(owner.id)
            )
            if all_reportee_of_ceo:
                user_id_list_of_c_level = list(
                    map(
                        lambda user_id: str(user_id),
                        all_reportee_of_ceo.values_list("reportee_id", flat=True),
                    )
                )

                generate_permissions_for_all_users(
                    log=self.log,
                    user=owner,
                    instance_id=document_obj_id,
                    module_type="documents",
                    read_permission=True,
                    write_permission=False,  # C-level user can only read(View) this documents
                    users_list=user_id_list_of_c_level,
                )
        else:
            # Get seniors of new owner
            all_seniors = (
                self.user_app_services.reportee_tracker_app_services.get_all_seniors(
                    reportee_id=str(owner.id)
                )
            )
            # All seniors can read and write the documents of their junior
            if all_seniors:
                generate_permissions_for_all_users(
                    log=self.log,
                    user=owner,
                    instance_id=document_obj_id,
                    module_type="documents",
                    read_permission=True,
                    write_permission=True,
                    users_list=all_seniors,
                )

    def create_document_from_dict(
        self,
        user: User,
        data: Dict[str, Any],
        file_obj=None,
        company_id=None,
        is_success_manager=False,
    ) -> Document:
        title = data.get("title")
        priority = data.get("priority")
        status = data.get("status")
        link = data.get("link", None)
        document_owner = data.get("owner", None)
        """
        Create a document from a dictionary.

        Parameters:
            user (User): The user object creating the document.
            data (Dict[str, Any]): A dictionary containing the document data.
            file_obj (Optional): The file object to be attached to the document. Defaults to None.
            company_id (Optional): The ID of the company. Defaults to None.
            is_success_manager (bool): Flag indicating if the user is a success manager. Defaults to False.

        Returns:
            Document: The created document object.

        Raises:
            FileExtensionNotAllowedException: If the file extension is not allowed.
            DocumentException: If the link or document is required.
            DocumentException: If trying to create a private document for another user.

        """
        if file_obj:
            file_extension = file_obj.name.split(".")[-1]
            if file_extension not in settings.ALLOWED_FILE_EXTENSIONS:
                raise FileExtensionNotAllowedException(
                    "file-extension-not-allowed-exception",
                    f"{file_extension} type file is not allowed. Please try to upload a different type of file.",
                    self.log,
                )

        if link is None and file_obj is None:
            raise DocumentException(
                "document-exception", "The link or document is required.", self.log
            )

        if company_id and is_success_manager:
            ceo_user_obj = self.user_app_services.get_ceo_user_object(
                company_id=company_id
            )
            user = ceo_user_obj if ceo_user_obj else user

        if document_owner:
            if status == Document.PRIVATE:
                raise DocumentException(
                    "document-exception",
                    "You cannot create private documents for other users.",
                    self.log,
                )
        try:
            with transaction.atomic():
                document_factory_method = self.document_services.get_document_factory()

                user_id = user.id
                user_name = user.username

                if document_owner:
                    owner_details = self.user_app_services.user_services.get_user_by_id(
                        id=document_owner
                    )
                    user_id = owner_details.id
                    user_name = owner_details.username

                if not link:
                    file_instance = (
                        self.file_app_services.create_or_update_file_from_file_obj(
                            file_obj=file_obj, user=user, user_name=user_name
                        )
                    )
                    link = file_instance.url

                document_obj = document_factory_method.build_entity_with_id(
                    title=title,
                    priority=priority,
                    status=status,
                    owner=UserID(value=user_id),
                    link=link,
                    is_file_uploaded=True if file_obj else False,
                    file_name=file_obj.name if file_obj else None,
                )
                document_obj.save()

                document_instance = generate_instance_permissions(
                    instance_id=document_obj.id
                )

                #  update direct report of document creator
                self.direct_report_app_services.update_direct_report_by_user_id(
                    user=owner_details if document_owner else user,
                    module_type="documents",
                    instance=document_instance,
                )

                if status == Document.SHARED:

                    owner_is_ceo = self.user_app_services.is_user_role_ceo(
                        user=owner_details if document_owner else user
                    )
                    if owner_is_ceo:
                        all_reportee_of_ceo = self.user_app_services.reportee_tracker_app_services.get_reportee_trackers_from_senior_id(
                            senior_id=(
                                str(owner_details.id)
                                if document_owner
                                else str(user.id)
                            )
                        )

                        all_user_of_ceo_reportee = list(
                            map(
                                lambda user_id: str(user_id),
                                all_reportee_of_ceo.values_list(
                                    "reportee_id", flat=True
                                ),
                            )
                        )
                        if all_user_of_ceo_reportee:
                            generate_permissions_for_all_users(
                                log=self.log,
                                user=owner_details if document_owner else user,
                                instance_id=document_obj.id,
                                module_type="documents",
                                read_permission=True,
                                write_permission=False,
                                users_list=all_user_of_ceo_reportee,
                            )
                    else:
                        # get seniors
                        all_seniors = self.user_app_services.reportee_tracker_app_services.get_all_seniors(
                            reportee_id=str(user_id)
                        )
                        # All seniors can read and write the documents of their junior
                        if all_seniors:
                            generate_permissions_for_all_users(
                                log=self.log,
                                user=owner_details if document_owner else user,
                                instance_id=document_obj.id,
                                module_type="documents",
                                read_permission=True,
                                write_permission=True,
                                users_list=all_seniors,
                            )
                return document_obj
        except Exception as e:
            raise e

    def list_all_documents(self, user: User, company_id=None) -> QuerySet[Document]:
        """
        Returns a QuerySet of all documents based on the user and company ID.

        Parameters:
            user (User): The user object.
            company_id (Optional[int]): The ID of the company. Defaults to None.

        Returns:
            QuerySet[Document]: A QuerySet of all documents.

        """
        user_role = self.user_roles_app_service.get_user_role_by_user_id(
            user_id=user.id
        )
        users_list = (
            self.user_roles_app_service.list_user_roles()
            .filter(
                company_id=(
                    company_id
                    if (company_id and user_role.is_success_manager)
                    else user_role.company_id
                )
            )
            .values_list("user_id", flat=True)
        )
        return self.document_services.get_document_repo().filter(owner__in=users_list)

    def list_documents(
        self,
        user: User,
        direct_report_id: str,
    ) -> QuerySet[Document]:
        """
        Returns a QuerySet of documents based on the user and direct report ID.

        Parameters:
            user (User): The user object.
            direct_report_id (str): The ID of the direct report.

        Returns:
            QuerySet[Document]: A QuerySet of documents.

        """
        direct_report = self.direct_report_app_services.get_direct_report_by_id(
            direct_report_id=direct_report_id
        )
        if not direct_report.documents:
            return self.document_services.get_document_repo().none()

        permissions_dict = {
            item["id"]: item["permissions"] for item in direct_report.documents
        }

        if str(direct_report.user_id) != str(user.id):
            private_documents = self.document_services.get_document_repo().filter(
                owner=direct_report.user_id, status=Document.PRIVATE
            )
            if private_documents:
                for document in private_documents:
                    if str(document.id) in permissions_dict.keys():
                        permissions_dict.pop(str(document.id))

        queryset = (
            self.document_services.get_document_repo()
            .annotate_by_direct_report_permission(
                permissions=direct_report.documents,
                filters=dict(
                    is_active=True,
                    id__in=list(permissions_dict.keys()),
                ),
            )
            .order_by("-created_at")
        )

        return queryset

    def update_document_from_dict(
        self,
        user: User,
        data: Dict[str, Any],
        document_id: str,
        file_obj=None,
        company_id=None,
        is_success_manager=False,
    ) -> Document:
        """
        Update a document from a dictionary.

        Parameters:
            user (User): The user object updating the document.
            data (Dict[str, Any]): A dictionary containing the updated document data.
            document_id (str): The ID of the document to be updated.
            file_obj (Optional): The file object to be attached to the document. Defaults to None.
            company_id (Optional): The ID of the company. Defaults to None.
            is_success_manager (bool): Flag indicating if the user is a success manager. Defaults to False.

        Returns:
            Document: The updated document object.

        Raises:
            DocumentNotExistsException: If the document does not exist.
            FileExtensionNotAllowedException: If the file extension is not allowed.
            DoNotHavePermissionException: If trying to update the owner and status of the document at the same time.
            UserNotExistException: If the new owner does not exist.
            NotFromSameCompanyException: If the new owner does not belong to the same user company.

        """
        status = data.get("status", None)
        new_owner_id = data.get("owner", None)

        # Update with common global service
        self.instance_access_permission.has_write_access(
            user_id=str(user.id),
            instance_id=str(document_id),
            module_type=ModuleInstanceType.DOCUMENTS,
            company_id=company_id,
        )

        document_obj = (
            self.list_all_documents(user=user, company_id=company_id)
            .filter(id=document_id)
            .first()
        )
        if not document_obj:
            raise DocumentNotExistsException(
                "document-not-found-exception",
                "Document not found",
                self.log,
            )
        if company_id and is_success_manager:
            ceo_user_obj = self.user_app_services.get_ceo_user_object(
                company_id=company_id
            )
            user = ceo_user_obj if ceo_user_obj else user

        try:
            with transaction.atomic():
                if data.get("link", None) is not None or file_obj is not None:
                    document_file_obj = document_obj.get_file()
                    if document_file_obj:
                        document_file_obj.delete()
                    if file_obj:
                        file_extension = file_obj.name.split(".")[-1]
                        if file_extension not in settings.ALLOWED_FILE_EXTENSIONS:
                            raise FileExtensionNotAllowedException(
                                "file-extension-not-allowed-exception",
                                f"{file_extension} type file is not allowed. Please try to upload a different type of file.",
                                self.log,
                            )
                        file_instance = (
                            self.file_app_services.create_or_update_file_from_file_obj(
                                user=user, file_obj=file_obj
                            )
                        )
                        data["link"] = file_instance.url
                document_obj.is_file_uploaded = True if file_obj else False
                document_obj.file_name = file_obj.name if file_obj else None

                if status:
                    if new_owner_id:
                        raise DoNotHavePermissionException(
                            "do-not-have-permission-exception",
                            f"You can not update the owner and status of document at same time.",
                            self.log,
                        )
                    document_existing_owner = (
                        self.user_app_services.list_users()
                        .filter(id=str(document_obj.owner))
                        .first()
                    )

                    if (
                        document_obj.status == Document.SHARED
                        and status == Document.PRIVATE
                    ):
                        # Remove instance from all company user
                        self.direct_report_app_services.remove_instance_from_direct_report(
                            user=document_existing_owner,
                            module_type="documents",
                            instance=str(document_obj.id),
                        )
                        # Add permission for specific user
                        document_instance = generate_instance_permissions(
                            instance_id=document_obj.id
                        )
                        #  update direct report of document creator
                        self.direct_report_app_services.update_direct_report_by_user_id_as_str(
                            user_id=str(document_obj.owner),
                            module_type="documents",
                            instance=document_instance,
                        )

                    elif (
                        document_obj.status == Document.PRIVATE
                        and status == Document.SHARED
                    ):
                        is_user_ceo = self.user_app_services.is_user_role_ceo(
                            user=document_existing_owner
                        )
                        self._generate_document_permission_as_per_owner_role(
                            user_is_ceo=is_user_ceo,
                            owner=document_existing_owner,
                            document_obj_id=str(document_obj.id),
                        )

                if new_owner_id:
                    new_owner = (
                        self.user_app_services.list_users()
                        .filter(id=str(new_owner_id))
                        .first()
                    )
                    if not new_owner:
                        raise UserNotExistException(
                            "user-not-exist-exception",
                            "Owner does not exist.",
                            self.log,
                        )

                    if not self.user_roles_app_service.is_users_from_same_company_from_list_of_user_ids(
                        user_id_list=[str(user.id), str(new_owner.id)]
                    ):
                        raise NotFromSameCompanyException(
                            "not-from-same-company-exception",
                            "Owner does not belongs to same user company",
                            self.log,
                        )

                    document_obj.owner = str(new_owner.id)

                    # Remove instance from all company user
                    self.direct_report_app_services.remove_instance_from_direct_report(
                        user=user,
                        module_type="documents",
                        instance=str(document_obj.id),
                    )

                    # Add permission and Update direct report of new owner
                    document_instance = generate_instance_permissions(
                        instance_id=document_obj.id
                    )
                    self.direct_report_app_services.update_direct_report_by_user_id(
                        user=new_owner,
                        module_type="documents",
                        instance=document_instance,
                    )

                    if document_obj.status == Document.SHARED:
                        is_user_ceo = self.user_app_services.is_user_role_ceo(
                            user=new_owner
                        )

                        self._generate_document_permission_as_per_owner_role(
                            user_is_ceo=is_user_ceo,
                            owner=new_owner,
                            document_obj_id=str(document_obj.id),
                        )

                #  Update document entity
                document_obj.update_entity(data=data)
                document_obj.save()
                return document_obj
        except Exception as e:
            raise e

    def delete_document_by_id(
        self, user: User, document_id: str, company_id=None
    ) -> bool:
        """
        Delete a document by its ID.

        Parameters:
            user (User): The user object deleting the document.
            document_id (str): The ID of the document to be deleted.
            company_id (Optional[int]): The ID of the company. Defaults to None.

        Returns:
            bool: True if the document is successfully deleted.

        Raises:
            DocumentNotExistsException: If the document with the given ID does not exist.

        """
        document_queryset = self.list_all_documents(
            user=user, company_id=company_id
        ).filter(id=document_id)
        if not document_queryset:
            raise DocumentNotExistsException(
                "document-not-found-exception",
                "Document not found",
                self.log,
            )

        # Update with common service
        self.instance_access_permission.has_write_access(
            user_id=str(user.id),
            instance_id=str(document_id),
            module_type=ModuleInstanceType.DOCUMENTS,
            company_id=company_id,
        )

        try:
            with transaction.atomic():

                file_obj = document_queryset.first().get_file()
                if file_obj:
                    file_obj.delete()

                # Remove all user's permission instance
                self.direct_report_app_services.remove_instance_from_direct_report(
                    user=user,
                    module_type="documents",
                    instance=str(document_queryset.first().id),
                )
                document_queryset.delete()
                return True
        except Exception as e:
            raise e
