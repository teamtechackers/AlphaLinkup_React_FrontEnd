import React, { useEffect, useState, useMemo } from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import { FiTrash2, FiEdit } from "react-icons/fi";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import industryTypeService from "../services/industry_type_service";
import { INDUSTRY_TYPE_STRINGS } from "../utils/strings/pages/industry_type_strings";
import { CONSTANTS } from "../utils/strings/constants";
import { IndustryTypeModel, IndustryTypeModelLabels } from "../models/industry_type_model";
import { COLORS } from "../utils/theme/colors";
import { STYLES } from "../utils/typography/styles";
const IndustryTypeList: React.FC = () => {
  const [items, setItems] = useState<IndustryTypeModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<IndustryTypeModel | null>(null);
  const [name, setName] = useState("");
  const [status, setStatus] = useState("1");
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  

  const load = async () => {
    setLoading(true);
    try {
      const data = await industryTypeService.getIndustryTypesList();
      const list = Array.isArray(data?.industry_type_list) ? data.industry_type_list : [];
      setItems(list as IndustryTypeModel[]);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    load();
  }, []);
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Prepare payload
      const payload: any = { name, status: Number(status) };
      if (editing?.id) {
        payload.id = editing.id; // Include id only if editing
      }
  
      // Check for duplicate industry type
      const duplicateIndustry = await industryTypeService.checkDuplicateIndustryType(payload.name, payload.id);
      console.log("Duplicate check result:", duplicateIndustry);
  
      if (duplicateIndustry.validate === true) {
        return toast.error("Industry type already exists");
      }
  
      // Save industry type
      const res = await industryTypeService.saveIndustryType(payload);
  
      if (res.status === "Success") {
        toast.success(res.info || "Saved successfully");
        setEditing(null);
        setName("");
        setStatus("1");
        await load();
      } else {
        toast.error(res.info || "Failed to save");
      }
    } catch (err) {
      console.error(err);
      toast.error(CONSTANTS.MESSAGES.SOMETHING_WENT_WRONG);
    }
  };
  
  

  const onEdit = (item: IndustryTypeModel) => {
    setEditing(item);
    setName(item.name || "");
    setStatus(String(item.status ?? "1"));
  };

  const onDelete = async (item: IndustryTypeModel) => {
    if (!item.id) return;
    try {
      const res = await industryTypeService.deleteIndustryType(String(item.id));
      if (res.status === "Success") {
        toast.success(res.info || "Deleted successfully");
        await load();
      } else {
        toast.error(res.info || "Failed to delete");
      }
    } catch (err) {
      console.error(err);
      toast.error(CONSTANTS.MESSAGES.SOMETHING_WENT_WRONG);
    }
  };

  const columns = useMemo(
    () => [
      { field: IndustryTypeModelLabels.ID, headerName: INDUSTRY_TYPE_STRINGS.TABLE.HEADER_ID, width: 100 },
      { field: IndustryTypeModelLabels.NAME, headerName: INDUSTRY_TYPE_STRINGS.TABLE.HEADER_NAME, flex: 1 },
      {
        field: IndustryTypeModelLabels.STATUS,
        headerName: INDUSTRY_TYPE_STRINGS.TABLE.HEADER_STATUS,
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
              ? INDUSTRY_TYPE_STRINGS.TABLE.STATUS_ACTIVE
              : INDUSTRY_TYPE_STRINGS.TABLE.STATUS_INACTIVE}
          </span>
        ),
      },
      {
        field: IndustryTypeModelLabels.ACTIONS,
        headerName: INDUSTRY_TYPE_STRINGS.TABLE.HEADER_ACTIONS,
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
    <div className="container-fluid vh-100" style={{ backgroundColor: COLORS.lightGray }}>

      {/* Page Title */}
      <div className="row">
        <div className="col-12">
          <div style={STYLES.page_title}>
              {INDUSTRY_TYPE_STRINGS.TITLE}
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
            pageSizeOptions={[5, 10, 20, 50]}
            paginationModel={paginationModel}
            onPaginationModelChange={(newModel) => setPaginationModel(newModel)}
            pagination
          />

          </Box>
        </div>

        {/* Form */}
        <div className="col-lg-4">
          <div className="card shadow-sm">
            <div className="card-header" style={{ backgroundColor: COLORS.lightGray }}>
              <h5 className="mb-0">
                {editing
                  ? INDUSTRY_TYPE_STRINGS.FORM.EDIT_INDUSTRY_TYPE
                  : INDUSTRY_TYPE_STRINGS.FORM.ADD_INDUSTRY_TYPE}
              </h5>
            </div>
            <div className="card-body">
              <form onSubmit={onSubmit}>
                <div className="row g-3 align-items-end">
                  {/* Name */}
                  <div className="col-md-12">
                    <label className="form-label" style={STYLES.field_label}>
                      {INDUSTRY_TYPE_STRINGS.TABLE.HEADER_NAME} *
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
                      {INDUSTRY_TYPE_STRINGS.TABLE.HEADER_STATUS} *
                    </label>
                    <select
                      className="form-select"
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                    >
                      <option value="1">{INDUSTRY_TYPE_STRINGS.TABLE.STATUS_ACTIVE}</option>
                      <option value="0">{INDUSTRY_TYPE_STRINGS.TABLE.STATUS_INACTIVE}</option>
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

export default IndustryTypeList;
