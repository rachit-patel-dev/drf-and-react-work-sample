// Third party import
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { getToLocalStorage, setToLocalStorage } from "../../Library/Utils";

import { IPlanningList, IselecedOverviewDetails, ISelectedPerson, ISetPersonActionPayload, PlanningState } from "../../types/planning";

const currentDate = new Date();
const currentYear = currentDate.getFullYear()?.toString();
const currentMonth = currentDate.getMonth() + 1;
const currentQuarter = Math.ceil(currentMonth / 3)?.toString();

const initialState: PlanningState = {
  selectedQuarter: currentQuarter,
  selectedYear: currentYear,
  selectedPlanningId: "",
  selectedPerson: {
    id: "",
    firstName: "",
    lastName: "",
    c_level: false,
    ceo_level: false,
    profile_image: "",
    profile_color_hash: "",
  },
  listPlanning: getToLocalStorage("listPlanning") || [],
  selecedOverviewDetails: {
    overviewId: "",
    objective_planning: {
      Q1: false,
      Q2: false,
      Q3: false,
      Q4: false
    },
    kpi_planning: {
      Q1: false,
      Q2: false,
      Q3: false,
      Q4: false,
    },
    initiative_planning: {
      Q1: false,
      Q2: false,
      Q3: false,
      Q4: false,
    },
    recurring_activity_planning: {
      Q1: false,
      Q2: false,
      Q3: false,
      Q4: false,
    },
  },
};

export const planningSlice = createSlice({
  name: "planning",
  initialState,
  reducers: {
    setSelectedPlanningQuarter: (
      state: { selectedQuarter: string },
      action: PayloadAction<string>
    ) => {
      state.selectedQuarter = action.payload;
    },
    setSelectedPlanningYear: (
      state: { selectedYear: string },
      action: PayloadAction<string>
    ) => {
      state.selectedYear = action.payload;
    },
    setSelectedPlanningId: (
      state: { selectedPlanningId: string },
      action: PayloadAction<string>
    ) => {
      state.selectedPlanningId = action.payload;
    },
    setSelectedPerson: (
      state: { selectedPerson: ISelectedPerson },
      action: PayloadAction<ISetPersonActionPayload>
    ) => {
      const { payload, reset } = action.payload;
      if (reset) state.selectedPerson = initialState.selectedPerson;
      else state.selectedPerson = { ...state?.selectedPerson, ...payload };
    },
    setListPlanning: (
      state: { listPlanning: IPlanningList },
      action: PayloadAction<IPlanningList>
    ) => {
      state.listPlanning = action.payload;
      setToLocalStorage("listPlanning", JSON.stringify(action.payload));
    },
    setSelecedOverviewDetails: (
      state: { selecedOverviewDetails: IselecedOverviewDetails },
      action: PayloadAction<IselecedOverviewDetails>
    ) => {
      state.selecedOverviewDetails = action.payload
    },
  },
});

export const {
  setSelectedPlanningQuarter,
  setSelectedPlanningYear,
  setSelectedPlanningId,
  setSelectedPerson,
  setListPlanning,
  setSelecedOverviewDetails,
} = planningSlice.actions;

export default planningSlice.reducer;
