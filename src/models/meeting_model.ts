export interface MeetingModel {
  meeting_id: string;
  meeting_type_id: string;
  request_id: string;
  requester_name: string;
  investor_id: string;
  investor_name: string;
  duration: string;
  meeting_type: string;
  meeting_time: string;
  meeting_date: string;
  schedule_status: string;
  request_status?: string;
  meeting_location?: string;
  meeting_lat?: string | null;
  meeting_lng?: string | null;
  meeting_url?: string;
  meeting_name?: string;
  investor_image?: string;
  country?: string;
  state?: string;
  city?: string;
}

export const MeetingModelLabels = {
  MEETING_ID: "meeting_id",
  MEETING_TYPE_ID: "meeting_type_id",
  REQUEST_ID: "request_id",
  REQUESTER_NAME: "requester_name",
  INVESTOR_ID: "investor_id",
  INVESTOR_NAME: "investor_name",
  DURATION: "duration",
  MEETING_TYPE: "meeting_type",
  MEETING_TIME: "meeting_time",
  MEETING_DATE: "meeting_date",
  SCHEDULE_STATUS: "schedule_status",
  REQUEST_STATUS: "request_status",
  MEETING_LOCATION: "meeting_location",
  MEETING_URL: "meeting_url",
  MEETING_NAME: "meeting_name",
  INVESTOR_IMAGE: "investor_image",
  COUNTRY: "country",
  STATE: "state",
  CITY: "city",
};
