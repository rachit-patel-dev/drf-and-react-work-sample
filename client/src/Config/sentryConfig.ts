import React from "react";

import {
  Routes,
  useLocation,
  useNavigationType,
  createRoutesFromChildren,
  matchRoutes,
} from "react-router-dom";

import * as Sentry from "@sentry/react";

import { envConf } from "./envConfig";

import { escapeRegExp } from "../Library/Utils";

const { apiBaseUrl, sentryDsn, envType } = envConf;

if (envType === "production") {
  Sentry.init({
    dsn: sentryDsn,
    integrations: [
      new Sentry.BrowserTracing({
        tracePropagationTargets: [
          "localhost",
          new RegExp(escapeRegExp(apiBaseUrl)),
        ],
        // See docs for support of different versions of variation of react router
        // https://docs.sentry.io/platforms/javascript/guides/react/configuration/integrations/react-router/
        routingInstrumentation: Sentry.reactRouterV6Instrumentation(
          React.useEffect,
          useLocation,
          useNavigationType,
          createRoutesFromChildren,
          matchRoutes
        ),
      }),
      Sentry.replayIntegration({
        maskAllText: false,
        blockAllMedia: false,
      }),
    ],
    tracesSampleRate: 1.0,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
  });
}

export const SentryRoutes = Sentry.withSentryReactRouterV6Routing(Routes);
