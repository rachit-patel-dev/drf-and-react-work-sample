# django imports
from rest_framework import serializers
from domain_driven_api.domain.document.models import Document
from domain_driven_api.application.user.services import UserAppServices
from domain_driven_api.interface.initiative.serializers import (
    ResponsiblePersonSerializer,
)


class DocumentCreateSerializer(serializers.ModelSerializer):
    """
    A serializer class for creating a document.

    This serializer is used to validate and deserialize data for creating a document.
    It is used in conjunction with the Document model.

    Attributes:
        model (Document): The Document model that the serializer is based on.
        fields (list): The fields from the Document model that should be included in the serializer.
        extra_kwargs (dict): Additional keyword arguments for the serializer fields.

    Example:
        To create a new document, instantiate the serializer with the data and call the `is_valid()` method to validate the data.
        If the data is valid, call the `save()` method to create the document.

            serializer = DocumentCreateSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()

    Note:
        The `link` and `owner` fields are marked as not required in the serializer, meaning they can be omitted when creating a document.
    """

    class Meta:
        model = Document
        fields = ["title", "priority", "status", "link", "owner"]
        extra_kwargs = {"link": {"required": False}, "owner": {"required": False}}


class DocumentRetrieveSerializer(serializers.ModelSerializer):
    """
    A serializer class for retrieving a document.

    This serializer is used to convert the Document model instance into a JSON representation for retrieving a document. It includes the fields 'id', 'title', 'priority', 'status', 'owner', 'link', 'is_file_uploaded', and 'file_name'.

    Attributes:
        owner (SerializerMethodField): A serializer method field that retrieves the owner of the document.

    Methods:
        get_owner(obj): Retrieves the owner of the document using the UserAppServices class.

    Meta:
        model (Document): The model class that the serializer is based on.
        fields (list): The fields to include in the serialized representation of the document.

    """

    owner = serializers.SerializerMethodField()

    def get_owner(self, obj):
        user_app_services = UserAppServices(log=self.context["log"])
        return ResponsiblePersonSerializer(
            instance=user_app_services.get_user_by_pk(pk=obj.owner),
            context={"log": self.context["log"]},
        ).data

    class Meta:
        model = Document
        fields = [
            "id",
            "title",
            "priority",
            "status",
            "owner",
            "link",
            "is_file_uploaded",
            "file_name",
        ]


class DocumentListSerializer(DocumentRetrieveSerializer):
    """
    A serializer class for listing documents.

    This serializer extends the DocumentRetrieveSerializer and adds a 'permissions' field to the serialized representation of a document. It is used to convert the Document model instance into a JSON representation for listing documents.

    Attributes:
        permissions (JSONField): A field that represents the permissions associated with the document.

    Meta:
        model (Document): The model class that the serializer is based on.
        fields (list): The fields to include in the serialized representation of the document, including the 'permissions' field.

    """

    permissions = serializers.JSONField()

    class Meta(DocumentRetrieveSerializer.Meta):
        fields = DocumentRetrieveSerializer.Meta.fields + ["permissions"]


class DocumentUpdateSerializer(serializers.ModelSerializer):
    """
    A serializer class for updating a Document object.

    This serializer is used to validate and deserialize data for updating a Document object. It specifies the fields that can be updated and provides additional validation rules for each field.

    Attributes:
        model (Model): The Document model class.
        fields (list): The list of fields that can be updated.
        extra_kwargs (dict): Additional keyword arguments for the fields.

    """

    class Meta:
        model = Document
        fields = ["title", "priority", "status", "link", "owner"]
        extra_kwargs = {
            "title": {"required": False},
            "priority": {"required": False},
            "status": {"required": False},
            "link": {"required": False},
            "owner": {"required": False},
        }
