import axios from "axios";
import authGuardService from "./auth_guard_service";

const httpClient = axios.create();
const HTTP_AUTH_DEBUG_PREFIX = "[HTTP_AUTH]";

const logHttpAuth = (...args: unknown[]) => {
  console.log(HTTP_AUTH_DEBUG_PREFIX, ...args);
};

const isAuthTraceUrl = (url?: string): boolean => {
  if (!url) return false;
  return (
    url.includes("/admin-login") ||
    url.includes("/admin-dashboard") ||
    url.includes("admin-my-permissions")
  );
};

const shouldSkipAuthGuard = (url?: string): boolean => {
  if (!url) return false;
  return url.includes("/admin-login");
};

httpClient.interceptors.response.use(
  (response) => {
    const url = response.config?.url;
    if (isAuthTraceUrl(url)) {
      logHttpAuth("response", {
        url,
        statusCode: response.status,
        status: response.data?.status,
        rcode: response.data?.rcode,
      });
    }

    if (!shouldSkipAuthGuard(url)) {
      const invalidToken = authGuardService.isAuthTokenInvalid(response.data);
      if (invalidToken) {
        logHttpAuth("invalid-token-detected:response", { url });
        authGuardService.handleInvalidToken("response_payload");
      }
    }
    return response;
  },
  (error) => {
    const url = error?.config?.url;
    if (isAuthTraceUrl(url)) {
      logHttpAuth("response-error", {
        url,
        statusCode: error?.response?.status,
        payload: error?.response?.data ?? error?.message,
      });
    }

    if (!shouldSkipAuthGuard(url)) {
      const payload = error?.response?.data ?? error?.message;
      const invalidToken = authGuardService.isAuthTokenInvalid(payload);
      if (invalidToken) {
        logHttpAuth("invalid-token-detected:error", { url });
        authGuardService.handleInvalidToken("response_error");
      }
    }
    return Promise.reject(error);
  }
);

export default httpClient;
