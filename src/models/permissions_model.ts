// interfaces/permissions_model.ts (New File)

export interface Permission {
  permission_id: string; // Keep as string as per API response
  permission_key: string;
  permission_name: string;
  description: string;
}

// The API returns an object where keys are categories (e.g., 'admins', 'jobs')
// and values are arrays of Permission.
export interface PermissionsByCategory {
  [category: string]: Permission[];
}

export interface PermissionsListResponse {
  status: boolean;
  rcode: number;
  permissions: PermissionsByCategory;
}