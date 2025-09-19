export interface CityModel {
  // row_id: GridRowId;
  // row_id: GridRowId;
  id: number;
  state_name: string;
  city_name: string;
  country_id: number;
  status: number;
}

export const CityModelLabels = {
  ID: "id",
  STATE_NAME: "name",
  CITY_NAME: "city_name",
  COUNTRY_ID: "country_id",
  STATUS: "status",
  ACTIONS: "actions",
};
