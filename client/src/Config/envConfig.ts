export const envConf = {
  baseUrl: String(process.env.REACT_APP_BASE_URL),
  apiBaseUrl: String(process.env.REACT_APP_API_URL),
  sentryDsn: String(process.env.REACT_APP_SENTRY_DSN),
  envType: String(process.env.REACT_APP_ENV),
};
