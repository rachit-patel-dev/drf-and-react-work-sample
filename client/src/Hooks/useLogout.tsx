import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  setReportees,
  setDirectReporteePersons,
  setSelectedDirectReportee,
  setSelectedDirectReporteeUser,
  setSelectedDirectReporteeUserId,
  setUserDetails,
} from "../Store/Reducers/AuthModule/auth";
import { resetSelectedReviewMonth } from "../Store/Reducers/review";

const useLogout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    dispatch(setUserDetails(null));
    dispatch(setSelectedDirectReportee(""));
    dispatch(setSelectedDirectReporteeUserId(""));
    dispatch(
      setSelectedDirectReporteeUser({
        id: "",
        name: "",
        first_name: "",
        last_name: "",
        profile_image: "",
        profile_color_hash: "",
        c_level: false,
        ceo_level: false,
      })
    );
    dispatch(
      setReportees({
        personList: [],
        hasMorePerson: false,
      })
    );
    dispatch(setDirectReporteePersons([]));
    dispatch(resetSelectedReviewMonth());
    navigate("/signin");
  };
  return {
    logout,
  };
};

export default useLogout;
