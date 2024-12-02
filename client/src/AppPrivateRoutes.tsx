import React from "react";

import { Outlet, Navigate } from "react-router-dom";

import { isAuth } from "./Library/Utils/auth";

const PrivteRoutes = () => {
  return isAuth() ? <Outlet /> : <Navigate to="/signin" />;
};
export default PrivteRoutes;
