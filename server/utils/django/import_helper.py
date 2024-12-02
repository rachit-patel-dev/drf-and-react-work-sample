import importlib
from django.conf import settings
from domain_driven_api.infrastructure.logger.models import AttributeLogger


def import_module_dynamically(
    layer_name: str, module_name: str, file_name: str, item: str, log: AttributeLogger
):
    """
    Dynamically imports a module and returns the specified item from it.

    Parameters:
    - layer_name (str): The name of the layer in which the module is located.
    - module_name (str): The name of the module to import.
    - file_name (str): The name of the file within the module.
    - item (str): The name of the item to retrieve from the module.
    - log (AttributeLogger): An instance of the AttributeLogger class for logging errors.

    Returns:
    - The specified item from the imported module, or None if an error occurs during the import.

    Raises:
    - None.

    Example:
    import_module_dynamically("domain", "models", "user", "UserModel", logger)
    """
    try:
        path = f"{settings.PROJECT_DIR}.{layer_name}.{module_name}.{file_name}"
        module = importlib.import_module(path)
        return getattr(module, item)
    except Exception as e:
        log.error(str(e))
        return None
