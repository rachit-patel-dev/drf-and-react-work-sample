import type { FilterValue } from "antd/es/table/interface";

import { Person } from "./person";
import { IPermission } from "./user";

export interface Document {
  id: string;
  title: string;
  priority: string;
  status: string;
  owner: Person;
  link: string;
  is_file_uploaded: boolean;
  file_name: string;
  permissions: IPermission;
}

export type DocumentList = Document[];

export interface DocumentFilters {
  priority?: FilterValue;
  status?: FilterValue;
}

export interface DocumentTableRecord extends Document {
  key: string;
}

export interface DocumentInfo {
  isLoading: boolean;
  isOpenAddDocumentModal: boolean;
  addLink: boolean;
  isOpenEditDocumentModal: boolean;
  callDocumentList: boolean;
  documentList: DocumentList;
  documentListSyncedWithDb: DocumentList;
  currentPage: number;
  pageSize: number;
  hasMoreDocuments: boolean;

  documentPersonList: Person[];
  personListCurrentPage: number;
  personListPageSize: number;
  hasMorePerson: boolean;
  personListLoading: boolean;
  callPersonList: boolean;

  selectedPriorities: FilterValue;
  selectedStatuses: FilterValue;
  sortColumn: string;
  totalCount: number;

  docIdForEdit: string;
  selectedDocumentLink: string;
  selectedDocumentName: string;
  isFileUploaded: boolean;
}

export interface DocumentUpdatePayload {
  isLoading?: boolean;
  isOpenAddDocumentModal?: boolean;
  addLink?: boolean;
  isOpenEditDocumentModal?: boolean;
  callDocumentList?: boolean;
  documentList?: DocumentList;
  documentListSyncedWithDb?: DocumentList;
  currentPage?: number;
  pageSize?: number;
  hasMoreDocuments?: boolean;

  documentPersonList?: Person[];
  personListCurrentPage?: number;
  personListPageSize?: number;
  hasMorePerson?: boolean;
  personListLoading?: boolean;
  callPersonList?: boolean;

  selectedPriorities?: FilterValue;
  selectedStatuses?: FilterValue;
  sortColumn?: string;
  totalCount?: number;

  docIdForEdit?: string;
  selectedDocumentLink?: string;
  selectedDocumentName?: string;
  isFileUploaded?: boolean;
}

export interface DocumentAction {
  type: string;
  payload: DocumentUpdatePayload;
}

export interface DocumentOption {
  label: string;
  value: string;
}
