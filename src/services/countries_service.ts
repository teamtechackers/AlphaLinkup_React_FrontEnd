import axios from "axios";
import { VARIABLES } from "../utils/strings/variables";
import { API_ROUTES } from "../utils/strings/api_routes";

const baseUrl = process.env.REACT_APP_API_BASE_URL as string;

const countriesService = {
  
  getCountriesList: async (draw: number, start: number, length: number) => {
    const res = await axios.get(`${baseUrl}${API_ROUTES.COUNTRY_LIST.GET_AJAX}`, {
      params: { 
        user_id: VARIABLES.USER_ID, 
        token: VARIABLES.TOKEN,
        draw,
        start,
        length
      },
    });
    return res.data;
  },

  saveCountry: async (payload: { id: number; name: string; status: number }) => {
    const res = await axios.post(`${baseUrl}${API_ROUTES.COUNTRY_LIST.SAVE}`, null, { 
      params: {
        user_id: VARIABLES.USER_ID,
        token: VARIABLES.TOKEN,
        id: payload.id,
        name: payload.name,
        status: payload.status,
      },
    });
    return res.data;
  },
  
  deleteCountry: async (id: number) => {
    const res = await axios.get(`${baseUrl}${API_ROUTES.COUNTRY_LIST.DELETE}/${id}`, {
      params: { user_id: VARIABLES.USER_ID, token: VARIABLES.TOKEN },
    });
    return res.data;
  },
  
  editCountry: async (id: number) => {
    const res = await axios.get(`${baseUrl}${API_ROUTES.COUNTRY_LIST.EDIT}/${id}`, {
      params: { user_id: VARIABLES.USER_ID, token: VARIABLES.TOKEN },
    });
    return res.data;
  },

  checkDuplicateCountry: async (name: string, id?: number) => {
    const params: any = { name, user_id: VARIABLES.USER_ID, token: VARIABLES.TOKEN };
    if (id) params.id = id;
    const res = await axios.get(`${baseUrl}${API_ROUTES.COUNTRY_LIST.CHECK_DUPLICATE}`,{ params });
    return res.data;
  },
};

export default countriesService;
