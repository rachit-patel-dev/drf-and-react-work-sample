from typing import NamedTuple, List, TypeVar, Generic, Union, Any, Dict
from django.db.models.query import QuerySet
from domain_driven_api.application.user.models import UserProfileExtendedModel
from domain_driven_api.domain.kpi.kpi_frequency.models import KPIFrequency
from domain_driven_api.domain.kpi.models import KPI
from domain_driven_api.domain.planning.models import Planning
from django.db.models.manager import BaseManager
from dataclasses import dataclass

MyModel = TypeVar("MyModel")


class CLevelCheckerDto(NamedTuple):
    is_ceo: bool
    is_c_level: bool
    extended_user_queryset: QuerySet["UserProfileExtendedModel"]


class UserAndCompanyListDTO(NamedTuple):
    users_list: List[dict]
    companies_list: List[dict]


class KPIWithFrequencyDto(NamedTuple):
    kpis: QuerySet[KPI]
    kpi_frequencies: QuerySet[KPIFrequency]


class PlanningAndOverViewsDTO(NamedTuple):
    planning_list: List[Planning]
    planning_overview_list: List[Planning]


@dataclass(frozen=True)
class SerializerContextWithQuerysetDTO(Generic[MyModel]):
    queryset: QuerySet[MyModel]
    serializer_context: Dict[str, Any]


class ArchiveKPIDto(NamedTuple):
    is_archived: bool
    archived_kpi_list: List[Any]


@dataclass(frozen=True)
class UserProfileUpdateOrRemoveDTO(Generic[MyModel]):
    is_profile_update_or_remove: bool
    user_obj: MyModel


@dataclass(frozen=True)
class SerializerContextWithInstanceDTO(Generic[MyModel]):
    instance: MyModel
    serializer_context: Dict[str, Any]
