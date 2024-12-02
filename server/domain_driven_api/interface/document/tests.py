import logging

from rest_framework.test import APITestCase, APIRequestFactory, force_authenticate
from domain_driven_api.domain.user.models import UserBasePermissions, UserPersonalData
from .views import DocumentViewSet
from domain_driven_api.domain.user.services import UserServices
from domain_driven_api.application.roles.services import RolesAppServices
from domain_driven_api.domain.company.models import CompanyFactory
from domain_driven_api.domain.role.user_role.models import UserRoleFactory, RoleID
from domain_driven_api.domain.division.user_division.models import (
    UserID,
    CompanyDivisionID,
    UserDivisionFactory,
)
from domain_driven_api.domain.division.models import DivisionFactory, DivisionID
from domain_driven_api.domain.company.company_division.models import (
    CompanyDivisionFactory,
    CompanyID,
)
from domain_driven_api.domain.calender_manager.models import CalenderManager
from domain_driven_api.application.document.services import DocumentAppServices

from domain_driven_api.application.objective.test_helper import (
    TestHelper as ObjectiveTestHelper,
)
from domain_driven_api.application.direct_report.services import DirectReportAppServices
from domain_driven_api.infrastructure.logger.models import AttributeLogger
from scripts.calender_generator import generate_ten_years_calendar_data
from faker import Faker

fake = Faker()
log = AttributeLogger(logging.getLogger(__name__))


