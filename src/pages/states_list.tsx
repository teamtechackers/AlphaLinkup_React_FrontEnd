import React, { useEffect, useState, useMemo } from "react";
import Box from "@mui/material/Box";
import { DataGrid } from '@mui/x-data-grid';
import statesService from "../services/states_service";
import { STATES_STRINGS } from "../utils/strings/pages/states_strings";
import { CONSTANTS } from "../utils/strings/constants";
import { StateModel, StateModelLabels } from "../models/state_model";
import { COLORS } from "../utils/theme/colors";
import { FiTrash2, FiEdit } from "react-icons/fi";
import { toast } from 'react-toastify';
import { STYLES } from "../utils/typography/styles";
import GlobalService from "../services/global_service";
import { Country } from "../models/global_model";

const StatesList: React.FC = () => {
  const [items, setItems] = useState<StateModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<StateModel | null>(null);
  const [name, setName] = useState("");
  const [status, setStatus] = useState("1");
  const [countryId, setCountryId] = useState(0);
  const [countries, setCountries] = useState<Country[]>([]);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [rowCount, setRowCount] = useState(0);
  const load = async () => {
    setLoading(true);
    try {
      const res = await statesService.getStatesAjaxList(page, pageSize);
      setItems(res.rows as StateModel[]);
      setRowCount(res.total);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [page, pageSize]);

  useEffect(() => {
    const loadCountries = async () => {
      try {
        const res = await GlobalService.getCountries();
        setCountries(res);
      } catch (err) {
        console.error("Error loading countries", err);
      }
    };
    loadCountries();
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload: any = {
        country_id: countryId > 0 ? countryId : undefined,
        name,
        status: Number(status),
      };
      
      if (editing?.id) {
        payload.id = editing.id; // ✅ use row_id to match backend
      }

      const res = await statesService.saveOrUpdateState(payload);

      if (res.status === CONSTANTS.MESSAGE_TAGS.SUCCESS) {
        toast.success(res.info);
        setEditing(null);
        setName("");
        setStatus("1");
        setCountryId(0);
        await load();
      } else {
        toast.error(res.info);
      }
    } catch (err) {
      console.error(err);
      toast.error(CONSTANTS.MESSAGES.SOMETHING_WENT_WRONG);
    }
  };

  const onEdit = (item: StateModel) => {
    setEditing(item);
    setName(item.name || "");
    setStatus(String(item.status ?? "1"));
    setCountryId(item.country_id);
  };

  const onDelete = async (item: StateModel) => {
    if (!item.id) return;
    try {
      const res = await statesService.deleteState(item.id);
      if (res.status === "Success") {
        toast.success(res.info);
        await load();
      } else {
        toast.error(res.info);
      }
    } catch (err) {
      console.error(err);
      toast.error(CONSTANTS.MESSAGES.SOMETHING_WENT_WRONG);
    }
  };

  const columns = useMemo(() => [
    { field: StateModelLabels.ID, headerName: STATES_STRINGS.TABLE.HEADER_ID, width: 80 },
    { field: StateModelLabels.COUNTRY_NAME, headerName: STATES_STRINGS.TABLE.HEADER_COUNTRY, flex: 1 },
    { field: StateModelLabels.STATE_NAME, headerName: STATES_STRINGS.TABLE.HEADER_NAME, flex: 1 },
    {
      field: StateModelLabels.STATUS,
      headerName: STATES_STRINGS.TABLE.HEADER_STATUS,
      width: 120,
      renderCell: (params: any) => (
        <span
          className="text-center p-1 rounded"
          style={{
            backgroundColor: params.value === 1 ? `${COLORS.green}30` : `${COLORS.red}30`,
            color: params.value === 1 ? COLORS.green : COLORS.red,
          }}
        >
          {params.value === 1 ? STATES_STRINGS.TABLE.STATUS_ACTIVE : STATES_STRINGS.TABLE.STATUS_INACTIVE}
        </span>
      ),
    },
    {
      field: StateModelLabels.ACTIONS,
      headerName: STATES_STRINGS.TABLE.HEADER_ACTIONS,
      width: 120,
      sortable: false,
      filterable: false,
      renderCell: (params: any) => (
        <div className="d-flex align-items-center gap-3 w-100 h-100">
          <FiEdit style={{ cursor: "pointer" }} onClick={() => onEdit(params.row)} />
          <FiTrash2 style={{ cursor: "pointer" }} onClick={() => onDelete(params.row)} />
        </div>
      ),
    },
  ], [items]);

  return (
    <div className="container-fluid page-padding-2 vh-100" style={{ backgroundColor: COLORS.lightGray }}>
      <h4 className="my-4">{STATES_STRINGS.TITLE}</h4>
      <div className="row g-4 w-100">
        {/* Table */}
        <div className="col-lg-8 p-0">
          <Box sx={{ height: 800, width: '100%' }}>
            <DataGrid
              rows={items}
              columns={columns}
              loading={loading}
              getRowId={(row) => row.row_id ?? row.id}
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
              <h5 className="mb-0">{editing ? STATES_STRINGS.FORM.EDIT_STATE : STATES_STRINGS.FORM.ADD_STATE}</h5>
            </div>
            <div className="card-body">
              <form onSubmit={onSubmit}>

                <div className="row g-3 align-items-end">
                  {/* Country Name */}
                  <div className="col-md-12">
                    <label className="form-label" style={STYLES.field_label}>{STATES_STRINGS.TABLE.HEADER_COUNTRY} *</label>
                    <select
                      className="form-select"
                      value={countryId}
                      onChange={(e) => setCountryId(Number(e.target.value))}
                      required
                      style={{ color: COLORS.darkGray, backgroundColor: COLORS.white }}
                    >
                      <option value={0}>Select Country</option>
                      {countries.map((c) => (
                        <option key={c.country_id} value={c.country_id}>
                          {c.country_name}
                        </option>
                      ))}
                    </select>
                  </div>
                  {/* State Name */}
                  <div className="col-md-12">
                    <label className="form-label" style={STYLES.field_label}>{STATES_STRINGS.TABLE.HEADER_NAME} *</label>
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
                    <label className="form-label" style={STYLES.field_label}>{STATES_STRINGS.TABLE.HEADER_STATUS} *</label>
                    <select
                      className="form-select"
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                    >
                      <option value="1">{STATES_STRINGS.TABLE.STATUS_ACTIVE}</option>
                      <option value="0">{STATES_STRINGS.TABLE.STATUS_INACTIVE}</option>
                    </select>
                  </div>
                </div>

                {/* Buttons row */}
                <div className="d-flex gap-2 mt-3">
                  <button type="submit" className="btn" style={{ backgroundColor: COLORS.purple, color: COLORS.white }}>
                    {editing ? CONSTANTS.BUTTONS.UPDATE : CONSTANTS.BUTTONS.SAVE}
                  </button>
                  {editing && (
                    <button
                      type="button"
                      className="btn"
                      style={{ backgroundColor: COLORS.red, color: COLORS.white }}
                      onClick={() => { setEditing(null); setName(""); setStatus("1"); setCountryId(0); }}
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

export default StatesList;
