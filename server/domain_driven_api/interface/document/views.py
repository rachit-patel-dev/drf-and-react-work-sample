from django.utils.decorators import decorator_from_middleware_with_args
from drf_spectacular.utils import extend_schema_view
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication

# local imports
from .serializers import (
    DocumentCreateSerializer,
    DocumentListSerializer,
    DocumentRetrieveSerializer,
    DocumentUpdateSerializer,
)
from . import open_api
from .pagination import DocumentPagination
from .filters import DocumentFilters

# app imports
from domain_driven_api.application.document.services import DocumentAppServices

from utils.django.exceptions import (
    DoNotHavePermissionException,
    InvalidModuleTypeException,
    DocumentException,
    DocumentNotExistsException,
    FileExtensionNotAllowedException,
    UserNotExistException,
    NotFromSameCompanyException,
)
from domain_driven_api.infrastructure.custom_response.response_and_error import (
    APIResponse,
)
from domain_driven_api.interface.access_control.middleware import MiddlewareWithLogger


@extend_schema_view(
    create=open_api.document_create_extension,
    list=open_api.document_list_extension,
    update=open_api.document_update_extension,
    delete_document=open_api.delete_document_extension,
)
class DocumentViewSet(viewsets.ViewSet):
    """
    API endpoints to create, list, update, and delete documents.

    Attributes:
        authentication_classes (tuple): A tuple of authentication classes used for authentication.
        permission_classes (tuple): A tuple of permission classes used for authorization.
        pagination_class (class): The pagination class used for paginating the queryset.
        filter_class (class): The filter class used for filtering the queryset.
        access_control (function): A decorator function used for applying access control middleware.

    Methods:
        get_queryset(): Returns the queryset for retrieving documents.
        get_serializer_context(): Returns the context for the serializer.
        get_serializer_class(): Returns the serializer class based on the action.
        create(request): Creates a new document.
        list(request): Lists all documents.
        update(request, pk): Updates an existing document.
        delete_document(request, pk): Deletes a document.
    """

    authentication_classes = (JWTAuthentication,)
    permission_classes = (IsAuthenticated,)
    pagination_class = DocumentPagination
    filter_class = DocumentFilters

    access_control = decorator_from_middleware_with_args(MiddlewareWithLogger)

    @access_control()
    def get_queryset(self):
        """
        Returns the queryset for retrieving documents.

        This method is used to retrieve the queryset of documents based on the provided filters and permissions. It utilizes the `DocumentAppServices` class to retrieve the list of documents.

        Parameters:
            self: The current instance of the `DocumentViewSet` class.

        Returns:
            queryset: The queryset of documents.

        Raises:
            None
        """
        document_app_services = DocumentAppServices(log=self.log)
        queryset = (
            document_app_services.list_documents(
                user=self.request.user,
                direct_report_id=self.request.query_params.get("direct_report"),
            )
            .distinct()
            .order_by("-created_at")
        )
        return self.filter_class(self.request.query_params, queryset=queryset).qs

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update({"log": self.log})
        return context

    def get_serializer_class(self):
        if self.action == "create":
            return DocumentCreateSerializer
        if self.action == "list":
            return DocumentListSerializer
        if self.action == "update":
            return DocumentUpdateSerializer

    @access_control()
    def create(self, request):
        """
        Creates a new document.

        This method is used to create a new document based on the provided data and file. It utilizes the `DocumentAppServices` class to create the document.

        Parameters:
            request (HttpRequest): The HTTP request object.

        Returns:
            APIResponse: The API response object containing the created document data and a success message.

        Raises:
            DocumentException: If there is an error related to the document.
            FileExtensionNotAllowedException: If the file extension is not allowed.
            Exception: If there is a general error during the document creation process.
        """
        self.parser_classes = [MultiPartParser, FormParser]
        serializer = self.get_serializer_class()
        serializer_data = serializer(data=request.data)
        if serializer_data.is_valid():
            try:
                document_app_services = DocumentAppServices(log=self.log)
                document_obj = document_app_services.create_document_from_dict(
                    user=self.request.user,
                    data=serializer_data.data,
                    file_obj=request.data.get("document_file"),
                    company_id=self.request.query_params.get("company_id"),
                    is_success_manager=self.request.is_success_manager,
                )
                response = DocumentRetrieveSerializer(
                    document_obj,
                    context={
                        "user": self.request.user,
                        "request": self.request,
                        "log": self.log,
                    },
                )
                return APIResponse(
                    data=response.data, message="Successfully created document."
                )
            except (DocumentException, FileExtensionNotAllowedException) as e:
                return APIResponse(
                    status_code=e.status_code,
                    errors=e.error_data(),
                    message=e.message,
                    for_error=True,
                )
            except Exception as e:
                return APIResponse(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    errors=e,
                    for_error=True,
                    general_error=True,
                )
        return APIResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            errors=serializer_data.errors,
            message="Invalid data",
            for_error=True,
        )

    @access_control(direct_report_required=True)
    def list(self, request):
        """
        Lists all documents.

        This method is used to retrieve a paginated list of all documents. It utilizes the `get_queryset` method to retrieve the queryset of documents based on the provided filters and permissions. It then paginates the queryset using the `pagination_class` and serializes the paginated data using the `get_serializer_class` method.

        Parameters:
            request (HttpRequest): The HTTP request object.

        Returns:
            APIResponse: The API response object containing the paginated list of documents and a success message.

        Raises:
            None
        """
        serializer = self.get_serializer_class()
        queryset = self.get_queryset()
        paginator = self.pagination_class()
        paginated_queryset = paginator.paginate_queryset(queryset, request)
        serializer_data = serializer(
            paginated_queryset,
            many=True,
            context={
                "user": self.request.user,
                "request": self.request,
                "log": self.log,
            },
        )
        paginated_data = paginator.get_paginated_response(serializer_data.data).data
        message = "Successfully listed all documents."
        return APIResponse(data=paginated_data, message=message)

    @access_control()
    def update(self, request, pk):
        """
        Updates an existing document.

        This method is used to update an existing document based on the provided data and file. It utilizes the `DocumentAppServices` class to update the document.

        Parameters:
            request (HttpRequest): The HTTP request object.
            pk (int): The primary key of the document to be updated.

        Returns:
            APIResponse: The API response object containing the updated document data and a success message.

        Raises:
            DocumentNotExistsException: If the document does not exist.
            FileExtensionNotAllowedException: If the file extension is not allowed.
            DocumentException: If there is an error related to the document.
            DoNotHavePermissionException: If the user does not have permission to update the document.
            InvalidModuleTypeException: If the module type is invalid.
            UserNotExistException: If the user does not exist.
            NotFromSameCompanyException: If the user is not from the same company as the document.

        Exceptions:
            Exception: If there is a general error during the document update process.
        """
        serializer = self.get_serializer_class()
        serializer_data = serializer(data=request.data)
        if serializer_data.is_valid():
            try:
                document_app_services = DocumentAppServices(log=self.log)
                document_obj = document_app_services.update_document_from_dict(
                    user=self.request.user,
                    data=serializer_data.data,
                    document_id=pk,
                    file_obj=request.data.get("document_file"),
                    company_id=self.request.query_params.get("company_id"),
                    is_success_manager=self.request.is_success_manager,
                )
                response = DocumentRetrieveSerializer(
                    document_obj,
                    context={
                        "user": self.request.user,
                        "request": self.request,
                        "log": self.log,
                    },
                )
                return APIResponse(
                    data=response.data, message="Successfully updated document."
                )
            except (
                DocumentNotExistsException,
                FileExtensionNotAllowedException,
                DocumentException,
                DoNotHavePermissionException,
                InvalidModuleTypeException,
                UserNotExistException,
                NotFromSameCompanyException,
            ) as e:
                return APIResponse(
                    status_code=e.status_code,
                    errors=e.error_data(),
                    message=e.message,
                    for_error=True,
                )
            except Exception as e:
                return APIResponse(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    errors=e,
                    for_error=True,
                    general_error=True,
                )
        return APIResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            errors=serializer_data.errors,
            message="Invalid data",
            for_error=True,
        )

    @action(detail=True, methods=["delete"], name="delete_document")
    @access_control()
    def delete_document(self, request, pk):
        """
        Deletes a document.

        This method is used to delete a document based on the provided document ID. It utilizes the `DocumentAppServices` class to delete the document.

        Parameters:
            request (HttpRequest): The HTTP request object.
            pk (int): The primary key of the document to be deleted.

        Returns:
            APIResponse: The API response object containing an empty data field and a success message.

        Raises:
            DocumentNotExistsException: If the document does not exist.
            DocumentException: If there is an error related to the document.
            DoNotHavePermissionException: If the user does not have permission to delete the document.
            InvalidModuleTypeException: If the module type is invalid.

        Exceptions:
            Exception: If there is a general error during the document deletion process.
        """
        try:
            document_app_services = DocumentAppServices(log=self.log)
            document_app_services.delete_document_by_id(
                user=self.request.user,
                document_id=pk,
                company_id=self.request.query_params.get("company_id"),
            )
            return APIResponse(data={}, message="Document deleted successfully.")
        except (
            DocumentNotExistsException,
            DocumentException,
            DoNotHavePermissionException,
            InvalidModuleTypeException,
        ) as e:
            return APIResponse(
                status_code=e.status_code,
                errors=e.error_data(),
                message=e.message,
                for_error=True,
            )
        except Exception as e:
            return APIResponse(
                status_code=status.HTTP_400_BAD_REQUEST,
                errors=e,
                for_error=True,
                general_error=True,
            )
