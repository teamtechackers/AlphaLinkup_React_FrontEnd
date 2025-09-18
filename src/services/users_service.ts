import axios from "axios";
import { VARIABLES } from "../utils/strings/variables";
import { API_ROUTES } from "../utils/strings/api_routes";
import { UserModel } from "../models/user_model";
import qs from "qs"
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

  saveUser: async (payload: UserModel) => {
    const body: any = {
      user_id: VARIABLES.USER_ID,
      token: VARIABLES.TOKEN,
      full_name: payload.user_name,
      mobile: payload.phone_number,
      email: payload.email_address,
      address: payload.address,
      country_id: payload.country_id,
      state_id: payload.state_id,
      city_id: payload.city_id,
      status: payload.status || payload.status ? 1 : 0,
    }
    console.log("submitting",body)
    const params: any = {
      user_id: VARIABLES.USER_ID,
      token: VARIABLES.TOKEN,
      full_name: payload.user_name,
      mobile: payload.phone_number,
      email: payload.email_address,
      address: payload.address,
      country_id: payload.country_id,
      state_id: payload.state_id,
      city_id: payload.city_id,
      status: payload.status === "Active" || payload.status ? 1 : 0,
    };
  
    if (payload.user_id) {
      params.row_id = payload.user_id;
    }
  
    const res = await axios.post(
      `${baseUrl}${API_ROUTES.USERS.SUBMIT}`,
      qs.stringify(body),
      {
        params,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
        },
      }
    );
  
    return res.data;
  },

  deleteUser: async (userIdToDelete: number) => {
    const res = await axios.post(
      `${baseUrl}${API_ROUTES.USERS.DELETE}`,
      {},
      {
        params: {
          user_id: VARIABLES.USER_ID,
          token: VARIABLES.TOKEN,
          keys: userIdToDelete,
        },
      }
    );
    return res.data;
  },

  checkDuplicateUser: async (mobile?: string, email?: string, user_id?: number) => {
    const params: any = {
      user_id: VARIABLES.USER_ID,
      token: VARIABLES.TOKEN,
    };
    if (mobile) params.mobile = mobile;
    if (email) params.email = email;
    if (user_id) params.row_id = user_id;

    const res = await axios.post(`${baseUrl}${API_ROUTES.USERS.CHECK_DUPLICATE}`, null, { params });
    return res.data;
  },
};

export default usersService;
