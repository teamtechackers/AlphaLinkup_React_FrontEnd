export interface UserModel {
  user_id: number;
  user_name: string | null;
  phone_number: string | null;
  email_address: string | null;
  profile_photo?: string | null;
  address?: string | null;
  country_id?: number | null;
  country_name?: string | null;
  state_id?: number | null;
  state_name?: string | null;
  city_id?: number | null;
  city_name?: string | null;
  status: "Active" | "Inactive";
}

export const UserModelLabels = {
  USER_ID: "user_id",
  USER_NAME: "user_name",
  PHONE_NUMBER: "phone_number",
  EMAIL_ADDRESS: "email_address",
  STATUS: "status",
  ACTIONS: "actions",
};
