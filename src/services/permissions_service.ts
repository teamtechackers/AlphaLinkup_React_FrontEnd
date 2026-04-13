import axios from "axios";
import { RuntimePermissionsResponse } from "../models/runtime_permissions_model";
import { VARIABLES } from "../utils/strings/variables";
import { normalizeApiUserId } from "../utils/helpers/api_id";

const defaultPermissionsResponse: RuntimePermissionsResponse = {
  status: false,
  rcode: 500,
  is_super_admin: false,
  permissions: {},
};

const runtimePermissionsService = {
  getMyPermissions: async (): Promise<RuntimePermissionsResponse> => {
    try {
      const endpoint =
        process.env.REACT_APP_MY_PERMISSIONS_URL ||
        "https://alphalinkup.com/api/admin-my-permissions";

      const token = VARIABLES.TOKEN || localStorage.getItem("token") || "";
      const rawUserId = VARIABLES.USER_ID || localStorage.getItem("user_id") || "";
      const userId = normalizeApiUserId(rawUserId);

      if (!token || !userId) {
        return defaultPermissionsResponse;
      }

      const formData = new FormData();
      formData.append("user_id", userId);
      formData.append("token", token);

      const res = await axios.post(endpoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const data = res?.data;
      return {
        status: Boolean(data?.status),
        rcode: Number(data?.rcode ?? 500),
        is_super_admin: Boolean(data?.is_super_admin),
        permissions: data?.permissions && typeof data.permissions === "object" ? data.permissions : {},
      };
    } catch (error) {
      console.error("Error fetching runtime permissions", error);
      return defaultPermissionsResponse;
    }
  },
};

export default runtimePermissionsService;
