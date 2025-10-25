export interface ServiceProviderModel {
  row_id: number;
  sp_id: string;
  user_id: string;
  user_name: string;
  country_id: string;
  country_name: string;
  state_id: string;
  state_name: string;
  city_id: string;
  city_name: string;
  description: string;
  sp_rating: string;
  approval_status: string;
  status: string;
}

export const ServiceProviderModelLabels = {
  SP_ID: "sp_id",
  USER_NAME: "user_name",
  DESCRIPTION: "description",
  APPROVAL_STATUS: "approval_status",
  STATUS: "status",
  ACTIONS: "actions",
};
