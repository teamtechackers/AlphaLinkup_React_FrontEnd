export interface EventModel {
  row_id: number;
  user_id: string | null;
  user_name: string | null;
  event_id: string | null;
  event_name: string | null;
  industry_type?: string | null;
  industry_id?: string | null;
  industry_name?: string | null;
  country_id: string | null;
  country_name?: string | null;
  state_id: string | null;
  state_name?: string | null;
  city_id: string | null;
  city_name?: string | null;
  event_venue: string | null;
  event_link: string | null;
  latitude: string | null;
  longitude: string | null;
  event_geo_address: string | null;
  date: string | null;
  start_time: string | null;
  end_time: string | null;
  event_mode_id: string | null;
  event_mode_name?: string | null;
  event_type_id: string | null;
  event_type_name?: string | null;
  event_details: string | null;
  event_banner?: string | null;
  status: string | null;
}

export const EventLabels = {
  EVENT_ID: "event_id",
  USER_NAME: "user_name",
  EVENT_NAME: "event_name", 
  EVENT_VENUE: "event_venue", 
  STATUS: "status",
  ACTIONS: "actions",
};
