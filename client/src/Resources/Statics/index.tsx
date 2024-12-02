/* eslint-disable import/no-cycle */
import { getToLocalStorage } from "../../Library/Utils";

export const graphDownloadAsOptions = [
  {
    value: "pdf",
    label: "Pdf",
  },
  { value: "excel", label: "Excel" },
];

export const activityDayoptions = [
  { label: "Mon", value: "Monday" },
  { label: "Tue", value: "Tuesday" },
  { label: "Wed", value: "Wednesday" },
  { label: "Thu", value: "Thursday" },
  { label: "Fri", value: "Friday" },
  { label: "Sat", value: "Saturday" },
  { label: "Sun", value: "Sunday" },
];

export const allowedDocumentExtenstions =
  ".doc, .docx, .ppt, .pptx, .xls, .xlsx, .gdoc, .gsheet, .gslides, .pdf, .txt, .zip, .rar, .csv, .tsv, .jpg, .jpeg, .png";

export const allowedProfilePictureExtensions = [".jpg", ".gif", ".png"];

export const convertActivityDateFormat = "YYYY-MM-DD[T]HH:mm:ss.123[Z]";

export const objectiveDefaultSortColumn = "objective_type";

export const defaultCurrentPage = 1;
export const defaultPageSize = 10;
export const defaultPageSizeOptions = [10, 20, 30];
export const userPageSizeOptions = [20, 30];

export const overviewDefaultPageSize = 20;
export const overviewDefaultPageSizeOptions = [20, 30];

export const activityOverviewPageSizeOptions = [20, 30];
export const processOverviewPageSizeOptions = [20, 30];

export const userDefaultPageSize = 20;

export const activityOverviewDefaultPageSize = 20;

export const initiativePersonDefaultPageSize = 8;

export const addUserPersonListDefaultPageSize = 7;
export const roleListDefaultPageSize = 7;
export const divisionListDefaultPageSize = 7;

export const activityRecordsDefaultType = "open";

export const settingsTabKeysForOnlyCeo = [
  "general",
  "planning",
  "reviews",
  "forecast",
];

const currentYear = new Date().getFullYear();

export const kpiYearOptions = Array.from({ length: 14 }, (_, i) => ({
  value: currentYear - i,
  label: `${currentYear - i}`,
}));

export const objectiveYearOptions = Array.from({ length: 10 }, (_, i) => ({
  value: `${currentYear - i}`,
  label: `${currentYear - i}`,
}));

export const reviewYearOptions = Array.from({ length: 10 }, (_, i) => ({
  value: `${currentYear - i}`,
  label: `${currentYear - i}`,
}));

export const monthNameByNumbers: any = {
  1: "January",
  2: "February",
  3: "March",
  4: "April",
  5: "May",
  6: "June",
  7: "July",
  8: "August",
  9: "September",
  10: "October",
  11: "November",
  12: "December",
};

export const priorities = ["low", "medium", "high"];

export const languageOptions = [
  { value: "En", label: "English" },
  { value: "De", label: "Deutsch / German (Standard)" },
];

export const dateFormatOptions = [
  {
    value: "YYYY/MM/DD",
    label: "YYYY/MM/DD - 2023/01/28",
  },
  {
    value: "MM/DD/YYYY",
    label: "MM/DD/YYYY - 01/28/2023",
  },
  {
    value: "DD.MM.YYYY",
    label: "DD.MM.YYYY - 28.01.2023",
  },
];

export const numberFormatOptions = [
  {
    value: "en-US",
    label: "100,000 - English",
  },
  { value: "de-DE", label: "100.000 - Deutsch / German" },
];

export const defaultDateFormat = "DD.MM.YYYY";
export const defaultNumberFormat = "de-DE";
export const defaultLanguage = getToLocalStorage("language") || "De";

export const numericValueRegex = /^[0-9]+$/;

/**
 * Enum representing individual planning modules.
 *
 * @enum {string}
 * @property {string} KpiPlanning - Represents the KPI planning module.
 * @property {string} InitiativePlanning - Represents the initiative planning module.
 * @property {string} RecurringActivityPlanning - Represents the recurring activity planning module.
 * @property {string} DocumentPlanning - Represents the document planning module.
 */
export enum IndividualPlanningModuleEnum {
  KpiPlanning = "planning-kpi-definition",
  InitiativePlanning = "planning-initiative",
  RecurringActivityPlanning = "planning-recurring-activity",
  DocumentPlanning = "planning-documents",
  ObjectivePlanning = "planning-objective-definition",
}

/**
 * Enum representing the field names for a selected user.
 * Each field corresponds to a specific attribute of a user profile.
 */
export enum SelectedUserFieldNameEnum {
  ID = "id",
  FIRSTNAME = "first_name",
  LASTNAME = "last_name",
  PROFILEIMAGE = "profile_image",
  PROFILECOLORHASH = "profile_color_hash",
}

export const germanSpecialCharactersRegex = /^[a-zA-Z\säÄöÖüÜß]*$/;
