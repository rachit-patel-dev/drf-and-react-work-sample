// Third party import
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { getToLocalStorage, setToLocalStorage } from "../../Library/Utils";
import {
  ActionModuleFilterKeys,
  DocumentModuleFilterKeys,
  GLOBAL_FILTERS_KEY_TO_LOCAL_STORAGE,
  IModulesWithFilters,
  InitiativeModuleFilterKeys,
  KPIModuleFilterKeys,
  ObjectiveModuleFilterKeys,
  ProcessModuleFilterKeys,
  RadicalFocusModules,
  RecurringActivityModuleFilterKeys,
} from "../../Resources/Statics/globalFiltersStatics";

/**
 * Initializes the initialState for the IModulesWithFilters object.
 * If there is a value stored in the localStorage for the GLOBAL_FILTERS_KEY_TO_LOCAL_STORAGE key,
 * it will be used as the initialState.
 * Otherwise, a default initialState will be created with empty filter objects for each module.
 *
 * @returns {IModulesWithFilters} The initialState for the IModulesWithFilters object.
 */
const initialState: IModulesWithFilters = getToLocalStorage(
  GLOBAL_FILTERS_KEY_TO_LOCAL_STORAGE
)
  ? getToLocalStorage(GLOBAL_FILTERS_KEY_TO_LOCAL_STORAGE)
  : {
      [RadicalFocusModules.INITIATIVE_MODULE]: {
        [InitiativeModuleFilterKeys.STATUS]: {},
        [InitiativeModuleFilterKeys.RESPONSIBLE]: {},
        [InitiativeModuleFilterKeys.INITIATIVE_PRIORITY]: {},
      },
      [RadicalFocusModules.ACTION_MODULE]: {
        [ActionModuleFilterKeys.DUE_DATE]: {},
        [ActionModuleFilterKeys.PRIORITY]: {},
      },
      [RadicalFocusModules.DOCUMENT_MODULE]: {
        [DocumentModuleFilterKeys.STATUS]: {},
        [DocumentModuleFilterKeys.OWNER]: {},
        [DocumentModuleFilterKeys.DOCUMENT_PRIORITY]: {},
      },
      [RadicalFocusModules.RECURRING_ACTIVITY_MODULE]: {
        [RecurringActivityModuleFilterKeys.CYCLE]: {},
        [RecurringActivityModuleFilterKeys.RESPONSIBLE_PERSON]: {},
      },
      [RadicalFocusModules.PROCESS_MODULE]: {
        [ProcessModuleFilterKeys.STATUS]: {},
        [ProcessModuleFilterKeys.RESPONSIBLE_PERSON]: {},
      },
      [RadicalFocusModules.KPI_MODULE]: {
        [KPIModuleFilterKeys.RESPONSIBLE_PERSON]: {},
      },
      [RadicalFocusModules.OBJECTIVE_MODULE]: {
        [ObjectiveModuleFilterKeys.RESPONSIBLE_PERSON]: {},
      },
    };

/**
 * This code segment defines a Redux slice for managing global filters.
 * It exports a `globalStoredFiltersSlice` object that contains a `setFiltersByModuleNameAndFilterKey` reducer function.
 * The `setFiltersByModuleNameAndFilterKey` function takes in the current state, an action payload containing the module name, filter key, and updated value, and returns the updated state.
 * It updates the state by merging the updated value with the existing filter values for the specified module and filter key.
 * After updating the state, it also saves the updated state to local storage using the `setToLocalStorage` function.
 * The initial state for the slice is retrieved from local storage or set to a default value if no previous state is found.
 */
export const globalStoredFiltersSlice = createSlice({
  name: "globalFilters",
  initialState,
  reducers: {
    /**
     * This code segment represents the implementation of the `setFiltersByModuleNameAndFilterKey` method.
     * @param state - The current state of the application. It is of any type.
     * @param action - The payload action containing the following properties:
     *    - moduleName: A value from the `RadicalFocusModules` enum representing the module to which the filter is to be applied.
     *    - filterKey: A value from one of the filter keys enums (`ActionModuleFilterKeys`, `InitiativeModuleFilterKeys`, `KPIModuleFilterKeys`, `DocumentModuleFilterKeys`, `ProcessModuleFilterKeys`, `RecurringActivityModuleFilterKeys`, `ObjectiveModuleFilterKeys`) representing the specific filter to be applied.
     *    - updatedValue: A record of string keys to any type values representing the new value for the specified filter.
     * @returns The updated state after applying the specified filter. The state is of type `IModulesWithFilters`.
     */
    setFiltersByModuleNameAndFilterKey: (
      state: any,
      action: PayloadAction<{
        moduleName: RadicalFocusModules;
        filterKey:
          | ActionModuleFilterKeys
          | InitiativeModuleFilterKeys
          | KPIModuleFilterKeys
          | DocumentModuleFilterKeys
          | ProcessModuleFilterKeys
          | RecurringActivityModuleFilterKeys
          | ObjectiveModuleFilterKeys;
        updatedValue: Record<string, any>;
      }>
    ) => {
      const { moduleName, filterKey, updatedValue } = action.payload;
      const updatedState: IModulesWithFilters = {
        ...state,
        [moduleName]: {
          ...state[moduleName],
          [filterKey]: {
            ...state[moduleName][filterKey],
            ...updatedValue,
          },
        },
      };
      setToLocalStorage(
        GLOBAL_FILTERS_KEY_TO_LOCAL_STORAGE,
        JSON.stringify(updatedState)
      );
      return updatedState;
    },
  },
});

export const { setFiltersByModuleNameAndFilterKey } =
  globalStoredFiltersSlice.actions;

export default globalStoredFiltersSlice.reducer;
