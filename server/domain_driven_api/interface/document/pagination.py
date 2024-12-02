from rest_framework.pagination import PageNumberPagination


class DocumentPagination(PageNumberPagination):
    """
    A custom pagination class for paginating documents.

    This class extends the 'PageNumberPagination' class from the 'rest_framework.pagination' module.

    Attributes:
        page_size (int): The number of documents to include on each page. Default is 5.
        page_size_query_param (str): The query parameter to specify the page size. Default is "page_size".
        max_page_size (int): The maximum number of documents allowed on a single page. Default is 100.

    """

    page_size = 5
    page_size_query_param = "page_size"
    max_page_size = 100
