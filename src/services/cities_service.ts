import axios from "axios";
import { VARIABLES } from "../utils/strings/variables";
import { API_ROUTES } from "../utils/strings/api_routes";
import { start } from "repl";
import { stringify } from "querystring";
import qs from "qs";
const baseUrl = process.env.REACT_APP_API_BASE_URL as string;

const citiesService = {
  getCitiesList: async (page: number, pageSize: number) => {
    const start = page * pageSize;
    const length = pageSize;
    const res = await axios.post(
      `${baseUrl}${API_ROUTES.CITY_LIST.GET}`,
      {}, // empty body (if backend doesn’t need POST body)
      {
        params: {
          user_id: VARIABLES.USER_ID,
          token: VARIABLES.TOKEN,
          draw: 1,
          start,
         length
        },
      }
    );
    console.log("Cities List Response:", res.data);
    return res.data;
  },
  

  saveCity: async (payload: {
    row_id: number;
    state_id: number;
    name: string;
    status: number;
  }) => {
    const body = {
      user_id: VARIABLES.USER_ID,
      token: VARIABLES.TOKEN,
      ...payload,
    };
  
    console.log("SaveCity body:", qs.stringify(body)); // Debug log
  
    const res = await axios.post(
      `${baseUrl}${API_ROUTES.CITY_LIST.SAVE}`,
      qs.stringify(body),
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        params: {
          user_id: VARIABLES.USER_ID,
          token: VARIABLES.TOKEN,
          ...payload,
        },
      }
    );
    // console.log("SaveCity raw response:", res); // Debug log
  
    console.log("SaveCity response:", res.data); // Debug log
    return res.data;
  },
  
  
  
  

  deleteCity: async (id: number) => {
   const body:any= {
      user_id: VARIABLES.USER_ID,
      token: VARIABLES.TOKEN,
      keys: id,
    }
    const res = await axios.post(
      `${baseUrl}${API_ROUTES.CITY_LIST.DELETE}`,
      qs.stringify(body),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    )
    console.log(res.data)
    return res.data;
  },

  checkDuplicateCity: async (name: string, state_id: number, id?: number) => {
    const params: any = { name, sid: state_id, user_id: VARIABLES.USER_ID, token: VARIABLES.TOKEN };
    const body: any = { name, sid: state_id, user_id: VARIABLES.USER_ID, token: VARIABLES.TOKEN };
    if (id) params.id = id;
    const res = await axios.post(`${baseUrl}${API_ROUTES.CITY_LIST.CHECK_DUPLICATE}`, qs.stringify(body),
    { headers: { "Content-Type": "application/x-www-form-urlencoded" } , 
     params }
  
  );
    return res.data;
  },
};

export default citiesService;
