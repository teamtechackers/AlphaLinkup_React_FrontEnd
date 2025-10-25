export interface ServiceModel {
  usps_id: string;
  sp_id: string;
  service_id: string;
  service_name: string;
  company_name: string;
  tag_line: string;
  title: string;
  service_description: string;
  service_image: string;
  avg_service_rating: string;
  status: string;
  created_dts: string;
  country: string;
  state: string;
  city: string;
}

export const ServiceModelLabels = {
  USPS_ID: "usps_id",
  SP_ID: "sp_id",
  SERVICE_ID: "service_id",
  SERVICE_NAME: "service_name",
  COMPANY_NAME: "company_name",
  TAG_LINE: "tag_line",
  TITLE: "title",
  SERVICE_DESCRIPTION: "service_description",
  SERVICE_IMAGE: "service_image",
  AVG_SERVICE_RATING: "avg_service_rating",
  STATUS: "status",
  CREATED_DTS: "created_dts",
  COUNTRY: "country",
  STATE: "state",
  CITY: "city",
};
