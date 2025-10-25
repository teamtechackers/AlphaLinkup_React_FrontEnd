"use client";

import React, { useEffect, useState, useMemo } from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import { FiTrash2, FiEdit } from "react-icons/fi";
import { toast } from "react-toastify";
import citiesService from "../services/cities_service";
import statesService from "../services/states_service";
import { CITIES_STRINGS } from "../utils/strings/pages/cities_strings";
import { CONSTANTS } from "../utils/strings/constants";
import { COLORS } from "../utils/theme/colors";
import { STYLES } from "../utils/typography/styles";
import type { CityModel } from "../models/city_model";
import { StateModel } from "../models/state_model";

const CitiesList: React.FC = () => {
  const [items, setItems] = useState<CityModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<CityModel | null>(null);
  const [cityName, setCityName] = useState("");
  const [status, setStatus] = useState("1");
  const [stateId, setStateId] = useState(0);
  const [states, setStates] = useState<{ id: number; name: string }[]>([]);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [rowCount, setRowCount] = useState(0);
  const [draw, setDraw] = useState(1);

  // ✅ Load Cities
  const loadCities = async () => {
    setLoading(true);
    try {
      const { page, pageSize } = paginationModel;
      const start = page * pageSize;

      const data = await citiesService.getCitiesList(page, pageSize);

      const list: CityModel[] = Array.isArray(data?.data)
        ? data.data.map((row: any) => ({
            row_id: Number(row[0]), // ✅ backend row id
            state_name: row[1] || "-",
            city_name: row[2],
            id: Number(row[3]), // ✅ required for DataGrid
            status: row[4]?.includes("Active") ? 1 : 0,
          }))
        : [];

      setItems(list);
      setRowCount(data.recordsTotal || 0);
      setDraw((d) => d + 1);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load cities");
    } finally {
      setLoading(false);
    }
  };

// ✅ Load States (all ids & names)
const loadStates = async () => {
  try {
    const start = 0;
    const res = await statesService.getStatesAjaxList(draw, start);
    console.log("States response:", res.data);
    const list: StateModel[] = Array.isArray(res?.data)
    ? res.data.map((row: any) => ({
        id: Number(row[3]),                           // ✅ DataGrid & TS need this
        row_id: Number(row[3]),                       // ✅ keep row_id for backend
        country_id: Number(row[0]),                   // ✅ country_id
        country_name: row[1],                         // ✅ country name
        name: row[2],                                 // ✅ state name
        status: row[4]?.includes("Active") ? 1 : 0,   // ✅ status
      }))
    : [];
    setStates(list); // ✅ use mapped list instead of raw response
  } catch (err) {
    console.error("Error loading states", err);
    toast.error("Failed to load states");
  }
};


  useEffect(() => {
    loadCities();
  }, [paginationModel]);

  useEffect(() => {
    loadStates();
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stateId) return toast.error("Select a state first");
    if (!cityName.trim()) return toast.error("Enter a city name");
  
    try {
      const payload: any = {
        row_id: editing?.id,
        state_id: stateId,
        name: cityName.trim(),
        status: Number(status),
      };
  
      console.log("Payload to check/save:", payload);
  
      const duplicateRes = await citiesService.checkDuplicateCity(
        payload.name,
        payload.state_id,
        payload.row_id
      );
  
      console.log("Duplicate check response:", duplicateRes);
  
      if (duplicateRes.validate === false) {
        return toast.error("City already exists");
      }
  
      const res = await citiesService.saveCity(payload);
      console.log("Save response:", res);
  
      if (res.status === true) {
        toast.success(res.info || (editing ? "City updated!" : "City created!"));
        setEditing(null);
        setCityName("");
        setStatus("1");
        setStateId(0);
        await loadCities();
      } else {
        toast.error(res.info || "Failed to save city");
      }
    } catch (err) {
      console.error("Error in onSubmit:", err);
      toast.error(CONSTANTS.MESSAGES.SOMETHING_WENT_WRONG);
    }
  };
  const onEdit = (item: CityModel) => {
    setEditing(item);
    setCityName(item.city_name);
    setStatus(String(item.status));
    const st = states.find((s) => s.name === item.state_name);
    setStateId(st ? st.id : 0);
  };

  const onDelete = async (item: CityModel) => {
    if (!item.id) return;
    try {
      const res = await citiesService.deleteCity(item.id);
      if (res.status === true ) {
        toast.success(res.info || "City deleted successfully!");
        await loadCities();
      } else {
        toast.error(res.info || "Failed to delete city");
      }
    } catch {
      toast.error(CONSTANTS.MESSAGES.SOMETHING_WENT_WRONG);
    }
  };

  const columns = useMemo(
    () => [
      { field: "row_id", headerName: CITIES_STRINGS.TABLE.HEADER_ID, width: 80 },
      { field: "state_name", headerName: CITIES_STRINGS.TABLE.HEADER_STATE_NAME, flex: 1 },
      { field: "city_name", headerName: CITIES_STRINGS.TABLE.HEADER_CITY_NAME, flex: 1 },
      {
        field: "status",
        headerName: CITIES_STRINGS.TABLE.HEADER_STATUS,
        width: 120,
        renderCell: (params: any) => (
          <span
            className="text-center p-1 rounded"
            style={{
              backgroundColor: params.value === 1 ? `${COLORS.green}30` : `${COLORS.red}30`,
              color: params.value === 1 ? COLORS.green : COLORS.red,
            }}
          >
            {params.value === 1 ? CITIES_STRINGS.TABLE.STATUS_ACTIVE : CITIES_STRINGS.TABLE.STATUS_INACTIVE}
          </span>
        ),
      },
      {
        field: "actions",
        headerName: CITIES_STRINGS.TABLE.HEADER_ACTIONS,
        width: 120,
        sortable: false,
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
              {CITIES_STRINGS.TITLE}
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
              paginationModel={paginationModel}
              onPaginationModelChange={(model) => setPaginationModel(model)}
            />
          </Box>
        </div>

        {/* Form */}
        <div className="col-lg-4">
          <div className="card shadow-sm">
            <div className="card-header" style={{ backgroundColor: COLORS.lightGray }}>
              <h5 className="mb-0">{editing ? CITIES_STRINGS.FORM.EDIT_CITY : CITIES_STRINGS.FORM.ADD_CITY}</h5>
            </div>
            <div className="card-body">
              <form onSubmit={onSubmit}>
                {/* State */}
                <div className="mb-3">
                  <label className="form-label" style={STYLES.field_label}>
                    State *
                  </label>
              
                  
                  <select
                    className="form-select"
                    value={stateId}
                    onChange={(e) => setStateId(Number(e.target.value))}
                    required
                  >
                    <option value={0}>Select State</option>
                    {states.map((s, idx) => (
                      <option key={s.id || idx} value={s.id}>
                        {s.name}
                      </option>
                    ))}

                  </select>
                </div>

                {/* City Name */}
                <div className="mb-3">
                  <label className="form-label" style={STYLES.field_label}>
                    City Name *
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={cityName}
                    onChange={(e) => setCityName(e.target.value)}
                    required
                  />
                </div>

                {/* Status */}
                <div className="mb-3">
                  <label className="form-label" style={STYLES.field_label}>
                    Status *
                  </label>
                  <select className="form-select" value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option value="1">{CITIES_STRINGS.TABLE.STATUS_ACTIVE}</option>
                    <option value="0">{CITIES_STRINGS.TABLE.STATUS_INACTIVE}</option>
                  </select>
                </div>

                {/* Buttons */}
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
                        setCityName("");
                        setStatus("1");
                        setStateId(0);
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

export default CitiesList;
