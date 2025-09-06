import axios from "axios";
import { VARIABLES } from "../utils/strings/variables";
import { API_ROUTES } from "../utils/strings/api_routes";

const baseUrl = process.env.REACT_APP_API_BASE_URL as string;

const statesService = {

  getStatesAjaxList: async () => {
    const res = await axios.get(`${baseUrl}${API_ROUTES.STATE_LIST.GET_AJAX}`, {
      params: { user_id: VARIABLES.USER_ID, token: VARIABLES.TOKEN },
    });

    const rows = res.data?.data || [];

    return rows.map((r: any[]) => ({
      id: r[0],
      country_name: r[1],
      name: r[2],
      status: r[3]?.includes("Active") ? 1 : 0,
      country_id: extractCountryId(r[4]),
    }));
  },

  // services/states_service.ts
  saveOrUpdateState: async (payload: {
    id?: number;          // our local row id
    country_id?: number;
    name: string;
    status?: number;
  }) => {
    const params: any = {
      user_id: VARIABLES.USER_ID,
      token: VARIABLES.TOKEN,
      name: payload.name,
    };

    if (payload.country_id && payload.country_id > 0) {
      params.country_id = payload.country_id;
    }

    if (typeof payload.status !== "undefined") {
      params.status = payload.status;
    }

    // ✅ include row_id only when updating
    if (payload.id && payload.id > 0) {
      params.row_id = payload.id;
    }

    console.log("Submitting state:", params); // debug

    const res = await axios.post(
      `${baseUrl}${API_ROUTES.STATE_LIST.SAVE}`,
      null,
      { params }
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
