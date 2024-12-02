import re
import django_filters
from django.db.models import Q, Case, Value, When, IntegerField, Subquery, OuterRef
from domain_driven_api.domain.document.models import Document
from domain_driven_api.domain.user.models import User


class DocumentFilters(django_filters.FilterSet):
    """
    A class representing filters for the Document model.

    Attributes:
        priority (django_filters.CharFilter): A filter for the priority field of the Document model.
        status (django_filters.CharFilter): A filter for the status field of the Document model.
        sort_by (django_filters.CharFilter): A filter for sorting the queryset based on a specific field.
        responsible_person (django_filters.CharFilter): A filter for filtering the queryset based on the responsible person.

    Methods:
        priority_type_filter(queryset, name, value): Filters the queryset based on the priority field.
        status_filter(queryset, name, value): Filters the queryset based on the status field.
        sort_by_filter(queryset, name, value): Sorts the queryset based on a specific field.
        responsible_person_filter(queryset, name, value): Filters the queryset based on the responsible person.

    """


"""A class representing filters for the Document model."""


class DocumentFilters(django_filters.FilterSet):
    # ... rest of the code
    class Meta:
        model = Document
        fields = ["priority", "status"]

    priority = django_filters.CharFilter(
        method="priority_type_filter", label="priority"
    )

    status = django_filters.CharFilter(method="status_filter", label="status")

    sort_by = django_filters.CharFilter(method="sort_by_filter", label="sort_by")

    responsible_person = django_filters.CharFilter(
        method="responsible_person_filter", label="responsible_person"
    )

    def priority_type_filter(self, queryset, name, value):
        """
        Filter the queryset based on the priority type.

        :param queryset: The queryset to be filtered.
        :param name: The name of the filter field.
        :param value: The value of the filter field.
        :return: The filtered queryset.
        """
        priority = value.strip().split(",")
        return queryset.filter(Q(priority__in=priority)).distinct()

    def status_filter(self, queryset, name, value):
        """
        Filter the queryset based on the status field.

        :param queryset: The queryset to be filtered.
        :param name: The name of the filter field.
        :param value: The value of the filter field.
        :return: The filtered queryset.
        """
        status = value.strip().split(",")
        return queryset.filter(Q(status__in=status)).distinct()

    def sort_by_filter(self, queryset, name, value):
        """
        Filter the queryset based on the sort_by field.

        :param queryset: The queryset to be filtered.
        :param name: The name of the filter field.
        :param value: The value of the filter field.
        :return: The filtered queryset.
        """
        if re.search(r"(?:-)?status", value):
            status_case = Case(
                When(priority="Private", then=Value(0)),
                When(priority="Shared", then=Value(1)),
                default=Value(2),
                output_field=IntegerField(),
            )
            if value == "status":
                sortable = status_case
                return queryset.order_by(
                    sortable,
                    "status",
                )
            elif value == "-status":
                sortable = -status_case
                return queryset.order_by(
                    sortable,
                    "-status",
                )
            else:
                return queryset.order_by(value)

        if re.search(r"(?:-)?owner", value):
            return queryset.annotate(
                owner_name=Subquery(
                    User.objects.filter(id=OuterRef("owner")).values(
                        "first_name", isForSubQuery=True
                    )
                )
            ).order_by(value)

        priority_case = Case(
            When(priority="Low", then=Value(0)),
            When(priority="Medium", then=Value(1)),
            When(priority="High", then=Value(2)),
            default=Value(3),
            output_field=IntegerField(),
        )

        if value == "priority":
            sortable = priority_case
            return queryset.order_by(
                sortable,
                "priority",
            )
        elif value == "-priority":
            sortable = -priority_case
            return queryset.order_by(
                sortable,
                "-priority",
            )
        else:
            return queryset.order_by(value)

    def responsible_person_filter(self, queryset, name, value):
        """
        Filter the queryset based on the responsible_person field.

        :param queryset: The queryset to be filtered.
        :param name: The name of the filter field.
        :param value: The value of the filter field.
        :return: The filtered queryset.
        """
        responsible_person_ids = value.strip().split(",")
        responsible_person_ids = [ids.strip() for ids in responsible_person_ids]
        return queryset.filter(Q(owner__in=responsible_person_ids)).distinct()
