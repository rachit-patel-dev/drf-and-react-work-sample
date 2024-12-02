import logging

# django imports
from django.test import TestCase
from django.db.models.query import QuerySet
from domain_driven_api.domain.document.models import Document
from domain_driven_api.domain.user.models import UserBasePermissions, UserPersonalData
from domain_driven_api.domain.user.services import UserServices
from domain_driven_api.application.roles.services import RolesAppServices
from domain_driven_api.domain.company.models import CompanyFactory
from domain_driven_api.domain.role.user_role.models import UserRoleFactory, RoleID
from domain_driven_api.domain.company.company_division.models import CompanyID
from domain_driven_api.domain.division.user_division.models import (
    UserID,
    UserDivisionFactory,
    CompanyDivisionID,
)
from domain_driven_api.domain.division.models import DivisionFactory, DivisionID
from domain_driven_api.domain.company.company_division.models import (
    CompanyDivisionFactory,
)
from domain_driven_api.application.document.services import DocumentAppServices
from domain_driven_api.application.direct_report.services import DirectReportAppServices

from domain_driven_api.infrastructure.logger.models import AttributeLogger

log = AttributeLogger(logging.getLogger(__name__))


class DocumentAppServicesTests(TestCase):
    """
    Test case class for testing the functionality of the DocumentAppServices class.

    Methods:
    - test_create_document_from_dict: Tests the create_document_from_dict method of DocumentAppServices.
    - test_list_documents: Tests the list_documents method of DocumentAppServices.
    - test_update_document_from_dict: Tests the update_document_from_dict method of DocumentAppServices.
    - test_delete_document_by_id: Tests the delete_document_by_id method of DocumentAppServices.

    """

    @classmethod
    def setUpTestData(cls):
        cls.user_data_01 = UserPersonalData(
            username="test_user01@ymail.com",
            first_name="TestUser01",
            last_name="Tester01",
            email="test_user01@ymail.com",
        )
        cls.user_data_02 = UserPersonalData(
            username="test_user02@ymail.com",
            first_name="TestUser02",
            last_name="Tester02",
            email="test_user02@ymail.com",
        )

        cls.user_password = "Test@1234"
        cls.user_permissions_01 = UserBasePermissions(is_staff=False, is_active=False)
        cls.user_permissions_02 = UserBasePermissions(is_active=False, is_staff=False)

        cls.user_obj_01 = (
            UserServices()
            .get_user_factory()
            .build_entity_with_id(
                password=cls.user_password,
                personal_data=cls.user_data_01,
                base_permissions=cls.user_permissions_01,
            )
        )
        cls.user_obj_01.save()

        cls.user_obj_02 = (
            UserServices()
            .get_user_factory()
            .build_entity_with_id(
                password=cls.user_password,
                personal_data=cls.user_data_02,
                base_permissions=cls.user_permissions_02,
            )
        )
        cls.user_obj_02.save()

        cls.direct_report_app_services = DirectReportAppServices(log=log)
        cls.direct_report_01 = cls.direct_report_app_services.direct_report_services.get_direct_report_factory().build_entity_with_id(
            user_id=UserID(value=cls.user_obj_01.id)
        )
        cls.direct_report_01.save()
        cls.direct_report_02 = cls.direct_report_app_services.direct_report_services.get_direct_report_factory().build_entity_with_id(
            user_id=UserID(value=cls.user_obj_02.id)
        )
        cls.direct_report_02.save()

        cls.role_app_services = RolesAppServices(log=log)
        cls.role_01 = (
            cls.role_app_services.role_services.get_role_factory().build_entity_with_id(
                name="CEO"
            )
        )
        cls.role_01.save()
        cls.role_02 = (
            cls.role_app_services.role_services.get_role_factory().build_entity_with_id(
                name="Manager"
            )
        )
        cls.role_02.save()

        cls.company = CompanyFactory().build_entity_with_id(
            name="Company One Pvt. Ltd."
        )
        cls.company.save()

        cls.user_role_01 = UserRoleFactory().build_entity_with_id(
            role_id=RoleID(value=cls.role_01.id),
            company_id=CompanyID(value=cls.company.id),
            user_id=UserID(value=cls.user_obj_01.id),
        )
        cls.user_role_01.save()
        cls.user_role_02 = UserRoleFactory().build_entity_with_id(
            role_id=RoleID(value=cls.role_02.id),
            company_id=CompanyID(value=cls.company.id),
            user_id=UserID(value=cls.user_obj_02.id),
        )
        cls.user_role_02.save()

        cls.division_01 = DivisionFactory().build_entity_with_id(name="CEO")
        cls.division_01.save()
        cls.division_02 = DivisionFactory().build_entity_with_id(name="Technical")
        cls.division_02.save()

        cls.company_division_01 = CompanyDivisionFactory().build_entity_with_id(
            company_id=CompanyID(value=cls.company.id),
            division_id=DivisionID(value=cls.division_01.id),
        )
        cls.company_division_01.save()
        cls.company_division_02 = CompanyDivisionFactory().build_entity_with_id(
            company_id=CompanyID(value=cls.company.id),
            division_id=DivisionID(value=cls.division_02.id),
        )
        cls.company_division_02.save()

        cls.user_division_01 = UserDivisionFactory().build_entity_with_id(
            user_id=UserID(value=cls.user_obj_01.id),
            company_division_id=CompanyDivisionID(value=cls.company_division_01.id),
        )
        cls.user_division_01.save()
        cls.user_division_02 = UserDivisionFactory().build_entity_with_id(
            user_id=UserID(value=cls.user_obj_02.id),
            company_division_id=CompanyDivisionID(value=cls.company_division_02.id),
        )
        cls.user_division_02.save()

        cls.document_app_service = DocumentAppServices(log=log)

    def test_create_document_from_dict(self):
        document = self.document_app_service.create_document_from_dict(
            user=self.user_obj_01,
            data=dict(
                title="Doc Title",
                priority="High",
                status="Shared",
                link="www.google.com",
            ),
        )
        self.assertEqual(isinstance(document, Document), True)

        with self.assertRaises(Exception):
            # without link and file object
            document = self.document_app_service.create_document_from_dict(
                user=self.user_obj_01,
                data=dict(title="Doc Title", priority="High", status="Shared"),
            )

    def test_list_documents(self):
        list_documents = self.document_app_service.list_documents(
            user=self.user_obj_01, direct_report_id=self.direct_report_01.id
        )
        self.assertEqual(type(list_documents), QuerySet)

    def test_update_document_from_dict(self):
        existing_document = self.document_app_service.create_document_from_dict(
            user=self.user_obj_01,
            data=dict(
                title="Doc Title",
                priority="High",
                status="Shared",
                link="www.google.com",
            ),
        )

        document = self.document_app_service.update_document_from_dict(
            user=self.user_obj_01,
            data=dict(status="Private"),
            document_id=existing_document.id,
        )

        self.assertEqual(isinstance(document, Document), True)
        self.assertNotEqual(existing_document.status, document.status)

        with self.assertRaises(Exception):
            # with wrong document
            document = self.document_app_service.update_document_from_dict(
                user=self.user_obj_01,
                data=dict(status="Private"),
                document_id="ba3cb337-5780-4488-b271-3d5d21b7549d",
            )

            # with wrong status
            document = self.document_app_service.update_document_from_dict(
                user=self.user_obj_01,
                data=dict(status="Wrong Status"),
                document_id=existing_document.id,
            )

    def test_delete_document_by_id(self):
        existing_document = self.document_app_service.create_document_from_dict(
            user=self.user_obj_01,
            data=dict(
                title="Doc Title",
                priority="High",
                status="Shared",
                link="www.google.com",
            ),
        )

        document_deleted = self.document_app_service.delete_document_by_id(
            user=self.user_obj_01, document_id=existing_document.id
        )
        self.assertIsInstance(document_deleted, bool)

        with self.assertRaises(Exception):
            # with wrong document
            self.document_app_service.delete_document_by_id(
                user=self.user_obj_01,
                document_id="ba3cb337-5780-4488-b271-3d5d21b7549d",
            )
