from dataclasses import dataclass
import logging
from domain_driven_api.infrastructure.logger.models import AttributeLogger
from rest_framework import status
import sentry_sdk

log = AttributeLogger(logging.getLogger(__name__))


@dataclass(frozen=True)
class BaseExceptionWithLogs(Exception):
    item: str
    message: str
    log: AttributeLogger = log
    status_code: int = status.HTTP_400_BAD_REQUEST

    def error_data(self) -> dict:
        error_data = {"item": self.item, "message": self.message}
        self.log.error(str(error_data))
        sentry_sdk.capture_exception(
            self, tags={"custom-exceptions": "custom-exceptions"}
        )

        return error_data

    def __str__(self):
        return "{}: {}".format(self.item, self.message)


# general exception classes with status codes


class Status401Exception(BaseExceptionWithLogs):
    def __init__(self, item, message, log):
        super().__init__(item, message, log, status_code=status.HTTP_401_UNAUTHORIZED)


class Status400Exception(BaseExceptionWithLogs):
    def __init__(self, item, message, log):
        super().__init__(item, message, log, status_code=status.HTTP_400_BAD_REQUEST)


class Status403Exception(BaseExceptionWithLogs):
    def __init__(self, item, message, log):
        super().__init__(item, message, log, status_code=status.HTTP_403_FORBIDDEN)


class Status404Exception(BaseExceptionWithLogs):
    def __init__(self, item, message, log):
        super().__init__(item, message, log, status_code=status.HTTP_404_NOT_FOUND)


class Status409Exception(BaseExceptionWithLogs):
    def __init__(self, item, message, log):
        super().__init__(item, message, log, status_code=status.HTTP_409_CONFLICT)


class Status422Exception(BaseExceptionWithLogs):
    def __init__(self, item, message, log):
        super().__init__(
            item, message, log, status_code=status.HTTP_422_UNPROCESSABLE_ENTITY
        )


# done
class UserSignUpException(BaseExceptionWithLogs):
    pass


# done
class UpdateStatusException(BaseExceptionWithLogs):
    pass


# not used at anywhere
class AddUserException(BaseExceptionWithLogs):
    pass


class UserLoginException(Status401Exception):
    pass


# done
class UserNotExistException(Status404Exception):
    pass


class UserProfileWithCompanyDetailsDoesNotExistException(Status404Exception):
    pass


# done
class TokenExpireException(Status401Exception):
    pass


class UserAlreadySignUpException(Status409Exception):
    pass


# done
class ResetPasswordException(BaseExceptionWithLogs):
    pass


# done
class UserAlreadyExistsException(Status409Exception):
    pass


# not used
class UserRoleException(BaseExceptionWithLogs):
    pass


# done
class ObjectiveException(BaseExceptionWithLogs):
    pass


# done
class NotFromSameCompanyException(Status403Exception):
    pass


# done
class ObjectiveNotExistsException(Status404Exception):
    pass


# done
class ObjectiveTypeNotExistsException(Status404Exception):
    pass


# done
class ObjectiveNotBelongsToUserException(Status403Exception):
    pass


# done
class ObjectiveConditionException(BaseExceptionWithLogs):
    pass


# done
class ObjectiveConditionNotFoundException(Status403Exception):
    pass


# done
class NotUserObjectiveException(Status403Exception):
    pass


# done
class ResponsiblePersonNotFoundException(Status404Exception):
    pass


# done
class SeniorPersonNotFoundException(Status404Exception):
    pass


# not used
class ReporteeNotFoundException(BaseExceptionWithLogs):
    pass


# not used
class ReporteeTrackerException(BaseExceptionWithLogs):
    pass


# done
class CompanyNotFoundException(Status404Exception):
    pass


# done
class CompanyDivisionNotCreatedException(BaseExceptionWithLogs):
    pass


# done
class CompanyDivisionAlreadyExistsException(Status409Exception):
    pass


# done
class CompanyRoleNotCreatedException(BaseExceptionWithLogs):
    pass


#  done
class CompanyRoleNotExistsException(Status404Exception):
    pass


# done
class PrioritizedTaskException(BaseExceptionWithLogs):
    pass


# done
class PrioritizedTaskNotExistException(Status404Exception):
    pass


# done
class PrioritizedTaskNotOwnerException(Status403Exception):
    pass


# done
class MiddlewareException(Status401Exception):
    pass


# not used anywhere
class DivisionException(BaseExceptionWithLogs):
    pass


# done
class DivisionNameException(BaseExceptionWithLogs):
    pass


# done
class AbsoluteKPIsNotProvidedException(BaseExceptionWithLogs):
    pass


# done
class AbsoluteKPIsNotFoundException(Status404Exception):
    pass


# done
class AbsoluteKPIsNotAllowedException(BaseExceptionWithLogs):
    pass


# done
class RoleNameAlreadyExistsException(Status409Exception):
    pass


# done
class RoleNameException(BaseExceptionWithLogs):
    pass


# done
class RoleException(BaseExceptionWithLogs):
    pass


# done
class KPIsException(BaseExceptionWithLogs):
    pass


# done
class KPIsUnitNotProvidedException(Status422Exception):
    pass


# done
class CalenderNotFoundException(Status404Exception):
    pass


# done
class KPIFrequencyDataNotValidatedException(Status422Exception):
    pass


# done
class KPIFrequencyNotFoundException(Status404Exception):
    pass


# done
class KPIFrequencyNotProvidedException(Status422Exception):
    pass


# done
class KPIFrequencyException(BaseExceptionWithLogs):
    pass


