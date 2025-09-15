import axios from "axios";
import { VARIABLES } from "../utils/strings/variables";
import { API_ROUTES } from "../utils/strings/api_routes";

const baseUrl = process.env.REACT_APP_API_BASE_URL as string;

const eventModesService = {
  getEventModesList: async (draw = 1, start = 0, length = 10) => {
    const res = await axios.get(`${baseUrl}${API_ROUTES.EVENT_MODES.GET_AJAX}`, {
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

  saveEventMode: async (payload: { id?: number; name: string; status: number }) => {
    const params: any = {
      user_id: VARIABLES.USER_ID,
      token: VARIABLES.TOKEN,
      name: payload.name,
      status: payload.status,
    };
    const body: any = {
      user_id: VARIABLES.USER_ID,
      token: VARIABLES.TOKEN,
      name: payload.name,
      status: payload.status,
      row_id:payload.id
    };
    if (payload.id && payload.id > 0) {
      params.row_id = payload.id;
    }

    const res = await axios.post(`${baseUrl}${API_ROUTES.EVENT_MODES.SUBMIT}`,body,{ params });
    return res.data;
  },
// cosnt form/
  deleteEventMode: async (id: number) => {
    const body = {
      user_id: VARIABLES.USER_ID,
      token: VARIABLES.TOKEN,
      keys: id,
    };
    const res = await axios.post(`${baseUrl}${API_ROUTES.EVENT_MODES.DELETE}`,body, {
      params: {
        user_id: VARIABLES.USER_ID,
        token: VARIABLES.TOKEN,
        // keys: id,
      },
      
    });
    return res.data;
  },

  checkDuplicateEventMode: async (name: string, id?: number) => {
    const params: any = { name, user_id: VARIABLES.USER_ID, token: VARIABLES.TOKEN };
    if (id) params.id = id;
    const res = await axios.post(`${baseUrl}${API_ROUTES.EVENT_MODES.CHECK_DUPLICATE}`, null, { params });
    return res.data;
  },
};

export default eventModesService;
