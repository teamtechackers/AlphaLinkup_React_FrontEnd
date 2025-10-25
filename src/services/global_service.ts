import axios from "axios";
import { VARIABLES } from "../utils/strings/variables";
import { API_ROUTES } from "../utils/strings/api_routes";

const baseUrl = process.env.REACT_APP_API_BASE_URL as string;

class GlobalService {
  static async getCountries() {
    const res = await axios.get(`${baseUrl}${API_ROUTES.GLOBAL_API.API_COUNTRY_LIST}`, {
      params: {
        user_id: VARIABLES.USER_ID,
        token: VARIABLES.TOKEN,
      },
    });
    return res.data?.country_list || [];
  }
  static async getStates(countryId: number | string) {
    try {
      const res = await axios.get(`${baseUrl}${API_ROUTES.GLOBAL_API.API_STATE_LIST}`, {
        params: {
          user_id: VARIABLES.USER_ID,
          token: VARIABLES.TOKEN,
          country_id: Number(countryId), // force number
        },
      });
      // console.log("States API raw response:", res.data);
      return res.data?.state_list || [];
    } catch (err) {
      console.error("Error fetching states", err);
      return [];
    }
  }
  
  static async getCities(stateId: number | string) {
    try {
      const res = await axios.get(`${baseUrl}${API_ROUTES.GLOBAL_API.API_CITY_LIST}`, {
        params: {
          user_id: VARIABLES.USER_ID,
          token: VARIABLES.TOKEN,
          state_id: Number(stateId), // force number
        },
      });  
      // adjust depending on actual response structure
      return res.data?.city_list || res.data?.data?.city_list || res.data?.cities || [];
    } catch (err) {
      console.error("Error fetching cities", err);
      return [];
    }
  }
  

  static async getPayList() {
    const res = await axios.get(`${baseUrl}${API_ROUTES.GLOBAL_API.API_PAY_LIST}`, {
      params: {
        user_id: VARIABLES.USER_ID,
        token: VARIABLES.TOKEN,
      },
    });
    return res.data?.pay_list || [];
  }

  static async getJobTypes() {
    const res = await axios.get(`${baseUrl}${API_ROUTES.GLOBAL_API.API_JOB_TYPE_LIST}`, {
      params: {
        user_id: VARIABLES.USER_ID,
        token: VARIABLES.TOKEN,
      },
    });
    return res.data?.job_type_list || [];
  }
  
  static async getEventModes() {
    const res = await axios.get(`${baseUrl}${API_ROUTES.GLOBAL_API.API_EVENT_MODE_LIST}`, {
      params: {
        user_id: VARIABLES.USER_ID,
        token: VARIABLES.TOKEN,
      },
    });
    return res.data?.event_mode_list || [];
  }

  static async getEventTypes() {
    const res = await axios.get(`${baseUrl}${API_ROUTES.GLOBAL_API.API_EVENT_TYPE_LIST}`, {
      params: {
        user_id: VARIABLES.USER_ID,
        token: VARIABLES.TOKEN,
      },
    });
    return res.data?.event_type_list || [];
  }

    static async getEmploymentTypes() {
    const res = await axios.get(`${baseUrl}${API_ROUTES.GLOBAL_API.API_EMPLOYMENT_TYPE_LIST}`, {
      params: {
        user_id: VARIABLES.USER_ID,
        token: VARIABLES.TOKEN,
      },
    });
    return res.data?.employment_type_list || [];
  }

  static async getUsers() {
    const res = await axios.get(`${baseUrl}${API_ROUTES.GLOBAL_API.API_USER_LIST}`, {
      params: {
        user_id: VARIABLES.USER_ID,
        token: VARIABLES.TOKEN,
      },
    });
    return res.data?.user_list || [];
  }

    static async getIndustryTypes() {
    const res = await axios.post(
      `${baseUrl}${API_ROUTES.GLOBAL_API.API_INDUSTRY_TYPE_LIST}`,
      {},
      {
        params: {
          user_id: VARIABLES.USER_ID,
          token: VARIABLES.TOKEN,
        },
      }
    );
    return res.data?.industry_type_list || [];
  }

  static async getFundSizes() {
    try {
      const res = await axios.get(`${baseUrl}${API_ROUTES.GLOBAL_API.API_FUND_SIZE_LIST}`, {
        params: {
          user_id: VARIABLES.USER_ID,
          token: VARIABLES.TOKEN,
        },
      });
      return res.data?.fund_size_list || [];
    } catch (err) {
      console.error("Error fetching fund sizes", err);
      return [];
    }
  }

}

export default GlobalService;
