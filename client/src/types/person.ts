export interface Person {
  id: string;
  kpi_count: number;
  company_division_id: string;
  first_name: string;
  last_name: string;
  re_invite_time: string;
  profile_image: string;
  username: string;
  reportees: [];
  c_level?: boolean;
  ceo_level?: boolean;
  profile_color_hash: string;
}

export interface IReportee {
  reportee: Person;
}

export interface IPersonReducerInfo {
  personList: Person[];
  currentPage: number;
  currentPageSize: number;
  isLoading: boolean;
  searchTerm: string;
  companyDivisionId: string;
  hasMorePerson: boolean;
  callPersonList: boolean;
  selectedPersonId: string[];
  selectedObjectiveTypes: string[];
}

export interface IPersonTableRecord extends Person {
  key: string;
}

export interface IAllPersonReducerInfo {
  personList: Person[];
  currentPage: number;
  currentPageSize: number;
  isLoading: boolean;
  searchTerm: string;
  hasMorePerson: boolean;
  callPersonList: boolean;
  totalCount: number;
}

export interface IPersonReducerPayload {
  personList?: Person[];
  currentPage?: number;
  currentPageSize?: number;
  isLoading?: boolean;
  searchTerm?: string;
  companyDivisionId?: string;
  hasMorePerson?: boolean;
  callPersonList?: boolean;
  selectedPersonId?: string[];
  selectedObjectiveTypes?: string[];
}
export interface IAllPersonReducerPayload {
  personList?: Person[];
  currentPage?: number;
  currentPageSize?: number;
  isLoading?: boolean;
  searchTerm?: string;
  hasMorePerson?: boolean;
  callPersonList?: boolean;
  totalCount?: number;
}

export interface IDirectReporteeReducerState {
  personList: IReportee[];
  currentPage: number;
  currentPageSize: number;
  isLoading: boolean;
  searchTerm: string;
  callPersonList: boolean;
  selectedPersonId: string[];
}

export interface IDirectReporteeReducerPayload {
  personList?: IReportee[];
  currentPage?: number;
  currentPageSize?: number;
  isLoading?: boolean;
  searchTerm?: string;
  callPersonList?: boolean;
  selectedPersonId?: string[];
}
