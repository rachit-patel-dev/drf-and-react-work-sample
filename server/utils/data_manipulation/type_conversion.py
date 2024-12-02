from typing import Dict, List, Tuple, Union, Any

from utils.django.exceptions import DictKeysAreNotEqualException

def dict_key_changer(
    old_keys: List[Any], new_keys: List[Any], data_dict: Dict[str, Any]
) -> dict:
    """
    Change keys in a dictionary based on provided old and new key lists.

    Parameters:
        old_keys (list): List of old keys to be replaced.
        new_keys (list): List of new keys to replace the corresponding old keys.
        data_dict (dict): The original dictionary to be modified.

    Returns:
        dict: A new dictionary with keys replaced as specified.

    Raises:
        DictKeysAreNotEqualException: If the lengths of old_keys and new_keys are not equal.

    Example:
        original_dict = {'old_key1': 'value1', 'old_key2': 'value2', 'another_key': 'another_value'}
        new_keys = ['new_key1', 'new_key2']
        modified_dict = dict_key_changer(['old_key1', 'old_key2'], new_keys, original_dict)
        print(modified_dict)
    """
    if old_keys.__len__() != new_keys.__len__():
        raise DictKeysAreNotEqualException(
            item="Dict keys length match exception",
            message="dict keys are not in same length",
        )
    # Create a copy of the original dictionary to avoid modifying it directly
    modified_dict = data_dict.copy()

    # Iterate over old_keys and new_keys
    for old_key, new_key in zip(old_keys, new_keys):
        # Check if the old key exists in the dictionary
        if old_key in modified_dict:
            # Update the dictionary with the new key and value
            modified_dict[new_key] = modified_dict[old_key]
            # Optionally, remove the old key if needed
            del modified_dict[old_key]

    # Return the modified dictionary
    return modified_dict


def tuple_of_lists_to_tuple_of_dicts(
    lists: Tuple[List[Dict[str, Union[str, int, float, bool, None, Any]]], ...],
    keys: Tuple[str, ...],
) -> Tuple[Dict[str, Dict[str, Union[str, int, float, bool, None, Any]]], ...]:
    """
    Convert a tuple of lists of dictionaries into a tuple of dictionaries,
    using the specified keys as the dictionary keys.

    Args:
        lists (tuple): A tuple of lists, where each list contains dictionaries.
        keys (tuple): A tuple of strings specifying the keys to use for each list.

    Returns:
        tuple: A tuple of dictionaries, where each dictionary is created using the specified keys.

    Example:
        planning_overview_dict = [
            {"planning_id": 1, "data": "planning_data_1"},
            {"planning_id": 2, "data": "planning_data_1"},
            {"planning_id": 3, "data": "planning_data_1"},
        ]

        company_division_dict = [
            {"id": 101, "division_name": "Division_A"},
            {"id": 102, "division_name": "Division_A"},
            {"id": 103, "division_name": "Division_A"},
        ]

        keys_tuple = ("planning_id", "id")

        result_tuple = tuple_of_lists_to_tuple_of_dicts(
            (planning_overview_dict, company_division_dict), keys_tuple
        )

        # Accessing individual results
        result_planning_dict, result_company_division_dict = result_tuple

        print("Result Planning Dict:", result_planning_dict)
        print("Result Company Division Dict:", result_company_division_dict)
    """
    result_dicts = tuple(
        {str(item[key]): item for item in lst} for lst, key in zip(lists, keys)
    )
    return result_dicts
