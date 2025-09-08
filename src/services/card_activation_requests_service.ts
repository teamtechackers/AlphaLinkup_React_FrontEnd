import axios from "axios";
import qs from "qs";
import { VARIABLES } from "../utils/strings/variables";
import { API_ROUTES } from "../utils/strings/api_routes";

const baseUrl = process.env.REACT_APP_API_BASE_URL as string;

const cardActivationRequestsService = {
  getList: async (draw = 1, start = 0, length = 10) => {
    const res = await axios.get(`${baseUrl}${API_ROUTES.CARD_ACTIVATION.GET_AJAX}`, {
      params: {
        user_id: VARIABLES.USER_ID,
        token: VARIABLES.TOKEN,
        draw,
        start,
        length,
      },
    });
    return res.data;
  },

    save: async (payload: { id?: number; sp_user_id: number; description: string; status: number }) => {
    const body = qs.stringify({
        user_id: payload.sp_user_id,
        description: payload.description,
        status: payload.status,
    });

    const res = await axios.post(
        `${baseUrl}${API_ROUTES.CARD_ACTIVATION.SAVE}`,
        body,
        {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        params: { user_id: VARIABLES.USER_ID, token: VARIABLES.TOKEN },
        }
    );

    return res.data;
    },

  delete: async (id: number) => {
    const res = await axios.post(`${baseUrl}${API_ROUTES.CARD_ACTIVATION.DELETE}`, null, {
      params: { keys: id, user_id: VARIABLES.USER_ID, token: VARIABLES.TOKEN },
    });
    return res.data;
  },
};

export default cardActivationRequestsService;
