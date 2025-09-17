import axios from "axios";
import { VARIABLES } from "../utils/strings/variables";
import { API_ROUTES } from "../utils/strings/api_routes";
// import { VARIABLES } from "../utils/strings/variables";
import qs from "qs";
const baseUrl = process.env.REACT_APP_API_BASE_URL as string;

const statesService = {

  getStatesAjaxList: async (page: number, pageSize: number) => {
    const start = page * pageSize;
    const length = pageSize;
    const res = await axios.get(`${baseUrl}${API_ROUTES.STATE_LIST.GET_AJAX}`, {
      params: {
        user_id: VARIABLES.USER_ID,
        token: VARIABLES.TOKEN,
        draw: 1,
        start,
        length,
      },
    });

    const rows = res.data?.data || [];

    const mapped = rows.map((r: any[]) => ({
      id: r[0],
      country_name: r[1],
      name: r[2],
      row_id: r[3],
      status: r[4]?.includes("Active") ? 1 : 0,
      country_id: extractCountryId(r[5]),
    }));

    return {
      rows: mapped,
      total: res.data?.recordsTotal ?? mapped.length,
    };
  },

  saveOrUpdateState: async (payload: {
    user_id?: string;
    token?: string;
    row_id?: number;
    country_id?: number;
    name: string;
    status?: number;
  }) => {
    const body: any = {
      user_id: payload.user_id || VARIABLES.USER_ID,
      token: payload.token || VARIABLES.TOKEN,
      row_id: payload.row_id ?? 0, // ✅ default 0 if not provided
      country_id: payload.country_id,
      name: payload.name,
      status: payload.status,
    };
    
    // ❌ don’t send `id`, only `row_id`
    // backend should decide insert (0) vs update (>0)
  
    console.log("Submitting state (form-urlencoded):", body);
  
    const res = await axios.post(
      `${baseUrl}${API_ROUTES.STATE_LIST.SAVE}`,
      qs.stringify(body),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
  
    return res.data;
  },

  deleteState: async (id: number) => {
    const res = await axios.post(`${baseUrl}${API_ROUTES.STATE_LIST.DELETE}`, null, {
      params: { user_id: VARIABLES.USER_ID, token: VARIABLES.TOKEN, keys: id },
    });
    return res.data;
  },

  checkDuplicateState: async (name: string, country_id: number, id?: number) => {
    const params: any = { name, cid: country_id, user_id: VARIABLES.USER_ID, token: VARIABLES.TOKEN };
    if (id) params.id = id;
    const res = await axios.post(`${baseUrl}${API_ROUTES.STATE_LIST.CHECK_DUPLICATE}`, null, { params });
    return res.data;
  },
};

const extractCountryId = (html: string): number => {
  const match = html?.match(/data-country="(\d+)"/);
  return match ? parseInt(match[1], 10) : 0;
};

export default statesService;
