export interface DivisionDetail {
  id: string;
  name: string;
  division_name: string;
}
export interface Division extends DivisionDetail {
  division: DivisionDetail;
}

// export interface IDivisionReducerState {
//   divisionList: Division[];
//   currentPage: number;
//   currentPageSize: number;
//   isLoading: boolean;
//   searchTerm: string;
//   hasMoreDivision: boolean;
//   callDivisionList: boolean;
//   selectedDivisionId: string[];
// }

// export interface IDivisionReducerPayload {
//   divisionList?: Division[];
//   currentPage?: number;
//   currentPageSize?: number;
//   isLoading?: boolean;
//   searchTerm?: string;
//   hasMoreDivision?: boolean;
//   callDivisionList?: boolean;
//   selectedDivisionId?: string[];
// }
