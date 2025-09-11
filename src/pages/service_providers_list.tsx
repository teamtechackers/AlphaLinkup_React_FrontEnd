import React, { useEffect, useState, useMemo } from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import { FiTrash2, FiEdit } from "react-icons/fi";
import { toast } from "react-toastify";

import serviceProvidersService from "../services/service_providers_service";
import { SERVICE_PROVIDERS_STRINGS } from "../utils/strings/pages/service_providers_strings";
import { CONSTANTS } from "../utils/strings/constants";
import { ServiceProviderModel, ServiceProviderModelLabels } from "../models/service_provider_model";
import { COLORS } from "../utils/theme/colors";
import { STYLES } from "../utils/typography/styles";
import GlobalService from "../services/global_service";

const ServiceProvidersList: React.FC = () => {
  const [items, setItems] = useState<ServiceProviderModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<ServiceProviderModel | null>(null);

  const [spUserId, setSpUserId] = useState("0");
  const [fullName, setFullName] = useState("");
  const [countryId, setCountryId] = useState("101");
  const [stateId, setStateId] = useState("17");
  const [cityId, setCityId] = useState("1726");
  const [description, setDescription] = useState("");
  const [avgSpRating, setAvgSpRating] = useState("0");
  const [approvalStatus, setApprovalStatus] = useState("1");
  const [status, setStatus] = useState("1");

  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const [rowCount, setRowCount] = useState(0);

  const [countries, setCountries] = useState<any[]>([]);
  const [states, setStates] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);

  const load = async (page = paginationModel.page, pageSize = paginationModel.pageSize) => {
    setLoading(true);
    try {
      const start = page * pageSize;
      const data = await serviceProvidersService.getList(page + 1, start, pageSize);

      const list = Array.isArray(data?.data)
        ? data.data.map((row: any[]) => {
            return {
              id: Number(row[0]),
              full_name: row[1],
              description: row[2],
              approval_status: row[3]?.replace(/<[^>]+>/g, ""),
              status: row[4]?.replace(/<[^>]+>/g, ""),
            } as ServiceProviderModel;
          })
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

  const resetForm = () => {
    setEditing(null);
    setSpUserId("0");
    setFullName("");
    setCountryId("101");
    setStateId("17");
    setCityId("1726");
    setDescription("");
    setAvgSpRating("0");
    setApprovalStatus("1");
    setStatus("1");
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        id: editing?.id,
        sp_user_id: Number(spUserId),
        full_name: fullName,
        country_id: Number(countryId),
        state_id: Number(stateId),
        city_id: Number(cityId),
        description,
        avg_sp_rating: Number(avgSpRating),
        approval_status: Number(approvalStatus),
        status: Number(status),
      };

      const res = await serviceProvidersService.save(payload);
      if (res.status?.toLowerCase() === "success") {
        toast.success(res.info || "Saved successfully");
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

  const onEdit = (item: ServiceProviderModel) => {
    setEditing(item);
    setFullName(item.full_name ?? "");
    setDescription(item.description ?? "");
    setApprovalStatus(String(item.approval_status));
    setStatus(String(item.status));
    // TODO: set other fields (spUserId, countryId, etc.) when backend sends them
  };

  const onDelete = async (item: ServiceProviderModel) => {
    if (!item.id) return;
    if (!window.confirm(CONSTANTS.MESSAGES.DELETE_CONFIRM)) return;
    try {
      const res = await serviceProvidersService.delete(item.id);
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
      { field: ServiceProviderModelLabels.ID, headerName: SERVICE_PROVIDERS_STRINGS.TABLE.HEADER_ID, width: 80 },
      { field: ServiceProviderModelLabels.FULL_NAME, headerName: SERVICE_PROVIDERS_STRINGS.TABLE.HEADER_FULL_NAME, width: 200 },
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
        renderCell: (params: any) => (
          <span
            className="text-center p-1 rounded"
            style={{
              backgroundColor: params.value === 1 ? `${COLORS.green}30` : `${COLORS.red}30`,
              color: params.value === 1 ? COLORS.green : COLORS.red,
            }}
          >
            {params.value === 1 ? SERVICE_PROVIDERS_STRINGS.TABLE.STATUS_ACTIVE : SERVICE_PROVIDERS_STRINGS.TABLE.STATUS_INACTIVE}
          </span>
        ),
      },
      {
        field: ServiceProviderModelLabels.ACTIONS,
        headerName: SERVICE_PROVIDERS_STRINGS.TABLE.HEADER_ACTIONS,
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
    <div className="container-fluid page-padding-2" style={{ backgroundColor: COLORS.lightGray }}>
      <h4 className="my-4">{SERVICE_PROVIDERS_STRINGS.TITLE}</h4>
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
              <h5 className="mb-0">{editing ? SERVICE_PROVIDERS_STRINGS.FORM.EDIT : SERVICE_PROVIDERS_STRINGS.FORM.ADD}</h5>
            </div>
            <div className="card-body">
              <form onSubmit={onSubmit}>
                <div className="row g-3 align-items-end">

                  <div className="col-md-12">
                    <label className="form-label" style={STYLES.field_label}>Select Users</label>
                    <select className="form-select" value={spUserId} onChange={(e) => setSpUserId(e.target.value)}>
                      <option value="0">-- Select User --</option>
                      <option value="54">User 54</option>
                      {/* TODO: populate dynamically */}
                    </select>
                  </div>

                  <div className="col-md-12">
                    <label className="form-label" style={STYLES.field_label}>{SERVICE_PROVIDERS_STRINGS.TABLE.HEADER_FULL_NAME}</label>
                    <input className="form-control" value={fullName} onChange={(e) => setFullName(e.target.value)} />
                  </div>

                  {/* Country */}
                  <div className="col-md-12">
                    <label className="form-label" style={STYLES.field_label}>
                      Country *
                    </label>
                    <select
                      className="form-select"
                      value={countryId}
                      onChange={(e) => setCountryId(e.target.value)}
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
                      State *
                    </label>
                    <select
                      className="form-select"
                      value={stateId}
                      onChange={(e) => setStateId(e.target.value)}
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
                      City *
                    </label>
                    <select
                      className="form-select"
                      value={cityId}
                      onChange={(e) => setCityId(e.target.value)}
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
                    <label className="form-label" style={STYLES.field_label}>{SERVICE_PROVIDERS_STRINGS.TABLE.HEADER_DESCRIPTION}</label>
                    <textarea className="form-control" value={description} onChange={(e) => setDescription(e.target.value)} />
                  </div>

                  <div className="col-md-12">
                    <label className="form-label" style={STYLES.field_label}>SP Rating</label>
                    <input type="number" step="0.1" className="form-control" value={avgSpRating} onChange={(e) => setAvgSpRating(e.target.value)} />
                  </div>

                  <div className="col-md-12">
                    <label className="form-label" style={STYLES.field_label}>{SERVICE_PROVIDERS_STRINGS.TABLE.HEADER_APPROVAL_STATUS}</label>
                    <select className="form-select" value={approvalStatus} onChange={(e) => setApprovalStatus(e.target.value)}>
                      <option value="1">Pending</option>
                      <option value="2">Approved</option>
                      <option value="3">Rejected</option>
                    </select>
                  </div>

                  <div className="col-md-12">
                    <label className="form-label" style={STYLES.field_label}>{SERVICE_PROVIDERS_STRINGS.TABLE.HEADER_STATUS}</label>
                    <select className="form-select" value={status} onChange={(e) => setStatus(e.target.value)}>
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
    </div>
  );
};

export default ServiceProvidersList;
