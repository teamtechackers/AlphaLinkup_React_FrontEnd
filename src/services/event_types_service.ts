import axios from "axios";
import { VARIABLES } from "../utils/strings/variables";
import { API_ROUTES } from "../utils/strings/api_routes";
import qs from'qs'
const baseUrl = process.env.REACT_APP_API_BASE_URL as string;

const eventTypesService = {
  getEventTypesList: async (draw = 1, start = 0, length = 10) => {
    const res = await axios.get(`${baseUrl}${API_ROUTES.EVENT_TYPE.GET_AJAX}`, {
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

  // saveEventType: async (payload: { id?: number; name: string; status: number }) => {
  //   const params: any = {
  //     user_id: VARIABLES.USER_ID,
  //     token: VARIABLES.TOKEN,
  //     name: payload.name,
  //     status: payload.status,
  //   };
  //   // if (payload.id && payload.id > 0) params.id = payload.id;

  //   // const res = await axios.post(`${baseUrl}${API_ROUTES.EVENT_TYPE.SUBMIT}`, null, { params });
  //   const res = await axios.post(`${baseUrl}${API_ROUTES.EVENT_TYPE.SUBMIT}`, null, { params });
  //   return res.data;
  // },
  saveEventType: async (payload: { id?: number; name: string; status: number }) => {
    const body: any = {
      user_id: VARIABLES.USER_ID,
      token: VARIABLES.TOKEN,
      name: payload.name,
      status: payload.status,
      row_id: payload.id,
    };
    const params: any = {
      user_id: VARIABLES.USER_ID,
      token: VARIABLES.TOKEN,
      name: payload.name,
      status: payload.status,
      // row_id: payload.id,
    };
    if (payload.id && payload.id > 0) {
      body.id = payload.id;
    }
  
    const res = await axios.post(
      `${baseUrl}${API_ROUTES.EVENT_TYPE.SUBMIT}`,
     qs.stringify( body),{
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }, // 👈 body is here now
    );
  
    return res.data;
  },
  
  deleteEventType: async (id: number) => {
    const  body:any= {
      user_id: VARIABLES.USER_ID,
      token: VARIABLES.TOKEN,
      keys: id,
    }
    const res = await axios.post(`${baseUrl}${API_ROUTES.EVENT_TYPE.DELETE}`, qs.stringify(body), {
    });
    return res.data;
  },

  checkDuplicateEventType: async (name: string, id?: number) => {
    const body: any = { name, user_id: VARIABLES.USER_ID, token: VARIABLES.TOKEN };
    if (id) body.id = id;
    const res = await axios.post(`${baseUrl}${API_ROUTES.EVENT_TYPE.CHECK_DUPLICATE}`, qs.stringify(body), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      }
     });
    return res.data;
  },
};

export default eventTypesService;
