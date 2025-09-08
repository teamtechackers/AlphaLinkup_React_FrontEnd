import { loginService } from "./login_service";
import { UserModel } from "../models/user_model";

const token = "your_hardcoded_token";
const sessionDuration = 60 * 60 * 1000; // 1 hour

const authService = {
  currentUser: {} as UserModel,

  createSession: async  (userId: string, userName: string) => {
    const sessionId = `${userId}_${Date.now()}`;
    const sessionStart = Date.now();

    localStorage.setItem("session_id", sessionId);
    localStorage.setItem("session_start", sessionStart.toString());
    localStorage.setItem("token", token);
    localStorage.setItem("user_id", userId);
    localStorage.setItem("user_name", userName);

    authService.currentUser = {
      id: Number(userId),
      full_name: userName,
      mobile: "",
      email: null,
      status: 1,
    };
  },

  checkSession: (): boolean => {
    const sessionId = localStorage.getItem("session_id");
    const sessionStartStr = localStorage.getItem("session_start");
    const tokenValue = localStorage.getItem("token");

    if (!sessionId || !sessionStartStr || tokenValue !== token) {
      return false;
    }

    const sessionStart = Number(sessionStartStr);
    const now = Date.now();

    if (now - sessionStart > sessionDuration) {
      authService.destroySession();
      return false;
    }

    const userIdStr = localStorage.getItem("user_id");
    const userName = localStorage.getItem("user_name") ?? "";

    authService.currentUser = {
      id: userIdStr ? Number(userIdStr) : 0,
      full_name: userName,
      mobile: "",
      email: null,
      status: 1,
    };

    return true;
  },

  destroySession: () => {
    localStorage.removeItem("session_id");
    localStorage.removeItem("session_start");
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
    localStorage.removeItem("user_name");
    authService.currentUser = {} as UserModel;
  },

  login: async (username: string, password: string) => {
    const response = await loginService.adminLogin(username, password);
    if (response && response.status === true) {
      const userId = response.user_id;
      const userName = response.user_name;
      authService.createSession(userId, userName);
      return true;
    }
    return false;
  },

  logout: () => {
    authService.destroySession();
  },

  getUser: () => {
    return authService.currentUser;
  },
};

export default authService;
