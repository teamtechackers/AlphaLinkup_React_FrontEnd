export interface StateModel {
  id: number;
  row_id: number;
  country_id: number;
  country_name?: string;
  name: string;
  status: number;
}

export const StateModelLabels = {
  ID: "id",
  COUNTRY_NAME: "country_name",
  STATE_NAME: "name",
  STATUS: "status",
  ACTIONS: "actions",
};
