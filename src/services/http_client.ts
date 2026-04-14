import axios from "axios";
import authGuardService from "./auth_guard_service";

const httpClient = axios.create();

const shouldSkipAuthGuard = (url?: string): boolean => {
  if (!url) return false;
  return url.includes("/admin-login");
};

httpClient.interceptors.response.use(
  (response) => {
    if (!shouldSkipAuthGuard(response.config?.url)) {
      const invalidToken = authGuardService.isAuthTokenInvalid(response.data);
      if (invalidToken) {
        authGuardService.handleInvalidToken("response_payload");
      }
    }
    return response;
  },
  (error) => {
    if (!shouldSkipAuthGuard(error?.config?.url)) {
      const payload = error?.response?.data ?? error?.message;
      const invalidToken = authGuardService.isAuthTokenInvalid(payload);
      if (invalidToken) {
        authGuardService.handleInvalidToken("response_error");
      }
    }
    return Promise.reject(error);
  }
);

export default httpClient;
