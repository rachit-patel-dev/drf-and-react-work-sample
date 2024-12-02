import { Person } from "./person";
import { DivisionDetail } from "./division";

export interface IPlanningOverview {
  id: string;
  planning_id: string;
  person: Person;
  division: DivisionDetail;
  company_division_id: string;
  is_objective_planned: boolean;
  is_kpi_planned: boolean;
  is_initiative_planned: boolean;
  is_recurring_activity_planned: boolean;
  children?: IPlanningOverview[];
}

export interface IPlanningOverviewRecords extends IPlanningOverview {
  key: string;
}


export type IPlanningOverviewList = IPlanningOverview[];

export interface IModulePlanning {
  Q1: boolean;
  Q2: boolean;
  Q3: boolean;
  Q4: boolean;
}
export interface IPlanningOverviewBooleanFields {
  objective_planning: IModulePlanning;
  kpi_planning: IModulePlanning;
  initiative_planning: IModulePlanning;
  recurring_activity_planning: IModulePlanning;
}

export type PlanningCheckboxFields = "objective_planning" | "kpi_planning" | "initiative_planning" | "recurring_activity_planning"

export type Quarters = "Q1" | "Q2" | "Q3" | "Q4"

export interface IPlanning {
  id: string;
  year: number;
  company_id: string;
  objective_planning: IModulePlanning,
  kpi_planning: IModulePlanning,
  initiative_planning: IModulePlanning,
  recurring_activity_planning: IModulePlanning,
  responsible_person: Person
  planning_overview_id: string;
  company_division: {
    id: string;
    division_id: string;
    division_name: string;
  }
  children?: IPlanning[];
}

export type UpdatePlanning = Partial<IPlanning>;

export interface IPlanningQuarterUpdatePayload {
  [key: string]: {
    [forQuarter: string]: boolean;
  };
}

export interface IPlanningRecords extends IPlanning {
  key: string;
}

export type IPlanningList = IPlanning[];

export interface IPlanningOverviewReducer {
  isLoading: boolean;
  callFetchPlanning: boolean;
  planningOverviewList: IPlanningOverviewList;
}

export interface IPlanningOverviewReducerPayload {
  isLoading?: boolean;
  callFetchPlanning?: boolean;
  planningOverviewList?: IPlanningOverviewList;
}

export interface IPlanningActionDispatch {
  type: string;
  payload: IPlanningOverviewReducerPayload;
}

export interface ISelectedPerson {
  id: string;
  firstName: string;
  lastName: string;
  c_level?:boolean;
  ceo_level?:boolean;
  profile_image?: string;
  profile_color_hash?: string;
}

export interface IselecedOverviewDetails {
  overviewId: string;
  objective_planning: {
    Q1: boolean;
    Q2: boolean;
    Q3: boolean;
    Q4: boolean;
  },
  kpi_planning: {
    Q1: boolean;
    Q2: boolean;
    Q3: boolean;
    Q4: boolean;
  },
  initiative_planning: {
    Q1: boolean;
    Q2: boolean;
    Q3: boolean;
    Q4: boolean;
  },
  recurring_activity_planning: {
    Q1: boolean;
    Q2: boolean;
    Q3: boolean;
    Q4: boolean;
  },

}

export interface ISelectedPersonPayload {
  id?: string;
  firstName?: string;
  lastName?: string;
}

export interface ISetPersonActionPayload {
  payload?: ISelectedPersonPayload;
  reset?: boolean;
}

export interface PlanningState {
  selectedQuarter: string;
  selectedYear: string;
  selectedPlanningId: string;
  selectedPerson: ISelectedPerson;
  listPlanning: IPlanningList;
  selecedOverviewDetails: IselecedOverviewDetails;
}
