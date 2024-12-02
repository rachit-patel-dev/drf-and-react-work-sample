import { ApiUrl } from "../ApiUrl";
import api from "../ApiService";
// import { IGetObjectivesQueryParams } from "../../types/objective";
// import { buildQueryStringWithQueryParams } from "../../Library/Utils";

// export const getObjectives = async (
//   page: number,
//   pageSize: number,
//   year: string[],
//   sortBy: string,
//   directReportId: string,
//   signal: AbortSignal,
//   objectiveType: string[] = [],
//   search: string = "",
//   responsiblePersonIds: string[] = [],
//   isArchived: boolean = false,
// ) => {
//   const queryParams: IGetObjectivesQueryParams = {
//     page,
//     page_size: pageSize,
//     year,
//     sort_by: sortBy,
//     direct_report: directReportId,
//     signal,
//     objective_type: objectiveType,
//     search,
//     responsible_person: responsiblePersonIds,
//     is_archived: isArchived
//   }
//   const queryString = buildQueryStringWithQueryParams(queryParams);
//   const response = await api.get(
//     `${ApiUrl.objectiveModule.get_objectives}?${queryString}`,
//     {
//       signal,
//     }
//   );
//   return response;
// };

// export const updateObjective = async (id: string, values: object) => {
//   const response = await api.put(
//     `${ApiUrl.objectiveModule.update_objective}${id}/`,
//     values
//   );
//   return response;
// };

// export const addObjective = async (values: object) => {
//   const response = await api.post(
//     `${ApiUrl.objectiveModule.add_objective}`,
//     values
//   );
//   return response;
// };

export const getAllPersonList = async (
  page: number,
  pageSize: number,
  search: string
) => {
  const response = await api.get(
    `${ApiUrl.objectiveModule.get_responsible_persons}?page=${page}&page_size=${pageSize}&search=${search}`
  );
  return response;
};

// export const getObjectivesConditions = async (id: string) => {
//   const response = await api.get(
//     `${ApiUrl.objectiveModule.get_condition}${id}/list_conditions/`
//   );
//   return response;
// };

// export const updateList = async (id: string, values: object) => {
//   const response = await api.patch(
//     `${ApiUrl.objectiveModule.update_condition}${id}/edit_condition/`,
//     values
//   );
//   return response;
// };

// export const addList = async (id: string, values: object) => {
//   const response = await api.post(
//     `${ApiUrl.objectiveModule.add_condition}${id}/add_condition/`,
//     values
//   );
//   return response;
// };

// export const deleteCondition = async (id: string) => {
//   const response = await api.delete(
//     `${ApiUrl.objectiveModule.delete_condition}${id}/delete_condition/`
//   );
//   return response;
// };

// export const addRemoveObjectiveFromArchive = async (objectives: object) => {
//   const response = await api.patch(
//     `${ApiUrl.objectiveModule.objective_archive}`,
//     objectives
//   );
//   return response;
// };
