import axios from "axios";
import { VARIABLES } from "../utils/strings/variables";
import { API_ROUTES } from "../utils/strings/api_routes";
import qs from "qs"
const baseUrl = process.env.REACT_APP_API_BASE_URL as string;

const foldersService = {
  getFoldersList: async () => {
    const res = await axios.get(`${baseUrl}${API_ROUTES.FOLDERS.GET}`, {
      params: { user_id: VARIABLES.USER_ID, token: VARIABLES.TOKEN },
    });
    return res.data.folders_list;
  },

  saveFolder: async (payload: { row_id?: number; name: string; status: number }) => {
    const res = await axios.post(`${baseUrl}${API_ROUTES.FOLDERS.SAVE}`, null, {
      params: {
        user_id: VARIABLES.USER_ID,
        token: VARIABLES.TOKEN,
        row_id: payload.row_id,
        name: payload.name,
        status: payload.status,
      },
    });
    return res.data;
  },

  deleteFolder: async (id: number) => {
    const res = await axios.post(`${baseUrl}${API_ROUTES.FOLDERS.DELETE}`, null, {
      params: { user_id: VARIABLES.USER_ID, token: VARIABLES.TOKEN, keys: id },
    });
    return res.data;
  },

  checkDuplicateFolder: async (name: string, id: number = 0) => {
    const body: any = {
      user_id: VARIABLES.USER_ID,
      token: VARIABLES.TOKEN,
      name,
      id,
    };

    const res = await axios.post(
      `${baseUrl}${API_ROUTES.FOLDERS.CHECK_DUPLICATE}`,
      qs.stringify(body),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    return res.data;
  },
};

export default foldersService;
