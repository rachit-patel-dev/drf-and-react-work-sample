"""This is a model module to store Document data in to the database"""

import uuid
from typing import Dict, Any
from dataclasses import dataclass
from django.db import models
from domain_driven_api.domain.file.models import File
from utils.django.custom_models import (
    ActivityTracking,
    DirectReportPermissionAnnotateMixin,
)
from utils.global_methods.global_value_objects import UserID


@dataclass(frozen=True)
class DocumentID:
    """
    This is a value object that should be used to generate and pass the DocumentID to the DocumentFactory
    """

    value: uuid.UUID


# ----------------------------------------------------------------------
# Document Model
# ----------------------------------------------------------------------


class Document(ActivityTracking, DirectReportPermissionAnnotateMixin):
    """
    A class representing a document.

    Inherits from ActivityTracking and DirectReportPermissionAnnotateMixin.

    Attributes:
        HIGH (str): Constant representing high priority.
        MEDIUM (str): Constant representing medium priority.
        LOW (str): Constant representing low priority.
        DOCUMENT_PRIORITY (list): List of tuples representing document priorities.
        PRIVATE (str): Constant representing private status.
        SHARED (str): Constant representing shared status.
        DOCUMENT_STATUS (list): List of tuples representing document statuses.
        id (UUIDField): Primary key field for the document.
        title (CharField): Field for the document title.
        priority (CharField): Field for the document priority.
        status (CharField): Field for the document status.
        owner (UUIDField): Field for the document owner.
        link (CharField): Field for the document link.
        is_file_uploaded (BooleanField): Field indicating if a file is uploaded for the document.
        file_name (CharField): Field for the file name associated with the document.

    Methods:
        get_file(): Retrieves the file associated with the document.
        update_entity(data: Dict[str, Any]): Updates the document entity with the provided data.
    """

    # Document priority
    HIGH = "High"
    MEDIUM = "Medium"
    LOW = "Low"

    DOCUMENT_PRIORITY = [(HIGH, "High"), (MEDIUM, "Medium"), (LOW, "Low")]

    # Document status
    PRIVATE = "Private"
    SHARED = "Shared"

    DOCUMENT_STATUS = [(PRIVATE, "Private"), (SHARED, "Shared")]

    id = models.UUIDField(primary_key=True, editable=False, default=uuid.uuid4)
    title = models.CharField(max_length=250, blank=False, null=False)
    priority = models.CharField(max_length=6, choices=DOCUMENT_PRIORITY, default=None)
    status = models.CharField(max_length=7, choices=DOCUMENT_STATUS, default=None)
    owner = models.UUIDField(blank=False, null=False)
    link = models.CharField(null=False, blank=False)
    is_file_uploaded = models.BooleanField(null=False, blank=False)
    file_name = models.CharField(null=True, blank=True)

    def get_file(self):
        return File.objects.filter(url=self.link, is_active=True)

    def update_entity(self, data: Dict[str, Any]):
        if data.get("title", None):
            self.title = data.get("title")
        if data.get("priority", None):
            self.priority = data.get("priority")
        if data.get("status", None):
            self.status = data.get("status")
        if data.get("link", None):
            self.link = data.get("link")

    class Meta:
        verbose_name = "Document"
        verbose_name_plural = "Documents"
        db_table = "document"


class DocumentFactory:
    """
    A factory class for creating instances of the Document class.

    Methods:
        build_entity(id: DocumentID, title: str, priority: str, status: str, owner: UserID, link: str, is_file_uploaded: bool, file_name: str = None) -> Document:
            Creates and returns an instance of the Document class with the provided parameters.

        build_entity_with_id(title: str, priority: str, status: str, owner: UserID, link: str, is_file_uploaded: bool, file_name: str = None) -> Document:
            Creates and returns an instance of the Document class with a generated DocumentID and the provided parameters.
    """

    @staticmethod
    def build_entity(
        id: DocumentID,
        title: str,
        priority: str,
        status: str,
        owner: UserID,
        link: str,
        is_file_uploaded: bool,
        file_name: str = None,
    ) -> Document:
        """
        Creates and returns an instance of the Document class with the provided parameters.

        Parameters:
            id (DocumentID): The ID of the document.
            title (str): The title of the document.
            priority (str): The priority of the document.
            status (str): The status of the document.
            owner (UserID): The owner of the document.
            link (str): The link of the document.
            is_file_uploaded (bool): Indicates if a file is uploaded for the document.
            file_name (str, optional): The name of the file associated with the document.

        Returns:
            Document: An instance of the Document class.

        """
        return Document(
            id=id.value,
            title=title,
            priority=priority,
            status=status,
            owner=owner.value,
            link=link,
            is_file_uploaded=is_file_uploaded,
            file_name=file_name,
        )

    @classmethod
    def build_entity_with_id(
        cls,
        title: str,
        priority: str,
        status: str,
        owner: UserID,
        link: str,
        is_file_uploaded: bool,
        file_name: str = None,
    ) -> Document:
        """
        This is a factory method used to build an instance of the Document class.

        Parameters:
            title (str): The title of the document.
            priority (str): The priority of the document.
            status (str): The status of the document.
            owner (UserID): The owner of the document.
            link (str): The link of the document.
            is_file_uploaded (bool): Indicates if a file is uploaded for the document.
            file_name (str, optional): The name of the file associated with the document.

        Returns:
            Document: An instance of the Document class.

        """
        entity_id = DocumentID(uuid.uuid4())
        return cls.build_entity(
            id=entity_id,
            title=title,
            priority=priority,
            status=status,
            owner=owner,
            link=link,
            is_file_uploaded=is_file_uploaded,
            file_name=file_name,
        )
