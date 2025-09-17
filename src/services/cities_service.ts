import axios from "axios";
import { VARIABLES } from "../utils/strings/variables";
import { API_ROUTES } from "../utils/strings/api_routes";

const baseUrl = process.env.REACT_APP_API_BASE_URL as string;

const citiesService = {
  getCitiesList: async (page: number, pageSize: number) => {
    const res = await axios.get(`${baseUrl}${API_ROUTES.CITY_LIST.GET}`, {
      params: { user_id: VARIABLES.USER_ID, token: VARIABLES.TOKEN },
    });
    return res.data;
  },

  saveCity: async (payload: { id?: number; state_id: number; name: string; status: number }) => {
    const res = await axios.post(`${baseUrl}${API_ROUTES.CITY_LIST.SAVE}`, null, {
      params: {
        user_id: VARIABLES.USER_ID,
        token: VARIABLES.TOKEN,
        state_id: payload.state_id,
        name: payload.name,
        status: payload.status,
        id: payload.id ?? 0,
      },
    });
    return res.data;
  },

  deleteCity: async (id: number) => {
    const res = await axios.post(`${baseUrl}${API_ROUTES.CITY_LIST.DELETE}`, null, {
      params: {
        user_id: VARIABLES.USER_ID,
        token: VARIABLES.TOKEN,
        keys: id,
      },
    });
    return res.data;
  },

  checkDuplicateCity: async (name: string, state_id: number, id?: number) => {
    const params: any = { name, sid: state_id, user_id: VARIABLES.USER_ID, token: VARIABLES.TOKEN };
    if (id) params.id = id;
    const res = await axios.post(`${baseUrl}${API_ROUTES.CITY_LIST.CHECK_DUPLICATE}`, null, { params });
    return res.data;
  },
};

export default citiesService;
