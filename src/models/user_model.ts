export interface UserModel {
  id: number;
  full_name: string | null;
  mobile: string | null;
  email: string | null;
  address?: string | null;
  country_id?: number | null;
  state_id?: number | null;
  city_id?: number | null;
  status: number;
}

export const UserModelLabels = {
  ID: "id",
  FULL_NAME: "full_name",
  MOBILE: "mobile",
  EMAIL: "email",
  STATUS: "status",
  ACTIONS: "actions",
};
