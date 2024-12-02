// Third party import
/* eslint-disable import/no-cycle */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { getToLocalStorage } from "../../../Library/Utils";

import { UserDetail } from "../../../types/user";
import { IReportee, Person } from "../../../types/person";

interface IReportees {
  personList: Person[];
  hasMorePerson: boolean;
}

type IDirectReportee = IReportee[];

export interface IDirectReporteeUser {
  id: string;
  name: string;
  first_name: string;
  last_name: string;
  profile_image: string;
  profile_color_hash: string;
  c_level: boolean;
  ceo_level: boolean;
}

interface IPagePermission {
  review: boolean;
  forecast: boolean;
  planning: boolean;
}

interface AuthState {
  userDetails: UserDetail;
  token: string;
  selectedDirectReportee: string;
  selectedDirectReporteeUser: IDirectReporteeUser;
  selectedDirectReporteeUserId: string;
  isUserRoleBaseUrl: boolean;
  Reportees: IReportees;
  directReporteePersons: IDirectReportee;
  pagePermissions: IPagePermission | null;
}

const initialState: AuthState = {
  userDetails: getToLocalStorage("user") || null,
  token: "",
  selectedDirectReportee: getToLocalStorage("user")?.direct_report || "",
  selectedDirectReporteeUser: getToLocalStorage("user")?.id
    ? {
      id: getToLocalStorage("user")?.id,
      name: `${getToLocalStorage("user")?.first_name} ${getToLocalStorage("user")?.last_name
        }`,
      first_name: getToLocalStorage("user")?.first_name,
      last_name: getToLocalStorage("user")?.last_name,
      profile_image: getToLocalStorage("user")?.profile,
      profile_color_hash: getToLocalStorage("user")?.profile_color_hash,
      c_level: getToLocalStorage("user")?.user_level?.c_level as boolean,
      ceo_level: getToLocalStorage("user")?.user_level?.ceo_level as boolean,
    }
    : {
      id: "",
      name: "",
      first_name: "",
      last_name: "",
      profile_image: "",
      profile_color_hash: "",
      c_level: false,
      ceo_level: false,
    },
  selectedDirectReporteeUserId: getToLocalStorage("user")?.id || "",
  isUserRoleBaseUrl: true,
  Reportees: {
    personList: [],
    hasMorePerson: false,
  },
  directReporteePersons: [],
  pagePermissions: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUserDetails: (
      state: { userDetails: UserDetail | null },
      action: PayloadAction<any>
    ) => {
      if (action.payload)
        state.userDetails = { ...state.userDetails, ...action.payload };
      else state.userDetails = null;
    },
    setToken: (state: { token: string }, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
    setSelectedDirectReportee: (
      state: { selectedDirectReportee: string },
      action: PayloadAction<string>
    ) => {
      state.selectedDirectReportee = action.payload;
    },
    setSelectedDirectReporteeUser: (
      state: { selectedDirectReporteeUser: IDirectReporteeUser },
      action: PayloadAction<IDirectReporteeUser>
    ) => {
      state.selectedDirectReporteeUser = {
        ...state.selectedDirectReporteeUser,
        ...action.payload,
      };
    },
    setSelectedDirectReporteeUserId: (
      state: { selectedDirectReporteeUserId: string },
      action: PayloadAction<string>
    ) => {
      state.selectedDirectReporteeUserId = action.payload;
    },
    setIsUserRoleBaseUrl: (
      state: { isUserRoleBaseUrl: boolean },
      action: PayloadAction<any>
    ) => {
      state.isUserRoleBaseUrl = action.payload;
    },
    setReportees: (
      state: { Reportees: IReportees },
      action: PayloadAction<any>
    ) => {
      state.Reportees = action.payload;
    },
    setDirectReporteePersons: (
      state: { directReporteePersons: IDirectReportee },
      action: PayloadAction<any>
    ) => {
      state.directReporteePersons = action.payload;
    },
    setPagePermissions: (
      state: { pagePermissions: IPagePermission | null },
      action: PayloadAction<any>
    ) => {
      state.pagePermissions = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setUserDetails,
  setToken,
  setSelectedDirectReportee,
  setSelectedDirectReporteeUser,
  setSelectedDirectReporteeUserId,
  setIsUserRoleBaseUrl,
  setReportees,
  setDirectReporteePersons,
  setPagePermissions,
} = authSlice.actions;

export default authSlice.reducer;