# done
class CalenderManagerException(BaseExceptionWithLogs):
    pass


# done
class ResponsiblePersonDivisionNotExistsException(Status404Exception):
    pass


# done
class UserDivisionNotExistsException(Status404Exception):
    pass


# done
class CompanyDivisionNotExistsException(Status404Exception):
    pass


# done
class UserDivisionIsNotCEOException(Status403Exception):
    pass


# done
class KPINotExistsException(Status404Exception):
    pass


class KPINotArchivableException(Status422Exception):
    pass


class KPINotDeletableException(Status422Exception):
    pass


# done
class ObjectiveArchivedException(BaseExceptionWithLogs):
    pass


# done
class CompanyNotExistsException(Status404Exception):
    pass


# done
class ReportingPersonNotFoundException(Status404Exception):
    pass


# done
class VerifyTokenDataException(Status403Exception):
    pass


# done
class MailNotSendException(BaseExceptionWithLogs):
    pass


# done
class UserDeletionException(BaseExceptionWithLogs):
    pass


# done
class NotPercentageKPIException(BaseExceptionWithLogs):
    pass


# done
class InitiativeActionException(BaseExceptionWithLogs):
    pass


# done
class InitiativeActionNotFoundException(Status404Exception):
    pass


# done
class InitiativeNotFoundException(Status404Exception):
    pass


class PriorityNotExistsException(Status404Exception):
    pass


class InitiativeStatusNotExistsException(Status404Exception):
    pass


# done
class RelativeKPINotFoundException(Status404Exception):
    pass


# done
class KPILogicLevelNotExistsException(Status404Exception):
    pass


# done
class KPIFrequencyNotExistsException(Status404Exception):
    pass


# done
class ProcessNotExistsException(Status404Exception):
    pass


# done
class FileObjectCreateException(BaseExceptionWithLogs):
    pass


class RecurringActivityDeadlineNotProvidedException(BaseExceptionWithLogs):
    pass


class RecurringActivityDeadlineException(BaseExceptionWithLogs):
    pass


class RecurringActivityStartTimeNotProvidedException(BaseExceptionWithLogs):
    pass


class RecurringActivityRecurrenceNotProvidedException(BaseExceptionWithLogs):
    pass


class RecurringActivityRecurrenceOptionNotProvidedException(BaseExceptionWithLogs):
    pass


class RecurringActivityRecurrenceDayNotProvidedException(BaseExceptionWithLogs):
    pass


class RecurringActivityNotFoundException(Status404Exception):
    pass


class OneTimeRecurringActivityNotAllowedException(Status404Exception):
    pass


class RecordNotFoundException(Status404Exception):
    pass


class DeadlineAndThresholdBothNotAcceptableException(BaseExceptionWithLogs):
    pass


class ForecastException(BaseExceptionWithLogs):
    pass


class DocumentException(BaseExceptionWithLogs):
    pass


class DocumentNotExistsException(Status404Exception):
    pass


class HighLightLowLightException(BaseExceptionWithLogs):
    pass


class FileExtensionNotAllowedException(BaseExceptionWithLogs):
    pass


class FileSizeNotAllowedException(BaseExceptionWithLogs):
    pass


class ReviewSettingsNotFoundException(Status404Exception):
    pass


class ReviewSettingsOrderException(Status404Exception):
    pass


class ReviewNotFoundException(Status404Exception):
    pass


class GeneralSettingsNotFoundException(Status404Exception):
    pass


class SuccessManagerNotFoundException(Status404Exception):
    pass


class BillingInformationNotFoundException(Status404Exception):
    pass


class PlanningNotFoundException(Status404Exception):
    pass


class PlanningOverviewNotFoundException(Status404Exception):
    pass


class PlanningOverviewNotFoundCreatedException(BaseExceptionWithLogs):
    pass


class ReviewActionNotFoundException(Status404Exception):
    pass


class DictKeysAreNotEqualException(Status400Exception):
    pass


class UserIsNotSeniorOrOwnerException(Status403Exception):
    pass


class PageLevelPermissionNotFoundException(Status404Exception):
    pass


class CeoDoesNotExists(Status403Exception):
    pass


# done
class TemplateNotFoundException(BaseExceptionWithLogs):
    pass


class DoNotHavePermissionException(Status403Exception):
    pass


class ReviewActionException(BaseExceptionWithLogs):
    pass


class CompanyIsNotActivatedException(BaseExceptionWithLogs):
    pass


class InvalidModuleTypeException(BaseExceptionWithLogs):
    pass


# file exceptions
class FileNotUploadedOrCreatedException(BaseExceptionWithLogs):
    pass


class FileException(BaseExceptionWithLogs):
    pass


class FileInstanceNotFoundException(Status404Exception):
    pass


class FileInstanceNotRemovedFromS3Exception(Status404Exception):
    pass


class ProfilePictureDataNotAllowedException(Status403Exception):
    pass


class CompanyIsNotActivated(BaseExceptionWithLogs):
    pass


class InitiativeIdRequiredException(BaseExceptionWithLogs):
    pass


class CompanyDivisionRequiredException(BaseExceptionWithLogs):
    pass


class ActionTypeNotExistsException(Status404Exception):
    pass


class ActionException(BaseExceptionWithLogs):
    pass


class ActionNotFoundException(Status404Exception):
    pass


class NotFromSameCompanyDivisionException(Status403Exception):
    pass


class InitiativeFilterException(Status400Exception):
    pass


class FirstNameLastNameException(Status400Exception):
    pass
