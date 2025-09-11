export interface EventModel {
  id: number;
  user_id: number | null;
  full_name: string | null;
  event_name: string | null;
  industry_type: number | null;
  industry_id: number | null;
  country_id: number | null;
  state_id: number | null;
  city_id: number | null;
  event_venue: string | null;
  event_link: string | null;
  event_lat: string | null;
  event_lng: string | null;
  event_geo_address: string | null;
  event_date: string | null;
  event_start_time: string | null;
  event_end_time: string | null;
  event_mode_id: number | null;
  event_type_id: number | null;
  event_details: string | null;
  status: number | null;
}

export const EventLabels = {
  ID: "id",
  USER_ID: "user_id",
  NAME: "event_name",
  FULL_NAME: "full_name", 
  INDUSTRY_TYPE: "industry_type",
  INDUSTRY_ID: "industry_id",
  COUNTRY_ID: "country_id",
  STATE_ID: "state_id",
  CITY_ID: "city_id",
  VENUE: "event_venue",
  LINK: "event_link",
  LAT: "event_lat",
  LNG: "event_lng",
  GEO_ADDRESS: "event_geo_address",
  DATE: "event_date",
  START_TIME: "event_start_time",
  END_TIME: "event_end_time",
  MODE_ID: "event_mode_id",
  TYPE_ID: "event_type_id",
  DETAILS: "event_details",
  STATUS: "status",
  ACTIONS: "actions",
};
