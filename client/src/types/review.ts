import type { FilterValue } from "antd/es/table/interface";

import { Person } from "./person";
import { DivisionDetail } from "./division";

export interface IActionDetail {
  id: string;
  name: string;
  link:string;
  description: string;
  responsible_person: Person;
  division: DivisionDetail;
  company_division_id: string;
  priority: string;
  due_date: string;
  owner: Person;
  progress:string;
  is_archive:boolean;
  created_at: string;
}

export type ActionList = IActionDetail[];

export interface IActionTableRecord extends IActionDetail {
  key: string;
}

export interface IActionInfo {
  isAddActionOpen: boolean;
  isEditActionOpen: boolean;
  selectedActionInfo: null | IActionDetail;
  actionList: ActionList;
  currentPage: number;
  currentPageSize: number;
  totalCount: number;
  isLoading: boolean;
  selectedPriority: FilterValue;
  selectedDueDates: string[];
  sortedByColumns: string;
  hasMoreActions: boolean;
  callActions: boolean;
}

export interface IActionPayload {
  isAddActionOpen?: boolean;
  isEditActionOpen?: boolean;
  selectedActionInfo?: null | IActionDetail;
  actionList?: ActionList;
  currentPage?: number;
  currentPageSize?: number;
  totalCount?: number;
  isLoading?: boolean;
  selectedPriority?: FilterValue;
  selectedDueDates?: string[];
  sortedByColumns?: string;
  hasMoreActions?: boolean;
  callActions?: boolean;
}

export interface IActionDispatch {
  type: string;
  payload: IActionPayload;
}

export interface IActionFilters {
  priority?: FilterValue;
}
export interface IReviewUser {
  id: string;
  company_id: string;
  company_division_id: string;
  division: DivisionDetail;
  division_head: Person;
  is_part_of_review: boolean;
}

export type IReviewUserList = IReviewUser[];
export interface IReviewSettingInfo {
  isLoading: boolean;
  callFetchSettings: boolean;
  reviewUserList: IReviewUserList;
}

export interface IReviewSettingTableRecord extends IReviewUser {
  key: string;
}

export interface IReviewSettingActionPayload {
  isLoading?: boolean;
  callFetchSettings?: boolean;
  reviewUserList?: IReviewUserList;
}
export interface IReviewSettingAction {
  type: string;
  payload: IReviewSettingActionPayload;
}
export interface IReview {
  id: string;
  year: number;
  month: string;
  month_index: number;
  company_id: string;
  is_reviewed: boolean;
}

export type IReviewList = IReview[];

export interface IHighLowlight {
  id: string;
  created_at: string;
  modified_at: string;
  is_active: boolean;
  type: string;
  description: string;
  company_division_id: string;
  owner_id: string;
}

export type IHighLowlightList = IHighLowlight[];
