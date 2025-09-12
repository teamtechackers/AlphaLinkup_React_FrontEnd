import axios from "axios";
import { API_ROUTES } from "../utils/strings/api_routes";
import { VARIABLES } from "../utils/strings/variables";
import toBase64 from "../utils/helpers/hasher";
import authService from "./auth_service";

const baseUrl = process.env.REACT_APP_API_BASE_URL;

const dashboardService = {
  getDashboardData: async (userIdPlain?: number) => {

    const currentUser = authService.getUser();

    const userIdSource = userIdPlain || currentUser.user_id;

    const userdB64 = userIdSource ? toBase64(String(userIdSource)).replace(/=+$/, '') : undefined;

    const response = await axios.get(`${baseUrl}${API_ROUTES.DASHBOARD}`, {
      params: {
        user_id: userdB64,
        token: VARIABLES.TOKEN,
      },
    });

    return response.data;
  },
};

export default dashboardService;
