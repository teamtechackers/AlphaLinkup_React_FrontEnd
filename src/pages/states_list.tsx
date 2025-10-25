"use client";

import React, { useEffect, useState, useMemo } from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import { FiTrash2, FiEdit } from "react-icons/fi";
import { toast } from "react-toastify";
import statesService from "../services/states_service";
import GlobalService from "../services/global_service";
import { STATES_STRINGS } from "../utils/strings/pages/states_strings";
import { CONSTANTS } from "../utils/strings/constants";
import { COLORS } from "../utils/theme/colors";
import { STYLES } from "../utils/typography/styles";
import { StateModel, StateModelLabels } from "../models/state_model";
import type { Country } from "../models/global_model";

const StatesList: React.FC = () => {
  const [items, setItems] = useState<StateModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<StateModel | null>(null);
  const [name, setName] = useState("");
  const [status, setStatus] = useState("1");
  const [countryId, setCountryId] = useState(0);
  const [countries, setCountries] = useState<Country[]>([]);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [draw, setDraw] = useState(1);
  const [rowCount, setRowCount] = useState(0);

  // Load States
  const load = async () => {
    setLoading(true);
    try {
      const { page, pageSize } = paginationModel;
      const start = page * pageSize;

      const data = await statesService.getStatesAjaxList(draw, start);
const list: StateModel[] = Array.isArray(data?.data)
  ? data.data.map((row: any) => ({
      id: Number(row[3]),
      row_id: Number(row[3]),
      country_id: Number(row[0]),
      country_name: row[1],
      name: row[2],
      status: row[4]?.includes("Active") ? 1 : 0,
      
    }))
  : [];

    
    
    

      setItems(list);
      setRowCount(data.recordsTotal || 0);
      setDraw((d) => d + 1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [paginationModel]);

  // Load countries only once
  useEffect(() => {
    const loadCountries = async () => {
      try {
        const res = await GlobalService.getCountries();
        setCountries(res);
        console.log("Countries loaded:", res);
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
        payload.row_id = editing.id; // include id for edit
      }
  
      console.log("Payload:", payload);
  
      // Await the duplicate check
      const checkDuplicate = await statesService.checkDuplicateState(
        payload.name,
        payload.country_id!,
        payload.row_id
      );
      
      if (checkDuplicate.is_duplicate) {
        return toast.error("State already exists");
      }
      
  
      // Save or update state
      const res = await statesService.saveOrUpdateState(payload);
  
      if (res.status === "Success" || res.status === true) {
        toast.success(
          res.info ||
            (editing ? "State updated successfully!" : "State created successfully!")
        );
        setEditing(null);
        setName("");
        setStatus("1");
        setCountryId(0);
        await load();
      } else {
        toast.error(res.info || "Failed to save state");
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

    // Ensure countries is defined and safely find the country
    const country = countries?.find(
      (c) => c.country_name === item.country_name
    );

    // Set country ID or fallback to null
    setCountryId(Number(country?.country_id) || 0);
};
  
  
  

  async function onDelete(item: StateModel) {
    if (!item.row_id) return;
    try {
      const res = await statesService.deleteState(item.row_id);
      if (res.status === "Success" || res.status === true) {
        toast.success(res.info || "State deleted successfully!");
        await load();
      } else {
        toast.error(res.info || "Failed to delete state");
      }
    } catch {
      toast.error(CONSTANTS.MESSAGES.SOMETHING_WENT_WRONG);
    }
  }

  const columns = useMemo(
    () => [
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
              {STATES_STRINGS.TITLE}
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
              getRowId={(row) => row.row_id}
              disableRowSelectionOnClick
              paginationMode="server"
              rowCount={rowCount}
              paginationModel={paginationModel}
              onPaginationModelChange={(newModel) => setPaginationModel(newModel)}
            />
          </Box>
        </div>

        {/* Form */}
        <div className="col-lg-4">
          <div className="card shadow-sm">
            <div className="card-header" style={{ backgroundColor: COLORS.lightGray }}>
              <h5 className="mb-0">
                {editing ? STATES_STRINGS.FORM.EDIT_STATE : STATES_STRINGS.FORM.ADD_STATE}
              </h5>
            </div>
            <div className="card-body">
              <form onSubmit={onSubmit}>
                <div className="row g-3 align-items-end">
                  {/* Country */}
                  <div className="col-md-12">
                    <label className="form-label" style={STYLES.field_label}>
                      {STATES_STRINGS.TABLE.HEADER_COUNTRY} *
                    </label>
                    <select
                      className="form-select"
                      value={countryId}
                      onChange={(e) => setCountryId(Number(e.target.value))}
                      required
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
                    <label className="form-label" style={STYLES.field_label}>
                      {STATES_STRINGS.TABLE.HEADER_NAME} *
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
                      {STATES_STRINGS.TABLE.HEADER_STATUS} *
                    </label>
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
                        setName("");
                        setStatus("1");
                        setCountryId(0);
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

export default StatesList;
