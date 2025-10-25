import React, { useEffect, useState, useMemo } from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import { FiTrash2, FiEdit } from "react-icons/fi";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import employmentTypeService from "../services/employment_type_service";
import { EMPLOYMENT_TYPE_STRINGS } from "../utils/strings/pages/employment_type_strings";
import { CONSTANTS } from "../utils/strings/constants";
import { COLORS } from "../utils/theme/colors";
import { STYLES } from "../utils/typography/styles";
import { EmploymentTypeModel, EmploymentTypeModelLabels } from "../models/employment_type_model";

const EmploymentTypeList: React.FC = () => {
  const [items, setItems] = useState<EmploymentTypeModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<EmploymentTypeModel | null>(null);
  const [name, setName] = useState("");
  const [status, setStatus] = useState("1");
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [rowCount, setRowCount] = useState(0);

  const load = async () => {
    setLoading(true);
    try {
      const res = await employmentTypeService.getListAjax(page, pageSize);
      setItems(res.rows);
      setRowCount(res.total);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [page, pageSize]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = { id: editing?.id, name, status: Number(status) };
      // 1️⃣ Check duplicate first
      const checkDuplicateemployment = await employmentTypeService.checkDuplicate(payload.name, payload.id);
      console.log("Duplicate check response:", checkDuplicateemployment);
      if (checkDuplicateemployment.validate === true) {
        return toast.error("Job already exists");
      }
      // 2️⃣ Only save if not duplicate
      const res = await employmentTypeService.saveOrUpdate(payload);
      if (res.status === "Success") {
        toast.success(res.info);
        setEditing(null);
        setName("");
        setStatus("1");
        await load();
      } else {
        toast.error(res.info);
      }
    } catch (err) {
      console.error(err);
      toast.error(CONSTANTS.MESSAGES.SOMETHING_WENT_WRONG);
    }
  };
  

  const onEdit = (item: EmploymentTypeModel) => {
    setEditing(item);
    setName(item.name || "");
    setStatus(String(item.status ?? "1"));
  };

  const onDelete = async (item: EmploymentTypeModel) => {
    if (!item.id) return;
    try {
      const res = await employmentTypeService.delete(item.id);
      if (res.status === "Success" || res.status === true) {
        toast.success(res.message || res.info);
        await load();
      } else {
        toast.error(res.message || res.info);
      }
    } catch (err) {
      console.error(err);
      toast.error(CONSTANTS.MESSAGES.SOMETHING_WENT_WRONG);
    }
  };

  const columns = useMemo(
    () => [
      { field: EmploymentTypeModelLabels.ID, headerName: EMPLOYMENT_TYPE_STRINGS.TABLE.HEADER_ID, width: 100 },
      { field: EmploymentTypeModelLabels.NAME, headerName: EMPLOYMENT_TYPE_STRINGS.TABLE.HEADER_NAME, flex: 1 },
      {
        field: EmploymentTypeModelLabels.STATUS,
        headerName: EMPLOYMENT_TYPE_STRINGS.TABLE.HEADER_STATUS,
        width: 120,
        renderCell: (params: any) => (
          <span
            className="text-center p-1 rounded"
            style={{
              backgroundColor: params.value === 1 ? `${COLORS.green}30` : `${COLORS.red}30`,
              color: params.value === 1 ? COLORS.green : COLORS.red,
            }}
          >
            {params.value === 1
              ? EMPLOYMENT_TYPE_STRINGS.TABLE.STATUS_ACTIVE
              : EMPLOYMENT_TYPE_STRINGS.TABLE.STATUS_INACTIVE}
          </span>
        ),
      },
      {
        field: EmploymentTypeModelLabels.ACTIONS,
        headerName: EMPLOYMENT_TYPE_STRINGS.TABLE.HEADER_ACTIONS,
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
              {EMPLOYMENT_TYPE_STRINGS.TITLE}
            </div>
        </div>
      </div>

      <div className="row">
        {/* Table */}
        <div className="col-lg-8">
          <Box sx={{ height: 800, width: "100%" }}>
            <DataGrid
              rows={items}
              columns={columns}
              loading={loading}
              getRowId={(row) => row.id}
              disableRowSelectionOnClick
              paginationMode="server"
              rowCount={rowCount}
              paginationModel={{ page, pageSize }}
              onPaginationModelChange={(model) => {
                setPage(model.page);
                setPageSize(model.pageSize);
              }}
              pageSizeOptions={[5, 10, 20, 50]}
            />
          </Box>
        </div>

        {/* Form */}
        <div className="col-lg-4">
          <div className="card shadow-sm">
            <div className="card-header" style={{ backgroundColor: COLORS.lightGray }}>
              <h5 className="mb-0">
                {editing ? EMPLOYMENT_TYPE_STRINGS.FORM.EDIT : EMPLOYMENT_TYPE_STRINGS.FORM.ADD}
              </h5>
            </div>
            <div className="card-body">
              <form onSubmit={onSubmit}>
                <div className="row g-3 align-items-end">
                  {/* Name */}
                  <div className="col-md-12">
                    <label className="form-label" style={STYLES.field_label}>
                      {EMPLOYMENT_TYPE_STRINGS.TABLE.HEADER_NAME} *
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>

                  {/* Status */}
                  <div className="col-md-12">
                    <label className="form-label" style={STYLES.field_label}>
                      {EMPLOYMENT_TYPE_STRINGS.TABLE.HEADER_STATUS} *
                    </label>
                    <select className="form-select" value={status} onChange={(e) => setStatus(e.target.value)}>
                      <option value="1">{EMPLOYMENT_TYPE_STRINGS.TABLE.STATUS_ACTIVE}</option>
                      <option value="0">{EMPLOYMENT_TYPE_STRINGS.TABLE.STATUS_INACTIVE}</option>
                    </select>
                  </div>
                </div>

                {/* Buttons */}
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
                      style={{ backgroundColor: COLORS.red, color: COLORS.white }}
                      type="button"
                      className="btn"
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

export default EmploymentTypeList;
