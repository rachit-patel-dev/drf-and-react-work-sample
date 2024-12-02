from django.db.models.manager import BaseManager
from utils.django.custom_models import DirectReportPermissionAnnotateMixin
from .models import Document, DocumentFactory
from typing import Type


class DocumentServices:
    """
    A class that provides services related to documents.

    Methods:
        get_document_factory() -> Type[DocumentFactory]:
            Returns the DocumentFactory class.

        get_document_repo() -> DirectReportPermissionAnnotateMixin.DirectReportPermissionAnnotateManager[Document]:
            Returns the manager for the Document model.

        get_document_by_id(id: str) -> Document:
            Retrieves a document by its ID.

    """

    @staticmethod
    def get_document_factory() -> Type[DocumentFactory]:
        """
        Returns the DocumentFactory class.

        Returns:
            Type[DocumentFactory]: The DocumentFactory class.

        """
        return DocumentFactory

    @staticmethod
    def get_document_repo() -> (
        DirectReportPermissionAnnotateMixin.DirectReportPermissionAnnotateManager[
            Document
        ]
    ):
        """
        Returns the manager for the Document model.

        Returns:
            DirectReportPermissionAnnotateMixin.DirectReportPermissionAnnotateManager[Document]: The manager for the Document model.
        """
        return Document.objects

    def get_document_by_id(self, id: str) -> Document:
        return Document.objects.get(id=id)
