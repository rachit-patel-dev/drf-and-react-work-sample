import type { FilterValue } from "antd/es/table/interface";

import { ApiUrl } from "../ApiUrl";
import api from "../ApiService";

export const getDocuments = async (
  page: number,
  pageSize: number,
  directReportId: string,
  signal: AbortSignal,
  priority: FilterValue = [],
  status: FilterValue = [],
  sortBy: string = "",
  responsiblePersonIds: string[] = []
) => {
  const response = await api.get(
    `${ApiUrl.documentModule.common_document_base}?page=${page}&page_size=${pageSize}&priority=${priority}&status=${status}&sort_by=${sortBy}&direct_report=${directReportId}&responsible_person=${responsiblePersonIds}`, {
    signal
  }
  );
  return response;
};

export const addDocument = async (values: object) => {
  const response = await api.post(
    `${ApiUrl.documentModule.common_document_base}`,
    values
  );
  return response;
};

export const updateDocument = async (id: string, values: object) => {
  const response = await api.put(
    `${ApiUrl.documentModule.common_document_base}${id}/`,
    values
  );
  return response;
};

export const removeDocument = async (id: string) => {
  const response = await api.delete(
    `${ApiUrl.documentModule.common_document_base}${id}/delete_document/`
  );
  return response;
};
