export interface InterestModel {
  id: number;
  name: string;
  status: number;
  created_at?: string | null;
  created_by?: string | null;
  updated_at?: string | null;
  updated_by?: string | null;
  deleted?: number;
  deleted_by?: string | null;
  deleted_at?: string | null;
}

export const InterestModelLabels = {
  ID: "id",
  NAME: "name",
  STATUS: "status",
  ACTIONS: "actions",
};
