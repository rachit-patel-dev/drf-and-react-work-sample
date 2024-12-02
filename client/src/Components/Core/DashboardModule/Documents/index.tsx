/* eslint-disable react/require-default-props */
/* eslint-disable camelcase */
/* eslint-disable no-nested-ternary */

import React, {
  ForwardRefRenderFunction,
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";

import {
  Button,
  Table,
  Select,
  Tooltip,
  Input,
  Popconfirm,
  Collapse,
  Pagination,
} from "antd";
import type { PaginationProps } from "antd";
import {
  DeleteOutlined,
  QuestionCircleOutlined,
  LinkOutlined,
  UploadOutlined,
  FormOutlined,
} from "@ant-design/icons";
import { SorterResult } from "antd/es/table/interface";
import { toast } from "react-toastify";
import type { ColumnsType, TableProps } from "antd/es/table";
import { useDispatch, useSelector } from "react-redux";
import debounce from "lodash.debounce";

import { RootState } from "../../../../Store/store";

import AddDocument from "./AddDocument";
import UpdateDocument from "./UpdateDocument";
import PersonFilterIcon from "../../../UI/Filter/PersonFilterIcon";
import PersonFilterDropdown from "../../../UI/Filter/PersonFilterDropdown";

import useOptions from "../../../../Hooks/useOptions";
import useLanguage from "../../../../Hooks/useLanguage";
import useResetStateOnReporteeChange from "../../../../Hooks/useResetStateOnReporteeChange";
import useAbortForRF from "../../../../Hooks/useAbortForRF";
import useFetchResponsiblePerson from "../../../../Hooks/useFetchResponsiblePerson";

// API
import {
  getDocuments,
  updateDocument,
  removeDocument,
} from "../../../../Network/Core/document";
import { fetchDivisionWiseDocuments } from "../../../../Network/Core/review";
import { fetchListDocuments } from "../../../../Network/Core/planning";

//  helper
import {
  errorHandling,
  getSortedColumn,
  isArrayEqual,
  toggleSelectedPerson,
} from "../../../../Library/Utils";

import { Person } from "../../../../types/person";
import {
  Document,
  DocumentAction,
  DocumentFilters,
  DocumentInfo,
  DocumentList,
  DocumentOption,
  DocumentTableRecord,
  DocumentUpdatePayload,
} from "../../../../types/document";

import {
  IndividualPlanningModuleEnum,
  defaultPageSizeOptions,
} from "../../../../Resources/Statics";

import {
  DocumentModuleFilterKeys,
  RadicalFocusModules,
} from "../../../../Resources/Statics/globalFiltersStatics";
import { setFiltersByModuleNameAndFilterKey } from "../../../../Store/Reducers/globalFilters";
import ProfileImage from "../../../UI/Image";

const { Option } = Select;
const { TextArea } = Input;
const { Panel } = Collapse;

interface IDocument {
  module?: string;
}

const Documents: ForwardRefRenderFunction<HTMLDivElement, IDocument> = (
  { module = "" },
  ref
) => {
  const dispatcher = useDispatch();

  const authState = useSelector((state: RootState) => state.authReducer);
  // Document module state for filters
  const documentModuleFilters = useSelector(
    (state: RootState) =>
      state.globalFiltersReducers?.[RadicalFocusModules.DOCUMENT_MODULE]
  );

  // Document module priority filter store value
  const documentPriorityFilterFromStore = documentModuleFilters?.[
    DocumentModuleFilterKeys.DOCUMENT_PRIORITY
  ]?.[authState.selectedDirectReportee] || [""];

  // Document module status filter store value
  const documentStatusFilterFromStore = documentModuleFilters?.[
    DocumentModuleFilterKeys.STATUS
  ]?.[authState.selectedDirectReportee] || [""];

  // Document module persons filter store value
  const documentOwnerFilterFromStore =
    documentModuleFilters?.[DocumentModuleFilterKeys.OWNER]?.[
      authState.selectedDirectReportee
    ] || [];

  const initialDocumentInfo: DocumentInfo = {
    isLoading: false,
    isOpenAddDocumentModal: false,
    addLink: false,
    isOpenEditDocumentModal: false,
    callDocumentList: module === "",
    documentList: [],
    documentListSyncedWithDb: [],
    currentPage: 1,
    pageSize: 10,
    hasMoreDocuments: false,

    documentPersonList: [],
    personListCurrentPage: 1,
    personListPageSize: 8,
    hasMorePerson: false,
    personListLoading: false,
    callPersonList: true,

    selectedPriorities: module === "" ? documentPriorityFilterFromStore : [""],
    selectedStatuses: module === "" ? documentStatusFilterFromStore : [""],
    sortColumn: "",
    totalCount: 0,

    docIdForEdit: "",
    selectedDocumentLink: "",
    selectedDocumentName: "",
    isFileUploaded: true,
  };

  const [filterDropdownVisible, setFilterDropdownVisible] =
    useState<boolean>(false);
  const [selectedPersonsFilter, setSelectedPersonsFilter] = useState<string[]>(
    documentOwnerFilterFromStore
  );
  const [personSearchText, setPersonSearchText] = useState<string>("");

  const reducer = (documentInfo: DocumentInfo, action: DocumentAction) => {
    switch (action.type) {
      case "UPDATE": {
        return { ...documentInfo, ...action.payload };
      }
      default: {
        return documentInfo;
      }
    }
  };

  const fetchQueue = useRef<boolean[]>([]);
  const reviewAbortControllerRef = useRef(new AbortController());
  const reviewAbortSignal = reviewAbortControllerRef.current.signal;

  const [documentInfo, dispatch] = useReducer(reducer, initialDocumentInfo);
  const reviewDetails = useSelector((state: RootState) => state.reviewReducer);
  const planningDetails = useSelector(
    (state: RootState) => state.planningReducer
  );

  const selectedDirectReportee = useSelector(
    (state: RootState) => state.authReducer.selectedDirectReportee
  );

  const { abortSignal } = useAbortForRF();
  const { convertText } = useLanguage();
  const {
    documentPriorityOptions,
    documentPriorityFilterOptions,
    documentStatusFilteroptions,
    documentStatusoptions,
  } = useOptions();
  const { personInfo, onScrollOfPerson, onPersonSearch, dispatchUpdatePerson } =
    useFetchResponsiblePerson();

  const dispatchUpdateDocument = useCallback(
    (payload: DocumentUpdatePayload) => {
      dispatch({
        type: "UPDATE",
        payload,
      });
    },
    []
  );

  const resetDocumentState = () => {
    dispatchUpdatePerson({
      selectedPersonId: documentOwnerFilterFromStore,
    });
    dispatchUpdateDocument({
      currentPage: 1,
      sortColumn: "",
      selectedPriorities:
        module === "" ? documentPriorityFilterFromStore : [""],
      selectedStatuses: module === "" ? documentStatusFilterFromStore : [""],
      callDocumentList: true,
    });
  };

  useResetStateOnReporteeChange(resetDocumentState);

  const onResponsiblePersonSearchDebounced = useMemo(() => {
    return debounce(onPersonSearch, 500);
  }, []);

  const updateChangedPriority = async (value: string, id: string) => {
    try {
      await updateDocument(id, {
        priority: value,
      });
    } catch (error) {
      errorHandling(error);
    }
  };

  const handleChangePriority = (value: string, id: string, index: number) => {
    const { documentList } = documentInfo;
    const tempDocumentList = [...documentList];
    tempDocumentList[index].priority = value;
    dispatchUpdateDocument({
      documentList: tempDocumentList,
    });
  };

  const handleChangeStatus = async (
    value: string,
    id: string,
    index: number
  ) => {
    const { documentList } = documentInfo;
    const tempDocumentList = [...documentList];
    tempDocumentList[index].status = value;
    dispatchUpdateDocument({
      documentList: tempDocumentList,
    });
  };

  const onChangeResponsibelPerson = async (value: object, id: string) => {
    try {
      await updateDocument(id, {
        owner: value,
      });
      dispatchUpdateDocument({
        callDocumentList: true,
      });
    } catch (error) {
      errorHandling(error);
    }
  };

  const updateChangedStatus = async (value: string, id: string) => {
    try {
      await updateDocument(id, {
        status: value,
      });
      dispatchUpdateDocument({
        callDocumentList: true,
      });
    } catch (error) {
      errorHandling(error);
    }
  };

  const resetTitleToPreviousTitle = (index: number) => {
    const { documentList, documentListSyncedWithDb } = documentInfo;
    const tempDocuments: DocumentList = [...documentList];
    tempDocuments[index].title = documentListSyncedWithDb?.[index]?.title;
    dispatchUpdateDocument({
      documentList: structuredClone(tempDocuments),
    });
  };

  const onDocumentTitleChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
    index: number
  ) => {
    const { documentList } = documentInfo;
    const tempDocuments: DocumentList = [...documentList];
    tempDocuments[index].title = e.target.value;
    dispatchUpdateDocument({
      documentList: tempDocuments,
    });
  };

  const updateDocumentTitle = async (
    title: string,
    id: string,
    index: number
  ) => {
    try {
      const { documentListSyncedWithDb } = documentInfo;
      if (title === "") {
        resetTitleToPreviousTitle(index);
      } else {
        const res = await updateDocument(id, {
          title,
        });

        if (res?.data?.success) {
          const tempDocuments: DocumentList = [...documentListSyncedWithDb];
          tempDocuments[index].title = title;
          dispatchUpdateDocument({
            documentListSyncedWithDb: structuredClone(tempDocuments),
          });
        }
      }
    } catch (error) {
      errorHandling(error);
    }
  };
  const getAllDocuments = async () => {
    try {
      dispatchUpdateDocument({ isLoading: true, callDocumentList: false });

      const {
        currentPage,
        pageSize,
        selectedPriorities,
        selectedStatuses,
        sortColumn,
      } = documentInfo;

      let response;
      if (module === "review-division-update") {
        response = await fetchDivisionWiseDocuments(
          reviewDetails.selectedDivisionId,
          currentPage,
          pageSize,
          reviewAbortSignal,
          selectedPriorities,
          selectedStatuses,
          sortColumn
        );
      } else if (module === IndividualPlanningModuleEnum.DocumentPlanning) {
        response = await fetchListDocuments(
          planningDetails.selectedPerson?.id,
          currentPage,
          pageSize,
          selectedPriorities,
          selectedStatuses,
          sortColumn
        );
      } else {
        response = await getDocuments(
          currentPage,
          pageSize,
          selectedDirectReportee,
          abortSignal,
          selectedPriorities,
          selectedStatuses,
          sortColumn,
          selectedPersonsFilter
        );
      }

      if (response?.data?.success) {
        const documentListRes = response?.data?.data?.results || [];
        dispatchUpdateDocument({
          documentList: documentListRes,
          documentListSyncedWithDb: structuredClone(documentListRes),
          hasMoreDocuments: !!response?.data?.data?.next,
          totalCount: response?.data?.data?.count || 0,
        });
      }
    } catch (error) {
      errorHandling(error);
    } finally {
      /* If this api is called multiple time while previous api call is still in Progress,
         then to stop loader only when last api call is executed i have implemented
         below condition */
      if (fetchQueue.current.length <= 1) {
        dispatchUpdateDocument({ isLoading: false });
      }
      fetchQueue.current.shift();
    }
  };

  const onEditDocument = (doc: Document) => {
    dispatchUpdateDocument({
      docIdForEdit: doc.id,
      selectedDocumentLink: doc.link,
      selectedDocumentName: doc.file_name,
      isOpenEditDocumentModal: true,
      isFileUploaded: doc.is_file_uploaded,
    });
  };

  const deleteDocument = async (id: string) => {
    try {
      const response = await removeDocument(id);

      if (response?.data?.success) {
        dispatchUpdateDocument({
          currentPage: 1,
          selectedPriorities:
            module === "" ? documentPriorityFilterFromStore : [""],
          selectedStatuses:
            module === "" ? documentStatusFilterFromStore : [""],
          callDocumentList: true,
        });
        toast.success(convertText("successDeleteDocument"));
      }
    } catch (error) {
      errorHandling(error);
    }
  };

  const onFilterChange: TableProps<DocumentTableRecord>["onChange"] = async (
    pagination,
    filters: DocumentFilters,
    sorter:
      | SorterResult<DocumentTableRecord>
      | SorterResult<DocumentTableRecord>[]
  ) => {
    const columnName: string = getSortedColumn(sorter);

    dispatchUpdateDocument({
      sortColumn: columnName,
      currentPage: 1,
      callDocumentList: true,
    });
    if (filters.priority && filters.priority.length > 0) {
      if (module === "") {
        // setting the priority filters in store using module name and filterKey by direct report id
        dispatcher(
          setFiltersByModuleNameAndFilterKey({
            moduleName: RadicalFocusModules.DOCUMENT_MODULE,
            filterKey: DocumentModuleFilterKeys.DOCUMENT_PRIORITY,
            updatedValue: {
              [authState.selectedDirectReportee]: filters.priority || [""],
            },
          })
        );
      }
      dispatchUpdateDocument({
        currentPage: 1,
        selectedPriorities: filters.priority || [""],
        callDocumentList: true,
      });
    } else {
      if (module === "") {
        // setting the priority filters in store using module name and filterKey by direct report id
        dispatcher(
          setFiltersByModuleNameAndFilterKey({
            moduleName: RadicalFocusModules.DOCUMENT_MODULE,
            filterKey: DocumentModuleFilterKeys.DOCUMENT_PRIORITY,
            updatedValue: {
              [authState.selectedDirectReportee]: [""],
            },
          })
        );
      }
      dispatchUpdateDocument({
        currentPage: 1,
        selectedPriorities: [""],
        callDocumentList: true,
      });
    }
    if (filters.status && filters.status.length > 0) {
      if (module === "") {
        // setting the status filters in store using module name and filterKey by direct report id
        dispatcher(
          setFiltersByModuleNameAndFilterKey({
            moduleName: RadicalFocusModules.DOCUMENT_MODULE,
            filterKey: DocumentModuleFilterKeys.STATUS,
            updatedValue: {
              [authState.selectedDirectReportee]: filters.status || [""],
            },
          })
        );
      }
      dispatchUpdateDocument({
        currentPage: 1,
        selectedStatuses: filters.status || [""],
        callDocumentList: true,
      });
    } else {
      if (module === "") {
        // setting the status filters in store using module name and filterKey by direct report id
        dispatcher(
          setFiltersByModuleNameAndFilterKey({
            moduleName: RadicalFocusModules.DOCUMENT_MODULE,
            filterKey: DocumentModuleFilterKeys.STATUS,
            updatedValue: {
              [authState.selectedDirectReportee]: [""],
            },
          })
        );
      }
      dispatchUpdateDocument({
        currentPage: 1,
        selectedStatuses: [""],
        callDocumentList: true,
      });
    }
  };

  const onDocumentsPageChange: PaginationProps["onChange"] = (
    pageNumber,
    selectedPageSize
  ) => {
    dispatchUpdateDocument({
      currentPage: documentInfo.pageSize === selectedPageSize ? pageNumber : 1,
      pageSize: selectedPageSize,
      callDocumentList: true,
    });
  };

  const handleLinkClick = (document: Document) => {
    if (document?.link) {
      window.open(
        `${document?.link?.startsWith("www") ? "http://" : ""}${
          document?.link
        }`,
        "_blank"
      );
    }
  };

  const handleAddLink = () => {
    dispatchUpdateDocument({
      isOpenAddDocumentModal: !documentInfo.isOpenAddDocumentModal,
      addLink: true,
    });
  };

  const handleUploadDoc = () => {
    dispatchUpdateDocument({
      isOpenAddDocumentModal: !documentInfo.isOpenAddDocumentModal,
      addLink: false,
    });
  };

  const handlePersonCheckboxChange = (value: string) => {
    const updatedSelectedPersons = toggleSelectedPerson(
      selectedPersonsFilter,
      value
    );
    // setting the responsible person filters in store using module name and filterKey by direct report id
    if (module === "") {
      dispatcher(
        setFiltersByModuleNameAndFilterKey({
          moduleName: RadicalFocusModules.DOCUMENT_MODULE,
          filterKey: DocumentModuleFilterKeys.OWNER,
          updatedValue: {
            [authState.selectedDirectReportee]: updatedSelectedPersons || [],
          },
        })
      );
    }
    setSelectedPersonsFilter(updatedSelectedPersons);
  };

  const handlePersonSearch = (searchTerm: string) => {
    onResponsiblePersonSearchDebounced(searchTerm);
    setPersonSearchText(searchTerm);
  };

  const handleReset = () => {
    handlePersonSearch("");
    setSelectedPersonsFilter([]);
    // reset the responsible person filters in store using module name and filterKey by direct report id
    if (module === "") {
      dispatcher(
        setFiltersByModuleNameAndFilterKey({
          moduleName: RadicalFocusModules.DOCUMENT_MODULE,
          filterKey: DocumentModuleFilterKeys.OWNER,
          updatedValue: {
            [authState.selectedDirectReportee]: [],
          },
        })
      );
    }
  };

  const handlePersonFilterOk = () => {
    handlePersonSearch("");
    if (!isArrayEqual(personInfo?.selectedPersonId, selectedPersonsFilter)) {
      dispatchUpdatePerson({
        selectedPersonId: selectedPersonsFilter,
      });
      dispatchUpdateDocument({
        currentPage: 1,
        callDocumentList: true,
      });
    }
    setFilterDropdownVisible(false);
  };

  const handleFilterVisibleChange = (visible: boolean) => {
    if (!visible) {
      handlePersonFilterOk();
    }
  };

  useEffect(() => {
    if (documentInfo.callDocumentList) {
      fetchQueue.current.push(true);
      getAllDocuments();
    }
  }, [documentInfo.callDocumentList]);

  useEffect(() => {
    if (
      reviewDetails.selectedDivisionId &&
      module === "review-division-update"
    ) {
      dispatchUpdateDocument({
        currentPage: 1,
        callDocumentList: true,
      });
    }
    return () => {
      if (
        reviewDetails.selectedDivisionId &&
        module === "review-division-update"
      ) {
        reviewAbortControllerRef.current.abort();
        reviewAbortControllerRef.current = new AbortController();
      }
    };
  }, [reviewDetails.selectedDivisionId]);

  useEffect(() => {
    if (
      planningDetails.selectedPerson?.id &&
      module === IndividualPlanningModuleEnum.DocumentPlanning
    ) {
      dispatchUpdateDocument({
        currentPage: 1,
        callDocumentList: true,
      });
    } else {
      dispatchUpdateDocument({
        currentPage: 1,
        sortColumn: "",
        selectedPriorities:
          module === "" ? documentPriorityFilterFromStore : [""],
        selectedStatuses: module === "" ? documentStatusFilterFromStore : [""],
        documentList: [],
        hasMoreDocuments: false,
      });
    }
  }, [planningDetails.selectedPerson?.id, planningDetails.selectedYear]);

  useEffect(() => {
    setSelectedPersonsFilter(personInfo?.selectedPersonId);
  }, [personInfo?.selectedPersonId]);

  const columns: ColumnsType<DocumentTableRecord> = [
    {
      title: <div>{convertText("documentTitle")}</div>,
      dataIndex: "title",
      key: "documentTitle",
      render: (_, document, index) => {
        return document?.permissions?.w || module !== "" ? (
          <TextArea
            className="table-box-text"
            defaultValue={document?.title}
            value={document?.title}
            onChange={(e) => onDocumentTitleChange(e, index)}
            onBlur={() =>
              updateDocumentTitle(document?.title, document?.id, index)
            }
            autoSize={{ minRows: 1, maxRows: 5 }}
            maxLength={60}
          />
        ) : (
          <p className="table-box-text">{document?.title}</p>
        );
      },
    },
    {
      title: <div>{convertText("link")}</div>,
      dataIndex: "link",
      key: "link",
      render: (_, document) => {
        return (
          <Tooltip
            overlayClassName="task-tooltip"
            placement="top"
            title={document?.link || `${convertText("processLinkNotProvided")}`}
          >
            <Button
              onClick={() => handleLinkClick(document)}
              className={`action-btn ${!document?.link && "disabled"}`}
            >
              <LinkOutlined />
            </Button>
          </Tooltip>
        );
      },
    },

    {
      title: <>{convertText("priority")}</>,
      dataIndex: "priority",
      key: "priority",
      sorter: documentInfo.documentList.length > 0,
      filters: documentPriorityFilterOptions,
      filterSearch: true,
      filteredValue: documentInfo.selectedPriorities || [""],
      filterIcon: (
        <PersonFilterIcon selectedPersons={documentInfo?.selectedPriorities} />
      ),
      render: (_, document, i) => {
        return (
          <Select
            className={document?.priority?.toLowerCase()}
            size="small"
            defaultValue={document?.priority}
            disabled={!(document?.permissions?.w || module !== "")}
            value={document?.priority}
            style={{ width: 120 }}
            getPopupContainer={(trigger) => trigger.parentElement}
            onChange={(value) => handleChangePriority(value, document?.id, i)}
            onBlur={() =>
              updateChangedPriority(document?.priority, document?.id)
            }
            options={documentPriorityOptions}
          />
        );
      },
    },
    {
      title: <div>{convertText("status")}</div>,
      dataIndex: "status",
      key: "status",
      filters:
        module !== IndividualPlanningModuleEnum.DocumentPlanning
          ? documentStatusFilteroptions
          : undefined,
      filterSearch: true,
      filteredValue: documentInfo.selectedStatuses || [""],
      filterIcon: (
        <PersonFilterIcon selectedPersons={documentInfo?.selectedStatuses} />
      ),

      render: (_, document, i) => {
        return (
          <Select
            className={`document-status-select ${document?.status?.toLowerCase()} ${
              module === IndividualPlanningModuleEnum.DocumentPlanning
                ? "planning-document-status"
                : ""
            }`}
            size="small"
            defaultValue={document?.status}
            value={document?.status}
            style={{ width: 120 }}
            disabled={
              !(document?.permissions?.w || module !== "") ||
              module === IndividualPlanningModuleEnum.DocumentPlanning
            }
            getPopupContainer={(trigger) => trigger.parentElement}
            onChange={(value) => handleChangeStatus(value, document?.id, i)}
            onBlur={() => updateChangedStatus(document?.status, document?.id)}
          >
            {documentStatusoptions?.map((option: DocumentOption) => (
              <Option key={option?.value} value={option?.value}>
                <Tooltip
                  overlayClassName="task-tooltip"
                  placement="top"
                  title={option?.label}
                >
                  <span className={option?.value?.toLowerCase()}>
                    {option?.label}
                  </span>
                </Tooltip>
              </Option>
            ))}
          </Select>
        );
      },
    },
    {
      title: (
        <div className="ant-table-filter-column">{convertText("owner")}</div>
      ),
      dataIndex: "owner_name",
      key: "owner_name",
      sorter: documentInfo.documentList.length > 0,
      ...(module === ""
        ? {
            filterIcon: (
              <PersonFilterIcon
                selectedPersons={personInfo?.selectedPersonId}
                onClick={() => setFilterDropdownVisible(true)}
              />
            ),
            filterDropdown: (
              <PersonFilterDropdown
                handlePersonSearch={handlePersonSearch}
                personSearchText={personSearchText}
                personList={personInfo?.personList}
                handlePersonCheckboxChange={handlePersonCheckboxChange}
                selectedPersonsFilter={selectedPersonsFilter}
                handlePersonFilterOk={handlePersonFilterOk}
                handleReset={handleReset}
                isLoading={personInfo?.isLoading}
                handleScroll={onScrollOfPerson}
              />
            ),
            filterDropdownOpen: filterDropdownVisible,
            onFilterDropdownVisibleChange: handleFilterVisibleChange,
          }
        : {}),

      render: (_, document) => (
        <Select
          className="responsible-select"
          popupClassName="responsible-select-drop"
          getPopupContainer={(trigger) => trigger.parentElement}
          optionFilterProp="children"
          onPopupScroll={onScrollOfPerson}
          onChange={(value) => onChangeResponsibelPerson(value, document?.id)}
          disabled={!(document?.permissions?.w || module !== "")}
          defaultValue={{
            value: document?.owner?.id,
            label: (
              <Tooltip
                overlayClassName="task-tooltip"
                title={`${document?.owner?.first_name} ${document?.owner?.last_name}`}
              >
                <div className="resposible-text-img">
                  <ProfileImage
                    firstName={document?.owner?.first_name}
                    lastName={document?.owner?.last_name}
                    profileImage={document?.owner?.profile_image}
                    backgroundColor={document?.owner?.profile_color_hash}
                  />
                  <p>{`${document?.owner?.first_name} ${document?.owner?.last_name}`}</p>
                </div>
              </Tooltip>
            ),
          }}
        >
          {personInfo?.personList.map((person: Person) => (
            <Option key={person?.id} value={person?.id}>
              <Tooltip
                overlayClassName="task-tooltip"
                title={`${person?.first_name} ${person?.last_name}`}
              >
                <ProfileImage
                  firstName={person?.first_name}
                  lastName={person?.last_name}
                  profileImage={person?.profile_image}
                  backgroundColor={person?.profile_color_hash}
                />
                <span>{`${person?.first_name} ${person?.last_name}`}</span>
              </Tooltip>
            </Option>
          ))}
          {personInfo.isLoading && <Option>Loading...</Option>}
        </Select>
      ),
    },
    {
      title: <div>{convertText("edit")}</div>,
      dataIndex: "id",
      key: "initiativeAction",
      render: (_, document) => {
        return document?.permissions?.w || module !== "" ? (
          <div className="custom-action-row">
            <Button className="action-btn">
              <FormOutlined onClick={() => onEditDocument(document)} />
            </Button>
            <Popconfirm
              title={convertText("deleteDocumentTitle")}
              description={convertText("deleteDocumentDescription")}
              onConfirm={() => deleteDocument(document?.id)}
              okText={convertText("okBtn")}
              cancelText={convertText("cancelBtn")}
              icon={<QuestionCircleOutlined style={{ color: "red" }} />}
              placement="left"
            >
              <Button className="action-btn">
                <DeleteOutlined />
              </Button>
            </Popconfirm>
          </div>
        ) : (
          <div></div>
        );
      },
    },
  ];

  return (
    <div>
      <div
        id="documents"
        data-observer="observer-documents"
        ref={ref}
        className="custom-tab-panel"
      >
        <div className="custom-card">
          <Collapse
            defaultActiveKey={["1"]}
            className="dash-collapse"
            collapsible="icon"
          >
            <Panel
              header={
                <div className="custom-card-header">
                  <div className="hedaer-left">
                    <h3>{convertText("documents")}</h3>
                    {module ===
                      IndividualPlanningModuleEnum.DocumentPlanning && (
                      <div className="planning-selected-person">
                        for{" "}
                        <span>
                          {planningDetails?.selectedPerson?.firstName}{" "}
                          {planningDetails?.selectedPerson?.lastName}
                        </span>
                      </div>
                    )}
                    {module === "review-division-update" && (
                      <div className="planning-selected-person">
                        of <span>{reviewDetails?.selectedDivisionHead}</span>
                      </div>
                    )}
                  </div>
                  {module !== "review-division-update" && (
                    <div className="header-right">
                      <Button
                        className="theme-btn"
                        size="small"
                        onClick={handleAddLink}
                      >
                        <LinkOutlined />
                        {convertText("addLink")}
                      </Button>

                      <Button
                        className="theme-btn"
                        size="small"
                        onClick={handleUploadDoc}
                      >
                        <UploadOutlined />
                        {convertText("uploadDoc")}
                      </Button>
                    </div>
                  )}
                </div>
              }
              key="1"
            >
              <div className="custom-card-body collapse-table-body">
                <Table
                  className="dash-common-table intiative-listing-table Rf-table"
                  scroll={{ x: "max-content" }}
                  columns={columns}
                  loading={documentInfo.isLoading}
                  onChange={onFilterChange}
                  pagination={false}
                  dataSource={documentInfo.documentList?.map(
                    (document: Document) => {
                      return { ...document, key: document.id };
                    }
                  )}
                />

                {documentInfo.totalCount > 0 && (
                  <Pagination
                    showSizeChanger
                    current={documentInfo.currentPage}
                    total={documentInfo.totalCount}
                    pageSize={documentInfo.pageSize}
                    onChange={onDocumentsPageChange}
                    pageSizeOptions={defaultPageSizeOptions}
                    className="custom-pagination-div"
                  />
                )}
              </div>
            </Panel>
          </Collapse>
        </div>
      </div>

      <AddDocument
        documentInfo={documentInfo}
        dispatchUpdateDocument={dispatchUpdateDocument}
        module={module}
      />

      <UpdateDocument
        documentInfo={documentInfo}
        dispatchUpdateDocument={dispatchUpdateDocument}
      />
    </div>
  );
};

export default React.memo(forwardRef(Documents));
