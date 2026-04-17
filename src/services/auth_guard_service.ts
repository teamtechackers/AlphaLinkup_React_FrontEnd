import { toast } from "react-toastify";
import { APP_ROUTES } from "../utils/strings/app_routes";
import authService from "./auth_service";

const INVALID_TOKEN_PATTERNS = [
  /invalid\s+token/i,
  /invalid\s+admin\s+token/i,
  /token\s+mismatch/i,
];

const AUTH_TOAST_ID = "auth-token-invalid";
const AUTH_GUARD_DEBUG_PREFIX = "[AUTH_GUARD]";

const logAuthGuard = (...args: unknown[]) => {
  console.log(AUTH_GUARD_DEBUG_PREFIX, ...args);
};

const collectAuthTexts = (payload: unknown): string[] => {
  if (!payload) return [];

  if (typeof payload === "string") {
    return [payload];
  }

  if (typeof payload !== "object") {
    return [];
  }

  const data = payload as Record<string, unknown>;
  const texts: string[] = [];

  const knownKeys = ["message", "info", "error", "msg", "detail"];
  knownKeys.forEach((key) => {
    const value = data[key];
    if (typeof value === "string") {
      texts.push(value);
    }
  });

  if (typeof data.data === "string") {
    texts.push(data.data);
  }

  if (data.data && typeof data.data === "object") {
    texts.push(...collectAuthTexts(data.data));
  }

  if (Array.isArray(data.errors)) {
    data.errors.forEach((item) => {
      if (typeof item === "string") {
        texts.push(item);
      } else if (item && typeof item === "object") {
        texts.push(...collectAuthTexts(item));
      }
    });
  }

  return texts;
};

let isHandlingForcedLogout = false;

const authGuardService = {
  isAuthTokenInvalid: (payload: unknown): boolean => {
    const texts = collectAuthTexts(payload);
    if (!texts.length) return false;

    const isInvalid = texts.some((text) =>
      INVALID_TOKEN_PATTERNS.some((pattern) => pattern.test(text))
    );

    if (isInvalid) {
      logAuthGuard("isAuthTokenInvalid:matched", {
        route: typeof window !== "undefined" ? window.location.pathname : "server",
        texts,
      });
    }

    return isInvalid;
  },

  handleInvalidToken: (reason?: string) => {
    if (isHandlingForcedLogout) {
      logAuthGuard("handleInvalidToken:skip-already-handling", { reason });
      return;
    }

    const hasSession =
      typeof window !== "undefined" &&
      Boolean(localStorage.getItem("token") && localStorage.getItem("sessionId"));

    if (!hasSession) {
      logAuthGuard("handleInvalidToken:skip-no-session", { reason });
      return;
    }

    isHandlingForcedLogout = true;

    logAuthGuard("handleInvalidToken:trigger", {
      reason: reason || "unknown",
      route: typeof window !== "undefined" ? window.location.pathname : "server",
      hasSessionId: Boolean(localStorage.getItem("sessionId")),
      hasToken: Boolean(localStorage.getItem("token")),
      hasUserId: Boolean(localStorage.getItem("user_id")),
    });

    authService.logout();

    toast.error("Session expired. Please login again.", { toastId: AUTH_TOAST_ID });

    if (typeof window !== "undefined" && window.location.pathname !== APP_ROUTES.LOGIN) {
      window.location.replace(APP_ROUTES.LOGIN);
    }

    setTimeout(() => {
      isHandlingForcedLogout = false;
      logAuthGuard("handleInvalidToken:unlock");
    }, 1500);
  },
};

export default authGuardService;