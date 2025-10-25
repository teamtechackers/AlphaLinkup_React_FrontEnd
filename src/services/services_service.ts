import axios from "axios";
import { VARIABLES } from "../utils/strings/variables";
import { API_ROUTES } from "../utils/strings/api_routes";

const baseUrl = process.env.REACT_APP_API_BASE_URL as string;

const servicesService = {
  getList: async (service_id: string) => {
    const res = await axios.get(`${baseUrl}${API_ROUTES.GLOBAL_API.API_ALL_SERVICES_LIST}`, {
      params: { user_id: VARIABLES.USER_ID, token: VARIABLES.TOKEN, service_id },
    });
    return res.data;
  }
};

export default servicesService;
