import { MeetingModel } from "./meeting_model"; 

export interface PaginationModel {
  current_page: number;
  total_pages: number;
  total_records: number;
  records_per_page: number;
}

export interface StatusSummaryModel {
  request_status: string;
  count: number;
}

export interface MeetingListResponseModel {
  meeting_requests: MeetingModel[];
  pagination: PaginationModel;
  status_summary: StatusSummaryModel[];
}

export interface InvestorMeetingsResponseModel {
  investor_info: {
    investor_id: number;
    investor_name: string;
    investor_profile: string;
    avg_rating: number | null;
    investor_image: string;
    country: string;
    state: string;
    city: string;
  };
  meeting_requests: MeetingModel[];
  pagination: PaginationModel;
  status_summary: StatusSummaryModel[];
}

export interface UpdateMeetingResponseModel {
  message: string;
  updated_meeting_request: MeetingModel;
}

export interface ApiResponseModel<T> {
  status: boolean;
  message: string;
  data: T;
  timestamp: string;
}
