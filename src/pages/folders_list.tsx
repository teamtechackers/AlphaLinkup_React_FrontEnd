import React, { useEffect, useState, useMemo } from "react";
import Box from "@mui/material/Box";
import { DataGrid } from '@mui/x-data-grid';
import { FiTrash2, FiEdit } from "react-icons/fi";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import foldersService from "../services/folders_service";
import { FOLDERS_STRINGS } from "../utils/strings/pages/folders_string";
import { CONSTANTS } from "../utils/strings/constants";
import { FolderModel, FolderModelLabels } from "../models/folders_model";
import { COLORS } from "../utils/theme/colors";
import { STYLES } from "../utils/typography/styles";

const FoldersList: React.FC = () => {
  const [items, setItems] = useState<FolderModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<FolderModel | null>(null);
  const [name, setName] = useState("");
  const [status, setStatus] = useState("1");
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const [errors, setErrors] = useState<{ name?: string; status?: string }>({});
  const load = async () => {
    setLoading(true);
    try {
      const list = await foldersService.getFoldersList();
      setItems(list);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    const newErrors: { name?: string; status?: string } = {};
    if (!name.trim()) newErrors.name = "Folder name is required";
    if (!status) newErrors.status = "Status is required";
  
    setErrors(newErrors);
  
    if (Object.keys(newErrors).length > 0) return;
  
    try {
      const payload = { id: editing ? editing.id : undefined, name, status: Number(status) };
      console.log("Payload sending to API:", payload); // 🔍 debug line
  
      const res = await foldersService.saveFolder(payload);
  
      if (res.status === "Success") {
        toast.success(res.info);
        setEditing(null);
        setName("");
        setStatus("1");
        await load();
      } else {
        toast.error(res.info || CONSTANTS.MESSAGES.SOMETHING_WENT_WRONG);
      }
    } catch (err) {
      console.error(err);
      toast.error(CONSTANTS.MESSAGES.SOMETHING_WENT_WRONG);
    }
  };
  

  const onEdit = (item: FolderModel) => {
    setEditing(item);
    setName(item.name || "");
    setStatus(String(item.status ?? "1"));
  };

  const onDelete = async (item: FolderModel) => {
    if (!item.id) return;
    try {
      const res = await foldersService.deleteFolder(item.id);
      if (res.status === "Success") {
        toast.success(res.info);
        await load();
      } else {
        toast.error(res.info || CONSTANTS.MESSAGES.SOMETHING_WENT_WRONG);
      }
    } catch (err) {
      console.error(err);
      toast.error(CONSTANTS.MESSAGES.SOMETHING_WENT_WRONG);
    }
  };

  // Columns for DataGrid
  const columns = useMemo(
    () => [
      { field: FolderModelLabels.ID, headerName: FOLDERS_STRINGS.TABLE.HEADER_ID, width: 100 },
      { field: FolderModelLabels.NAME, headerName: FOLDERS_STRINGS.TABLE.HEADER_NAME, flex: 1 },
      {
        field: FolderModelLabels.STATUS,
        headerName: FOLDERS_STRINGS.TABLE.HEADER_STATUS,
        width: 120,
        renderCell: (params: any) => (
          <span
            className="text-center p-1 rounded"
            style={{
              backgroundColor: params.value === 1 ? `${COLORS.green}30` : `${COLORS.red}30`,
              color: params.value === 1 ? COLORS.green : COLORS.red,
            }}
          >
            {params.value === 1 ? FOLDERS_STRINGS.TABLE.STATUS_ACTIVE : FOLDERS_STRINGS.TABLE.STATUS_INACTIVE}
          </span>
        ),
      },
      {
        field: FolderModelLabels.ACTIONS,
        headerName: FOLDERS_STRINGS.TABLE.HEADER_ACTIONS,
        width: 120,
        sortable: false,
        filterable: false,
        renderCell: (params: any) => (
          <div className="d-flex align-items-center gap-3 w-100 h-100">
            <FiEdit
              className="icon-hover"
              size={18}
              style={{ cursor: "pointer" }}
              onClick={() => onEdit(params.row)}
            />
            <FiTrash2
              className="icon-hover"
              size={18}
              style={{ cursor: "pointer" }}
              onClick={() => onDelete(params.row)}
            />
          </div>
        ),
      },
    ],
    [items]
  );

  return (
    <div className="container-fluid page-padding-2 vh-100" style={{ backgroundColor: COLORS.lightGray }}>
      <h4 className="my-4">{FOLDERS_STRINGS.TITLE}</h4>
      <div className="row g-4 w-100">
        
        {/* Table */}
        <div className="col-lg-8 p-0">
        <Box sx={{ height: 800, width: '100%' }}>
                    <DataGrid
  rows={items}
  columns={columns}
  loading={loading}
  getRowId={(row) => row.id}
  disableRowSelectionOnClick
  pageSizeOptions={[5, 10, 20, 50]}
  paginationModel={paginationModel}
  onPaginationModelChange={(newModel) => setPaginationModel(newModel)}
  paginationMode="client"
  pagination
/>

                    </Box>
        </div>

        {/* Form */}
        <div className="col-lg-4">
          <div className="card shadow-sm">
            <div className="card-header" style={{ backgroundColor: COLORS.lightGray }}>
              <h5 className="mb-0">{editing ? FOLDERS_STRINGS.FORM.EDIT_FOLDER : FOLDERS_STRINGS.FORM.ADD_FOLDER}</h5>
            </div>
            <div className="card-body">
              <form onSubmit={onSubmit}>
                <div className="row g-3 align-items-end">
                  {/* Folder Name */}
                  <div className="col-md-12">
                    <label className="form-label" style={STYLES.field_label}>
                      {FOLDERS_STRINGS.TABLE.HEADER_NAME} *
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                    {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                  </div>

                  {/* Status */}
                  <div className="col-md-12">
                    <label className="form-label" style={STYLES.field_label}>
                      {FOLDERS_STRINGS.TABLE.HEADER_STATUS} *
                    </label>
                    <select
                      className="form-select"
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                    >
                      <option value="1">{FOLDERS_STRINGS.TABLE.STATUS_ACTIVE}</option>
                      <option value="0">{FOLDERS_STRINGS.TABLE.STATUS_INACTIVE}</option>
                    </select>
                    {errors.status && <div className="invalid-feedback">{errors.status}</div>}
                  </div>
                </div>

                {/* Buttons row */}
                <div className="d-flex gap-2 mt-3">
                  <button
                    type="submit"
                    className="btn"
                    style={{ backgroundColor: COLORS.purple, color: COLORS.white }}
                  >
                    {editing ? CONSTANTS.BUTTONS.UPDATE : CONSTANTS.BUTTONS.SAVE}
                  </button>
                  {editing && (
                    <button
                      type="button"
                      className="btn"
                      style={{ backgroundColor: COLORS.red, color: COLORS.white }}
                      onClick={() => {
                        setEditing(null);
                        setName("");
                        setStatus("1");
                      }}
                    >
                      {CONSTANTS.BUTTONS.CANCEL}
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default FoldersList;
