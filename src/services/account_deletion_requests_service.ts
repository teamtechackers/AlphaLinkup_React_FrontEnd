import axios from "axios";
import { VARIABLES } from "../utils/strings/variables";
import { API_ROUTES } from "../utils/strings/api_routes";
import usersService from "./users_service";

const baseUrl = process.env.REACT_APP_API_BASE_URL as string;

const accountDeletionRequestsService = {
  getAccountDeletionRequestsList: async () => {
    const params: any = {
      user_id: VARIABLES.USER_ID,
      token: VARIABLES.TOKEN,
    };

    const res = await axios.post(
      `${baseUrl}${API_ROUTES.ACCOUNT_DELETION_REQUESTS.GET_LIST}`,
      null,
      { params }
    );
    return res.data;
  },

  deleteAccountDeletionRequest: async (requestIdToDelete: number) => {
    const res = await axios.post(
      `${baseUrl}${API_ROUTES.ACCOUNT_DELETION_REQUESTS.DELETE}`,
      {},
      {
        params: {
          user_id: VARIABLES.USER_ID,
          token: VARIABLES.TOKEN,
          keys: requestIdToDelete,
        },
      }
    );
    return res.data;
  },

  processDeletionRequest: async (userIdToDelete: number) => {
    // Use the existing usersService to delete the user
    return await usersService.deleteUser(userIdToDelete);
  },
};

export default accountDeletionRequestsService;