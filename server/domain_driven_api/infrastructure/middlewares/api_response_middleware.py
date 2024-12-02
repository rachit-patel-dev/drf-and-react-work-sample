from domain_driven_api.infrastructure.translator.services import CustomTranslator


class CustomResponseMiddleware:
    """
    CustomResponseMiddleware class.

    This class is a middleware that intercepts the response from the view and performs custom operations on it.
    It uses the CustomTranslator class to translate the response data into the specified target language.

    Attributes:
        get_response (function): The function that gets the response from the view.
        custom_translator (CustomTranslator): An instance of the CustomTranslator class.

    Methods:
        __call__(self, request): Executes the middleware logic and returns the response.
        process_template_response(self, request, response): Processes the template response and translates the response data.

    """

    def __init__(self, get_response):
        self.get_response = get_response
        self.custom_translator = CustomTranslator()

    def __call__(self, request):
        response = self.get_response(request)
        return response

    def process_template_response(self, request, response):
        if "superadmin" in request.path:
            return response
        if "custom_admin" in request.path:
            return response
        language = request.headers.get("Language", "en").lower()
        response.data = self.custom_translator.translate_response(
            translating_data=response.data,
            translation_keys=["message"],
            target_language=language,
        )
        return response
