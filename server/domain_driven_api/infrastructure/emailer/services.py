from typing import List, Any, Dict
from django.conf import settings
from django.core.mail import EmailMessage
from domain_driven_api.infrastructure.logger.models import AttributeLogger
from utils.django.exceptions import MailNotSendException, TemplateNotFoundException


class Mail(EmailMessage):
    """
    A class representing an email message.

    Attributes:
        subject (str): The subject of the email.
        body (str): The body of the email.
        from_email (str): The sender's email address.
        to (list): A list of recipient email addresses.
        dynamic_template_data (dict): A dictionary containing dynamic template data.
        template_id (str): The ID of the email template.

    Methods:
        __init__(self, subject="", body="", from_email=None, to=None, bcc=None, connection=None, attachments=None, headers=None, cc=None, reply_to=None):
            Initializes a new instance of the Mail class.

        set_mail_data(self, subject="", body="", from_email=None, to=[], dynamic_template_data=None, template_id=None):
            Sets the data for the email message.

    """

    def __init__(
        self,
        subject="",
        body="",
        from_email=None,
        to=None,
        bcc=None,
        connection=None,
        attachments=None,
        headers=None,
        cc=None,
        reply_to=None,
    ):
        """
        Initializes a new instance of the Mail class.

        Parameters:
            subject (str): The subject of the email. Default is an empty string.
            body (str): The body of the email. Default is an empty string.
            from_email (str): The sender's email address. Default is None.
            to (list): A list of recipient email addresses. Default is None.
            bcc (list): A list of blind carbon copy email addresses. Default is None.
            connection: The email backend to use. Default is None.
            attachments (list): A list of email attachments. Default is None.
            headers (dict): A dictionary of email headers. Default is None.
            cc (list): A list of carbon copy email addresses. Default is None.
            reply_to (list): A list of reply-to email addresses. Default is None.
        """
        super().__init__(
            subject,
            body,
            from_email,
            to,
            bcc,
            connection,
            attachments,
            headers,
            cc,
            reply_to,
        )

    def set_mail_data(
        self,
        subject="",
        body="",
        from_email=None,
        to=[],
        dynamic_template_data=None,
        template_id=None,
    ):
        """
        Sets the data for the email message.

        Parameters:
            subject (str): The subject of the email. Default is an empty string.
            body (str): The body of the email. Default is an empty string.
            from_email (str): The sender's email address. Default is None.
            to (list): A list of recipient email addresses. Default is an empty list.
            dynamic_template_data (dict): A dictionary containing dynamic template data. Default is None.
            template_id (str): The ID of the email template. Default is None.
        """
        self.subject = subject
        self.body = body
        self.from_email = from_email
        self.to = to
        self.dynamic_template_data = dynamic_template_data
        self.template_id = template_id


class MailerServices:
    """
    A class representing Mailer Services.

    Attributes:
        log (AttributeLogger): An instance of AttributeLogger used for logging.
        from_email (str): The sender's email address.

    Methods:
        __init__(self, log: AttributeLogger):
            Initializes a new instance of the MailerServices class.

        set_mail_instance(self):
            Sets the mail_instance attribute with a new instance of the Mail class.

        send_mail(self, email: str, subject: str, template_data: Dict[str, Any], template_name: str, language: str = settings.DEFAULT_GERMAN_LANGUAGE):
            Sends an email using the provided parameters.

            Parameters:
                email (str): The recipient's email address.
                subject (str): The subject of the email.
                template_data (Dict[str, Any]): A dictionary containing dynamic template data.
                template_name (str): The name of the email template.
                language (str): The language to use for filtering the email template. Default is settings.DEFAULT_GERMAN_LANGUAGE.
    """

    def __init__(self, log: AttributeLogger):
        self.log = log
        self.from_email = f"{settings.EMAIL_FROM_NAME} <{settings.EMAIL_FROM_ADDRESS}>"

    def set_mail_instance(self):
        self.mail_instance = Mail()

    def send_mail(
        self,
        email: str,
        subject: str,
        template_data: Dict[str, Any],
        template_name: str,
        language: str = settings.DEFAULT_GERMAN_LANGUAGE,
    ):
        """
        Sends an email using the provided parameters.

        Parameters:
            email (str): The recipient's email address.
            subject (str): The subject of the email.
            template_data (Dict[str, Any]): A dictionary containing dynamic template data.
            template_name (str): The name of the email template.
            language (str): The language to use for filtering the email template. Default is settings.DEFAULT_GERMAN_LANGUAGE.

        Raises:
            TemplateNotFoundException: If the template_id is not found for the selected language.
            MailNotSendException: If there is an error sending the email.
        """
        if settings.ENABLE_MAILS:
            try:
                template_selection = settings.SENDGRID_TEMPLATES.get(template_name)
                template_id = template_selection.get(language.lower())

                if not template_id:
                    self.log.error("Template_id not found for selected language")
                    raise TemplateNotFoundException(
                        "template-not-found", f"Template Not Found, {str(e)}", self.log
                    )

                self.set_mail_instance()
                self.mail_instance.set_mail_data(
                    subject=subject,
                    from_email=self.from_email,
                    to=[email],
                    template_id=template_id,
                    dynamic_template_data=template_data,
                )
                self.mail_instance.send(fail_silently=False)
            except Exception as e:
                self.log.error(str(e))
                raise MailNotSendException("mail-not-send-exception", str(e), self.log)
        else:
            self.log.info(f"{template_data}-send-email-data-for-{email}")
