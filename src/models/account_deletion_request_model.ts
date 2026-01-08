export interface AccountDeletionRequestModel {
  user_id: number;
  full_name: string | null;
  email: string | null;
  mobile: string | null;
  created_dts: string | null;
  deleted_request: number;
}

export const AccountDeletionRequestModelLabels = {
  USER_ID: "user_id",
  FULL_NAME: "full_name",
  EMAIL: "email",
  MOBILE: "mobile",
  ACTIONS: "actions",
};