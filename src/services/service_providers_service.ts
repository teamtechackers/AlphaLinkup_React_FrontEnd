import axios from "axios";
import { VARIABLES } from "../utils/strings/variables";
import { API_ROUTES } from "../utils/strings/api_routes";

const baseUrl = process.env.REACT_APP_API_BASE_URL as string;

const serviceProvidersService = {
  getList: async (draw = 1, start = 0, length = 10) => {
    const res = await axios.post(`${baseUrl}${API_ROUTES.SERVICE_PROVIDERS.GET_AJAX}`, null, {
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

  save: async (payload: {
    sp_id?: number;
    sp_user_id: number;
    description: string;
    country_id: number;
    state_id: number;
    city_id: number;
    avg_sp_rating: number;
    approval_status: number;
    status: number;
  }) => {
    const params = {
      user_id: VARIABLES.USER_ID,
      token: VARIABLES.TOKEN,
      sp_user_id: payload.sp_user_id,
      description: payload.description,
      country_id: payload.country_id,
      state_id: payload.state_id,
      city_id: payload.city_id,
      avg_sp_rating: payload.avg_sp_rating,
      approval_status: payload.approval_status,
      status: payload.status,
      row_id: payload.sp_id,
    };

    const res = await axios.post(`${baseUrl}${API_ROUTES.SERVICE_PROVIDERS.SUBMIT}`, null, { params });
    return res.data;
  },

  delete: async (id: number) => {
    const res = await axios.post(`${baseUrl}${API_ROUTES.SERVICE_PROVIDERS.DELETE}`, null, {
      params: { keys: id, user_id: VARIABLES.USER_ID, token: VARIABLES.TOKEN },
    });
    return res.data;
  },
};

export default serviceProvidersService;
