import { loginService } from "./login_service";
import { UserModel } from "../models/user_model";

const sessionDuration = 60 * 60 * 1000; // 1 hour

const authService = {
  currentUser: {} as UserModel,

  createSession: async (userId: string, userName: string, token: string) => {
    const sessionId = `${userId}_${Date.now()}`;
    const sessionStart = Date.now();

    localStorage.setItem("sessionId", sessionId);
    localStorage.setItem("sessionStart", sessionStart.toString());
    localStorage.setItem("token", token);
    localStorage.setItem("userId", userId);
    localStorage.setItem("userName", userName);

    authService.currentUser = {
      user_id: Number(userId),
      user_name: userName,
      phone_number: "",
      email_address: null,
      status: "Active",
    };

    console.log("👤 currentUser set to:", authService.currentUser);
  },

  checkSession: (): boolean => {
    const sessionId = localStorage.getItem("sessionId");
    const sessionStartStr = localStorage.getItem("sessionStart");
    const tokenValue = localStorage.getItem("token");

    if (!sessionId || !sessionStartStr || !tokenValue) {
      return false;
    }

    const sessionStart = Number(sessionStartStr);
    const now = Date.now();

    if (now - sessionStart > sessionDuration) {
      authService.destroySession();
      return false;
    }

    const userIdStr = localStorage.getItem("userId");
    const userName = localStorage.getItem("userName") ?? "";

    authService.currentUser = {
      user_id: userIdStr ? Number(userIdStr) : 0,
      user_name: userName,
      phone_number: "",
      email_address: null,
      status: "Active",
    };

    return true;
  },

  destroySession: () => {
    localStorage.removeItem("sessionId");
    localStorage.removeItem("sessionStart");
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    authService.currentUser = {} as UserModel;
  },

  login: async (username: string, password: string) => {
    const response = await loginService.adminLogin(username, password);

    if (response && response.status === true) {
      const userId = response.user_id;
      const userName = response.username;
      const token = response.token; // 👈 get from backend response

      await authService.createSession(userId, userName, token);
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

  getToken: () => {
    return localStorage.getItem("token");
  },
};

export default authService;
