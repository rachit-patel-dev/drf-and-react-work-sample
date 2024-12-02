import type { FilterValue } from "antd/es/table/interface";

import { ApiUrl } from "../ApiUrl";
import api from "../ApiService";

// export const getReviewObjectives = async (
//   page: number,
//   pageSize: number,
//   year: string,
//   signal: AbortSignal,
//   sortBy: string = ""
// ) => {
//   const response = await api.get(
//     `${ApiUrl.ReviewModule.get_list_objectives}?page=${page}&page_size=${pageSize}&year=${year}&sort_by=${sortBy}`,
//     {
//       signal,
//     }
//   );
//   return response;
// };

// export const fetchDivisionWiseObjectives = async (
//   companyDivisionId: string,
//   page: number,
//   pageSize: number,
//   year: string,
//   signal: AbortSignal,
//   sortBy: string = ""
// ) => {
//   const response = await api.get(
//     `${ApiUrl.ReviewModule.common_review_base}${companyDivisionId}/division_wise_objective_list/?page=${page}&page_size=${pageSize}&year=${year}&sort_by=${sortBy}`,
//     {
//       signal,
//     }
//   );
//   return response;
// };

// export const fetchDivisionWiseInitiatives = async (
//   companyDivisionId: string,
//   page: number,
//   pageSize: number,
//   signal: AbortSignal,
//   priority: string[] = [],
//   status: string[] = [],
//   sortBy: string = ""
// ) => {
//   const response = await api.get(
//     `${ApiUrl.ReviewModule.common_review_base}${companyDivisionId}/division_wise_initiative_list/?page=${page}&page_size=${pageSize}&priority=${priority}&status=${status}&sort_by=${sortBy}`,
//     {
//       signal,
//     }
//   );
//   return response;
// };

export const fetchDivisionWiseDocuments = async (
  companyDivisionId: string,
  page: number,
  pageSize: number,
  signal: AbortSignal,
  priority: FilterValue = [],
  status: FilterValue = [],
  sortBy: string = ""
) => {
  const response = await api.get(
    `${ApiUrl.ReviewModule.common_review_base}${companyDivisionId}/division_wise_document_list/?page=${page}&page_size=${pageSize}&priority=${priority}&status=${status}&sort_by=${sortBy}`,
    {
      signal,
    }
  );
  return response;
};

// export const fetchDivisionWiseKpis = async (
//   companyDivisionId: string,
//   month: string,
//   year: string,
//   page: number,
//   pageSize: number,
//   signal: AbortSignal,
//   sortBy: string = ""
// ) => {
//   const response = await api.get(
//     `${ApiUrl.ReviewModule.common_review_base}${companyDivisionId}/division_wise_kpi_list/?page=${page}&page_size=${pageSize}&month=${month}&year=${year}&sort_by=${sortBy}`,
//     {
//       signal,
//     }
//   );
//   return response;
// };

// export const fetchHighLights = async (
//   companyDivisionId: string,
//   month: string,
//   year: string,
//   signal: AbortSignal,
//   page: number,
//   pageSize: number,
//   type: string = "highlights"
// ) => {
//   const response = await api.get(
//     `${ApiUrl.ReviewModule.common_review_base}${companyDivisionId}/list_highlight_lowlight/?page=${page}&page_size=${pageSize}&month=${month}&type=${type}&year=${year}`,
//     {
//       signal,
//     }
//   );
//   return response;
// };

// export const fetchLowLights = async (
//   companyDivisionId: string,
//   month: string,
//   year: string,
//   signal: AbortSignal,
//   page: number,
//   pageSize: number,
//   type: string = "lowlights"
// ) => {
//   const response = await api.get(
//     `${ApiUrl.ReviewModule.common_review_base}${companyDivisionId}/list_highlight_lowlight/?page=${page}&page_size=${pageSize}&month=${month}&type=${type}&year=${year}`,
//     {
//       signal,
//     }
//   );
//   return response;
// };

// export const fetchReviews = async (companyId: string) => {
//   const response = await api.get(
//     `${ApiUrl.ReviewModule.common_review_base}${companyId}/list_review/`
//   );
//   return response;
// };

// export const fetchReviewSettingsUsers = async (companyId: string) => {
//   const response = await api.get(
//     `${ApiUrl.ReviewModule.common_review_base}${companyId}/list_review_settings/`
//   );
//   return response;
// };

// export const fetchReviewForecast = async () => {
//   const response = await api.get(`${ApiUrl.ReviewModule.get_forecast}`);
//   return response;
// };

// export const fetchReviewActions = async (
//   companyDivisionId: string,
//   sortBy: string,
//   page: number,
//   pageSize: number,
//   month: string,
//   year: string,
//   signal: AbortSignal,
//   priority: FilterValue = [],
//   dueDate: string[] = []
// ) => {
//   const response = await api.get(
//     `${ApiUrl.prioritiesModule.get_actions}list_review_actions/?company_division_id=${companyDivisionId}&priority=${priority}&sort_by=${sortBy}&due_date=${dueDate}&page=${page}&page_size=${pageSize}&month=${month}&year=${year}`,
//     {
//       signal,
//     }
//   );
//   return response;
// };

// export const updateReview = async (id: string, values: object) => {
//   const response = await api.patch(
//     `${ApiUrl.ReviewModule.common_review_base}${id}/update_review/`,
//     values
//   );
//   return response;
// };

// export const updateReviewSettings = async (id: string, values: object) => {
//   const response = await api.patch(
//     `${ApiUrl.ReviewModule.common_review_base}${id}/update_review_settings/`,
//     values
//   );
//   return response;
// };

// export const updateHighlightLowlight = async (id: string, values: object) => {
//   const response = await api.patch(
//     `${ApiUrl.ReviewModule.common_review_base}${id}/update_highlight_lowlight/`,
//     values
//   );
//   return response;
// };

// export const deleteReviewAction = async (reviewId: string) => {
//   const response = await api.delete(
//     `${ApiUrl.ReviewModule.common_review_base}${reviewId}/delete_review_action/`
//   );
//   return response;
// };

// export const deleteHighlightLowlight = async (id: string) => {
//   const response = await api.delete(
//     `${ApiUrl.ReviewModule.common_review_base}${id}/delete_highlight_lowlight/`
//   );
//   return response;
// };

// export const createHighlighLowlight = async (values: object) => {
//   const response = await api.post(
//     `${ApiUrl.ReviewModule.create_highlight_lowlight}`,
//     values
//   );
//   return response;
// };

// export const addAction = async (values: object) => {
//   const response = await api.post(
//     `${ApiUrl.ReviewModule.create_review_actions}`,
//     values
//   );
//   return response;
// };

// export const addReviewAction = async (values: object) => {
//   const response = await api.post(
//     `${ApiUrl.prioritiesModule.get_actions}`,
//     { ...values, action_type: "review" }
//   );
//   return response;
// };

// export const updateReviewActions = async (actionId: string, values: object) => {
//   const response = await api.put(
//     `${ApiUrl.prioritiesModule.get_actions}${actionId}/`,
//     values
//   );
//   return response;
// };

// export const updateReviewSettingsOrder = async (id: string, orderData: {order_data: {id: string, order: number}[]}) => {
//   const response = await api.patch(
//     `${ApiUrl.ReviewModule.common_review_base}${id}${ApiUrl.ReviewModule.update_review_settings_order}`,
//     orderData
//   );
//   return response;
// }
