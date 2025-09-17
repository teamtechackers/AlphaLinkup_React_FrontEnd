import React, { useEffect, useState, useMemo } from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import { FiTrash2, FiEdit } from "react-icons/fi";
import { toast } from "react-toastify";
import citiesService from "../services/cities_service";
import statesService from "../services/states_service";
import { CITIES_STRINGS } from "../utils/strings/pages/cities_strings";
import { CityModel } from "../models/city_model";
import { COLORS } from "../utils/theme/colors";
import { STYLES } from "../utils/typography/styles";
import { CONSTANTS } from "../utils/strings/constants";

const CitiesList: React.FC = () => {
  const [items, setItems] = useState<CityModel[]>([]);
  const [states, setStates] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<CityModel | null>(null);
  const [cityName, setCityName] = useState("");
  const [status, setStatus] = useState("1");
  const [stateId, setStateId] = useState<number>(0);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  // ✅ Pagination state
 
  const [rowCount, setRowCount] = useState(0);

  // ✅ Load Cities
  const loadCities = async () => {
    setLoading(true);
    try {
      const data = await citiesService.getCitiesList(page, pageSize);
      const list = Array.isArray(data?.data) ? data.data : [];

      const cities = list.map((row: any[]) => ({
        row_id: row[0],
        state_name: row[1] || "-",
        city_name: row[2],
        id: row[3],
        status_html: row[4],
        status: row[4].includes("Active") ? 1 : 0,
      }));

      setItems(cities);
      setRowCount(data.recordsTotal || cities.length);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load cities");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Load States (for dropdown)
  const loadStates = async () => {
    try {
      const res = await statesService.getStatesAjaxList(0, 1000);
      setStates(res.rows || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load states");
    }
  };

  useEffect(() => {
    loadCities();
    loadStates();
  }, [page, pageSize]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stateId) return toast.error("Select a state first");
    if (!cityName.trim()) return toast.error("Enter a city name");

    try {
      const payload = {
        row_id: editing?.id ?? 0,
        state_id: stateId,
        name: cityName.trim(),
        status: Number(status),
      };
      console.log("Submitting city:", payload);
      const res = await citiesService.saveCity(payload);
      if (res.status === CONSTANTS.MESSAGE_TAGS.SUCCESS) {
        toast.success(res.info);
        setEditing(null);
        setCityName("");
        setStatus("1");
        setStateId(0);
        await loadCities();
      } else {
        toast.error(res.info);
      }
    } catch (err) {
      console.error(err);
      toast.error(CONSTANTS.MESSAGES.SOMETHING_WENT_WRONG);
    }
  };

  const onEdit = (item: CityModel) => {
    setEditing(item);
    setCityName(item.city_name);
    setStatus(String(item.status));
    const state = states.find((s) => s.name === item.state_name);
    setStateId(state ? state.id : 0);
  };

  const onDelete = async (item: CityModel) => {
    if (!item.id) return;
    try {
      const res = await citiesService.deleteCity(item.id);
      if (res.status === CONSTANTS.MESSAGE_TAGS.SUCCESS) {
        toast.success(res.info);
        await loadCities();
      } else {
        toast.error(res.info);
      }
    } catch (err) {
      console.error(err);
      toast.error(CONSTANTS.MESSAGES.SOMETHING_WENT_WRONG);
    }
  };

  // ✅ Real action buttons instead of HTML from backend
  const columns = useMemo(
    () => [
      { field: "id", headerName: CITIES_STRINGS.TABLE.HEADER_ID, width: 100 },
      { field: "state_name", headerName: CITIES_STRINGS.TABLE.HEADER_STATE_NAME, flex: 1 },
      { field: "city_name", headerName: CITIES_STRINGS.TABLE.HEADER_CITY_NAME, flex: 1 },
      {
        field: "status_html",
        headerName: CITIES_STRINGS.TABLE.HEADER_STATUS,
        width: 200,
        renderCell: (params: any) => (
          <div dangerouslySetInnerHTML={{ __html: params.value }} />
        ),
      },
      {
        field: "actions",
        headerName: CITIES_STRINGS.TABLE.HEADER_ACTIONS,
        width: 200,
        renderCell: (params: any) => (
          <div className="d-flex gap-2">
            <button
              className="btn btn-sm btn-outline-primary"
              onClick={() => onEdit(params.row)}
              >
              {/* Debugging log removed */}
              <FiEdit />
            </button>
            <button
              className="btn btn-sm btn-outline-danger"
              onClick={() => onDelete(params.row)}
            >
              <FiTrash2 />
            </button>
          </div>
        ),
      },
    ],
    [states]
  );

  return (
    <div className="container-fluid page-padding-2 vh-100" style={{ backgroundColor: COLORS.lightGray }}>
      <h4 className="my-4">{CITIES_STRINGS.TITLE}</h4>
      <div className="row g-4 w-100">
        {/* Table */}
        <div className="col-lg-8 p-0">
          <Box sx={{ height: 800, width: "100%" }}>
            <DataGrid
              rows={items}
              columns={columns}
              loading={loading}
              // getRowId={(row) => row.row_id ?? row.id}
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
              <h5 className="mb-0">{editing ? CITIES_STRINGS.FORM.EDIT_CITY : CITIES_STRINGS.FORM.ADD_CITY}</h5>
            </div>
            <div className="card-body">
              <form onSubmit={onSubmit}>
                {/* State select */}
                <div className="mb-3">
                  <label className="form-label" style={STYLES.field_label}>
                    State *
                  </label>
                  <select
                    className="form-select"
                    value={stateId}
                    onChange={(e) => setStateId(Number(e.target.value))}
                    required
                    style={{ color: COLORS.darkGray, backgroundColor: COLORS.white }}
                  >
                    <option value={0}>Select State</option>
                    {states.map((s) => (
                      <option key={s.id} value={s.id}>
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
                  <select
                    className="form-select"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option value="1">{CITIES_STRINGS.TABLE.STATUS_ACTIVE}</option>
                    <option value="0">{CITIES_STRINGS.TABLE.STATUS_INACTIVE}</option>
                  </select>
                </div>

                {/* Buttons */}
                <div className="d-flex gap-2 mt-3">
                  <button type="submit" className="btn" style={{ backgroundColor: COLORS.purple, color: COLORS.white }}>
                    {editing ? "Update" : "Save"}
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
