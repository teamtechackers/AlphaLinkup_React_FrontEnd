import axios from "axios";
import qs from "qs";
import { VARIABLES } from "../utils/strings/variables";
import { API_ROUTES } from "../utils/strings/api_routes";

const baseUrl = process.env.REACT_APP_API_BASE_URL as string;

const jobsService = {
  getList: async (draw = 1, start = 0, length = 10) => {
    const res = await axios.get(`${baseUrl}${API_ROUTES.JOBS.GET_AJAX}`, {
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
    id?: number;
    user_id: number;
    full_name: string;
    job_title: string;
    company_name: string;
    country_id: number;
    state_id: number;
    city_id: number;
    address: string;
    job_lat: number;
    job_lng: number;
    job_type_id: number;
    pay_id: number;
    job_description: string;
    status: number;
  }) => {
    const body = qs.stringify(payload);

    const res = await axios.post(`${baseUrl}${API_ROUTES.JOBS.SAVE}`, body, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      params: { user_id: VARIABLES.USER_ID, token: VARIABLES.TOKEN },
    });

    return res.data;
  },

  delete: async (id: number) => {
    const res = await axios.post(`${baseUrl}${API_ROUTES.JOBS.DELETE}`, null, {
      params: { keys: id, user_id: VARIABLES.USER_ID, token: VARIABLES.TOKEN },
    });
    return res.data;
  },
};

export default jobsService;
