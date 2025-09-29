import axios from "axios";
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

  save: async (payload: FormData, userId: string, token: string) => {
    const res = await axios.post(
       `${baseUrl}${API_ROUTES.EVENTS.SUBMIT}?user_id=${userId}&token=${token}`,
      payload,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Accept: "application/json",
        },
      }
    );

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
