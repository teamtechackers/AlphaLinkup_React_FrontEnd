export interface InvestorModel {
  id: number;
  user_id: number | null;
  full_name: string | null;
  reference_no: string | null;
  name: string | null;
  country_id: number | null;
  state_id: number | null;
  city_id: number | null;
  fund_size_id: number | null;
  linkedin_url: string | null;
  bio: string | null;
  image: string | null;
  profile: string | null;
  investment_stage: string | null;
  availability: string | null;
  meeting_city: string | null;
  countries_to_invest: string | null;
  investment_industry: string | null;
  language: string | null;
  approval_status: number | null;
  status: number | null;
}

export const InvestorLabels = {
  ID: "id",
  FULL_NAME: "full_name",
  REFERENCE_NO: "reference_no",
  NAME: "name",
  APPROVAL_STATUS: "approval_status",
  STATUS: "status",
  ACTIONS: "actions",
};
