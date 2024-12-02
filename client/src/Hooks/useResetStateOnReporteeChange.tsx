import { useEffect } from "react";

import { useSelector } from "react-redux";

import { RootState } from "../Store/store";

const useResetStateOnReporteeChange = (resetModuleState: () => void) => {
  const selectedDirectReportee = useSelector(
    (state: RootState) => state.authReducer.selectedDirectReportee
  );

  useEffect(() => {
    if (selectedDirectReportee) {
      resetModuleState();
    }
  }, [selectedDirectReportee]);
  return null;
};

export default useResetStateOnReporteeChange;
