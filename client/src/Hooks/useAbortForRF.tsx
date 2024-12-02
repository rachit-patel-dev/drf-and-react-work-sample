import { useEffect, useRef } from "react";

import { useSelector } from "react-redux";

import { RootState } from "../Store/store";

const useAbortForRF = () => {
  const abortControllerRef = useRef(new AbortController());
  const abortSignal = abortControllerRef.current.signal;

  const authState = useSelector((state: RootState) => state.authReducer);

  useEffect(() => {
    return () => {
      abortControllerRef.current.abort();
      abortControllerRef.current = new AbortController();
    };
  }, [authState.selectedDirectReportee]);

  return {
    abortSignal,
    abortControllerRef,
  };
};

export default useAbortForRF;
