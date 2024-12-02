import { ApiUrl } from "../ApiUrl";
import api from "../ApiService";
// import { getToLocalStorage } from "../../Library/Utils";

// const user = getToLocalStorage("user");
export const getResponsiblePersonList = async (
  page: number,
  pageSize: number,
  search: string,
  forDivision: boolean = false,
  companyDivisionId: string = ""
) => {
  const response = await api.get(
    `${ApiUrl.usersModule.get_responsible_persons}?page=${page}&page_size=${pageSize}&search=${search}&for_division=${forDivision}&company_division_id=${companyDivisionId}`
  );
  return response;
};

// export const getRoleList = async (
//   page: number,
//   pageSize: number,
//   search: string,
//   companyId: string
// ) => {
//   const response = await api.get(
//     `${ApiUrl.usersModule.get_roles}${companyId}/list_roles/?page=${page}&page_size=${pageSize}&search=${search}`
//   );
//   return response;
// };

// export const getDivisionsList = async (
//   page: number,
//   pageSize: number,
//   search: string
// ) => {
//   const response = await api.get(
//     `${ApiUrl.usersModule.get_divisions}${user.company_id}/list_divisions/?page=${page}&page_size=${pageSize}&search=${search}`
//   );
//   return response;
// };

// export const getFilterDivisionsList = async (
//   search: string,
//   pagination: boolean = true
// ) => {
//   const response = await api.get(
//     `${ApiUrl.usersModule.get_divisions}${user.company_id}/list_divisions/?search=${search}&pagination=${pagination}`
//   );
//   return response;
// };

// export const getPersonsByDivision = async (
//   divisionId: string,
//   page: number,
//   pageSize: number,
//   search: string = ""
// ) => {
//   const response = await api.get(
//     `${ApiUrl.usersModule.get_divisions}${divisionId}/division_users_list/?search=${search}&page=${page}&page_size=${pageSize}`
//   );
//   return response;
// };

// export const getUsers = async (
//   page: number,
//   pageSize: number,
//   sortBy: string,
//   search: string,
//   divisionIds: string[] = []
// ) => {
//   const response = await api.get(
//     `${ApiUrl.usersModule.get_users}?page=${page}&page_size=${pageSize}&search=${search}&division_id=${divisionIds}&sort_by=${sortBy}`
//   );
//   return response;
// };

// export const fetchCompanyLists = async () => {
//   const response = await api.get(`${ApiUrl.usersModule.success_manager}`);
//   return response;
// };

// export const addUser = async (values: object) => {
//   const response = await api.post(
//     `${ApiUrl.usersModule.add_user}${user.company_id}/add_user/`,
//     values
//   );
//   return response;
// };

// export const addRole = async (companyId: string, values: object) => {
//   const response = await api.post(
//     `${ApiUrl.usersModule.add_role}${companyId}/create_role/`,
//     values
//   );
//   return response;
// };

// export const addDivision = async (values: object) => {
//   const response = await api.post(
//     `${ApiUrl.usersModule.add_division}${user.company_id}/create_division/`,
//     values
//   );
//   return response;
// };

// export const updateStatus = async (id: string, values: object) => {
//   const response = await api.patch(
//     `${ApiUrl.usersModule.update_user_status}${id}/update_status/`,
//     values
//   );
//   return response;
// };

// export const deleteUser = async (id: string) => {
//   const response = await api.delete(`${ApiUrl.usersModule.delete_user}${id}/`);
//   return response;
// };

// export const reInviteUser = async (id: string) => {
//   const response = await api.post(
//     `${ApiUrl.usersModule.reinvite_user}${id}/reinvite/`
//   );
//   return response;
// };
