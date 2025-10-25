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
import GlobalService from "../services/global_service";

const CardActivationRequestsList: React.FC = () => {
  const [items, setItems] = useState<CardActivationRequestModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<CardActivationRequestModel | null>(null);
  const [spUserId, setSpUserId] = useState<number | "">("");
  const [userId, setUserId] = useState<number | "">("");
  const [fullName, setFullName] = useState("");
  const [name, setName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [businessLocation, setBusinessLocation] = useState("");
  const [countryId, setCountryId] = useState<number | "">("");
  const [stateId, setStateId] = useState<number | "">("");
  const [cityId, setCityId] = useState<number | "">("");
  const [description, setDescription] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const [rowCount, setRowCount] = useState(0);
  const [cardStatus, setCardtStatus] = useState<number | "">(0);
  const [status, setStatus] = useState<number | "">(3);
  const [countries, setCountries] = useState<any[]>([]);
  const [states, setStates] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const parseCardStatus = (raw: any): number => {
    if (raw == null) return 1;
    if (typeof raw === "number") return raw;
    const s = String(raw).trim();
    if (!isNaN(Number(s)) && s !== "") return Number(s);
    const l = s.toLowerCase();
    if (l.startsWith("pend")) return 1;
    if (l.startsWith("app")) return 2;
    if (l.startsWith("rej")) return 3;
    return 1;
  };

  const parseOverallStatus = (raw: any): number => {
    if (raw == null) return 1;
    if (typeof raw === "number") return raw;
    const s = String(raw).trim().toLowerCase();
    if (s === "1" || s.includes("active")) return 1;
    return 0;
  };

  const load = async (page = paginationModel.page, pageSize = paginationModel.pageSize) => {
    setLoading(true);
    try {
      const start = page * pageSize;
      const data = await cardActivationRequestsService.getList(page + 1, start, pageSize);

      const list = Array.isArray(data?.card_activation_requests_list)
        ? data.card_activation_requests_list.map((row: any) => ({
            row_id: Number(row.row_id),
            ubc_id: row.ubc_id ? Number(row.ubc_id) : null,
            sp_user_id: row.sp_user_id ? Number(row.sp_user_id) : null,
            user_id: row.user_id ? Number(row.user_id) : null,
            user_name: row.user_name ?? "",
            card_activation_name: row.card_activation_name ?? "",
            business_name: row.business_name ?? "",
            business_location: row.business_location ?? "",
            country_id: row.country_id ?? null,
            country_name: row.country_name ?? "",
            state_id: row.state_id ?? null,
            state_name: row.state_name ?? "",
            city_id: row.city_id ?? null,
            city_name: row.city_name ?? "",
            description: row.description ?? "",
            card_number: row.card_number ?? "",
            card_status: row.card_status ?? "",
            status: row.status ?? "",
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
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const list = await GlobalService.getCountries();
        setCountries(list);
      } catch (err) {
        console.error("Error loading countries", err);
      }
    };
    fetchCountries();
  }, []);

  useEffect(() => {
    if (!countryId) {
      setStates([]);
      setCities([]);
      return;
    }
    const fetchStates = async () => {
      try {
        const list = await GlobalService.getStates(countryId);
        setStates(list);
        setCities([]);
        setStateId("");
        setCityId("");
      } catch (err) {
        console.error("Error loading states", err);
      }
    };
    fetchStates();
  }, [countryId]);

  useEffect(() => {
    if (!stateId) {
      setCities([]);
      return;
    }
  const fetchCities = async () => {
    try {
      const list = await GlobalService.getCities(stateId);
      setCities(list);
      setCityId("");
    } catch (err) {
      console.error("Error loading cities", err);
    }
  };
    fetchCities();
  }, [stateId]);

    useEffect(() => {
  const fetchUsers = async () => {
      try {
        const list = await GlobalService.getUsers();
        setUsers(list);
      } catch (err) {
        console.error("Error loading users", err);
      }
    };
    fetchUsers();
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload: Partial<CardActivationRequestModel> = {
        ...(editing ? { row_id: editing.ubc_id } : {}),
        sp_user_id: spUserId !== "" ? spUserId : editing?.sp_user_id ?? "",
        user_name: name || editing?.user_name || "",
        card_activation_name: fullName || editing?.card_activation_name || "",
        business_name: businessName || editing?.business_name || "",
        business_location: businessLocation || editing?.business_location || "",
        country_id: countryId !== "" ? countryId : editing?.country_id ?? "",
        state_id: stateId !== "" ? stateId : editing?.state_id ?? "",
        city_id: cityId !== "" ? cityId : editing?.city_id ?? "",
        description: description || editing?.description || "",
        card_number: cardNumber || editing?.card_number || "",
        card_status: String(cardStatus !== "" ? cardStatus : parseCardStatus(editing?.card_status)),
        status: String(status !== "" ? status : parseOverallStatus(editing?.status)),
      };

      console.log("Submit payload: ", payload);

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

  const onEdit = async (item: CardActivationRequestModel) => {
    setEditing(item);

    setSpUserId(item.sp_user_id !== null && item.sp_user_id !== undefined ? Number(item.sp_user_id) : "");
    setUserId(item.user_id ? Number(item.user_id) : "");
    setFullName(item.card_activation_name ?? "");
    setName(item.user_name ?? "");
    setBusinessName(item.business_name ?? "");
    setBusinessLocation(item.business_location ?? "");
    
    if (item.country_id) {
      setCountryId(Number(item.country_id));
      const stateList = await GlobalService.getStates(item.country_id);
      setStates(stateList);

      if (item.state_id) {
        setStateId(Number(item.state_id));
        const cityList = await GlobalService.getCities(item.state_id);
        setCities(cityList);

        if (item.city_id) {
          setCityId(Number(item.city_id));
        }
      }
    }

    setDescription(item.description ?? "");
    setCardNumber(item.card_number ?? "");
    setCardtStatus(parseCardStatus(item.card_status));
    setStatus(parseOverallStatus(item.status));
  };

  const resetForm = () => {
    setEditing(null);
    setFullName("");
    setSpUserId("");
    setUserId("");
    setFullName("");
    setName("");
    setBusinessName("");
    setBusinessLocation("");
    setCountryId("");
    setStateId("");
    setCityId("");
    setDescription("");
    setCardNumber("");
     setCardtStatus(1);
    setStatus(1);
  };

  const onDelete = async (item: CardActivationRequestModel) => {
    if (!item.ubc_id) return;
    if (!window.confirm(CONSTANTS.MESSAGES.DELETE_CONFIRM)) return;

    try {
      const res = await cardActivationRequestsService.delete(Number(item.ubc_id));
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
      { field: CardActivationRequestLabels.UBC_ID, headerName: CARD_ACTIVATION_REQUESTS_STRINGS.TABLE.HEADER_ID, width: 100 },
      { field: CardActivationRequestLabels.USER_NAME, headerName: CARD_ACTIVATION_REQUESTS_STRINGS.TABLE.HEADER_NAME, width: 150 },
      { field: CardActivationRequestLabels.DESCRIPTION, headerName: CARD_ACTIVATION_REQUESTS_STRINGS.TABLE.HEADER_DESCRIPTION, width: 250 },
      {
        field: CardActivationRequestLabels.CARD_STATUS,
        headerName: CARD_ACTIVATION_REQUESTS_STRINGS.TABLE.HEADER_REQUEST_STATUS,
        width: 160,
        renderCell: (params: any) =>
          renderRequestStatus(params.value ?? params.row?.request_status),
      },
      {
        field: CardActivationRequestLabels.STATUS,
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
    <div className="container-fluid" style={{ backgroundColor: COLORS.lightGray }}>

      {/* Page Title */}
      <div className="row">
        <div className="col-12">
          <div style={STYLES.page_title}>
              {CARD_ACTIVATION_REQUESTS_STRINGS.TITLE}
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
              getRowId={(row) => row.ubc_id ?? 0}
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
                    <label className="form-label" style={STYLES.field_label}>
                      {CARD_ACTIVATION_REQUESTS_STRINGS.FORM.FIELD_LABELS.FULL_NAME}
                      <span style={{ color: COLORS.red}}> *</span>
                    </label>
                    <select
                      className="form-select"
                      value={userId}
                      onChange={(e) => {
                        const v = e.target.value === "" ? "" : Number(e.target.value);
                        setSpUserId(v === "" ? "" : Number(v));
                        setUserId(v === "" ? "" : Number(v));
                      }}
                      required
                    >
                      <option value="">Select User</option>
                      {users.map((u) => (
                        <option key={u.user_id} value={u.user_id}>
                          {u.user_name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Name */}
                  <div className="col-md-12">
                    <label className="form-label" style={STYLES.field_label}>
                      {CARD_ACTIVATION_REQUESTS_STRINGS.FORM.FIELD_LABELS.NAME}
                      <span style={{ color: COLORS.red}}> *</span>
                    </label>
                    <input type="text" className="form-control" value={name}
                     maxLength={CONSTANTS.MAX_LENGTHS.FIELD_100}
                      onChange={(e) => setName(e.target.value)} required />
                  </div>

                  {/* Business Name */}
                  <div className="col-md-12">
                    <label className="form-label" style={STYLES.field_label}>
                      {CARD_ACTIVATION_REQUESTS_STRINGS.FORM.FIELD_LABELS.BUSINESS_NAME}
                      <span style={{ color: COLORS.red}}> *</span>
                    </label>
                    <input type="text" className="form-control" value={businessName} 
                    maxLength={CONSTANTS.MAX_LENGTHS.FIELD_150}
                    onChange={(e) => setBusinessName(e.target.value)} required />
                  </div>

                  {/* Business Location */}
                  <div className="col-md-12">
                    <label className="form-label" style={STYLES.field_label}>
                      {CARD_ACTIVATION_REQUESTS_STRINGS.FORM.FIELD_LABELS.BUSINESS_LOCATION}
                      <span style={{ color: COLORS.red}}> *</span>
                    </label>
                    <input type="text" className="form-control" value={businessLocation} 
                    maxLength={CONSTANTS.MAX_LENGTHS.FIELD_150}
                    onChange={(e) => setBusinessLocation(e.target.value)} required />
                  </div>

                  {/* Country */}
                  <div className="col-md-12">
                    <label className="form-label" style={STYLES.field_label}>
                      {CARD_ACTIVATION_REQUESTS_STRINGS.FORM.FIELD_LABELS.COUNTRY}
                      <span style={{ color: COLORS.red}}> *</span>
                    </label>
                    <select
                        className="form-select"
                        value={countryId}
                        onChange={(e) => setCountryId(Number(e.target.value))}
                        required
                      >
                        <option value="">Select Country</option>
                        {countries.map((c) => (
                          <option key={c.country_id} value={c.country_id}>
                            {c.country_name}
                          </option>
                        ))}
                    </select>
                  </div>

                  {/* State */}
                  <div className="col-md-12">
                    <label className="form-label" style={STYLES.field_label}>
                      {CARD_ACTIVATION_REQUESTS_STRINGS.FORM.FIELD_LABELS.STATE}
                      <span style={{ color: COLORS.red}}> *</span>
                    </label>
                    <select
                      className="form-select"
                      value={stateId}
                      onChange={(e) => setStateId(Number(e.target.value))}
                      required
                      disabled={!countryId}
                    >
                      <option value="">Select State</option>
                      {states.map((s) => (
                        <option key={s.state_id} value={s.state_id}>
                          {s.state_name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* City */}
                  <div className="col-md-12">
                    <label className="form-label" style={STYLES.field_label}>
                      {CARD_ACTIVATION_REQUESTS_STRINGS.FORM.FIELD_LABELS.CITY}
                      <span style={{ color: COLORS.red}}> *</span>
                    </label>
                    <select
                      className="form-select"
                      value={cityId}
                      onChange={(e) => setCityId(Number(e.target.value))}
                      required
                      disabled={!stateId}
                    >
                      <option value="">Select City</option>
                      {cities.map((c) => (
                        <option key={c.city_id} value={c.city_id}>
                          {c.city_name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Description */}
                  <div className="col-md-12">
                    <label className="form-label" style={STYLES.field_label}>
                      {CARD_ACTIVATION_REQUESTS_STRINGS.FORM.FIELD_LABELS.DESCRIPTION}
                      <span style={{ color: COLORS.red}}> *</span>
                    </label>
                    <textarea className="form-control" value={description} 
                    maxLength={CONSTANTS.MAX_LENGTHS.FIELD_200}
                    onChange={(e) => setDescription(e.target.value)} required />
                  </div>

                  {/* Card Number */}
                  <div className="col-md-12">
                    <label className="form-label" style={STYLES.field_label}>
                      {CARD_ACTIVATION_REQUESTS_STRINGS.FORM.FIELD_LABELS.CARD_NUMBER}
                      <span style={{ color: COLORS.red}}> *</span>
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      value={cardNumber}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (/^\d*$/.test(val)) {
                          setCardNumber(val);
                        }
                      }}
                      required
                       maxLength={CONSTANTS.MAX_LENGTHS.FIELD_100}
                      onWheel={(e) => e.currentTarget.blur()}
                    />
                  </div>

                  {/* Request Status */}
                  <div className="col-md-12">
                    <label className="form-label" style={STYLES.field_label}>
                      {CARD_ACTIVATION_REQUESTS_STRINGS.FORM.FIELD_LABELS.CARD_STATUS}
                      <span style={{ color: COLORS.red}}> *</span>
                    </label>
                    <select
                      className="form-select"
                      value={cardStatus === "" ? 1 : cardStatus}
                      onChange={(e) => setCardtStatus(e.target.value === "" ? "" : Number(e.target.value))}
                      required
                    >
                      <option value="" >Select Card Status</option>
                      <option value={1}>Pending</option>
                      <option value={2}>Approved</option>
                      <option value={3}>Rejected</option>
                    </select>
                  </div>

                  {/* Overall Status */}
                  <div className="col-md-12">
                    <label className="form-label" style={STYLES.field_label}>
                      {CARD_ACTIVATION_REQUESTS_STRINGS.FORM.FIELD_LABELS.STATE}
                      <span style={{ color: COLORS.red}}> *</span>
                    </label>
                    <select className="form-select" value={status === "" ? 1 : status} onChange={(e) => setStatus(e.target.value === "" ? "" : Number(e.target.value))} required>
                      <option value="" >Select Status</option>
                      <option value={1}>Active</option>
                      <option value={0}>Inactive</option>
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
