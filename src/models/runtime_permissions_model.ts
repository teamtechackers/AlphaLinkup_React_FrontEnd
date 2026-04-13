export interface RuntimePermissionsMap {
  [permissionKey: string]: boolean;
}

export interface RuntimePermissionsResponse {
  status: boolean;
  rcode: number;
  is_super_admin: boolean;
  permissions: RuntimePermissionsMap;
}

export interface PagePermissions {
  canViewTable: boolean;
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
}

export type PagePermissionKey =
  | "users"
  | "admins"
  | "jobs"
  | "events"
  | "investors"
  | "services"
  | "cards"
  | "meetings"
  | "master_data"
  | "account_deletion_requests";
