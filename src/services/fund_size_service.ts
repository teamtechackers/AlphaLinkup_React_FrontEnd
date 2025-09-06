import axios from "axios";
import { VARIABLES } from "../utils/strings/variables";
import { API_ROUTES } from "../utils/strings/api_routes";

const baseUrl = process.env.REACT_APP_API_BASE_URL as string;

const fundSizeService = {

    getFundSizeList: async () => {
        const res = await axios.get(`${baseUrl}${API_ROUTES.FUND_SIZE.GET}`, {
            params: { user_id: VARIABLES.USER_ID, token: VARIABLES.TOKEN },
        });
        return res.data.fund_size_list ?? [];
    },

    saveFundSize: async (payload: { id?: number; investment_range: string; status: number }) => {
        const params: any = {
            user_id: VARIABLES.USER_ID,
            token: VARIABLES.TOKEN,
            investment_range: payload.investment_range,
            status: payload.status,
        };
        if (payload.id) params.id = payload.id;

        const res = await axios.post(`${baseUrl}${API_ROUTES.FUND_SIZE.SAVE}`, null, { params });
        return res.data;
    },

    deleteFundSize: async (keys: number | string) => {
        const res = await axios.post(`${baseUrl}${API_ROUTES.FUND_SIZE.DELETE}`, null, {
            params: { user_id: VARIABLES.USER_ID, token: VARIABLES.TOKEN, keys },
        });
        return res.data;
    },
};

export default fundSizeService;
