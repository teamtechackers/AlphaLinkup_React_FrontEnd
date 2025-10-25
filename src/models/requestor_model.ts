export interface RequestorModel {
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
  full_name: string | null;
  mobile: string | null;
  email: string | null;
  country?: string | null;
  state?: string | null;
  city?: string | null;
}

export const RequestorModelLabels = {
  USER_ID: "user_id",
  USER_NAME: "user_name",
  PHONE_NUMBER: "phone_number",
  EMAIL_ADDRESS: "email_address",
  STATUS: "status",
  ACTIONS: "actions",
  FULL_NAME: "full_name",
  MOBILE: "mobile",
  EMAIL: "email",
  PROFILE_PHOTO: "profile_photo",
  ADDRESS: "address",
  COUNTRY: "country",
  STATE: "state",
  CITY: "city",
};
