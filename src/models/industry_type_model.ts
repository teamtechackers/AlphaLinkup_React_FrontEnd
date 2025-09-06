export interface IndustryTypeModel {
  id: number;
  name: string;
  status: number;
  created_at?: string;
  created_by?: number;
  updated_at?: string | null;
  updated_by?: number | null;
  deleted?: number;
  deleted_by?: number | null;
  deleted_at?: string | null;
}

export const IndustryTypeModelLabels = {
  ID: "id",
  NAME: "name",
  STATUS: "status",
  ACTIONS: "actions",
};
