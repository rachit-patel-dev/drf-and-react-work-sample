import inspect
from typing import List, Any, Dict
from typing import Union, Dict
from rest_framework import status
from rest_framework.response import Response
from django.conf import settings
import sentry_sdk


class APIResponse:
    def __new__(
        cls,
        errors: Union[dict, Exception] = {},
        status_code: status = None,
        data: Dict[str, Any] = {},
        message: Union[str, Dict[str, str]] = "",
        for_error: bool = False,
        general_error: bool = False,
        is_partially_processed: bool = False,
        **kwargs,
    ) -> "APIResponse":
        """
        APIResponse class represents a custom response builder for API endpoints.

        Attributes:
            message (Union[str, dict]): The message to be included in the response.
            errors (dict): The errors to be included in the response.
            status_code (status): The HTTP status code of the response.
            data (Dict[str, Any]): The data to be included in the response.
            for_error (bool): Indicates if the response is for an error event.
            general_error (bool): Indicates if the response is a general error.
            is_partially_processed (bool): Indicates if the response is partially processed.
            kwargs: Additional keyword arguments.

        Methods:
            __new__: Creates a new instance of the APIResponse class.
            __init__: Initializes the APIResponse instance.
            response_builder_callback: Determines which response method to call based on the for_error attribute.
            struct_response: Builds the response dictionary structure.
            success_message: Generates the success message based on the caller function name.
            success: Creates a custom response for a success event with a response status of 200.
            fail: Creates a custom response for a failure event with a custom response status.

        Note:
            This class is designed to be used as a response builder for API endpoints. It provides methods to create custom responses for success and failure events, with the ability to include data, errors, and custom status codes.
        """
        cls.__init__(
            cls,
            message=message,
            errors=errors,
            status_code=status_code,
            data=data,
            for_error=for_error,
            general_error=general_error,
            is_partially_processed=is_partially_processed,
            **kwargs,
        )
        instance = super().__new__(cls)
        instance.message = message
        instance.errors = errors
        instance.status_code = status_code
        instance.data = data
        instance.for_error = for_error
        instance.is_partially_processed = is_partially_processed
        instance.caller_function = inspect.stack()[1].function
        if isinstance(errors, Exception):
            instance.errors = errors.args
            sentry_sdk.capture_exception(
                errors, tags={"catched-exceptions": "catched-exceptions"}
            )
        return instance.response_builder_callback()

    def __init__(
        self,
        message: Union[str, dict],
        errors={},
        status_code: status = None,
        data: Dict[str, Any] = {},
        for_error: bool = False,
        general_error: bool = False,
        is_partially_processed: bool = False,
        **kwargs,
    ) -> None:
        """
        Initializes an instance of the APIResponse class.

        Parameters:
            message (Union[str, dict]): The message to be included in the response.
            errors (dict, optional): The errors to be included in the response. Defaults to {}.
            status_code (status, optional): The HTTP status code of the response. Defaults to None.
            data (Dict[str, Any], optional): The data to be included in the response. Defaults to {}.
            for_error (bool, optional): Indicates if the response is for an error event. Defaults to False.
            general_error (bool, optional): Indicates if the response is a general error. Defaults to False.
            is_partially_processed (bool, optional): Indicates if the response is partially processed. Defaults to False.
            **kwargs: Additional keyword arguments.

        Returns:
            None

        Note:
            This method initializes the instance of the APIResponse class with the provided parameters.
            It sets the instance variables for message, errors, status_code, data, for_error, caller_function,
            general_error, is_partially_processed, and kwargs.

        Example:
            response = APIResponse(
                message="Success",
                errors={},
                status_code=status.HTTP_200_OK,
                data={"key": "value"},
                for_error=False,
                general_error=False,
                is_partially_processed=False,
                custom_arg="custom_value"
            )
        """
        self.message = message
        self.errors = errors
        self.status_code = status_code
        self.data = data
        self.for_error = for_error
        self.caller_function = inspect.stack()[1].function
        self.general_error = general_error
        self.is_partially_processed = is_partially_processed
        self.kwargs = kwargs

    def response_builder_callback(self):
        """
        Determines which response method to call based on the value of the 'for_error' attribute.

        Returns:
            Response: The response generated by either the 'fail' or 'success' method.

        Note:
            This method checks the value of the 'for_error' attribute. If it is True, the 'fail' method is called to generate a custom response for a failure event. If it is False, the 'success' method is called to generate a custom response for a success event.

        Example:
            response_builder_callback()
        """
        if self.for_error:
            return self.fail()
        else:
            return self.success()

    def struct_response(
        self,
        data: Dict[str, Any],
        success: bool,
        message: str,
        errors=None,
        is_partially_processed: bool = False,
    ) -> dict:
        """
        Builds the response dictionary structure.

        Parameters:
            data (Dict[str, Any]): The data to be included in the response.
            success (bool): Indicates if the response is a success event.
            message (str): The message to be included in the response.
            errors (Optional[Dict[str, Any]]): The errors to be included in the response. Defaults to None.
            is_partially_processed (bool, optional): Indicates if the response is partially processed. Defaults to False.

        Returns:
            dict: The response dictionary structure.

        Note:
            This method builds the response dictionary structure based on the provided parameters. It creates a dictionary with keys 'success', 'message', and 'data'. If 'errors' parameter is provided, it adds the 'errors' key to the dictionary. If 'is_partially_processed' parameter is True, it adds the 'is_partially_processed' key to the dictionary.

        Example:
            response = struct_response(
                data={"key": "value"},
                success=True,
                message="Success",
                errors={"error": "Error message"},
                is_partially_processed=False
            )
        """
        response = dict(success=success, message=message, data=data)
        if errors:
            response["errors"] = errors
        if is_partially_processed:
            response["is_partially_processed"] = is_partially_processed
        return response

    def success_message(self):
        return f'{self.caller_function.replace("_", "-").title()} Successful.'

    def success(self) -> Response:
        """
        This method will create a custom response for a success event with a response status of 200.

        Returns:
            Response: The custom response object.

        Note:
            This method generates a custom response for a success event. It creates a success message based on the value of the 'message' attribute. If the 'message' attribute is not provided, it generates the success message based on the caller function name. It determines if the response is partially processed based on the value of the 'is_partially_processed' attribute. It builds the response dictionary structure using the 'struct_response' method, with the provided data, success message, and is_partially_processed flag. If additional keyword arguments are provided, they are added to the response dictionary. The response status is set to 200 if the 'status_code' attribute is not provided.

        Example:
            response = success()
        """
        success_message = self.message if self.message else self.success_message()
        is_partially_processed = True if self.is_partially_processed else False
        response_data = self.struct_response(
            data=self.data,
            success=True,
            message=success_message,
            is_partially_processed=is_partially_processed,
        )
        if self.kwargs:
            response_data.update(self.kwargs)
        success_status = self.status_code if self.status_code else status.HTTP_200_OK
        return Response(response_data, status=success_status)

    def fail(self) -> Response:
        """
        Creates a custom response for a failure event with a custom response status.

        Returns:
            Response: The custom response object.

        Note:
            This method generates a custom response for a failure event. It determines the error message based on the value of the 'message' attribute. If the 'message' attribute is a dictionary, it takes the first error message from the dictionary. If the 'message' attribute is not a dictionary, it uses the value of the 'message' attribute as the error message. If the 'general_error' attribute is True, it uses the general error message from the settings module. It builds the response dictionary structure using the 'struct_response' method, with an empty data dictionary, a success flag set to False, the error message, and the errors provided. If additional keyword arguments are provided, they are added to the response dictionary. The response status is set to the value of the 'status_code' attribute.

        Example:
            response = fail()
        """
        error_message = (
            self.message[next(iter(self.message))][0]
            if isinstance(self.message, dict)
            else self.message
        )
        if self.general_error:
            error_message = settings.GENERAL_ERROR_MESSAGE
        response_data = self.struct_response(
            data={}, success=False, message=error_message, errors=self.errors
        )
        if self.kwargs:
            response_data.update(self.kwargs)
        return Response(response_data, status=self.status_code)
