import axios from "axios";
import { VARIABLES } from "../utils/strings/variables";
import { API_ROUTES } from "../utils/strings/api_routes";

const baseUrl = process.env.REACT_APP_API_BASE_URL as string;

const payService = {
  getPayList: async () => {
    const res = await axios.get(`${baseUrl}${API_ROUTES.PAY.GET}`, {
      params: { user_id: VARIABLES.USER_ID, token: VARIABLES.TOKEN },
    });
    return res.data;
  },

  savePay: async (payload: { id: number; name: string; status: number }) => {
    const res = await axios.post(`${baseUrl}${API_ROUTES.PAY.SAVE}`, null, {
      params: {
        user_id: VARIABLES.USER_ID,
        token: VARIABLES.TOKEN,
        id: payload.id,
        name: payload.name,
        status: payload.status,
      },
    });
    return res.data;
  },

  deletePay: async (id: number) => {
    const res = await axios.post(`${baseUrl}${API_ROUTES.PAY.DELETE}`, null, {
      params: { user_id: VARIABLES.USER_ID, token: VARIABLES.TOKEN, keys: id },
    });
    return res.data;
  },

  checkDuplicatePay: async (name: string, id?: number) => {
    const params: any = { name, user_id: VARIABLES.USER_ID, token: VARIABLES.TOKEN };
    if (id) params.id = id;
    const res = await axios.post(`${baseUrl}${API_ROUTES.PAY.CHECK_DUPLICATE}`, null, { params });
    return res.data;
  },
};

export default payService;
