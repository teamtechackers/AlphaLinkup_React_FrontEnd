export interface UserModel {
  user_id: number;
  user_name: string | null;
  phone_number: string | null;
  email_address: string | null;
  profile_photo?: string | null;
  role?: string | null;
  address?: string | null;
  country_id?: number | null;
  country_name?: string | null;
  state_id?: number | null;
  state_name?: string | null;
  city_id?: number | null;
  city_name?: string | null;
  status: "Active" | "Inactive";
  user_role?: string | null;
  username?: string | null;
  permissions?: string[];
  
  // New fields for API compatibility
  row_id?: number;
  user_type?: string | null;
  password?: string | null;
  is_super_admin?: boolean;
  permissions_details?: Array<{ 
    permission_id: number;
    permission_name: string;
    permission_key: string;
  }> | null;
  permission_count?: number;
  all_permissions?: boolean;
}

export const UserModelLabels = {
  USER_ID: "user_id",
  USER_NAME: "user_name",
  ROLE: "role",
  PHONE_NUMBER: "phone_number",
  EMAIL_ADDRESS: "email_address",
  STATUS: "status",
  ACTIONS: "actions",
  ROW_ID: "row_id",
  USER_TYPE: "user_type",
};
