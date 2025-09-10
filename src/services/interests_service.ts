import axios from "axios";
import { VARIABLES } from "../utils/strings/variables";
import { API_ROUTES } from "../utils/strings/api_routes";

const baseUrl = process.env.REACT_APP_API_BASE_URL as string;

const interestsService = {
  getInterestsList: async (start: number, length: number, draw: number) => {
    const res = await axios.get(`${baseUrl}${API_ROUTES.INTERESTS.GET_AJAX}`, {
      params: {
        user_id: VARIABLES.USER_ID,
        token: VARIABLES.TOKEN,
        start,
        length,
        draw,
      },
    });
    return res.data;
  },

  saveInterest: async (payload: { id: number; name: string; status: number }) => {
    const res = await axios.post(`${baseUrl}${API_ROUTES.INTERESTS.SAVE}`, null, {
      params: {
        user_id: VARIABLES.USER_ID,
        token: VARIABLES.TOKEN,
        row_id: payload.id > 0 ? payload.id : undefined,
        name: payload.name,
        status: payload.status,
      },
    });
    return res.data;
  },

  deleteInterest: async (id: number) => {
    const res = await axios.post(`${baseUrl}${API_ROUTES.INTERESTS.DELETE}`, null, {
      params: { user_id: VARIABLES.USER_ID, token: VARIABLES.TOKEN, keys: id },
    });
    return res.data;
  },
};

export default interestsService;
