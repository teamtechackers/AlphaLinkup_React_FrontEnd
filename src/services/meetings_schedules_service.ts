import axios from "axios";
import { VARIABLES } from "../utils/strings/variables";
import { API_ROUTES } from "../utils/strings/api_routes";
import { InvestorDetailModel }  from "../models/investor_detail_model";
import { RequestorModel } from "../models/requestor_model";
import { 
  MeetingListResponseModel, 
  UpdateMeetingResponseModel, 
  InvestorMeetingsResponseModel,
  ApiResponseModel 
} from "../models/api_response_model";

const baseUrl = process.env.REACT_APP_API_BASE_URL as string;

const meetingsSchedulesService = {
  getMeetingsList: async (page = 1, limit = 10): Promise<ApiResponseModel<MeetingListResponseModel>> => {
    const res = await axios.get(`${baseUrl}${API_ROUTES.MEETINGS.GET_MEETING_LIST}`, {
      params: {
        user_id: VARIABLES.USER_ID,
        token: VARIABLES.TOKEN,
        page,
        limit,
      },
    });
    return res.data;
  },

  getRequestorDetails: async (requestorId: string): Promise<ApiResponseModel<RequestorModel>> => {
    const res = await axios.get(`${baseUrl}${API_ROUTES.MEETINGS.GET_REQUESTOR_DETAILS}`, {
      params: {
        requestor_id: requestorId,
        user_id: VARIABLES.USER_ID,
        token: VARIABLES.TOKEN,
      },
    });
    return res.data;
  },

  getInvestorDetails: async (investorId: string): Promise<ApiResponseModel<InvestorDetailModel>> => {
    const res = await axios.get(`${baseUrl}${API_ROUTES.MEETINGS.GET_INVESTOR_DETAILS}`, {
      params: {
        user_id: VARIABLES.USER_ID,
        token: VARIABLES.TOKEN,
        investor_id: investorId,
      },
    });
    return res.data;
  },

  updateMeetingRequest: async (payload: {
    request_id: string;
    meeting_date: string;
    meeting_time: string;
    request_status: string;
  }): Promise<ApiResponseModel<UpdateMeetingResponseModel>> => {
    const res = await axios.post(`${baseUrl}${API_ROUTES.MEETINGS.UPDATE_MEETING_REQUEST}`, null, {
      params: {
        user_id: VARIABLES.USER_ID,
        token: VARIABLES.TOKEN,
        request_id: payload.request_id,
        meeting_date: payload.meeting_date,
        meeting_time: payload.meeting_time,
        request_status: payload.request_status,
      },
    });
    return res.data;
  },

  getInvestorMeetings: async (investorId: string, page = 1, limit = 10): Promise<ApiResponseModel<InvestorMeetingsResponseModel>> => {
    const res = await axios.get(`${baseUrl}${API_ROUTES.MEETINGS.GET_INVESTOR_MEETINGS}`, {
      params: {
        user_id: VARIABLES.USER_ID,
        token: VARIABLES.TOKEN,
        investor_id: investorId,
        page,
        limit,
      },
    });
    return res.data;
  },
};

export default meetingsSchedulesService;