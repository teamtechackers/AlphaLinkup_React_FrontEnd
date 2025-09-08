// services/investors_service.ts
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

  save: async (payload: any) => {
    const body = qs.stringify({
      user_id: payload.user_id,
      full_name: payload.full_name,
      name: payload.name,
      country_id: payload.country_id,
      state_id: payload.state_id,
      city_id: payload.city_id,
      fund_size_id: payload.fund_size_id,
      linkedin_url: payload.linkedin_url,
      bio: payload.bio,
      profile: payload.profile,
      investment_stage: payload.investment_stage,
      availability: payload.availability,
      meeting_city: payload.meeting_city,
      countries_to_invest: payload.countries_to_invest,
      investment_industry: payload.investment_industry,
      language: payload.language,
      approval_status: payload.approval_status,
      status: payload.status,
    });

    const res = await axios.post(`${baseUrl}${API_ROUTES.INVESTORS.SAVE}`, body, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      params: {
        user_id: VARIABLES.USER_ID,
        token: VARIABLES.TOKEN,
      },
    });

    return res.data;
},

  view: async (id: number) => {
    const res = await axios.post(`${baseUrl}${API_ROUTES.INVESTORS.VIEW}`, { keys: id, user_id: VARIABLES.USER_ID, token: VARIABLES.TOKEN });
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
