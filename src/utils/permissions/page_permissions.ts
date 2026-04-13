import {
  PagePermissionKey,
  PagePermissions,
  RuntimePermissionsMap,
} from "../../models/runtime_permissions_model";

interface PermissionKeySet {
  view: string;
  create?: string;
  edit?: string;
  delete?: string;
}

const PAGE_PERMISSION_KEYS: Record<PagePermissionKey, PermissionKeySet> = {
  users: {
    view: "users.view",
    create: "users.create",
    edit: "users.edit",
    delete: "users.delete",
  },
  admins: {
    view: "admins.view",
    create: "admins.create",
    edit: "admins.edit",
    delete: "admins.delete",
  },
  jobs: {
    view: "jobs.view",
    create: "jobs.create",
    edit: "jobs.edit",
    delete: "jobs.delete",
  },
  events: {
    view: "events.view",
    create: "events.create",
    edit: "events.edit",
    delete: "events.delete",
  },
  investors: {
    view: "investors.view",
    create: "investors.create",
    edit: "investors.edit",
    delete: "investors.delete",
  },
  services: {
    view: "services.view",
    create: "services.create",
    edit: "services.edit",
    delete: "services.delete",
  },
  cards: {
    view: "cards.view",
    create: "cards.approve",
    edit: "cards.approve",
    delete: "cards.approve",
  },
  meetings: {
    view: "meetings.view",
    edit: "meetings.update",
    delete: "meetings.cancel",
  },
  master_data: {
    view: "master_data.view",
    create: "master_data.create",
    edit: "master_data.edit",
    delete: "master_data.delete",
  },
  account_deletion_requests: {
    view: "users.view",
    delete: "users.delete",
  },
};

const hasPermission = (
  runtimePermissions: RuntimePermissionsMap,
  isSuperAdmin: boolean,
  key?: string
): boolean => {
  if (isSuperAdmin) {
    return true;
  }
  if (!key) {
    return false;
  }
  return Boolean(runtimePermissions[key]);
};

export const getPagePermissions = (
  runtimePermissions: RuntimePermissionsMap,
  isSuperAdmin: boolean,
  page: PagePermissionKey
): PagePermissions => {
  const keySet = PAGE_PERMISSION_KEYS[page];
  return {
    canViewTable: hasPermission(runtimePermissions, isSuperAdmin, keySet.view),
    canCreate: hasPermission(runtimePermissions, isSuperAdmin, keySet.create),
    canEdit: hasPermission(runtimePermissions, isSuperAdmin, keySet.edit),
    canDelete: hasPermission(runtimePermissions, isSuperAdmin, keySet.delete),
  };
};

export const hasPermissionKey = (
  runtimePermissions: RuntimePermissionsMap,
  isSuperAdmin: boolean,
  permissionKey: string
): boolean => hasPermission(runtimePermissions, isSuperAdmin, permissionKey);

export const PERMISSION_DENIED_TABLE_MESSAGE =
  "You do not have permission to see this content";
