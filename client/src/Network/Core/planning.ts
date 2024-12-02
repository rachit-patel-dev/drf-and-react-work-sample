import { FilterValue } from "antd/es/table/interface";

import api from "../ApiService";
import { ApiUrl } from "../ApiUrl";

// export const fetchListPlanning = async (year: string = "", seniorId: string = "") => {
//   const response = await api.get(
//     `${ApiUrl.planningModule.common_planning_base}list_planning/?year=${year}${seniorId ? `&senior_id=${seniorId}` : ''}`
//   );
//   return response;
// };

// export const fetchListObjectives = async (
//   selectedPersonId: string,
//   year: string,
//   page: number,
//   pageSize: number,
//   sortBy: string = ""
// ) => {
//   const response = await api.get(
//     `${ApiUrl.planningModule.common_planning_base}${selectedPersonId}/list_objectives/?page=${page}&page_size=${pageSize}&year=${year}&sort_by=${sortBy}`
//   );
//   return response;
// };

// export const fetchListKpis = async (
//   selectedPersonId: string,
//   year: string,
//   page: number,
//   pageSize: number,
//   sortBy: string = ""
// ) => {
//   const response = await api.get(
//     `${ApiUrl.planningModule.common_planning_base}${selectedPersonId}/list_kpis/?page=${page}&page_size=${pageSize}&year=${year}&sort_by=${sortBy}`
//   );
//   return response;
// };

// export const fetchListInitiative = async (
//   selectedPersonId: string,
//   page: number,
//   pageSize: number,
//   priority: string[] = [],
//   status: string[] = [],
//   sortBy: string = ""
// ) => {
//   const response = await api.get(
//     `${ApiUrl.planningModule.common_planning_base}${selectedPersonId}/list_initiatives/?page=${page}&page_size=${pageSize}&priority=${priority}&status=${status}&sort_by=${sortBy}`
//   );
//   return response;
// };

export const fetchListDocuments = async (
  selectedPersonId: string,
  page: number,
  pageSize: number,
  priority: FilterValue = [],
  status: FilterValue = [],
  sortBy: string = ""
) => {
  const response = await api.get(
    `${ApiUrl.planningModule.common_planning_base}${selectedPersonId}/list_documents/?page=${page}&page_size=${pageSize}&priority=${priority}&status=${status}&sort_by=${sortBy}`
  );
  return response;
};

// export const fetchListRecurringActivities = async (
//   selectedPersonId: string,
//   page: number,
//   pageSize: number,
//   cycle: string[] = [],
//   sortBy: string = ""
// ) => {
//   const response = await api.get(
//     `${ApiUrl.planningModule.common_planning_base}${selectedPersonId}/list_recurring_activities/?page=${page}&page_size=${pageSize}&recurrence_option=${cycle}&sort_by=${sortBy}`
//   );
//   return response;
// };

// export const fetchListPlanningOverview = async (
//   planningOverviewId: string,
//   reporteeId: string = ""
// ) => {
//   const response = await api.get(
//     `${ApiUrl.planningModule.common_planning_base}${planningOverviewId}/list_planning_overview/?senior_id=${reporteeId}`
//   );
//   return response;
// };

// export const updatePlanningOverview = async (id: string, values: object) => {
//   const response = await api.patch(
//     `${ApiUrl.planningModule.common_planning_base}${id}/update_planning_overview/`,
//     values
//   );
//   return response;
// };
