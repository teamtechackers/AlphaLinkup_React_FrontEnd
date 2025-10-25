export interface InvestorProfileModel {
  investor_id: number;
  user_id: number;
  profile: string;
  investment_stage: string;
  availability: string | null;
  meeting_city: string;
  countries_to_invest: string;
  investment_industry: string;
  language: string;
  avg_rating: number | null;
  image: string;
  country: string;
  state: string;
  city: string;
  investment_range: string;
  status: number;
  approval_status: number;
  created_dts: string;
}

export interface UserDetailsModel {
  user_id: number;
  full_name: string;
  email: string;
  mobile: string;
  address: string;
  linkedin_url: string;
  summary: string;
  profile_photo: string;
  created_dts: string;
}

export interface MeetingStatisticsModel {
  total_meetings: number;
  pending_meetings: string;
  scheduled_meetings: string;
  completed_meetings: string;
  missed_meetings: string;
}

export interface RatingsModel {
  "1_star": number;
  "2_star": number;
  "3_star": number;
  "4_star": number;
  "5_star": number;
  total_ratings: number;
  total_reviews: number;
  avg_rating: number;
}

export interface ReviewModel {
  review_id?: number;
  rating: number;
  review_text: string;
  reviewer_name: string;
  created_dts: string;
}

export interface RatingsAndReviewsModel {
  ratings: RatingsModel;
  recent_reviews: ReviewModel[];
}

export interface InvestorDetailModel {
  investor_profile: InvestorProfileModel;
  user_details: UserDetailsModel;
  meeting_statistics: MeetingStatisticsModel;
  ratings_and_reviews: RatingsAndReviewsModel;
}

export const InvestorDetailModelLabels = {
  INVESTOR_ID: "investor_id",
  USER_ID: "user_id",
  PROFILE: "profile",
  INVESTMENT_STAGE: "investment_stage",
  AVAILABILITY: "availability",
  MEETING_CITY: "meeting_city",
  COUNTRIES_TO_INVEST: "countries_to_invest",
  INVESTMENT_INDUSTRY: "investment_industry",
  LANGUAGE: "language",
  AVG_RATING: "avg_rating",
  IMAGE: "image",
  COUNTRY: "country",
  STATE: "state",
  CITY: "city",
  INVESTMENT_RANGE: "investment_range",
  STATUS: "status",
  APPROVAL_STATUS: "approval_status",
  CREATED_DTS: "created_dts",
  FULL_NAME: "full_name",
  EMAIL: "email",
  MOBILE: "mobile",
  ADDRESS: "address",
  LINKEDIN_URL: "linkedin_url",
  SUMMARY: "summary",
  PROFILE_PHOTO: "profile_photo",
  TOTAL_MEETINGS: "total_meetings",
  PENDING_MEETINGS: "pending_meetings",
  SCHEDULED_MEETINGS: "scheduled_meetings",
  COMPLETED_MEETINGS: "completed_meetings",
  MISSED_MEETINGS: "missed_meetings",
};
