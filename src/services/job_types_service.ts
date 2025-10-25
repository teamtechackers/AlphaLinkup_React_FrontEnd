import axios from "axios";
import { VARIABLES } from "../utils/strings/variables";
import { API_ROUTES } from "../utils/strings/api_routes";

const baseUrl = process.env.REACT_APP_API_BASE_URL as string;

const jobTypesService = {
  getJobTypesList: async (draw = 1, start = 0, length = 10) => {
    const res = await axios.get(`${baseUrl}${API_ROUTES.JOB_TYPE.GET_AJAX}`, {
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

  saveJobType: async (payload: { row_id?: number; name: string; status: number }) => {
    const res = await axios.post(`${baseUrl}${API_ROUTES.JOB_TYPE.SUBMIT}`, null, {
      params: {
        user_id: VARIABLES.USER_ID,
        token: VARIABLES.TOKEN,
        row_id: payload.row_id,
        name: payload.name,
        status: payload.status,
      },
    });
    return res.data;
  },

  deleteJobType: async (id: number) => {
    const res = await axios.post(`${baseUrl}${API_ROUTES.JOB_TYPE.DELETE}`, null, {
      params: { user_id: VARIABLES.USER_ID, token: VARIABLES.TOKEN, keys: id },
    });
    return res.data;
  },

  checkDuplicateJobType: async (name: string, id?: number) => {
    const params: any = { name, user_id: VARIABLES.USER_ID, token: VARIABLES.TOKEN };
    if (id) params.id = id;
    const res = await axios.post(`${baseUrl}${API_ROUTES.JOB_TYPE.CHECK_DUPLICATE}`, null, { params });
    return res.data;
  },
};

export default jobTypesService;
