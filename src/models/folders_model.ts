export interface FolderModel {
  id: number;
  name: string;
  sort_order: number;
  status: number;
  created_at: string | null;
  created_by: string | null;
  updated_at: string | null;
  updated_by: string | null;
  deleted: number;
  deleted_by: string | null;
  deleted_at: string | null;
}

export const FolderModelLabels = {
  ID: "id",
  NAME: "name",
  SORT_ORDER: "sort_order",
  STATUS: "status",
  ACTIONS: "actions",
};
