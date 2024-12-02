// Third party import
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { setToLocalStorage } from "../../Library/Utils";

import {
  defaultDateFormat,
  defaultLanguage,
  defaultNumberFormat,
} from "../../Resources/Statics";

interface GeneralSettingsState {
  dateFormat: string;
  numberFormat: string;
  language: string;
}

const initialState: GeneralSettingsState = {
  dateFormat: defaultDateFormat,
  numberFormat: defaultNumberFormat,
  language: defaultLanguage,
};

export const generalSettingsSlice = createSlice({
  name: "generalSettings",
  initialState,
  reducers: {
    setDateFormat: (
      state: { dateFormat: string },
      action: PayloadAction<string>
    ) => {
      state.dateFormat = action.payload || defaultDateFormat;
    },
    setNumberFormat: (
      state: { numberFormat: string },
      action: PayloadAction<string>
    ) => {
      state.numberFormat = action.payload || defaultNumberFormat;
    },
    setLanguage: (
      state: { language: string },
      action: PayloadAction<string>
    ) => {
      state.language = action.payload || defaultLanguage;
      setToLocalStorage("language", action.payload || defaultLanguage)
    },
  },
});

export const { setDateFormat, setNumberFormat, setLanguage } =
  generalSettingsSlice.actions;

export default generalSettingsSlice.reducer;
