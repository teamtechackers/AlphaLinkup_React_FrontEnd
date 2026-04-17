import axios from "./http_client";
import { API_ROUTES } from "../utils/strings/api_routes";
import { toBase64 } from "../utils/helpers/hasher";
import authService from "./auth_service";

const baseUrl = process.env.REACT_APP_API_BASE_URL;
const DASHBOARD_DEBUG_PREFIX = "[DASHBOARD_FLOW]";

const maskToken = (token?: string | null): string => {
  if (!token) return "(empty)";
  if (token.length <= 10) return `${token.slice(0, 2)}***${token.slice(-2)}`;
  return `${token.slice(0, 6)}...${token.slice(-4)}`;
};

const logDashboard = (...args: unknown[]) => {
  console.log(DASHBOARD_DEBUG_PREFIX, ...args);
};

const dashboardService = {
  getDashboardData: async (userIdPlain?: number) => {

    const currentUser = authService.getUser();
    const token = authService.getToken();

    const userdB64 = currentUser.user_id
      ? toBase64(String(currentUser.user_id)).replace(/=+$/, '')
      : undefined;

    logDashboard("request:start", {
      userIdPlain,
      currentUser,
      computedUserId: userdB64,
      token: maskToken(token),
    });

    const response = await axios.get(`${baseUrl}${API_ROUTES.DASHBOARD}`, {
      params: {
        user_id: userdB64,
        token,
      },
    });

    logDashboard("request:response", {
      status: response?.data?.status,
      rcode: response?.data?.rcode,
      keys: response?.data && typeof response.data === "object"
        ? Object.keys(response.data as Record<string, unknown>)
        : [],
    });

    return response.data;
  },
};

export default dashboardService;

