from typing import List, Any, Dict


class DynamicVariablesContext:
    """
    A context manager for dynamically adding and removing variables to an object.

    Usage:
    - Create an instance of the `DynamicVariablesContext` class, specifying the target `instance`
      and a dictionary `variables_dict` containing variable names and their corresponding values.
    - Enter the context using a `with` statement, which will add the variables to the `instance`.
    - Exit the context, and the added variables will be removed from the `instance`.

    Example:
    ```
    class MyClass:
        pass

    obj = MyClass()

    with DynamicVariablesContext(obj, {"x": 42, "y": "Hello"}):
        print(obj.x)  # Outputs: 42
        print(obj.y)  # Outputs: Hello

    print(obj.x)  # Raises AttributeError (variable 'x' is removed)
    print(obj.y)  # Raises AttributeError (variable 'y' is removed)
    ```

    Args:
    - instance: The target object to which variables will be dynamically added and removed.
    - variables_dict: A dictionary where keys are variable names and values are the corresponding values
      to be added to the `instance`.
    """

    def __init__(self, instance, variables_dict: Dict[str, Any]):
        self.instance = instance
        self.variables_dict = variables_dict

    def __enter__(self):
        for key, value in self.variables_dict.items():
            setattr(self.instance, key, value)

    def __exit__(self, exc_type, exc_value, traceback):
        for key in self.variables_dict.keys():
            delattr(self.instance, key)
