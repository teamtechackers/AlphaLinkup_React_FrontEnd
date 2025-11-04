export interface InvestorModel {
  row_id: number;
  investor_id: number;
  user_id: number;
  user_name: string;
  name: string;
  country_id: number;
  country_name: string;
  state_id: number;
  state_name: string;
  city_id: number;
  city_name: number;
  fund_size_id: number;
  fund_size_name: string;
  linkedin_url: string;
  bio: string;
  image: string;
  availability: string;
  profile: string;
  investment_stage: string;
  meeting_city: string;
  countries_to_invest: string;
  investment_industry: string;
  language: string;
  approval_status: string;
  status: string;
  reference_no: string;
}

export const InvestorLabels = {
  ID: "investor_id",
  FULL_NAME: "user_name",
  REFERENCE_NO: "reference_no",
  NAME: "name",
  APPROVAL_STATUS: "approval_status",
  STATUS: "status",
  ACTIONS: "actions",
};
