// Country model
export interface Country {
  country_id: string;
  country_name: string;
}

// State model
export interface State {
  state_id: string;
  state_name: string;
}

// City model
export interface City {
  city_id: string;
  city_name: string;
}

// Pay model
export interface Pay {
  pay_id: string;
  pay: string;
}

// JobType model
export interface JobType {
  job_type_id: string;
  job_type: string;
}

// Event Mode model
export interface EventMode {
  event_mode_id: string;
  event_mode: string;
}

// Event Type model
export interface EventType {
  event_type_id: string;
  event_type: string;
}

// EmploymentType model
export interface EmploymentType {
  employment_type_id: string;
  employment_type: string;
}

// User model
export interface User {
  user_id: string;
  user_name: string;
}

// IndustryType model
export interface IndustryType {
  industry_type_id: string;
  industry_type_name: string;
}

// FundSize model
export interface FundSize {
  fund_size_id: string;
  investment_range: string;
}
