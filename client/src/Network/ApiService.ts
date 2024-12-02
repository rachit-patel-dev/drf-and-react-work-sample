/* eslint-disable no-param-reassign */

import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";

import { envConf } from "../Config";

import { getToLocalStorage } from "../Library/Utils";

const { apiBaseUrl } = envConf;

export const authApi = axios.create({
  baseURL: `${apiBaseUrl}`,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    language: "En",
  },
  withCredentials: false,
  responseType: "json",
});

const api = axios.create({
  baseURL: `${apiBaseUrl}`,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: false,
  responseType: "json",
});

api.interceptors.request.use(
  async (config: AxiosRequestConfig) => {
    config.headers = config.headers ?? {};
    config.params = config.params || {};
    const token = getToLocalStorage("token");
    const auth = token ? `Bearer ${token}` : "";
    const language = getToLocalStorage("language")
      ? getToLocalStorage("language")
      : "De";
    config.headers.Authorization = auth;
    config.headers.language = language;
    config.headers.company_id = getToLocalStorage("user")?.is_success_manager
      ? getToLocalStorage("user")?.company_id || ""
      : "";

    if (getToLocalStorage("user")?.is_success_manager) {
      config.params = {
        ...config.params,
        company_id: getToLocalStorage("user")?.company_id || ""
      };
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    return response;
  },
  (error: AxiosError): Promise<AxiosError> => {
    if (error?.response?.status === 401) {
      localStorage.clear();
      window.location.href = `${window.location.origin}/signin`;
    }
    return Promise.reject(error);
  }
);

export default api;
