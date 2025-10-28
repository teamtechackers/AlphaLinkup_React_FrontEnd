import axios from "axios";
import { API_ROUTES } from "../utils/strings/api_routes";
import { toBase64 } from "../utils/helpers/hasher";
import authService from "./auth_service";

const baseUrl = process.env.REACT_APP_API_BASE_URL;

const dashboardService = {
  getDashboardData: async (userIdPlain?: number) => {

    const currentUser = authService.getUser();
    const token = authService.getToken();

    const userdB64 = currentUser.user_id
      ? toBase64(String(currentUser.user_id)).replace(/=+$/, '')
      : undefined;

    const response = await axios.get(`${baseUrl}${API_ROUTES.DASHBOARD}`, {
      params: {
        user_id: userdB64,
        token,
      },
    });

    return response.data;
  },
};

export default dashboardService;
