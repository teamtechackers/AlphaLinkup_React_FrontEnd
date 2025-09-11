import axios from "axios";
import { VARIABLES } from "../utils/strings/variables";
import { API_ROUTES } from "../utils/strings/api_routes";

const baseUrl = process.env.REACT_APP_API_BASE_URL as string;

class GlobalService {
  static async getCountries() {
    const res = await axios.get(`${baseUrl}${API_ROUTES.API_COUNTRY_LIST}`, {
      params: {
        user_id: VARIABLES.USER_ID,
        token: VARIABLES.TOKEN,
      },
    });
    return res.data?.country_list || [];
  }

  static async getStates(countryId: number | string) {
    const res = await axios.get(`${baseUrl}${API_ROUTES.API_STATE_LIST}`, {
      params: {
        user_id: VARIABLES.USER_ID,
        token: VARIABLES.TOKEN,
        country_id: countryId,
      },
    });
    return res.data?.state_list || [];
  }

  static async getCities(stateId: number | string) {
    const res = await axios.get(`${baseUrl}${API_ROUTES.API_CITY_LIST}`, {
      params: {
        user_id: VARIABLES.USER_ID,
        token: VARIABLES.TOKEN,
        state_id: stateId,
      },
    });
    return res.data?.city_list || [];
  }

  static async getPayList() {
    const res = await axios.get(`${baseUrl}${API_ROUTES.API_PAY_LIST}`, {
      params: {
        user_id: VARIABLES.USER_ID,
        token: VARIABLES.TOKEN,
      },
    });
    return res.data?.pay_list || [];
  }

  static async getJobTypes() {
    const res = await axios.get(`${baseUrl}${API_ROUTES.API_JOB_TYPE_LIST}`, {
      params: {
        user_id: VARIABLES.USER_ID,
        token: VARIABLES.TOKEN,
      },
    });
    return res.data?.job_type_list || [];
  }
  
  static async getEventModes() {
    const res = await axios.get(`${baseUrl}${API_ROUTES.API_EVENT_MODE_LIST}`, {
      params: {
        user_id: VARIABLES.USER_ID,
        token: VARIABLES.TOKEN,
      },
    });
    return res.data?.event_mode_list || [];
  }

  // Fetch Event Types
  static async getEventTypes() {
    const res = await axios.get(`${baseUrl}${API_ROUTES.API_EVENT_TYPE_LIST}`, {
      params: {
        user_id: VARIABLES.USER_ID,
        token: VARIABLES.TOKEN,
      },
    });
    return res.data?.event_type_list || [];
  }

}

export default GlobalService;
