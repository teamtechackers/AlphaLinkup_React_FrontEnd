import React, { useEffect, useState, useMemo } from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import { FiTrash2, FiEdit } from "react-icons/fi";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import cardActivationRequestsService from "../services/card_activation_requests_service";
import { CARD_ACTIVATION_REQUESTS_STRINGS } from "../utils/strings/pages/card_activation_requests_strings";
import { CONSTANTS } from "../utils/strings/constants";
import { CardActivationRequestModel, CardActivationRequestLabels } from "../models/card_activation_request_model";
import { COLORS } from "../utils/theme/colors";
import { STYLES } from "../utils/typography/styles";

const APPROVAL_STATUS = ["Pending", "Approved", "Rejected"];
const OVERALL_STATUS = ["Active", "Inactive"];

const CardActivationRequestsList: React.FC = () => {
  const [items, setItems] = useState<CardActivationRequestModel[]>([]);
  const [loading, setLoading] = useState(false);

  const [editing, setEditing] = useState<CardActivationRequestModel | null>(null);
  const [spUserId, setSpUserId] = useState<number | "">("");
  const [fullName, setFullName] = useState("");
  const [name, setName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [businessLocation, setBusinessLocation] = useState("");
  const [countryId, setCountryId] = useState<number | "">("");
  const [stateId, setStateId] = useState<number | "">("");
  const [cityId, setCityId] = useState<number | "">("");
  const [description, setDescription] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [overallStatus, setOverallStatus] = useState("Active");
  const [requestStatus, setRequestStatus] = useState("Pending");
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const [rowCount, setRowCount] = useState(0);

  const load = async (page = paginationModel.page, pageSize = paginationModel.pageSize) => {
    setLoading(true);
    try {
      const start = page * pageSize;
      const data = await cardActivationRequestsService.getList(page + 1, start, pageSize);

      const list = Array.isArray(data?.data)
        ? data.data.map((row: any[]) => ({
            id: Number(row[0]),
            name: row[1] ?? "",
            description: row[2] ?? "",
            request_status: row[3]?.replace(/<[^>]+>/g, "").trim() ?? "",
            overall_status: row[4]?.replace(/<[^>]+>/g, "").trim() ?? "",
            business_name: "",
            sp_user_id: null,
            country_id: null,
            state_id: null,
            city_id: null,
            card_number: "",
            card_status: "",
          }))
        : [];

      setItems(list);
      setRowCount(data?.recordsTotal ?? 0);
    } catch (err) {
      console.error(err);
      toast.error(CONSTANTS.MESSAGES.SOMETHING_WENT_WRONG);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(paginationModel.page, paginationModel.pageSize);
  }, [paginationModel]);

  const resetForm = () => {
    setEditing(null);
    setSpUserId("");
    setFullName("");
    setName("");
    setBusinessName("");
    setBusinessLocation("");
    setCountryId("");
    setStateId("");
    setCityId("");
    setDescription("");
    setCardNumber("");
    setRequestStatus("Pending");
    setOverallStatus("Active");
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const payload = {
        id: editing?.id ?? 0,
        sp_user_id: Number(spUserId),
        description,
        status: overallStatus === "Active" ? 1 : 0,
      };

      const res = await cardActivationRequestsService.save(payload);

      const success =
        res &&
        (res.status === true ||
          (typeof res.status === "string" && res.status.toLowerCase().includes("success")) ||
          res.success === true ||
          res.rcode === 200);

      if (success) {
        toast.success(editing ? CONSTANTS.MESSAGES.UPDATE_SUCCESS : CONSTANTS.MESSAGES.SAVE_SUCCESS);
        resetForm();
        await load();
      } else {
        toast.error(res.info || res.message || CONSTANTS.MESSAGES.SOMETHING_WENT_WRONG);
      }
    } catch (err) {
      console.error(err);
      toast.error(CONSTANTS.MESSAGES.SOMETHING_WENT_WRONG);
    }
  };

  const onEdit = (item: CardActivationRequestModel) => {
    setEditing(item);
    setSpUserId(item.id);
    setFullName(item.name ?? "");
    setDescription(item.description ?? "");
    setOverallStatus(item.overall_status ?? "Active");
  };

  const onDelete = async (item: CardActivationRequestModel) => {
    if (!item.id) return;
    if (!window.confirm(CONSTANTS.MESSAGES.DELETE_CONFIRM)) return;

    try {
      const res = await cardActivationRequestsService.delete(item.id);
      const success =
        res &&
        (res.status === "Success" ||
          (typeof res.status === "string" && res.status.toLowerCase().includes("success")) ||
          res.success === true);

      if (success) {
        toast.success(res.info || CONSTANTS.MESSAGES.DELETE_SUCCESS);
        await load();
      } else {
        toast.error(res.message || CONSTANTS.MESSAGES.SOMETHING_WENT_WRONG);
      }
    } catch (err) {
      console.error(err);
      toast.error(CONSTANTS.MESSAGES.SOMETHING_WENT_WRONG);
    }
  };

  const renderRequestStatus = (raw: any): React.ReactNode => {
    let normalized: number | null = null;

    if (raw == null) normalized = null;
    else if (typeof raw === "number") normalized = raw;
    else if (typeof raw === "string") {
      const s = raw.trim();
      if (s === "") normalized = null;
      else if (!isNaN(Number(s))) normalized = Number(s);
      else {
        const l = s.toLowerCase();
        if (l.startsWith("pend")) normalized = 1;
        else if (l.startsWith("app")) normalized = 2;
        else if (l.startsWith("rej")) normalized = 3;
      }
    }

    const bg =
      normalized === 1 ? `${COLORS.orange}30` :
      normalized === 2 ? `${COLORS.green}30` :
      normalized === 3 ? `${COLORS.red}30` :
      `${COLORS.gray}30`;

    const color =
      normalized === 1 ? COLORS.orange :
      normalized === 2 ? COLORS.green :
      normalized === 3 ? COLORS.red :
      COLORS.gray;

    const label =
      normalized === 1 ? "Pending" :
      normalized === 2 ? "Approved" :
      normalized === 3 ? "Rejected" :
      "-";

    return (
      <span className="text-center p-1 rounded" style={{ backgroundColor: bg, color }}>
        {label}
      </span>
    );
  };

  const columns = useMemo(
    () => [
      { field: CardActivationRequestLabels.ID, headerName: CARD_ACTIVATION_REQUESTS_STRINGS.TABLE.HEADER_ID, width: 100 },
      { field: CardActivationRequestLabels.NAME, headerName: CARD_ACTIVATION_REQUESTS_STRINGS.TABLE.HEADER_NAME, width: 150 },
      { field: CardActivationRequestLabels.DESCRIPTION, headerName: CARD_ACTIVATION_REQUESTS_STRINGS.TABLE.HEADER_DESCRIPTION, width: 250 },
      {
        field: CardActivationRequestLabels.REQUEST_STATUS,
        headerName: CARD_ACTIVATION_REQUESTS_STRINGS.TABLE.HEADER_REQUEST_STATUS,
        width: 160,
        renderCell: (params: any) =>
          renderRequestStatus(params.value ?? params.row?.request_status),
      },
      {
        field: CardActivationRequestLabels.OVERALL_STATUS,
        headerName: CARD_ACTIVATION_REQUESTS_STRINGS.TABLE.HEADER_OVERALL_STATUS,
        width: 140,
        renderCell: (params: any) => (
          <span
            className="text-center p-1 rounded"
            style={{
              backgroundColor: params.value.toLowerCase().includes("active") ? `${COLORS.green}30` : `${COLORS.red}30`,
              color: params.value.toLowerCase().includes("active") ? COLORS.green : COLORS.red,
            }}
          >
            {params.value.replace(/<[^>]+>/g, "")}
          </span>
        ),
      },
      {
        field: CardActivationRequestLabels.ACTIONS,
        headerName: CARD_ACTIVATION_REQUESTS_STRINGS.TABLE.HEADER_ACTIONS,
        width: 120,
        sortable: false,
        filterable: false,
        renderCell: (params: any) => (
          <div className="d-flex align-items-center gap-3 w-100 h-100">
            <FiEdit className="icon-hover" size={18} style={{ cursor: "pointer" }} onClick={() => onEdit(params.row)} />
            <FiTrash2 className="icon-hover" size={18} style={{ cursor: "pointer" }} onClick={() => onDelete(params.row)} />
          </div>
        ),
      },
    ],
    [items]
  );

  return (
    <div className="container-fluid page-padding-2" style={{ backgroundColor: COLORS.lightGray }}>
      <h4 className="my-4">{CARD_ACTIVATION_REQUESTS_STRINGS.TITLE}</h4>
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
              onPaginationModelChange={setPaginationModel}
              paginationMode="server"
              rowCount={rowCount}
            />
          </Box>
        </div>

        {/* Form */}
        <div className="col-lg-4">
          <div className="card shadow-sm">
            <div className="card-header" style={{ backgroundColor: COLORS.lightGray }}>
              <h5 className="mb-0">{editing ? CARD_ACTIVATION_REQUESTS_STRINGS.FORM.EDIT : CARD_ACTIVATION_REQUESTS_STRINGS.FORM.ADD}</h5>
            </div>
            <div className="card-body">
              <form onSubmit={onSubmit}>
                <div className="row g-3 align-items-end">
                  {/* Full Name */}
                  <div className="col-md-12">
                    <label className="form-label" style={STYLES.field_label}>{CARD_ACTIVATION_REQUESTS_STRINGS.FORM.LABELS.FULL_NAME} *</label>
                    <select className="form-select" value={spUserId} onChange={(e) => setSpUserId(Number(e.target.value))} required>
                      <option value={54}>Test User</option>
                    </select>
                  </div>

                  {/* Name */}
                  <div className="col-md-12">
                    <label className="form-label" style={STYLES.field_label}>{CARD_ACTIVATION_REQUESTS_STRINGS.FORM.LABELS.NAME} *</label>
                    <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} required />
                  </div>

                  {/* Business Name */}
                  <div className="col-md-12">
                    <label className="form-label" style={STYLES.field_label}>{CARD_ACTIVATION_REQUESTS_STRINGS.FORM.LABELS.BUSINESS_NAME} *</label>
                    <input type="text" className="form-control" value={businessName} onChange={(e) => setBusinessName(e.target.value)} required />
                  </div>

                  {/* Business Location */}
                  <div className="col-md-12">
                    <label className="form-label" style={STYLES.field_label}>{CARD_ACTIVATION_REQUESTS_STRINGS.FORM.LABELS.BUSINESS_LOCATION} *</label>
                    <input type="text" className="form-control" value={businessLocation} onChange={(e) => setBusinessLocation(e.target.value)} required />
                  </div>

                  {/* Country */}
                  <div className="col-md-12">
                    <label className="form-label" style={STYLES.field_label}>{CARD_ACTIVATION_REQUESTS_STRINGS.FORM.LABELS.COUNTRY} *</label>
                    <select className="form-select" value={countryId} onChange={(e) => setCountryId(Number(e.target.value))} required>
                      <option value={1}>Test Country</option>
                    </select>
                  </div>

                  {/* State */}
                  <div className="col-md-12">
                    <label className="form-label" style={STYLES.field_label}>{CARD_ACTIVATION_REQUESTS_STRINGS.FORM.LABELS.STATE} *</label>
                    <select className="form-select" value={stateId} onChange={(e) => setStateId(Number(e.target.value))} required>
                      <option value={1}>Test State</option>
                    </select>
                  </div>

                  {/* City */}
                  <div className="col-md-12">
                    <label className="form-label" style={STYLES.field_label}>{CARD_ACTIVATION_REQUESTS_STRINGS.FORM.LABELS.CITY} *</label>
                    <select className="form-select" value={cityId} onChange={(e) => setCityId(Number(e.target.value))} required>
                      <option value={1}>Test City</option>
                    </select>
                  </div>

                  {/* Description */}
                  <div className="col-md-12">
                    <label className="form-label" style={STYLES.field_label}>{CARD_ACTIVATION_REQUESTS_STRINGS.FORM.LABELS.DESCRIPTION} *</label>
                    <textarea className="form-control" value={description} onChange={(e) => setDescription(e.target.value)} required />
                  </div>

                  {/* Card Number */}
                  <div className="col-md-12">
                    <label className="form-label" style={STYLES.field_label}>{CARD_ACTIVATION_REQUESTS_STRINGS.FORM.LABELS.CARD_NUMBER} *</label>
                    <input type="text" className="form-control" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} required />
                  </div>

                  {/* Request Status */}
                  <div className="col-md-12">
                    <label className="form-label" style={STYLES.field_label}>
                      {CARD_ACTIVATION_REQUESTS_STRINGS.FORM.LABELS.CARD_STATUS} *
                    </label>
                    <select
                      className="form-select"
                      value={requestStatus}
                      onChange={(e) => setRequestStatus(e.target.value)}
                      required
                    >
                      <option value="1">Pending</option>
                      <option value="2">Approved</option>
                      <option value="3">Rejected</option>
                    </select>
                  </div>

                  {/* Overall Status */}
                  <div className="col-md-12">
                    <label className="form-label" style={STYLES.field_label}>{CARD_ACTIVATION_REQUESTS_STRINGS.FORM.LABELS.STATE} *</label>
                    <select className="form-select" value={overallStatus} onChange={(e) => setOverallStatus(e.target.value)} required>
                      <option value="1">Active</option>
                      <option value="0">Inactive</option>
                    </select>
                  </div>
                </div>

                {/* Buttons */}
                <div className="d-flex gap-2 mt-3">
                  <button type="submit" className="btn" style={{ backgroundColor: COLORS.purple, color: COLORS.white }}>
                    {editing ? CONSTANTS.BUTTONS.UPDATE : CONSTANTS.BUTTONS.SAVE}
                  </button>
                  {editing && (
                    <button type="button" className="btn" style={{ backgroundColor: COLORS.red, color: COLORS.white }} onClick={resetForm}>
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

export default CardActivationRequestsList;
