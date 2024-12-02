/* eslint-disable */
import React, { lazy, Suspense } from "react";

import { useDispatch } from "react-redux";
import { BrowserRouter, Route } from "react-router-dom";

import { SentryRoutes } from "./Config";
import PrivateRoute from "./AppPrivateRoutes";
import Loader from "./Components/UI/Loader";

import { routeHandlers } from "./Library/Utils/routeHandlers";

// Pages
const CommonComponent = lazy(() => import("./Pages/Common"));

export interface IAppRoutesProps {}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loader />}>
        <SentryRoutes>
          <Route path="/" element={<PrivateRoute />}>
            <Route
              path={routeHandlers["Dashboard"]["url"]}
              element={<CommonComponent componentName="Dashboard" />}
            />
          </Route>
        </SentryRoutes>
      </Suspense>
    </BrowserRouter>
  );
}
