import { loginService } from './login_service';
import { UserModel } from "../models/user_model";

const token = 'your_hardcoded_token';
const sessionDuration = 60 * 60 * 1000;

const authService = {

  currentUser: {
    user_id: "",
    username: "",
    role_id: "",
    full_name: "",
  } as UserModel,

  createSession: (userId: string, userName: string) => {
    const sessionId = `${userId}_${Date.now()}`;
    localStorage.setItem('session_id', sessionId);
    localStorage.setItem('token', token);
    localStorage.setItem('user_id', userId);
    localStorage.setItem('user_name', userName);
    authService.currentUser = {
      user_id: userId,
      username: userName,
      role_id: "",
      full_name: "",
    };
    setTimeout(() => {
      authService.destroySession();
    }, sessionDuration);
  },

  checkSession: async (): Promise<boolean> => {
    const sessionId = localStorage.getItem('session_id');
    const token = localStorage.getItem('token');
    if (sessionId && token === 'your_hardcoded_token') {
      authService.currentUser = {
        user_id: localStorage.getItem('user_id') ?? '',
        username: localStorage.getItem('user_name') ?? '',
        role_id: "",
        full_name: "",
      };
      return true;
    }
    return false;
  },

  destroySession: () => {
    localStorage.removeItem('session_id');
    localStorage.removeItem('token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('user_name');
    localStorage.removeItem('full_name');
    localStorage.removeItem('role_id');
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