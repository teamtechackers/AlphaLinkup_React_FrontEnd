// Reusable type for location info
export interface Location {
  country_name: string;
  state_name: string;
  city_name: string;
}

// Job entity
export interface Job extends Location {
  job_title: string;
  company_name: string;
  address: string;
}

// Investor entity
export interface Investor extends Location {
  reference_no: string;
  name: string;
  bio: string;
}

// Full dashboard response
export interface DashboardModel {
  count_users: number;
  count_jobs: number;
  count_events: number;
  count_service: number;
  count_investor: number;
  list_jobs: Job[];
  list_investor: Investor[];
}
