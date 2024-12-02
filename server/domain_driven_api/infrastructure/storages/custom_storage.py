from storages.backends.s3boto3 import S3Boto3Storage
from django.conf import settings


class MediaStorage(S3Boto3Storage):
    """
    Custom storage class for managing media files on Amazon S3.

    This class extends the S3Boto3Storage class to provide customized behavior
    for storing and retrieving media files (such as images, videos, etc.) in an
    Amazon S3 bucket. It utilizes the specified AWS storage bucket name and
    designates the 'media' directory as the location for storing the files.

    Attributes:
        bucket_name (str): The name of the AWS S3 bucket where media files are stored.
                        This value is obtained from the `AWS_STORAGE_BUCKET_NAME` setting.

        location (str): The subdirectory within the S3 bucket where media files are stored.
                        By default, this is set to 'media'.

        file_overwrite (bool): A flag indicating whether to allow overwriting existing files
                            with the same name. When set to True, existing files will be
                            overwritten. When set to False, a new unique filename will be
                            generated for each uploaded file to avoid overwrites.

    Note:
        This class assumes that appropriate AWS credentials and settings are configured
        for the application to interact with the specified S3 bucket.

    Example:
        # Create an instance of the MediaStorage class
        media_storage = MediaStorage()

        # Save a media file to the specified location in the S3 bucket
        media_storage.save('path/to/my_image.jpg', ContentFile(image_data))

        # Retrieve the URL for accessing the saved media file
        file_url = media_storage.url('path/to/my_image.jpg')
    """

    bucket_name = settings.AWS_STORAGE_BUCKET_NAME
    location = "media"
    file_overwrite = True