class DocumentViewSetTestCases(APITestCase):
    """
    Test cases for the DocumentViewSet class.

    This class contains test cases for the create, list, update, and delete methods of the DocumentViewSet class. It uses the APITestCase class from the rest_framework.test module for testing the API endpoints.

    Attributes:
        u_data_01 (UserPersonalData): An instance of the UserPersonalData class representing the personal data of a user.
        user_password (str): The password of the user.
        u_permissions_01 (UserBasePermissions): An instance of the UserBasePermissions class representing the base permissions of a user.
        factory (APIRequestFactory): An instance of the APIRequestFactory class for creating API requests.
        document_view_set (DocumentViewSet): An instance of the DocumentViewSet class for testing.
        user_obj (User): An instance of the User class representing a user.
        direct_report_app_services (DirectReportAppServices): An instance of the DirectReportAppServices class for testing.
        direct_report (DirectReport): An instance of the DirectReport class representing a direct report.
        expected_response_fields (list): A list of expected response fields.
        expected_response_fields_with_errors (list): A list of expected response fields with errors.
        expected_response_fields_of_data (list): A list of expected response fields of data.
        role_app_services (RolesAppServices): An instance of the RolesAppServices class for testing.
        role (UserRole): An instance of the UserRole class representing a user role.
        company (Company): An instance of the Company class representing a company.
        user_role (UserRole): An instance of the UserRole class representing a user role.
        division (Division): An instance of the Division class representing a division.
        company_division (CompanyDivision): An instance of the CompanyDivision class representing a company division.
        user_division (UserDivision): An instance of the UserDivision class representing a user division.
        document_app_service (DocumentAppServices): An instance of the DocumentAppServices class for testing.

    Methods:
        setUpTestData(): A setup method for the test cases.
        test_create_document(): Test case for the create method of the DocumentViewSet class.
        test_list_document(): Test case for the list method of the DocumentViewSet class.
        test_update_document(): Test case for the update method of the DocumentViewSet class.
        test_delete_document(): Test case for the delete_document method of the DocumentViewSet class.
    """

    @classmethod
    def setUpTestData(cls):
        """
        Setup method for UserViewSetTestCase.
        """
        cls.u_data_01 = UserPersonalData(
            username="testerman@example.com",
            first_name="Testerman",
            last_name="Testerson",
            email="testerman@example.com",
        )
        cls.user_password = "Test@1234"
        cls.u_permissions_01 = UserBasePermissions(is_staff=False, is_active=True)

        cls.factory = APIRequestFactory()
        cls.document_view_set = DocumentViewSet

        cls.user_obj = (
            UserServices()
            .get_user_factory()
            .build_entity_with_id(
                password=cls.user_password,
                personal_data=cls.u_data_01,
                base_permissions=cls.u_permissions_01,
            )
        )
        cls.user_obj.save()

        cls.direct_report_app_services = DirectReportAppServices(log=log)
        cls.direct_report = cls.direct_report_app_services.direct_report_services.get_direct_report_factory().build_entity_with_id(
            user_id=UserID(value=cls.user_obj.id)
        )
        cls.direct_report.save()

        cls.expected_response_fields = ["success", "message", "data"]
        cls.expected_response_fields_with_errors = cls.expected_response_fields + [
            "errors"
        ]
        cls.expected_response_fields_of_data = [
            "count",
            "next",
            "previous",
            "results",
            "current_week",
        ]

        # user role and company creation

        cls.role_app_services = RolesAppServices(log=log)
        cls.role = (
            cls.role_app_services.role_services.get_role_factory().build_entity_with_id(
                name="CEO"
            )
        )
        cls.role.save()

        cls.company = CompanyFactory().build_entity_with_id(name="Test-Company")
        cls.company.save()

        cls.user_role = UserRoleFactory().build_entity_with_id(
            role_id=RoleID(value=cls.role.id),
            company_id=CompanyID(value=cls.company.id),
            user_id=UserID(value=cls.user_obj.id),
        )
        cls.user_role.save()

        cls.division = DivisionFactory().build_entity_with_id(name="Test-Division")
        cls.division.save()

        cls.company_division = CompanyDivisionFactory().build_entity_with_id(
            company_id=CompanyID(value=cls.company.id),
            division_id=DivisionID(value=cls.division.id),
        )
        cls.company_division.save()

        cls.user_division = UserDivisionFactory().build_entity_with_id(
            user_id=UserID(value=cls.user_obj.id),
            company_division_id=CompanyDivisionID(value=cls.company_division.id),
        )
        cls.user_division.save()

        cls.document_app_service = DocumentAppServices(log=log)

    def test_create_document(self):
        expected_response_keys = [
            "id",
            "title",
            "priority",
            "status",
            "owner",
            "link",
            "is_file_uploaded",
            "file_name",
        ]
        document_data = {
            "title": "Test Doc",
            "priority": "High",
            "status": "Private",
            "link": "https://www.google.com/",
        }
        request = self.factory.post("/api/v0/document/", document_data)
        force_authenticate(request=request, user=self.user_obj)
        response = self.document_view_set.as_view({"post": "create"})(request)
        self.assertEquals(response.status_code, 200)
        self.assertEquals(response.data.get("success"), True)
        self.assertListEqual(list(response.data.keys()), self.expected_response_fields)
        self.assertListEqual(
            list(response.data.get("data").keys()), expected_response_keys
        )

        # create without authentication
        request = self.factory.post("/api/v0/document/", document_data)
        response = self.document_view_set.as_view({"post": "create"})(request)
        self.assertEquals(response.status_code, 401)

        # create with wrong priority type
        document_data = {
            "title": "Test Doc",
            "priority": "Wrong",
            "status": "Private",
            "link": "https://www.google.com/",
        }
        request = self.factory.post("/api/v0/document/", document_data)
        force_authenticate(request=request, user=self.user_obj)
        response = self.document_view_set.as_view({"post": "create"})(request)
        self.assertEquals(response.status_code, 400)

        # create with wrong status
        document_data = {
            "title": "Test Doc",
            "priority": "High",
            "status": "Important",
            "link": "https://www.google.com/",
        }
        request = self.factory.post("/api/v0/document/", document_data)
        force_authenticate(request=request, user=self.user_obj)
        response = self.document_view_set.as_view({"post": "create"})(request)
        self.assertEquals(response.status_code, 400)

        # create without link and document
        document_data = {"title": "Test Doc", "priority": "High", "status": "Private"}
        request = self.factory.post("/api/v0/document/", document_data)
        force_authenticate(request=request, user=self.user_obj)
        response = self.document_view_set.as_view({"post": "create"})(request)
        self.assertEquals(response.status_code, 400)

    def test_list_document(self):
        query_params_data = dict(direct_report=str(self.direct_report.id))
        request = self.factory.get("/api/v0/document/", query_params_data)
        force_authenticate(request=request, user=self.user_obj)
        response = self.document_view_set.as_view({"get": "list"})(request)
        self.assertEquals(response.status_code, 200)
        self.assertEquals(response.data.get("success"), True)

        # list without authentication
        request = self.factory.get("/api/v0/document/")
        response = self.document_view_set.as_view({"get": "list"})(request)
        self.assertEquals(response.status_code, 401)

    def test_update_document(self):
        expected_response_keys = [
            "id",
            "title",
            "priority",
            "status",
            "owner",
            "link",
            "is_file_uploaded",
            "file_name",
        ]
        document_data = {
            "title": "Test Doc",
            "priority": "High",
            "status": "Private",
            "link": "https://www.google.com/",
        }
        existing_document = self.document_app_service.create_document_from_dict(
            user=self.user_obj, data=document_data
        )
        data_to_update_document = dict(priority="Medium", status="Shared")
        request = self.factory.put(
            f"/api/v0/document/{existing_document.id}/", data_to_update_document
        )
        force_authenticate(request=request, user=self.user_obj)
        response = self.document_view_set.as_view({"put": "update"})(
            request, pk=existing_document.id
        )
        self.assertEquals(response.status_code, 200)
        self.assertEquals(response.data.get("success"), True)
        self.assertListEqual(list(response.data.keys()), self.expected_response_fields)
        self.assertListEqual(
            list(response.data.get("data").keys()), expected_response_keys
        )

        # update without authentication
        request = self.factory.put(
            f"/api/v0/document/{existing_document.id}/", data_to_update_document
        )
        response = self.document_view_set.as_view({"put": "update"})(
            request, pk=existing_document.id
        )
        self.assertEquals(response.status_code, 401)

        # update with wrong id
        request = self.factory.put(
            "/api/v0/document/3fa85f64-5717-4562-b3fc-2c963f66afa6/",
            data_to_update_document,
        )
        force_authenticate(request=request, user=self.user_obj)
        response = self.document_view_set.as_view({"put": "update"})(
            request, pk="3fa85f64-5717-4562-b3fc-2c963f66afa6"
        )
        self.assertEquals(response.status_code, 403)

        # update with wrong data
        data_to_update_document = dict(status="Important")
        request = self.factory.put(
            f"/api/v0/document/{existing_document.id}/", data_to_update_document
        )
        force_authenticate(request=request, user=self.user_obj)
        response = self.document_view_set.as_view({"put": "update"})(
            request, pk=existing_document.id
        )
        self.assertEquals(response.status_code, 400)

    def test_delete_document(self):
        document_data = {
            "title": "Test Doc",
            "priority": "High",
            "status": "Private",
            "link": "https://www.google.com/",
        }
        existing_document = self.document_app_service.create_document_from_dict(
            user=self.user_obj, data=document_data
        )
        request = self.factory.delete(
            f"/api/v0/document/{existing_document.id}/delete_document/"
        )
        force_authenticate(request=request, user=self.user_obj)
        response = self.document_view_set.as_view({"delete": "delete_document"})(
            request, pk=existing_document.id
        )
        self.assertEquals(response.status_code, 200)

        # delete with wrong id
        request = self.factory.delete(
            "/api/v0/document/3fa85f64-5717-4562-b3fc-2c963f66afa6/delete_document/"
        )
        force_authenticate(request=request, user=self.user_obj)
        response = self.document_view_set.as_view({"delete": "delete_document"})(
            request, pk="3fa85f64-5717-4562-b3fc-2c963f66afa6"
        )
        self.assertEquals(response.status_code, 404)

        # delete without authentication
        request = self.factory.delete(
            "/api/v0/document/3fa85f64-5717-4562-b3fc-2c963f66afa6/delete_document/"
        )
        response = self.document_view_set.as_view({"delete": "delete_document"})(
            request, pk="3fa85f64-5717-4562-b3fc-2c963f66afa6"
        )
        self.assertEquals(response.status_code, 401)
