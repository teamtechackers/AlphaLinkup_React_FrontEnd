import { loginService } from "./login_service";
import { UserModel } from "../models/user_model";
import { base64ToNumber } from "../utils/helpers/hasher"; // if you use this
import { normalizeApiUserId } from "../utils/helpers/api_id";
import { VARIABLES } from "../utils/strings/variables";

const sessionDuration = 60 * 60 * 1000; // 1 hour

const authService = {
  currentUser: {} as UserModel & { api_user_id?: string },

  createSession: async (userId: string, userName: string, token: string) => {
    const sessionId = `${userId}_${Date.now()}`;
    const sessionStart = Date.now();

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
    VARIABLES.USER_ID = normalizeApiUserId(userId);
    VARIABLES.TOKEN = token;

    console.log("👤 Current User Set:", authService.currentUser);
    console.log("🔑 Token Set:", token);
    console.log("🔧 VARIABLES updated:", VARIABLES);
  },

  checkSession: (): boolean => {
    const sessionId = localStorage.getItem("sessionId");
    const sessionStartStr = localStorage.getItem("sessionStart");
    const tokenValue = localStorage.getItem("token");

    if (!sessionId || !sessionStartStr || !tokenValue) return false;

    const sessionStart = Number(sessionStartStr);
    const now = Date.now();
    if (now - sessionStart > sessionDuration) {
      authService.destroySession();
      return false;
    }

    const userIdStr = localStorage.getItem("user_id"); // raw from backend, e.g. "MQ=="
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

    console.log("🔁 Session restored. VARIABLES:", VARIABLES);
    return true;
  },

  destroySession: () => {
    localStorage.removeItem("sessionId");
    localStorage.removeItem("sessionStart");
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
    localStorage.removeItem("userName");
    authService.currentUser = {} as UserModel;

    // clear global VARIABLES
    VARIABLES.USER_ID = "";
    VARIABLES.TOKEN = "";
    console.log("🔒 Session destroyed. VARIABLES cleared.");
  },


  login: async (username: string, password: string) => {
    try {
      const response = await loginService.adminLogin(username, password);
      console.log("📥 Login Response:", response);

      if (response && response.status === true) {
        const { user_id, username: userName, token } = response;
        console.log("👤 Logging in User:", { user_id, userName, token });
        await authService.createSession(user_id, userName, token);
        return true;
      }

      console.warn("⚠️ Login failed:", response);
      return false;
    } catch (error) {
      console.error("❌ Login Error:", error);
      return false;
    }
  },

  logout: () => authService.destroySession(),
  getUser: () => authService.currentUser,
  getToken: () => localStorage.getItem("token"),
};

export default authService;
