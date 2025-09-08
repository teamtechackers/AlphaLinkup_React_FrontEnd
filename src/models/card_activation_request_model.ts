export interface CardActivationRequestModel {
  id: number;
  sp_user_id: number | null;
  name: string | null;
  business_name: string | null;
  business_location: string | null;
  country_id: number | null;
  state_id: number | null;
  city_id: number | null;
  description: string | null;
  card_number: string | null;
  card_status: string | null;
  overall_status: string | null;
}

export const CardActivationRequestLabels = {
  ID: "id",
  SP_USER_ID: "sp_user_id",
  NAME: "name",
  BUSINESS_NAME: "business_name",
  BUSINESS_LOCATION: "business_location",
  COUNTRY_ID: "country_id",
  STATE_ID: "state_id",
  CITY_ID: "city_id",
  DESCRIPTION: "description",
  CARD_NUMBER: "card_number",
  CARD_STATUS: "card_status",
  REQUEST_STATUS: "request_status",
  OVERALL_STATUS: "overall_status",
  ACTIONS: "actions",
};
