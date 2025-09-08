import axios from "axios";
import { VARIABLES } from "../utils/strings/variables";
import { API_ROUTES } from "../utils/strings/api_routes";

const baseUrl = process.env.REACT_APP_API_BASE_URL as string;

const usersService = {
  getUsersList: async (draw = 1, start = 0, length = 10) => {
    const res = await axios.post(`${baseUrl}${API_ROUTES.USERS.GET_AJAX}`, null, {
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

  // saveUser handles both create and update:
  saveUser: async (payload: {
    id?: number;
    full_name?: string;
    mobile?: string;
    email?: string;
    address?: string;
    country_id?: number;
    state_id?: number;
    city_id?: number;
    status?: number;
  }) => {
    // if id present -> call edit_users (keys param)
    const commonParams: any = {
      user_id: VARIABLES.USER_ID,
      token: VARIABLES.TOKEN,
      full_name: payload.full_name,
      mobile: payload.mobile,
      email: payload.email,
      address: payload.address,
      country_id: payload.country_id,
      state_id: payload.state_id,
      city_id: payload.city_id,
      status: payload.status,
    };

    if (payload.id && payload.id > 0) {
      // update
      const params = { ...commonParams, keys: payload.id };
      const res = await axios.post(`${baseUrl}${API_ROUTES.USERS.EDIT}`, null, { params });
      return res.data;
    } else {
      // create
      const params = { ...commonParams };
      const res = await axios.post(`${baseUrl}${API_ROUTES.USERS.SAVE}`, null, { params });
      return res.data;
    }
  },

  deleteUser: async (id: number) => {
    const res = await axios.post(`${baseUrl}${API_ROUTES.USERS.DELETE}`, null, {
      params: { keys: id, user_id: VARIABLES.USER_ID, token: VARIABLES.TOKEN },
    });
    return res.data;
  },

  checkDuplicateUser: async (mobile?: string, email?: string, id?: number) => {
    const params: any = { user_id: VARIABLES.USER_ID, token: VARIABLES.TOKEN };
    if (mobile) params.mobile = mobile;
    if (email) params.email = email;
    if (id) params.keys = id;
    const res = await axios.post(`${baseUrl}${API_ROUTES.USERS.CHECK_DUPLICATE}`, null, { params });
    return res.data;
  },
};

export default usersService;
