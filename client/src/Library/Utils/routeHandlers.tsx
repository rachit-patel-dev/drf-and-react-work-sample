import React, { LazyExoticComponent, lazy } from "react";

// interface components
type routerHandlersType = {
  url: string;
  component: LazyExoticComponent<() => React.JSX.Element>;
};

export const routeHandlers: Record<string, routerHandlersType> = {
  Dashboard: {
    url: "/",
    component: lazy(() => import("../../Pages/DashBoardModule/Dashboard")),
  },
};
