from typing import List, Any, Dict
import logging
from googletrans import Translator
from googletrans.constants import LANGUAGES
from domain_driven_api.infrastructure.logger.models import AttributeLogger

log = AttributeLogger(logging.getLogger(__name__))


class CustomTranslator:
    """
    CustomTranslator class.

    This class provides methods for translating text into multiple target languages using Google Translate.

    Attributes:
        __language_dict (Dict[str, str]): A dictionary containing language codes and their corresponding names.

    Methods:
        __init__(): Initializes the CustomTranslator object.
        __check_language_availability(language: str): Checks if a given language is available for translation.
        translate_response(translating_data: Dict[str, Any], target_language: str, translation_keys: List[Any]): Translates a text into multiple target languages.

    """

    def __init__(self) -> None:
        self.__language_dict = LANGUAGES

    def __check_language_availability(self, language: str):
        return language in self.__language_dict.keys()

    def translate_response(
        self,
        translating_data: Dict[str, Any],
        target_language: str,
        translation_keys: List[Any],
    ):
        """
        Translate a text into multiple target languages using Google Translate.

        :param text: The text to be translated.
        :param target_languages: A list of language codes for the target languages.
                                For example: ['fr', 'es', 'ja'] for French, Spanish, and Japanese.
        :return: A dictionary containing the translations in the format {'language_code': 'translated_text'}.
        """
        translator = Translator()
        if not self.__check_language_availability(language=target_language):
            target_language = "en"
        for data in translating_data:
            if data in translation_keys:
                translation = translator.translate(
                    translating_data[data], dest=target_language
                )
                translating_data[data] = translation.text
        return translating_data
