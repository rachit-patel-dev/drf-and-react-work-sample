// Third party import
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { getToLocalStorage, setToLocalStorage } from "../../Library/Utils";

import { IReviewList, IReviewUserList } from "../../types/review";

interface ReviewState {
  selectedMonth: string;
  selectedYear: string;
  selectedDivisionId: string;
  selectedDivisionHead: string;
  reviewSettingUsers: IReviewUserList;
  reviewList: IReviewList;
}

const currentDate = new Date();
const currentYear = currentDate.getFullYear()?.toString();
const currentMonth = (currentDate.getMonth() + 1)?.toString();

const initialState: ReviewState = {
  selectedMonth: currentMonth,
  selectedYear: currentYear,
  selectedDivisionId: "",
  selectedDivisionHead: "",
  reviewSettingUsers: getToLocalStorage("reviewSettingsUser") || [],
  reviewList: getToLocalStorage("reviewList") || [],
};

export const reviewSlice = createSlice({
  name: "review",
  initialState,
  reducers: {
    setSelectedReviewMonth: (
      state: { selectedMonth: string },
      action: PayloadAction<string>
    ) => {
      state.selectedMonth = action.payload;
    },
    setSelectedReviewYear: (
      state: { selectedYear: string },
      action: PayloadAction<string>
    ) => {
      state.selectedYear = action.payload;
    },
    setSelectedReviewDivisionId: (
      state: ReviewState,
      action: PayloadAction<string>
    ) => {
      state.selectedDivisionId = action.payload;
    },
    setSelectedDivisionHead: (
      state: ReviewState,
      action: PayloadAction<string>
    ) => {
      state.selectedDivisionHead = action.payload;
    },
    setReviewSettingUsers: (
      state: { reviewSettingUsers: IReviewUserList },
      action: PayloadAction<IReviewUserList>
    ) => {
      state.reviewSettingUsers = action.payload;
      setToLocalStorage("reviewSettingsUser", JSON.stringify(action.payload));
    },
    setReviewList: (
      state: { reviewList: IReviewList },
      action: PayloadAction<IReviewList>
    ) => {
      state.reviewList = action.payload;
      setToLocalStorage("reviewList", JSON.stringify(action.payload));
    },
    resetSelectedReviewMonth: (
      state: { selectedMonth: string },
    ) => {
      state.selectedMonth = currentMonth;
    }
  },
});

export const {
  setSelectedReviewMonth,
  setSelectedReviewYear,
  setSelectedReviewDivisionId,
  setSelectedDivisionHead,
  setReviewSettingUsers,
  setReviewList,
  resetSelectedReviewMonth
} = reviewSlice.actions;

export default reviewSlice.reducer;
