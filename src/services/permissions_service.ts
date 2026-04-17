import axios from "./http_client";
import { RuntimePermissionsResponse } from "../models/runtime_permissions_model";
import { VARIABLES } from "../utils/strings/variables";
import { normalizeApiUserId } from "../utils/helpers/api_id";

const defaultPermissionsResponse: RuntimePermissionsResponse = {
  status: false,
  rcode: 500,
  is_super_admin: false,
  permissions: {},
};

const PERMISSIONS_DEBUG_PREFIX = "[PERMISSIONS_FLOW]";

const maskToken = (token?: string | null): string => {
  if (!token) return "(empty)";
  if (token.length <= 10) return `${token.slice(0, 2)}***${token.slice(-2)}`;
  return `${token.slice(0, 6)}...${token.slice(-4)}`;
};

const logPermissions = (...args: unknown[]) => {
  console.log(PERMISSIONS_DEBUG_PREFIX, ...args);
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

      logPermissions("request:start", {
        endpoint,
        token: maskToken(token),
        rawUserId,
        normalizedUserId: userId,
        variablesUserId: VARIABLES.USER_ID,
      });

      if (!token || !userId) {
        logPermissions("request:skip-missing-credentials", {
          hasToken: Boolean(token),
          hasUserId: Boolean(userId),
        });
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
      logPermissions("request:response", {
        status: data?.status,
        rcode: data?.rcode,
        isSuperAdmin: data?.is_super_admin,
        permissionsKeys: data?.permissions && typeof data.permissions === "object"
          ? Object.keys(data.permissions as Record<string, unknown>)
          : [],
      });

      return {
        status: Boolean(data?.status),
        rcode: Number(data?.rcode ?? 500),
        is_super_admin: Boolean(data?.is_super_admin),
        permissions: data?.permissions && typeof data.permissions === "object" ? data.permissions : {},
      };
    } catch (error) {
      console.error("[PERMISSIONS_FLOW] request:error", error);
      return defaultPermissionsResponse;
    }
  },
};

export default runtimePermissionsService;

