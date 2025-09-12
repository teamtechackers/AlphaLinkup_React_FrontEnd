export interface CardActivationRequestModel {
  row_id: number | string | null;
  ubc_id: number | string | null;
  sp_user_id: number | string | null;
  user_id: number | string | null;
  user_name: string | null;
  card_activation_name: string | null;
  business_name: string | null;
  business_location: string | null;
  country_id: number | string | null;
  country_name: string | null;
  state_id: number | string | null;
  state_name: string | null;
  city_id: number | string | null;
  city_name: string | null;
  description: string | null;
  card_number: string | null;
  card_status: string | null;
  status: string | null;
}


export const CardActivationRequestLabels = {
  UBC_ID: "ubc_id",
  USER_NAME: "user_name",
  DESCRIPTION: "description",
  CARD_STATUS: "card_status",
  STATUS: "status",
  ACTIONS: "actions",
};
