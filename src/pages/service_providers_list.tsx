import React, { useEffect, useState, useMemo } from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import { FiTrash2, FiEdit, FiEye } from "react-icons/fi";
import { toast } from "react-toastify";

import serviceProvidersService from "../services/service_providers_service";
import { SERVICE_PROVIDERS_STRINGS } from "../utils/strings/pages/service_providers_strings";
import { CONSTANTS } from "../utils/strings/constants";
import { ServiceProviderModel, ServiceProviderModelLabels } from "../models/service_provider_model";
import { COLORS } from "../utils/theme/colors";
import { STYLES } from "../utils/typography/styles";
import GlobalService from "../services/global_service";
import DetailsDialog from "../components/DetailsDialog";
import Dialog from "@mui/material/Dialog";
import ServicesListPage from "./services_details_list";
const ServiceProvidersList: React.FC = () => {
  const [items, setItems] = useState<ServiceProviderModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<ServiceProviderModel | null>(null);
  const [spUserId, setSpUserId] = useState("");
  const [fullName, setFullName] = useState("");
  const [countryId, setCountryId] = useState("");
  const [stateId, setStateId] = useState("");
  const [cityId, setCityId] = useState("");
  const [description, setDescription] = useState("");
  const [avgSpRating, setAvgSpRating] = useState("");
  const [approvalStatus, setApprovalStatus] = useState<number>(0);
  const [status, setStatus] = useState<number>(3);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const [rowCount, setRowCount] = useState(0);

  const [countries, setCountries] = useState<any[]>([]);
  const [states, setStates] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRow, setSelectedRow] = useState<ServiceProviderModel | null>(null);

  const [openServicesDialog, setOpenServicesDialog] = useState(false);
  const [selectedSPId, setSelectedSPId] = useState("");

  const handleServicesClick = (spId: string) => {
    setSelectedSPId(spId);
    setOpenServicesDialog(true);
  };

  const handleViewClick = (row: ServiceProviderModel) => {
    setSelectedRow(row);
    setOpenDialog(true);
  };

  const approvalStatusStringToNumber: Record<string, number> = {
    Pending: 1,
    Approved: 2,
    Rejected: 3,
  };

  const statusStringToNumber: Record<string, number> = {
    Active: 1,
    Inactive: 0,
  };

  const load = async (page = paginationModel.page, pageSize = paginationModel.pageSize) => {
    setLoading(true);
    try {
      const start = page * pageSize;
      const data = await serviceProvidersService.getList(page + 1, start, pageSize);

      const list: ServiceProviderModel[] = Array.isArray(data?.service_providers_list)
        ? data.service_providers_list.map((row: any) => ({
            row_id: row.row_id,
            sp_id: row.sp_id,
            user_id: row.user_id,
            user_name: row.user_name,
            country_id: row.country_id,
            country_name: row.country_name,
            state_id: row.state_id,
            state_name: row.state_name,
            city_id: row.city_id,
            city_name: row.city_name,
            description: row.description,
            sp_rating: row.sp_rating,
            approval_status: row.approval_status,
            status: row.status,
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

  const resetForm = () => {
  setEditing(null);
  setSpUserId("");
  setFullName("");
  setCountryId("");
  setStateId("");
  setCityId("");
  setDescription("");
  setAvgSpRating("");
  setApprovalStatus(1);
  setStatus(1);
};

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
   
    
    try {
      const payload = {
        sp_id: editing?.sp_id ? Number(editing.sp_id) : undefined,
        sp_user_id: Number(spUserId),
        country_id: Number(countryId),
        state_id: Number(stateId),
        city_id: Number(cityId),
        description,
        avg_sp_rating: Number(avgSpRating),
        approval_status: approvalStatus,
        status: status, 
      };

      const res = await serviceProvidersService.save(payload);

      if (res.status?.toLowerCase() === "success") {
        toast.success(res.info);
        resetForm();
        await load();
      } else {
        toast.error(res.message || CONSTANTS.MESSAGES.SOMETHING_WENT_WRONG);
      }
    } catch (err) {
      console.error(err);
      toast.error(CONSTANTS.MESSAGES.SOMETHING_WENT_WRONG);
    }
  };

  const onEdit = async (item: ServiceProviderModel) => {
    setEditing(item);
    setSpUserId(item.user_id ? String(item.user_id) : "");
    setFullName(item.user_name ?? "");
    setDescription(item.description ?? "");
    
    if (item.country_id) {
      setCountryId(String(item.country_id));
      const stateList = await GlobalService.getStates(item.country_id);
      setStates(stateList);

      if (item.state_id) {
        setStateId(String(item.state_id));
        const cityList = await GlobalService.getCities(item.state_id);
        setCities(cityList);

        if (item.city_id) {
          setCityId(String(item.city_id));
        }
      }
    }

    setAvgSpRating(item.sp_rating ?? "");
    setApprovalStatus(approvalStatusStringToNumber[item.approval_status] ?? 1);
    setStatus(statusStringToNumber[item.status] ?? 1);
  };

  const onDelete = async (item: ServiceProviderModel) => {
    if (!item.sp_id) return;
    if (!window.confirm(CONSTANTS.MESSAGES.DELETE_CONFIRM)) return;
    try {
      const res = await serviceProvidersService.delete(Number(item.sp_id));
      if (res.status?.toLowerCase() === "success") {
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

  const renderApprovalStatus = (raw: any): React.ReactNode => {
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
      normalized === 1 ? SERVICE_PROVIDERS_STRINGS.TABLE.STATUS_PENDING :
      normalized === 2 ? SERVICE_PROVIDERS_STRINGS.TABLE.STATUS_APPROVED :
      normalized === 3 ? SERVICE_PROVIDERS_STRINGS.TABLE.STATUS_REJECTED :
      "-";

    return (
      <span className="text-center p-1 rounded" style={{ backgroundColor: bg, color }}>
        {label}
      </span>
    );
  };

  const columns = useMemo(
    () => [
      { field: ServiceProviderModelLabels.SP_ID, headerName: SERVICE_PROVIDERS_STRINGS.TABLE.HEADER_ID, width: 80 },
      { field: ServiceProviderModelLabels.USER_NAME, headerName: SERVICE_PROVIDERS_STRINGS.TABLE.HEADER_FULL_NAME, width: 200 },
      { field: ServiceProviderModelLabels.DESCRIPTION, headerName: SERVICE_PROVIDERS_STRINGS.TABLE.HEADER_DESCRIPTION, width: 300 },
      {
        field: ServiceProviderModelLabels.APPROVAL_STATUS,
        headerName: SERVICE_PROVIDERS_STRINGS.TABLE.HEADER_APPROVAL_STATUS,
        width: 160,
        renderCell: (params: any) =>
          renderApprovalStatus(params.value ?? params.row?.approval_status),
      },
      {
        field: ServiceProviderModelLabels.STATUS,
        headerName: SERVICE_PROVIDERS_STRINGS.TABLE.HEADER_STATUS,
        width: 140,
        renderCell: (params: any) => {
          const normalized = typeof params.value === "string"
            ? statusStringToNumber[params.value] ?? 0
            : Number(params.value);

          return (
            <span
              className="text-center p-1 rounded"
              style={{
                backgroundColor: normalized === 1 ? `${COLORS.green}30` : `${COLORS.red}30`,
                color: normalized === 1 ? COLORS.green : COLORS.red,
              }}
            >
              {normalized === 1
                ? SERVICE_PROVIDERS_STRINGS.TABLE.STATUS_ACTIVE
                : SERVICE_PROVIDERS_STRINGS.TABLE.STATUS_INACTIVE}
            </span>
          );
        },
      },
      {
        field: ServiceProviderModelLabels.ACTIONS,
        headerName: SERVICE_PROVIDERS_STRINGS.TABLE.HEADER_ACTIONS,
        width: 150,
        sortable: false,
        filterable: false,
        renderCell: (params: any) => {
          const row: ServiceProviderModel & { approval_status_num?: number; status_num?: number } = {
            ...params.row,
            approval_status_num: typeof params.row.approval_status === "string"
              ? approvalStatusStringToNumber[params.row.approval_status] ?? 1
              : Number(params.row.approval_status),
            status_num: typeof params.row.status === "string"
              ? statusStringToNumber[params.row.status] ?? 1
              : Number(params.row.status),
          };
          return (
            <div className="d-flex align-items-center gap-3 w-100 h-100">
              <FiEdit size={18} style={{ cursor: "pointer" }} onClick={() => onEdit(row)} />
              <FiEye
                size={18}
                style={{ cursor: "pointer" }}
                onClick={() => handleViewClick(params.row)}
                title="View Details"
              />
              <FiEye
                size={18}
                style={{ cursor: "pointer" }}
                onClick={() => handleServicesClick(row.sp_id)}
                title="View Services"
              />
              <FiTrash2 size={18} style={{ cursor: "pointer" }} onClick={() => onDelete(row)} />
            </div>
          );
        },
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
              {SERVICE_PROVIDERS_STRINGS.TITLE}
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
              getRowId={(row) => row.sp_id}
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
              <h5 className="mb-0">{editing ? SERVICE_PROVIDERS_STRINGS.FORM.EDIT : SERVICE_PROVIDERS_STRINGS.FORM.ADD}</h5>
            </div>
            <div className="card-body">
              <form onSubmit={onSubmit}>
                <div className="row g-3 align-items-end">

                  <div className="col-md-12">
                    <label className="form-label" style={STYLES.field_label}>
                      {SERVICE_PROVIDERS_STRINGS.FORM.FIELD_LABELS.FULL_NAME}
                      <span style={{ color: COLORS.red }}> *</span>
                    </label>
                    <select
                      className="form-select"
                      value={spUserId}
                      onChange={(e) => setSpUserId(e.target.value)}
                      required
                    >
                      <option value="">Select User</option>
                      {users.map((u) => (
                        <option key={u.user_id} value={String(u.user_id)}>
                          {u.user_name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Country */}
                  <div className="col-md-12">
                    <label className="form-label" style={STYLES.field_label}>
                      {SERVICE_PROVIDERS_STRINGS.FORM.FIELD_LABELS.COUNTRY}
                      <span style={{ color: COLORS.red }}> *</span>
                    </label>
                    <select
                      className="form-select"
                      value={countryId}
                      onChange={(e) => setCountryId(e.target.value)}
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
                      {SERVICE_PROVIDERS_STRINGS.FORM.FIELD_LABELS.STATE}
                      <span style={{ color: COLORS.red }}> *</span>
                    </label>
                    <select
                      className="form-select"
                      value={stateId}
                      onChange={(e) => setStateId(e.target.value)}
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
                      {SERVICE_PROVIDERS_STRINGS.FORM.FIELD_LABELS.CITY}
                      <span style={{ color: COLORS.red }}> *</span>
                    </label>
                    <select
                      className="form-select"
                      value={cityId}
                      onChange={(e) => setCityId(e.target.value)}
                      required
                      disabled={!stateId}
                    >
                      <option value="">Select City</option>
                      {cities.map((ct) => (
                      <option key={ct.city_id} value={ct.city_id}>
                        {ct.city_name}
                      </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-12">
                    <label className="form-label" style={STYLES.field_label}>
                      {SERVICE_PROVIDERS_STRINGS.FORM.FIELD_LABELS.DESCRIPTION}
                      <span style={{ color: COLORS.red }}> *</span>
                    </label>
                    <textarea className="form-control" 
                    maxLength={CONSTANTS.MAX_LENGTHS.FIELD_200}
                    value={description} onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                  </div>

                  <div className="col-md-12">
                    <label className="form-label" style={STYLES.field_label}>
                      {SERVICE_PROVIDERS_STRINGS.FORM.FIELD_LABELS.SP_RATING}
                      <span style={{ color: COLORS.red }}> *</span>
                    </label>
                    <input type="number" step="0.1" className="form-control" value={avgSpRating} onChange={(e) => setAvgSpRating(e.target.value)} required/>
                  </div>

                  <div className="col-md-12">
                    <label className="form-label" style={STYLES.field_label}>
                      {SERVICE_PROVIDERS_STRINGS.FORM.FIELD_LABELS.APPROVAL_STATUS}
                      <span style={{ color: COLORS.red }}> *</span>
                    </label>
                    <select className="form-select" value={approvalStatus} onChange={(e) => setApprovalStatus(Number(e.target.value))} required>
                      <option value="">Select Approval Status</option>
                      <option value="1">Pending</option>
                      <option value="2">Approved</option>
                      <option value="3">Rejected</option>
                    </select>
                  </div>

                  <div className="col-md-12">
                    <label className="form-label" style={STYLES.field_label}>
                      {SERVICE_PROVIDERS_STRINGS.FORM.FIELD_LABELS.STATUS}
                      <span style={{ color: COLORS.red }}> *</span>
                    </label>
                    <select className="form-select" value={status} onChange={(e) => setStatus(Number(e.target.value))} required>
                      <option value="">Select Status</option>
                      <option value="1">Active</option>
                      <option value="0">Inactive</option>
                    </select>
                  </div>
                </div>

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

      {selectedRow && (
        <DetailsDialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          title="Service Provider Details"
          fields={[
            { label: "SP ID", value: selectedRow.sp_id },
            { label: "User Name", value: selectedRow.user_name },
            { label: "Country", value: selectedRow.country_name },
            { label: "State", value: selectedRow.state_name },
            { label: "City", value: selectedRow.city_name },
            { label: "Description", value: selectedRow.description },
            { label: "Average Rating", value: selectedRow.sp_rating },
            { label: "Approval Status", value: selectedRow.approval_status },
            { label: "Status", value: selectedRow.status === "1" ? "Active" : "Inactive" },
          ]}
        />
      )}

      {/* Services Dialog */}
      <Dialog 
        open={openServicesDialog} 
        onClose={() => setOpenServicesDialog(false)} 
        maxWidth="lg" 
        fullWidth
      >
        <ServicesListPage serviceId={selectedSPId} />
      </Dialog>

    </div>
  );
};

export default ServiceProvidersList;
