export interface JobModel {
  id: number;
  full_name: string | null;
  job_title: string | null;
  company_name: string | null;
  country_id: number | null;
  state_id: number | null;
  city_id: number | null;
  address: string | null;
  job_lat: number | null;
  job_lng: number | null;
  job_type_id: number | null;
  pay_id: number | null;
  job_description: string | null;
  status: string | null;
}

export const JobLabels = {
  ID: "id",
  FULL_NAME: "full_name",
  JOB_TITLE: "job_title",
  COMPANY_NAME: "company_name",
  STATUS: "status",
  ACTIONS: "actions",
};
