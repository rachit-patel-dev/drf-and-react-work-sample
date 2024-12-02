import itertools
from typing import Dict, List, Tuple
from django.db import transaction
from django.db.models.query import QuerySet
from domain_driven_api.domain.user.models import User
from domain_driven_api.domain.user.reportee_tracker.models import ReporteeTracker
from domain_driven_api.domain.company.models import Company
from domain_driven_api.domain.role.user_role.models import UserRole


def get_all_users_from_organizations() -> Dict[str, QuerySet[User]]:
    """
    Get all users from organizations.

    Returns:
        Dict[str, QuerySet[User]]: A dictionary mapping organization IDs to a queryset of users.

    """
    organizations_queryset = Company.objects.filter(is_active=True)
    organization_users = dict()
    for organization in organizations_queryset:
        user_roles = UserRole.objects.filter(company_id=organization.id)
        users_queryset = User.objects.none()
        for user_role in user_roles:
            users_queryset |= User.objects.filter(id=user_role.user_id)
        organization_users[f"{organization.id}"] = users_queryset
    return organization_users


def generate_reportees(data: Dict[str, QuerySet[User]]):
    """
    Generate reportees for users.

    This function generates reportees for users based on the provided data. It takes a dictionary of organization IDs mapped to a queryset of users as input.

    Parameters:
        data (Dict[str, QuerySet[User]]): A dictionary mapping organization IDs to a queryset of users.

    Returns:
        None

    """
    for users in data.values():
        user_list: List[Tuple[User, User]] = list(
            itertools.combinations(list(users), 2)
        )
        for user_pair in user_list:
            with transaction.atomic():
                reportee_tracker = ReporteeTracker(
                    senior_id=user_pair[0].id, reportee_id=user_pair[1].id
                )
                reportee_tracker.save()


def populate_hierarchy_of_users():
    """
    Populate the hierarchy of users.

    This function populates the hierarchy of users by generating reportees for each user in different organizations. It first retrieves a dictionary of organization IDs mapped to a queryset of users using the 'get_all_users_from_organizations' function. Then, it calls the 'generate_reportees' function to generate reportees for each user based on the provided data.

    Parameters:
        None

    Returns:
        None

    """
    users_dict_for_different_organizations = get_all_users_from_organizations()
    generate_reportees(data=users_dict_for_different_organizations)


def run():
    """
    Run the populate_hierarchy_of_users function and print a success message.

    This function calls the populate_hierarchy_of_users function to populate the hierarchy of users by generating reportees for each user in different organizations. After the function completes, it prints a success message indicating that the hierarchy data for all users has been successfully populated.

    Parameters:
        None

    Returns:
        None
    """
    populate_hierarchy_of_users()
    print("Successfully populated hierarchy data for all users")
