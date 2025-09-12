import axios from "axios";
import { VARIABLES } from "../utils/strings/variables";
import { API_ROUTES } from "../utils/strings/api_routes";
import { EmploymentTypeModel } from "../models/employment_type_model";

const baseUrl = process.env.REACT_APP_API_BASE_URL as string;

const employmentTypeService = {
  getListAjax: async (page: number, pageSize: number) => {
    const res = await axios.get(`${baseUrl}${API_ROUTES.EMPLOYMENT_TYPE.GET_AJAX}`, {
      params: {
        user_id: VARIABLES.USER_ID,
        token: VARIABLES.TOKEN,
        start: page + 1,
        draw: page * pageSize,
        length: pageSize,
      },
    });

    const list: EmploymentTypeModel[] = (res.data?.data || []).map((row: any[]) => ({
      id: row[1],
      name: row[2],
      status: row[3]?.includes("Active") ? 1 : 0,
    }));

    return {
      rows: list,
      total: res.data?.recordsTotal ?? 0,
    };
  },

  saveOrUpdate: async (payload: { id?: number; name: string; status: number }) => {
    const res = await axios.post(`${baseUrl}${API_ROUTES.EMPLOYMENT_TYPE.SAVE}`, null, {
      params: {
        user_id: VARIABLES.USER_ID,
        token: VARIABLES.TOKEN,
        name: payload.name,
        status: payload.status,
        ...(payload.id ? { row_id: payload.id } : {}),
      },
    });
    return res.data;
  },

  delete: async (id: number) => {
    const res = await axios.post(`${baseUrl}${API_ROUTES.EMPLOYMENT_TYPE.DELETE}`, null, {
      params: { user_id: VARIABLES.USER_ID, token: VARIABLES.TOKEN, keys: id },
    });
    return res.data;
  },

  checkDuplicate: async (name: string, id?: number) => {
    const params: any = { name, user_id: VARIABLES.USER_ID, token: VARIABLES.TOKEN };
    if (id) params.id = id;
    const res = await axios.post(`${baseUrl}${API_ROUTES.EMPLOYMENT_TYPE.CHECK_DUPLICATE}`, null, { params });
    return res.data;
  },
};

export default employmentTypeService;
