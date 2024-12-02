from drf_spectacular.utils import OpenApiParameter, OpenApiExample

from utils.django.custom_extend_schema import custom_extend_schema
from .serializers import DocumentRetrieveSerializer
from domain_driven_api.domain.document.models import Document

document_tags = ["Document-Module"]

document_priority_param = OpenApiParameter(
    name="priority",
    type=str,
    location=OpenApiParameter.QUERY,
    description="document priority for filter",
    examples=[
        OpenApiExample(Document.LOW, value=Document.LOW),
        OpenApiExample(Document.MEDIUM, value=Document.MEDIUM),
        OpenApiExample(Document.HIGH, value=Document.HIGH),
    ],
)

document_status_param = OpenApiParameter(
    name="status",
    type=str,
    location=OpenApiParameter.QUERY,
    description="document status for filter",
    examples=[
        OpenApiExample(Document.PRIVATE, value=Document.PRIVATE),
        OpenApiExample(Document.SHARED, value=Document.SHARED),
    ],
)

document_sorting_param = OpenApiParameter(
    name="sort_by",
    type=str,
    location=OpenApiParameter.QUERY,
    description="document sorting",
    examples=[
        OpenApiExample(
            "sort_by",
            value="priority,-priority, status, -status, owner_name, -owner_name",
        ),
    ],
)

company_id = OpenApiParameter(
    name="company_id",
    type=str,
    location=OpenApiParameter.QUERY,
    description="filter with company_id for success-manager",
)

responsible_person_param = OpenApiParameter(
    name="responsible_person",
    type=str,
    location=OpenApiParameter.QUERY,
    description="Param to filter the documents by Owner Person ID.",
)

direct_report_param = OpenApiParameter(
    name="direct_report",
    type=str,
    location=OpenApiParameter.QUERY,
    description="logged in user's direct report id",
    examples=None,
)

document_create_extension = custom_extend_schema(
    tags=document_tags,
    request={
        "multipart/form-data": {
            "type": "object",
            "properties": {
                "title": {"type": "string"},
                "priority": {"type": "string", "enum": ["High", "Medium", "Low"]},
                "status": {"type": "string", "enum": ["Private", "Shared"]},
                "link": {"type": "string"},
                "owner": {"type": "string"},
                "document_file": {"type": "string", "format": "binary"},
            },
            "required": ["title", "priority", "status"],
        }
    },
    parameters=[company_id],
    responses={200: DocumentRetrieveSerializer},
)

document_list_extension = custom_extend_schema(
    tags=document_tags,
    parameters=[
        document_priority_param,
        document_status_param,
        document_sorting_param,
        direct_report_param,
        responsible_person_param,
        company_id,
    ],
    paginator=True,
)

document_update_extension = custom_extend_schema(
    tags=document_tags,
    request={
        "multipart/form-data": {
            "type": "object",
            "properties": {
                "title": {"type": "string"},
                "priority": {"type": "string", "enum": ["High", "Medium", "Low"]},
                "status": {"type": "string", "enum": ["Private", "Shared"]},
                "link": {"type": "string"},
                "owner": {"type": "string"},
                "document_file": {"type": "string", "format": "binary"},
            },
        }
    },
    parameters=[company_id],
    responses={200: DocumentRetrieveSerializer},
)

delete_document_extension = custom_extend_schema(
    tags=document_tags, parameters=[company_id], responses={200: {}}
)
