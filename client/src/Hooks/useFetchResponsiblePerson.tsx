import React, { useEffect, useReducer } from "react";

import { useDispatch, useSelector } from "react-redux";

import { RootState } from "../Store/store";
import { setReportees } from "../Store/Reducers/AuthModule/auth";

import { getResponsiblePersonList } from "../Network/Core/users";
import { getAllPersonList } from "../Network/Core/objective";

import { errorHandling, isScrolledToBottom } from "../Library/Utils";
import {
  defaultCurrentPage,
  initiativePersonDefaultPageSize,
} from "../Resources/Statics";

import { IPersonReducerInfo, IPersonReducerPayload } from "../types/person";

interface personAction {
  type: string;
  payload: IPersonReducerPayload;
}

const useFetchResponsiblePerson = (
  loadInitially: boolean = true,
  fetchAllusers: boolean = false,
  forDivision: boolean = false
) => {
  const reducer = (personInfo: IPersonReducerInfo, action: personAction) => {
    switch (action.type) {
      case "UPDATE": {
        return { ...personInfo, ...action.payload };
      }
      default: {
        return personInfo;
      }
    }
  };

  const initialPersonInfo: IPersonReducerInfo = {
    personList: [],
    currentPage: defaultCurrentPage,
    currentPageSize: initiativePersonDefaultPageSize,
    isLoading: false,
    searchTerm: "",
    companyDivisionId: "",
    hasMorePerson: false,
    callPersonList: loadInitially,
    selectedPersonId: [],
    selectedObjectiveTypes: [],
  };

  const [personInfo, dispatch] = useReducer(reducer, initialPersonInfo);

  const {
    personList,
    currentPage,
    currentPageSize,
    searchTerm,
    companyDivisionId,
    hasMorePerson,
    isLoading,
    callPersonList,
  } = personInfo;

  const reduxDispatch = useDispatch();

  const Reportees = useSelector(
    (state: RootState) => state.authReducer.Reportees
  );

  const dispatchUpdatePerson = (payload: IPersonReducerPayload) => {
    dispatch({
      type: "UPDATE",
      payload,
    });
  };

  const getResponsiblePersons = async () => {
    try {
      dispatchUpdatePerson({ callPersonList: false });
      if (
        Reportees?.personList?.length > 0 &&
        currentPage === 1 &&
        searchTerm === "" &&
        !companyDivisionId &&
        !fetchAllusers &&
        !forDivision
      ) {
        dispatchUpdatePerson(Reportees);
      } else {
        dispatchUpdatePerson({ isLoading: true });

        let response;
        if (fetchAllusers) {
          response = await getAllPersonList(
            currentPage,
            currentPageSize,
            searchTerm
          );
        } else if (forDivision) {
          response = await getResponsiblePersonList(
            currentPage,
            currentPageSize,
            searchTerm,
            forDivision
          );
        } else {
          response = await getResponsiblePersonList(
            currentPage,
            currentPageSize,
            searchTerm,
            false,
            companyDivisionId
          );
        }
        let tempPersonList = [];
        if (currentPage !== 1) {
          tempPersonList = [...personList];
          tempPersonList = tempPersonList.concat(response?.data?.data?.results);
        } else {
          tempPersonList = response?.data?.data?.results;
        }
        const reporteeInfo = {
          personList: tempPersonList,
          hasMorePerson: response?.data?.data?.next !== null,
        };
        dispatchUpdatePerson(reporteeInfo);
        if (
          currentPage === 1 &&
          searchTerm === "" &&
          !companyDivisionId &&
          !fetchAllusers &&
          !forDivision
        )
          reduxDispatch(setReportees(reporteeInfo));
      }
    } catch (error) {
      errorHandling(error);
    } finally {
      dispatchUpdatePerson({ isLoading: false });
    }
  };

  const onPersonSearch = (value: string) => {
    dispatchUpdatePerson({
      currentPage: 1,
      searchTerm: value,
      callPersonList: true,
      isLoading: true,
    });
  };

  const onScrollOfPerson = async (event: React.UIEvent<HTMLElement>) => {
    if (hasMorePerson && !isLoading && isScrolledToBottom(event)) {
      dispatchUpdatePerson({
        isLoading: true,
        currentPage: currentPage + 1,
        callPersonList: true,
      });
    }
  };

  useEffect(() => {
    if (callPersonList) {
      getResponsiblePersons();
    }
  }, [callPersonList]);

  useEffect(() => {
    if (
      Reportees?.personList?.length > 0 &&
      !(loadInitially || fetchAllusers || forDivision)
    ) {
      dispatchUpdatePerson({
        callPersonList: true,
      });
    }
  }, [Reportees?.personList]);

  return {
    personInfo,
    dispatchUpdatePerson,
    onPersonSearch,
    onScrollOfPerson,
    isLoading,
  };
};

export default useFetchResponsiblePerson;
