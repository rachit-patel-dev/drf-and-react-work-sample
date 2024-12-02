import { getToLocalStorage } from "./index";

/**
 * Checks if a user is authenticated by verifying the presence of a token in local storage.
 * 
 * @returns {boolean} - Returns true if the user is authenticated, otherwise false.
 */
export const isAuth = () => {
  const token = getToLocalStorage("token");
  return !!token;
};
