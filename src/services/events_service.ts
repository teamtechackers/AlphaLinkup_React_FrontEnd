import axios from "axios";
import qs from "qs";
import { VARIABLES } from "../utils/strings/variables";
import { API_ROUTES } from "../utils/strings/api_routes";

const baseUrl = process.env.REACT_APP_API_BASE_URL as string;

const eventsService = {
    getList: async (draw = 1, start = 0, length = 10) => {
    const url = `${baseUrl}${API_ROUTES.EVENTS.GET_AJAX}`;
    const res = await axios.post(url, null, {
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

  save: async (payload: FormData, rowId?: number) => {
    if (rowId) payload.append("row_id", rowId.toString());
    const res = await axios.post(`${baseUrl}${API_ROUTES.EVENTS.SAVE}`, payload, {
      headers: { "Content-Type": "multipart/form-data" },
      params: { user_id: VARIABLES.USER_ID, token: VARIABLES.TOKEN },
    });
    return res.data;
  },

  delete: async (id: number) => {
    const res = await axios.post(`${baseUrl}${API_ROUTES.EVENTS.DELETE}`, null, {
      params: { keys: id, user_id: VARIABLES.USER_ID, token: VARIABLES.TOKEN },
    });
    return res.data;
  },
};

export default eventsService;
