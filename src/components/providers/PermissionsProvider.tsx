import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import runtimePermissionsService from "../../services/permissions_service";
import {
  PagePermissionKey,
  PagePermissions,
  RuntimePermissionsMap,
  RuntimePermissionsResponse,
} from "../../models/runtime_permissions_model";
import { getPagePermissions, hasPermissionKey } from "../../utils/permissions/page_permissions";

interface PermissionsContextValue {
  loading: boolean;
  isSuperAdmin: boolean;
  runtimePermissions: RuntimePermissionsMap;
  getPermissionsForPage: (page: PagePermissionKey) => PagePermissions;
  can: (permissionKey: string) => boolean;
  refreshPermissions: () => Promise<void>;
}

const defaultPagePermissions: PagePermissions = {
  canViewTable: false,
  canCreate: false,
  canEdit: false,
  canDelete: false,
};

const PermissionsContext = createContext<PermissionsContextValue>({
  loading: true,
  isSuperAdmin: false,
  runtimePermissions: {},
  getPermissionsForPage: () => defaultPagePermissions,
  can: () => false,
  refreshPermissions: async () => undefined,
});

export const PermissionsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [permissionsResponse, setPermissionsResponse] = useState<RuntimePermissionsResponse>({
    status: false,
    rcode: 500,
    is_super_admin: false,
    permissions: {},
  });

  const refreshPermissions = useCallback(async () => {
    console.log("[PERMISSIONS_PROVIDER] refresh:start");
    setLoading(true);
    const data = await runtimePermissionsService.getMyPermissions();
    console.log("[PERMISSIONS_PROVIDER] refresh:response", {
      status: data?.status,
      rcode: data?.rcode,
      isSuperAdmin: data?.is_super_admin,
      permissionsKeys: data?.permissions ? Object.keys(data.permissions) : [],
    });
    setPermissionsResponse(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    refreshPermissions();
  }, [refreshPermissions]);

  const value = useMemo<PermissionsContextValue>(() => {
    const runtimePermissions = permissionsResponse.permissions || {};
    const isSuperAdmin = permissionsResponse.is_super_admin;

    return {
      loading,
      isSuperAdmin,
      runtimePermissions,
      getPermissionsForPage: (page: PagePermissionKey) =>
        getPagePermissions(runtimePermissions, isSuperAdmin, page),
      can: (permissionKey: string) =>
        hasPermissionKey(runtimePermissions, isSuperAdmin, permissionKey),
      refreshPermissions,
    };
  }, [loading, permissionsResponse, refreshPermissions]);

  return <PermissionsContext.Provider value={value}>{children}</PermissionsContext.Provider>;
};

export const usePermissions = () => useContext(PermissionsContext);
