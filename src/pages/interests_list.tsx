import React, { useEffect, useState, useMemo } from "react";
import Box from "@mui/material/Box";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import interestsService from "../services/interests_service";
import { INTERESTS_STRINGS } from "../utils/strings/pages/interests_strings";
import { CONSTANTS } from "../utils/strings/constants";
import { InterestModel, InterestModelLabels } from "../models/interest_model";
import { COLORS } from "../utils/theme/colors";
import { FiTrash2, FiEdit } from "react-icons/fi";
import { STYLES } from "../utils/typography/styles";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const InterestsList: React.FC = () => {
  const [items, setItems] = useState<InterestModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<InterestModel | null>(null);
  const [name, setName] = useState("");
  const [status, setStatus] = useState("1");

  const load = async () => {
    setLoading(true);
    try {
      const data = await interestsService.getInterestsList();
      const list = Array.isArray(data?.interests_list) ? data.interests_list : [];
      setItems(list as InterestModel[]);
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
      const payload = { id: editing?.id ?? 0, name, status: Number(status) };
      const res = await interestsService.saveInterest(payload);

      // backend returns "Success" string or boolean true in other endpoints — handle both
      if (res.status === true || res.status === "Success") {
        toast.success(res.message || res.info || "Saved successfully");
        setEditing(null);
        setName("");
        setStatus("1");
        await load();
      } else {
        toast.error(res.message || res.info || CONSTANTS.MESSAGES.SOMETHING_WENT_WRONG);
      }
    } catch (err) {
      console.error(err);
      toast.error(CONSTANTS.MESSAGES.SOMETHING_WENT_WRONG);
    }
  };

  const onEdit = (item: InterestModel) => {
    setEditing(item);
    setName(item.name || "");
    setStatus(String(item.status ?? "1"));
  };

  const onDelete = async (item: InterestModel) => {
    if (!item.id) return;
    try {
      const res = await interestsService.deleteInterest(item.id);
      if (res.status === true || res.status === "Success") {
        toast.success(res.message || res.info || "Deleted successfully");
        await load();
      } else {
        toast.error(res.message || res.info || CONSTANTS.MESSAGES.SOMETHING_WENT_WRONG);
      }
    } catch (err) {
      console.error(err);
      toast.error(CONSTANTS.MESSAGES.SOMETHING_WENT_WRONG);
    }
  };

  // Columns for DataGrid
  const columns = useMemo(
    () => [
      { field: InterestModelLabels.ID, headerName: INTERESTS_STRINGS.TABLE.HEADER_ID, width: 100 },
      { field: InterestModelLabels.NAME, headerName: INTERESTS_STRINGS.TABLE.HEADER_NAME, flex: 1 },
      {
        field: InterestModelLabels.STATUS,
        headerName: INTERESTS_STRINGS.TABLE.HEADER_STATUS,
        width: 120,
        renderCell: (params: any) => (
          <span
            className="text-center p-1 rounded"
            style={{
              backgroundColor: params.value === 1 ? `${COLORS.green}30` : `${COLORS.red}30`,
              color: params.value === 1 ? COLORS.green : COLORS.red,
            }}
          >
            {params.value === 1 ? INTERESTS_STRINGS.TABLE.STATUS_ACTIVE : INTERESTS_STRINGS.TABLE.STATUS_INACTIVE}
          </span>
        ),
      },
      {
        field: InterestModelLabels.ACTIONS,
        headerName: INTERESTS_STRINGS.TABLE.HEADER_ACTIONS,
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
      <h4 className="my-4">{INTERESTS_STRINGS.TITLE}</h4>
      <div className="row g-4 w-100">
        {/* Table */}
        <div className="col-lg-8 p-0">
          <Box sx={{ height: 800, width: "100%" }}>
            <DataGrid
              rows={items}
              columns={columns}
              loading={loading}
              getRowId={(row) => row.id}
              disableRowSelectionOnClick
              pageSizeOptions={[5, 10, 20, 50]}
              paginationModel={{ page: 0, pageSize: 10 }}
              pagination
            />
          </Box>
        </div>

        {/* Form */}
        <div className="col-lg-4">
          <div className="card shadow-sm">
            <div className="card-header" style={{ backgroundColor: COLORS.lightGray }}>
              <h5 className="mb-0">
                {editing ? INTERESTS_STRINGS.FORM.EDIT_INTEREST : INTERESTS_STRINGS.FORM.ADD_INTEREST}
              </h5>
            </div>
            <div className="card-body">
              <form onSubmit={onSubmit}>
                <div className="row g-3 align-items-end">
                  {/* Name */}
                  <div className="col-md-12">
                    <label className="form-label" style={STYLES.field_label}>
                      {INTERESTS_STRINGS.TABLE.HEADER_NAME} *
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
                      {INTERESTS_STRINGS.TABLE.HEADER_STATUS} *
                    </label>
                    <select className="form-select" value={status} onChange={(e) => setStatus(e.target.value)}>
                      <option value="1">{INTERESTS_STRINGS.TABLE.STATUS_ACTIVE}</option>
                      <option value="0">{INTERESTS_STRINGS.TABLE.STATUS_INACTIVE}</option>
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

export default InterestsList;
