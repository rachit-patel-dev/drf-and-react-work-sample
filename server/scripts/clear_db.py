import os
import django

# Set the Django settings module to your project's settings module
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "domain_driven_api.settings")

# Initialize Django
django.setup()

from django.core.management import call_command


def remove_all_tables():
    """
    Remove all tables from the database and recreate them.

    This function prompts the user for confirmation before proceeding. If the user confirms, it runs the "flush" management command to remove all data from the database and then runs the "migrate" management command to recreate the database tables.

    Parameters:
        None

    Returns:
        None

    Raises:
        None

    Example:
        remove_all_tables()
    """
    # Prompt the user for confirmation before proceeding
    confirmation = input(
        "This will delete all database tables. Are you sure you want to continue? (yes/no): "
    ).lower()

    if confirmation == "yes":
        # Run the "flush" management command to remove all data from the database
        call_command("flush", interactive=False)

        # Run the "migrate" management command to recreate the database tables
        call_command("migrate")
        print("All database tables have been removed and models have been migrated.")
    else:
        print("Operation canceled.")


def run():
    """
    Run the 'remove_all_tables' function to remove all tables from the database and recreate them, and then print a success message.

    Parameters:
        None

    Returns:
        None

    Raises:
        None

    Example:
        run()
    """
    remove_all_tables()
    print("Successfully cleared all data.")
