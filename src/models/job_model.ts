export interface JobModel {
  row_id: number;
  job_id: string;
  job_title: string;
  user_id: string;
  user_name: string;
  company_name: string;
  country_id: string;
  country_name: string;
  state_id: string;
  state_name: string;
  city_id: string;
  city_name: string;
  address: string;
  latitude: string;
  longitude: string;
  job_type_id: string;
  job_type_name: string;
  job_description: string;
  pay_id: string;
  pay_name: string;
  status: string;
}

export const JobLabels = {
  ROW_ID: "row_id",
  USER_NAME: "user_name",
  JOB_TITLE: "job_title",
  COMPANY_NAME: "company_name",
  STATUS: "status",
  ACTIONS: "actions",
};

