/* eslint-disable no-plusplus */
/* eslint-disable prefer-destructuring */
/* eslint-disable import/no-cycle */

import { toast } from "react-toastify";
import type { UploadFile } from "antd/es/upload/interface";
import { SorterResult } from "antd/es/table/interface";
import { IDirectReporteeUser } from "../../Store/Reducers/AuthModule/auth";
import { UserDetail } from "../../types/user";
import textResource from "../../Resources/Languages/Language.json";
import { SelectedUserFieldNameEnum } from "../../Resources/Statics";

/**
 * Sets the value to local storage.
 * @param {string} key - The key to set.
 * @param {any} value - The value to set.
 */
export function setToLocalStorage(key: string, value: any) {
  localStorage.setItem(key, value);
}

/**
 * Gets the value from local storage.
 * @param {string} itemName - The name of the item to retrieve.
 * @returns {any} The retrieved value.
 */
export function getToLocalStorage(itemName: string) {
  if (itemName === "token" || itemName === "language") {
    return localStorage.getItem(itemName);
  }
  return JSON.parse(localStorage.getItem(itemName) || "null");
}

/**
 * Handles errors and displays toast messages.
 * @param {any} error - The error object.
 */
export function errorHandling(error: any) {
  if (error?.name !== "CanceledError") {
    const customMessage =
      getToLocalStorage("language") === "De"
        ? textResource["500ErrorMsgDe"]
        : textResource["500ErrorMsgEn"];
    if (error.response) {
      return toast.error(
        error.response.data
          ? error.response.data?.message || error.response.data?.detail
          : customMessage
      );
    }
    return toast.error(customMessage);
  }
  return null;
}

/**
 * Checks if the given element is scrolled to the bottom.
 * @param {any} event - The scroll event.
 * @returns {boolean} True if scrolled to bottom, otherwise false.
 */
export function isScrolledToBottom(event: any): boolean {
  return (
    Math.abs(
      event.target.scrollTop +
      event.target.offsetHeight -
      event.target.scrollHeight
    ) <= 1
  );
}

export const allowedFileExtensions = [
  ".doc", ".docx", ".ppt", ".pptx", ".xls", ".xlsx", ".gdoc", ".gsheet",
  ".gslides", ".pdf", ".txt", ".zip", ".rar", ".csv", ".tsv", ".jpg", ".jpeg", ".png"
];

export const maxDocSizeInMB = 5;
export const maxImageSizeInMB = 5;

/**
 * Validates the file type based on allowed extensions.
 * @param {UploadFile} file - The file to validate.
 * @param {string[]} extentions - The allowed extensions.
 * @returns {boolean} True if valid, otherwise false.
 */
export const validateFileType = ({ name }: UploadFile, extentions: string[]) => {
  if (!extentions) return true;
  const isAllowedExtension = extentions.some(ext => name.toLowerCase().endsWith(ext));
  return isAllowedExtension;
};

/**
 * Validates the file size based on max size.
 * @param {UploadFile} file - The file to validate.
 * @param {number} maxSize - The maximum size allowed.
 * @returns {boolean} True if valid, otherwise false.
 */
export const validateFileSize = ({ size }: UploadFile, maxSize: number) => {
  const fileSizeInMB = (size as number) / (1024 * 1024);
  return maxSize > fileSizeInMB;
};

/**
 * Toggles the selected person.
 * @param {string[]} selectedPersonsFilter - The array of selected persons.
 * @param {string} value - The value to toggle.
 * @returns {string[]} The updated array of selected persons.
 */
export const toggleSelectedPerson = (selectedPersonsFilter: string[], value: string) => {
  const updatedSelectedPersons = [...selectedPersonsFilter];
  const index = updatedSelectedPersons.indexOf(value);
  if (index === -1) {
    updatedSelectedPersons.push(value);
  } else {
    updatedSelectedPersons.splice(index, 1);
  }
  return updatedSelectedPersons;
};

/**
 * Escapes special characters in a regular expression.
 * @param {string} text - The text to escape.
 * @returns {string} The escaped text.
 */
export const escapeRegExp = (text: string) => {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

/**
 * Checks if two arrays of strings are equal.
 * @param {string[]} _arr1 - The first array to compare.
 * @param {string[]} _arr2 - The second array to compare.
 * @returns {boolean} True if equal, otherwise false.
 */
export function isArrayEqual(_arr1: string[], _arr2: string[]) {
  if (!Array.isArray(_arr1) || !Array.isArray(_arr2) || _arr1.length !== _arr2.length) {
    return false;
  }
  const arr1 = _arr1.concat().sort();
  const arr2 = _arr2.concat().sort();
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) {
      return false;
    }
  }
  return true;
}

/**
 * Builds a query string with the provided query parameters.
 * @param {Record<string, any>} params - The query parameters.
 * @returns {string} The built query string.
 */
export const buildQueryStringWithQueryParams = <T extends Record<string, any>>(
  params: T
): string => {
  const encodedParams = Object.entries(params)
    .filter(([_, value]) => value !== undefined && value !== null)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
    .join("&");
  return encodedParams;
};

/**
 * Extracts the sorted column name from the sorter object or array of sorter objects.
 * @param {SorterResult<any> | SorterResult<any>[]} sorter - The sorter object or array of sorter objects.
 * @returns {string} The sorted column name.
 */
export const getSortedColumn = (sorter: SorterResult<any> | SorterResult<any>[]) => {
  let columnName: string = "";
  let sort = sorter;
  if (sort && Array.isArray(sort)) sort = sort[0];
  if (sort.order === "descend") {
    columnName = `-${sort.field}`;
  } else if (sort.order === "ascend") {
    columnName = sort.field as string;
  }
  return columnName;
};

/**
 * Retrieves the selected field value based on conditions.
 * @param {SelectedUserFieldNameEnum} field - The field name.
 * @param {IDirectReporteeUser} reporteeUser - The reportee user object.
 * @param {UserDetail} userDetail - The user detail object.
 * @returns {any} The selected field value.
 */
export const getSelectedPerson = (field: SelectedUserFieldNameEnum, reporteeUser: IDirectReporteeUser,
  userDetail: UserDetail) => {
  return (reporteeUser?.id === userDetail?.id) && userDetail?.is_success_manager ? userDetail?.ceo_details?.[field] : reporteeUser?.[field];
};
