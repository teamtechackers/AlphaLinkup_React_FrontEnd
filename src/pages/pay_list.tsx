import React, { useEffect, useState, useMemo } from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import payService from "../services/pay_service";
import { PAY_STRINGS } from "../utils/strings/pages/pay_strings";
import { CONSTANTS } from "../utils/strings/constants";
import { PayModel, PayModelLabels } from "../models/pay_model";
import { COLORS } from "../utils/theme/colors";
import { FiTrash2, FiEdit } from "react-icons/fi";
import { STYLES } from "../utils/typography/styles";
import { toast } from "react-toastify";
const PayList: React.FC = () => {
  const [items, setItems] = useState<PayModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<PayModel | null>(null);
  const [name, setName] = useState("");
  const [status, setStatus] = useState("1");
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const load = async () => {
    setLoading(true);
    try {
      const data = await payService.getPayList();
      const list = Array.isArray(data?.pay_list) ? data.pay_list : [];
      setItems(list as PayModel[]);
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
      const res = await payService.savePay(payload);

      if (res.status === "Success" || res.status === true) {
        toast.success(res.info || "Saved successfully");
        setEditing(null);
        setName("");
        setStatus("1");
        await load();
      } else {
        toast.error(res.info || "Error saving data");
      }
    } catch {
      toast.error(CONSTANTS.MESSAGES.SOMETHING_WENT_WRONG);
    }
  };

  const onEdit = (item: PayModel) => {
    setEditing(item);
    setName(item.name || "");
    setStatus(String(item.status ?? "1"));
  };

  const onDelete = async (item: PayModel) => {
    if (!item.id) return;
    try {
      const res = await payService.deletePay(item.id);
      if (res.status === "Success" || res.status === true) {
        toast.success(res.info || "Deleted successfully");
        await load();
      } else {
        toast.error(res.info || "Error deleting data");
      }
    } catch {
      toast.error(CONSTANTS.MESSAGES.SOMETHING_WENT_WRONG);
    }
  };

  // Columns
  const columns = useMemo(
    () => [
      { field: PayModelLabels.ID, headerName: PAY_STRINGS.TABLE.HEADER_ID, width: 100 },
      { field: PayModelLabels.NAME, headerName: PAY_STRINGS.TABLE.HEADER_NAME, flex: 1 },
      {
        field: PayModelLabels.STATUS,
        headerName: PAY_STRINGS.TABLE.HEADER_STATUS,
        width: 120,
        renderCell: (params: any) => (
          <span
            className="text-center p-1 rounded"
            style={{
              backgroundColor: params.value === 1 ? `${COLORS.green}30` : `${COLORS.red}30`,
              color: params.value === 1 ? COLORS.green : COLORS.red,
            }}
          >
            {params.value === 1 ? PAY_STRINGS.TABLE.STATUS_ACTIVE : PAY_STRINGS.TABLE.STATUS_INACTIVE}
          </span>
        ),
      },
      {
        field: PayModelLabels.ACTIONS,
        headerName: PAY_STRINGS.TABLE.HEADER_ACTIONS,
        width: 120,
        renderCell: (params: any) => (
          <div className="d-flex align-items-center gap-3 w-100 h-100">
            <FiEdit style={{ cursor: "pointer" }} onClick={() => onEdit(params.row)} />
            <FiTrash2 style={{ cursor: "pointer" }} onClick={() => onDelete(params.row)} />
          </div>
        ),
      },
    ],
    [items]
  );

  return (
    <div className="container-fluid page-padding-2 vh-100" style={{ backgroundColor: COLORS.lightGray }}>
      <h4 className="my-4">{PAY_STRINGS.TITLE}</h4>
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
                {editing ? PAY_STRINGS.FORM.EDIT_PAY : PAY_STRINGS.FORM.ADD_PAY}
              </h5>
            </div>
            <div className="card-body">
              <form onSubmit={onSubmit}>
                <div className="row g-3 align-items-end">
                  {/* Name */}
                  <div className="col-md-12">
                    <label className="form-label" style={STYLES.field_label}>
                      {PAY_STRINGS.TABLE.HEADER_NAME} *
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
                      {PAY_STRINGS.TABLE.HEADER_STATUS} *
                    </label>
                    <select
                      className="form-select"
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                    >
                      <option value="1">{PAY_STRINGS.TABLE.STATUS_ACTIVE}</option>
                      <option value="0">{PAY_STRINGS.TABLE.STATUS_INACTIVE}</option>
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

export default PayList;
