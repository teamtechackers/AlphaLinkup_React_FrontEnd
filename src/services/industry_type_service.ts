import axios from "axios";
import { VARIABLES } from "../utils/strings/variables";
import { API_ROUTES } from "../utils/strings/api_routes";
import qs from "qs"
const baseUrl = process.env.REACT_APP_API_BASE_URL as string;

const industryTypeService = {
  getIndustryTypesList: async () => {
    const res = await axios.get(`${baseUrl}${API_ROUTES.INDUSTRY_TYPE.GET}`, {
      params: { user_id: VARIABLES.USER_ID, token: VARIABLES.TOKEN },
    });
    return res.data;
  },

  saveIndustryType: async (payload: { id: number; name: string; status: number }) => {
    const res = await axios.post(`${baseUrl}${API_ROUTES.INDUSTRY_TYPE.SAVE}`, null, {
      params: {
        user_id: VARIABLES.USER_ID,
        token: VARIABLES.TOKEN,
        id: payload.id,
        row_id: payload.id,
        name: payload.name,
        status: payload.status,
      },
    });
    return res.data;
  },

  deleteIndustryType: async (keys: string) => {
    const res = await axios.post(`${baseUrl}${API_ROUTES.INDUSTRY_TYPE.DELETE}`, null, {
      params: { user_id: VARIABLES.USER_ID, token: VARIABLES.TOKEN, keys },
    });
    return res.data;
  },

  checkDuplicateIndustryType: async (name: string, id?: number) => {
    const params: any = { name, user_id: VARIABLES.USER_ID, token: VARIABLES.TOKEN };
    const body: any = { name, user_id: VARIABLES.USER_ID, token: VARIABLES.TOKEN };
    if (id) params.id = id;
    const res = await axios.post(`${baseUrl}${API_ROUTES.INDUSTRY_TYPE.CHECK_DUPLICATE}`, qs.stringify(body), {  headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },params });
    return res.data;
  },
};

export default industryTypeService;
