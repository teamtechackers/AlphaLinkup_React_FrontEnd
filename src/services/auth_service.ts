import { loginService } from "./login_service";
import { UserModel } from "../models/user_model";
import { base64ToNumber } from "../utils/helpers/hasher"; // if you use this
import { normalizeApiUserId } from "../utils/helpers/api_id";
import { VARIABLES } from "../utils/strings/variables";

const sessionDuration = 60 * 60 * 1000; // 1 hour
const AUTH_DEBUG_PREFIX = "[AUTH_FLOW]";

const maskToken = (token?: string | null): string => {
  if (!token) return "(empty)";
  if (token.length <= 10) return `${token.slice(0, 2)}***${token.slice(-2)}`;
  return `${token.slice(0, 6)}...${token.slice(-4)}`;
};

const logAuth = (...args: unknown[]) => {
  console.log(AUTH_DEBUG_PREFIX, ...args);
};

const authService = {
  currentUser: {} as UserModel & { api_user_id?: string },

  createSession: async (userId: string, userName: string, token: string) => {
    const sessionId = `${userId}_${Date.now()}`;
    const sessionStart = Date.now();
    const normalizedUserId = normalizeApiUserId(userId);

    logAuth("createSession:start", {
      userName,
      userIdRaw: userId,
      userIdNormalized: normalizedUserId,
      token: maskToken(token),
      sessionStart,
    });

    // keep raw returned value in localStorage (so nothing breaks)
    localStorage.setItem("sessionId", sessionId);
    localStorage.setItem("sessionStart", sessionStart.toString());
    localStorage.setItem("token", token);
    localStorage.setItem("user_id", userId);       // raw string (e.g. "MQ==")
    localStorage.setItem("userName", userName);

    // set app-friendly numeric id (decoded) and keep raw for API calls
    authService.currentUser = {
      user_id: Number(base64ToNumber(userId)),   // numeric for UI
      api_user_id: userId,                       // raw for API
      user_name: userName,
      phone_number: "",
      email_address: null,
      status: "Active",
    };

    // UPDATE the global VARIABLES object used by legacy services:
    // store the API format your services expect (base64 without '=' padding)
    VARIABLES.USER_ID = normalizedUserId;
    VARIABLES.TOKEN = token;

    logAuth("createSession:done", {
      currentUser: authService.currentUser,
      variablesUserId: VARIABLES.USER_ID,
      variablesToken: maskToken(VARIABLES.TOKEN),
    });
  },

  checkSession: (): boolean => {
    const sessionId = localStorage.getItem("sessionId");
    const sessionStartStr = localStorage.getItem("sessionStart");
    const tokenValue = localStorage.getItem("token");
    const userIdStr = localStorage.getItem("user_id");

    logAuth("checkSession:start", {
      hasSessionId: Boolean(sessionId),
      hasSessionStart: Boolean(sessionStartStr),
      hasToken: Boolean(tokenValue),
      hasUserId: Boolean(userIdStr),
      route: typeof window !== "undefined" ? window.location.pathname : "server",
    });

    if (!sessionId || !sessionStartStr || !tokenValue) {
      logAuth("checkSession:invalid-missing-core");
      return false;
    }

    const sessionStart = Number(sessionStartStr);
    const now = Date.now();
    const sessionAge = now - sessionStart;
    logAuth("checkSession:timing", {
      sessionStart,
      now,
      sessionAge,
      sessionDuration,
      isFiniteSessionStart: Number.isFinite(sessionStart),
    });

    if (sessionAge > sessionDuration) {
      logAuth("checkSession:expired", { sessionAge, sessionDuration });
      authService.destroySession();
      return false;
    }

    const userName = localStorage.getItem("userName") ?? "";

    authService.currentUser = {
      user_id: userIdStr ? Number(base64ToNumber(userIdStr)) : 0,
      api_user_id: userIdStr ?? "",
      user_name: userName,
      phone_number: "",
      email_address: null,
      status: "Active",
    };

    // restore VARIABLES so old services keep working
    VARIABLES.USER_ID = normalizeApiUserId(userIdStr ?? "");
    VARIABLES.TOKEN = tokenValue;

    logAuth("checkSession:valid", {
      currentUser: authService.currentUser,
      variablesUserId: VARIABLES.USER_ID,
      variablesToken: maskToken(VARIABLES.TOKEN),
    });
    return true;
  },

  destroySession: () => {
    logAuth("destroySession:start", {
      hasSessionId: Boolean(localStorage.getItem("sessionId")),
      hasToken: Boolean(localStorage.getItem("token")),
      hasUserId: Boolean(localStorage.getItem("user_id")),
      route: typeof window !== "undefined" ? window.location.pathname : "server",
    });

    localStorage.removeItem("sessionId");
    localStorage.removeItem("sessionStart");
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
    localStorage.removeItem("userName");
    authService.currentUser = {} as UserModel;

    // clear global VARIABLES
    VARIABLES.USER_ID = "";
    VARIABLES.TOKEN = "";

    logAuth("destroySession:done", {
      variablesUserId: VARIABLES.USER_ID,
      variablesToken: maskToken(VARIABLES.TOKEN),
    });
  },


  login: async (username: string, password: string) => {
    try {
      logAuth("login:start", { username });
      const response = await loginService.adminLogin(username, password);

      logAuth("login:response", {
        status: response?.status,
        rcode: response?.rcode,
        hasToken: Boolean(response?.token),
        userId: response?.user_id,
        username: response?.username,
      });

      if (response && response.status === true) {
        const { user_id, username: userName, token } = response;
        logAuth("login:success", {
          userId: user_id,
          userName,
          token: maskToken(token),
        });
        await authService.createSession(user_id, userName, token);
        return true;
      }

      logAuth("login:failed", {
        status: response?.status,
        info: response?.info,
        message: response?.message,
      });
      return false;
    } catch (error) {
      console.error("[AUTH_FLOW] login:error", error);
      return false;
    }
  },

  logout: () => authService.destroySession(),
  getUser: () => authService.currentUser,
  getToken: () => localStorage.getItem("token"),
};

export default authService;
