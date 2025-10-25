import React, { useEffect, useState, useMemo } from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import { FiTrash2, FiEdit } from "react-icons/fi";
import { toast } from "react-toastify";
import jobTypesService from "../services/job_types_service";
import { JOB_TYPES_STRINGS } from "../utils/strings/pages/job_types_strings";
import { JobTypeModel, JobTypeModelLabels } from "../models/job_type_model";
import { CONSTANTS } from "../utils/strings/constants";
import { COLORS } from "../utils/theme/colors";
import { STYLES } from "../utils/typography/styles";

const JobTypesList: React.FC = () => {
  const [items, setItems] = useState<JobTypeModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<JobTypeModel | null>(null);
  const [name, setName] = useState("");
  const [status, setStatus] = useState("1");
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [draw, setDraw] = useState(1);
  const [rowCount, setRowCount] = useState(0);

  const load = async () => {
    setLoading(true);
    try {
      const { page, pageSize } = paginationModel;
      const start = page * pageSize;

      const data = await jobTypesService.getJobTypesList(draw, start, pageSize);

      console.log(data);

      const list: JobTypeModel[] = Array.isArray(data?.data)
        ? data.data.map((row: any) => ({
            id: Number(row[3]),
            name: row[1],
            status: row[2].includes("Active") ? 1 : 0,
          }))
        : [];

      setItems(list);
      setRowCount(data.recordsTotal || 0);
      setDraw((d) => d + 1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [paginationModel]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const payload = { 
        row_id: editing?.id,
        name, 
        status: Number(status) 
      };
  
      // 1️⃣ Check duplicate first
      const check_duplicate = await jobTypesService.checkDuplicateJobType(payload.name, payload.row_id);
      console.log("Duplicate check response:", check_duplicate);
  
      if (check_duplicate.validate === true) {
        return toast.error("Job already exists");
      }
      const res = await jobTypesService.saveJobType(payload);
      if (res.status === "Success" || res.status === true) {
        toast.success(res.info || res.message);
        setEditing(null);
        setName("");
        setStatus("1");
        await load();
      } else {
        toast.error(res.info || res.message);
      }
    } catch (err) {
      console.error(err);
      toast.error(CONSTANTS.MESSAGES.SOMETHING_WENT_WRONG);
    }
  };
  

  const onEdit = (item: JobTypeModel) => {
    setEditing(item);
    setName(item.name || "");
    setStatus(String(item.status ?? "1"));
  };

  const onDelete = async (item: JobTypeModel) => {
    if (!item.id) return;
    try {
      const res = await jobTypesService.deleteJobType(item.id);
      if (res.status === "Success" || res.status === true) {
        toast.success(res.info || res.message);
        await load();
      } else {
        toast.error(res.info || res.message);
      }
    } catch {
      toast.error(CONSTANTS.MESSAGES.SOMETHING_WENT_WRONG);
    }
  };

  const columns = useMemo(
    () => [
      { field: JobTypeModelLabels.ID, headerName: JOB_TYPES_STRINGS.TABLE.HEADER_ID, width: 100 },
      { field: JobTypeModelLabels.NAME, headerName: JOB_TYPES_STRINGS.TABLE.HEADER_NAME, flex: 1 },
      {
        field: JobTypeModelLabels.STATUS,
        headerName: JOB_TYPES_STRINGS.TABLE.HEADER_STATUS,
        width: 120,
        renderCell: (params: any) => (
          <span
            className="text-center p-1 rounded"
            style={{
              backgroundColor: params.value === 1 ? `${COLORS.green}30` : `${COLORS.red}30`,
              color: params.value === 1 ? COLORS.green : COLORS.red,
            }}
          >
            {params.value === 1 ? JOB_TYPES_STRINGS.TABLE.STATUS_ACTIVE : JOB_TYPES_STRINGS.TABLE.STATUS_INACTIVE}
          </span>
        ),
      },
      {
        field: JobTypeModelLabels.ACTIONS,
        headerName: JOB_TYPES_STRINGS.TABLE.HEADER_ACTIONS,
        width: 120,
        sortable: false,
        filterable: false,
        renderCell: (params: any) => (
          <div className="d-flex align-items-center gap-3 w-100 h-100">
            <FiEdit size={18} style={{ cursor: "pointer" }} onClick={() => onEdit(params.row)} />
            <FiTrash2 size={18} style={{ cursor: "pointer" }} onClick={() => onDelete(params.row)} />
          </div>
        ),
      },
    ],
    [items]
  );

  return (
    <div className="container-fluid vh-100" style={{ backgroundColor: COLORS.lightGray }}>

      {/* Page Title */}
      <div className="row">
        <div className="col-12">
          <div style={STYLES.page_title}>
              {JOB_TYPES_STRINGS.TITLE}
            </div>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-8">
          <Box sx={{ height: 800, width: '100%' }}>
          <DataGrid
            rows={items}
            columns={columns}
            loading={loading}
            getRowId={(row) => row.id}
            disableRowSelectionOnClick
            paginationMode="server"
            rowCount={rowCount}
            paginationModel={paginationModel}
            onPaginationModelChange={(newModel) => setPaginationModel(newModel)}
          />
          </Box>
        </div>

        <div className="col-lg-4">
          <div className="card shadow-sm">
            <div className="card-header" style={{ backgroundColor: COLORS.lightGray }}>
              <h5 className="mb-0">{editing ? JOB_TYPES_STRINGS.FORM.EDIT_JOB_TYPE : JOB_TYPES_STRINGS.FORM.ADD_JOB_TYPE}</h5>
            </div>
            <div className="card-body">
              <form onSubmit={onSubmit}>
                <div className="row g-3 align-items-end">
                  <div className="col-md-12">
                    <label className="form-label" style={STYLES.field_label}>
                      {JOB_TYPES_STRINGS.TABLE.HEADER_NAME} *
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-md-12">
                    <label className="form-label" style={STYLES.field_label}>
                      {JOB_TYPES_STRINGS.TABLE.HEADER_STATUS} *
                    </label>
                    <select
                      className="form-select"
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                    >
                      <option value="1">{JOB_TYPES_STRINGS.TABLE.STATUS_ACTIVE}</option>
                      <option value="0">{JOB_TYPES_STRINGS.TABLE.STATUS_INACTIVE}</option>
                    </select>
                  </div>
                </div>
                <div className="d-flex gap-2 mt-3">
                  <button type="submit" className="btn" style={{ backgroundColor: COLORS.purple, color: COLORS.white }}>
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

export default JobTypesList;
