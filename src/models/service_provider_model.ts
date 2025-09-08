export interface ServiceProviderModel {
  id: number;
  full_name: string;
  sp_user_id: number;
  country_id: number;
  state_id: number;
  city_id: number;
  description: string;
  avg_sp_rating: number;
  approval_status: number;
  status: number;
}

export const ServiceProviderModelLabels = {
  ID: "id",
  FULL_NAME: "full_name",
  SP_USER_ID: "sp_user_id",
  COUNTRY_ID: "country_id",
  STATE_ID: "state_id",
  CITY_ID: "city_id",
  DESCRIPTION: "description",
  AVG_SP_RATING: "avg_sp_rating",
  APPROVAL_STATUS: "approval_status",
  STATUS: "status",
  ACTIONS: "actions",
};
