import axios from "axios";
import { VARIABLES } from "../utils/strings/variables";
import { API_ROUTES } from "../utils/strings/api_routes";

const baseUrl = process.env.REACT_APP_API_BASE_URL as string;

const interestsService = {
  getInterestsList: async () => {
    const res = await axios.get(`${baseUrl}${API_ROUTES.INTERESTS.GET}`, {
      params: { user_id: VARIABLES.USER_ID, token: VARIABLES.TOKEN },
    });
    return res.data;
  },

  saveInterest: async (payload: { id: number; name: string; status: number }) => {
    const res = await axios.post(`${baseUrl}${API_ROUTES.INTERESTS.SAVE}`, null, {
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

  deleteInterest: async (id: number) => {
    // API expects `keys` param (per your Postman)
    const res = await axios.post(`${baseUrl}${API_ROUTES.INTERESTS.DELETE}`, null, {
      params: { user_id: VARIABLES.USER_ID, token: VARIABLES.TOKEN, keys: id },
    });
    return res.data;
  },
};

export default interestsService;
