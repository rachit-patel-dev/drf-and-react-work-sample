from googletrans.constants import LANGUAGES
from drf_spectacular.utils import OpenApiParameter, OpenApiExample


default_language_query_param = OpenApiParameter(
    name="Language",
    type=str,
    location=OpenApiParameter.HEADER,
    description="The language parameter to translate.",
    examples=[
        OpenApiExample(f"{data}:{LANGUAGES[data ]}", value=data) for data in LANGUAGES
    ],
    default="en",
)
page_size_param = OpenApiParameter(
    name="page_size",
    type=str,  # This is important, drf-spectacular incorrectly sets this as an int by default
    location=OpenApiParameter.QUERY,
    description="The pagination page_size value.",
)

page_no_param = OpenApiParameter(
    name="page",
    type=str,  # This is important, drf-spectacular incorrectly sets this as an int by default
    location=OpenApiParameter.QUERY,
    description="The pagination page value.",
)


def default_cursor_param(paginator=False) -> list:
    """
    Generate a list of default OpenApiParameter objects for cursor-based pagination.

    :param paginator: A boolean indicating whether pagination is enabled or not. Default is False.
    :return: A list of OpenApiParameter objects representing the default cursor parameters.

    Example usage:
        >>> default_cursor_param()
        [default_language_query_param]

        >>> default_cursor_param(paginator=True)
        [default_language_query_param, page_size_param, page_no_param]
    """
    params = []
    params.append(default_language_query_param)
    if paginator:
        params.append(page_size_param)
        params.append(page_no_param)
    return params
