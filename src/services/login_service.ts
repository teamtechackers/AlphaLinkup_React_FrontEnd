import axios from 'axios';
import { API_ROUTES } from "../utils/strings/api_routes";

const baseUrl = process.env.REACT_APP_API_BASE_URL as string;

export const loginService = {
  adminLogin: async (username: string, password: string) => {
    const res = await axios.get(`${baseUrl}${API_ROUTES.LOGIN}`, {
      params: { username, password: password },
    });
    return res.data;
  },

  adminLogout: async () => {
    const res = await axios.get(`${baseUrl}${API_ROUTES.LOGOUT}`);
    return res.data;
  },
};