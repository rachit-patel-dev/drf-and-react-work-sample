import logging
import uuid
from django.test import TestCase
from django.db.models.manager import Manager
from .models import Document, DocumentFactory, DocumentID
from .services import DocumentServices
from utils.django.custom_models import DirectReportPermissionAnnotateMixin
from django.test import TestCase
from domain_driven_api.domain.division.models import DivisionFactory, DivisionID
from domain_driven_api.domain.company.models import CompanyFactory
from domain_driven_api.domain.company.company_division.models import (
    CompanyDivisionFactory,
    CompanyID,
)
from domain_driven_api.domain.division.user_division.models import (
    UserDivisionFactory,
    UserID,
    CompanyDivisionID,
)
from domain_driven_api.domain.role.user_role.models import UserRoleFactory, RoleID
from domain_driven_api.domain.user.models import UserBasePermissions, UserPersonalData
from domain_driven_api.application.user.services import UserAppServices
from domain_driven_api.domain.user.services import UserServices
from domain_driven_api.application.roles.services import RolesAppServices
from domain_driven_api.infrastructure.logger.models import AttributeLogger


log = AttributeLogger(logging.getLogger(__name__))


class DocumentTests(TestCase):
    def setUp(self):
        self.user_data_01 = UserPersonalData(
            username="test_user01@ymail.com",
            first_name="TestUser01",
            last_name="Tester01",
            email="test_user01@ymail.com",
        )

        self.user_password = "Test@1234"
        self.user_permissions_01 = UserBasePermissions(is_staff=False, is_active=False)

        self.user_obj_01 = (
            UserServices()
            .get_user_factory()
            .build_entity_with_id(
                password=self.user_password,
                personal_data=self.user_data_01,
                base_permissions=self.user_permissions_01,
            )
        )
        self.user_obj_01.save()

        # user role and company creation
        self.user_app_services = UserAppServices(log=log)
        self.role_app_services = RolesAppServices(log=log)
        self.role_01 = self.role_app_services.role_services.get_role_factory().build_entity_with_id(
            name="CEO"
        )
        self.role_01.save()

        self.company = CompanyFactory().build_entity_with_id(
            name="Company One Pvt. Ltd."
        )
        self.company.save()

        self.user_role_01 = UserRoleFactory().build_entity_with_id(
            role_id=RoleID(value=self.role_01.id),
            company_id=CompanyID(value=self.company.id),
            user_id=UserID(value=self.user_obj_01.id),
        )
        self.user_role_01.save()

        self.division_01 = DivisionFactory().build_entity_with_id(name="CEO")
        self.division_01.save()

        self.company_division_01 = CompanyDivisionFactory().build_entity_with_id(
            company_id=CompanyID(value=self.company.id),
            division_id=DivisionID(value=self.division_01.id),
        )
        self.company_division_01.save()

        self.user_division_01 = UserDivisionFactory().build_entity_with_id(
            user_id=UserID(value=self.user_obj_01.id),
            company_division_id=CompanyDivisionID(value=self.company_division_01.id),
        )
        self.user_division_01.save()

        self.document = DocumentFactory().build_entity_with_id(
            title="Document Title",
            priority="High",
            status="Private",
            owner=UserID(value=self.user_obj_01.id),
            link="www.google.com",
            is_file_uploaded=False,
        )
        self.document.save()

    def test_build_document_id(self):
        document_id = DocumentID(value=uuid.uuid4())
        self.assertEqual(type(document_id), DocumentID)

    def test_document_instance(self):
        self.assertIsInstance(self.document, Document)


class DocumentServicesTests(TestCase):
    def test_get_document_repo(self):
        repo = DocumentServices().get_document_repo()
        self.assertEqual(
            DirectReportPermissionAnnotateMixin.DirectReportPermissionAnnotateManager,
            type(repo),
        )

    def test_get_document_factory(self):
        factory = DocumentServices().get_document_factory()
        self.assertEqual(DocumentFactory, factory)
