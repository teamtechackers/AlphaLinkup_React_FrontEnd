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

    return {
      data: res.data.jobs_list,
      recordsTotal: res.data.recordsTotal,
      recordsFiltered: res.data.recordsFiltered,
    };
  },

  save: async (payload: any) => {
    const body = qs.stringify(payload);

    const res = await axios.post(`${baseUrl}${API_ROUTES.JOBS.SUBMIT}`, body, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      params: { user_id: VARIABLES.USER_ID, token: VARIABLES.TOKEN },
    });

    return res.data;
  },

  delete: async (id: number) => {
    const res = await axios.post(`${baseUrl}${API_ROUTES.JOBS.DELETE}`, null, {
      params: { row_id: id, user_id: VARIABLES.USER_ID, token: VARIABLES.TOKEN },
    });
    return res.data;
  },
};

export default jobsService;
