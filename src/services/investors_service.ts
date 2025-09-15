import axios from "axios";
import qs from "qs";
import { VARIABLES } from "../utils/strings/variables";
import { API_ROUTES } from "../utils/strings/api_routes";

const baseUrl = process.env.REACT_APP_API_BASE_URL as string;

const investorsService = {
  getList: async (draw = 1, start = 0, length = 10) => {
    const res = await axios.get(`${baseUrl}${API_ROUTES.INVESTORS.GET_AJAX}`, {
      params: { user_id: VARIABLES.USER_ID, token: VARIABLES.TOKEN, draw, start, length },
    });
    return res.data;
  },

  save: async (formData: FormData) => {
    const res = await axios.post(
      `${baseUrl}${API_ROUTES.INVESTORS.SUBMIT}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        params: {
          user_id: VARIABLES.USER_ID,
          token: VARIABLES.TOKEN,
        },
      }
    );
    return res.data;
  },

  delete: async (id: number) => {
    const res = await axios.post(`${baseUrl}${API_ROUTES.INVESTORS.DELETE}`, null, {
      params: { keys: id, user_id: VARIABLES.USER_ID, token: VARIABLES.TOKEN },
    });
    return res.data;
  },
};

export default investorsService;
