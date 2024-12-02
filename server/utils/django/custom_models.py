# python imports

# django imports
import json
from typing import List, Dict, Any
from django.db import models


class ActivityTracking(models.Model):
    """
    A DatedModel includes fields that reflect when the model has been created
    or modified
    """

    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        abstract = True


class DirectReportPermissionAnnotateMixin(models.Model):
    """
    A mixin class that provides a manager and method for annotating querysets with direct report permissions.

    Attributes:
        objects (DirectReportPermissionAnnotateManager): The manager for the mixin class.

    Methods:
        annotate_by_direct_report_permission(permissions: List[Any], filters: Dict[str, Any] = dict()) -> QuerySet:
            Annotates the queryset with direct report permissions based on the provided permissions and filters.

            Args:
                permissions (List[Any]): A list of permissions.
                filters (Dict[str, Any], optional): Additional filters to apply to the queryset. Defaults to an empty dictionary.

            Returns:
                QuerySet: The annotated queryset.

    """

    class DirectReportPermissionAnnotateManager(models.Manager):
        """
        Annotates the queryset with direct report permissions based on the provided permissions and filters.

        Args:
            permissions (List[Any]): A list of permissions.
            filters (Dict[str, Any], optional): Additional filters to apply to the queryset. Defaults to an empty dictionary.

        Returns:
            QuerySet: The annotated queryset.
        """

        def annotate_by_direct_report_permission(
            self, permissions: List[Any], filters: Dict[str, Any] = dict()
        ):
            permissions_dict = {item["id"]: item["permissions"] for item in permissions}
            return self.filter(**filters).annotate(
                permissions=models.Case(
                    *[
                        models.When(id=key, then=models.Value(json.dumps(value_dict)))
                        for key, value_dict in permissions_dict.items()
                    ],
                    output_field=models.JSONField(),
                )
            )

    objects = DirectReportPermissionAnnotateManager()

    class Meta:
        abstract = True
