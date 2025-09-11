import React, { useEffect, useState, useMemo } from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import { FiTrash2, FiEdit } from "react-icons/fi";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import eventsService from "../services/events_service";
import { EVENTS_STRINGS } from "../utils/strings/pages/events_strings";
import { CONSTANTS } from "../utils/strings/constants";
import { EventModel, EventLabels } from "../models/event_model";
import { COLORS } from "../utils/theme/colors";
import { STYLES } from "../utils/typography/styles";
import GlobalService from "../services/global_service";

const EventsList: React.FC = () => {
  const [items, setItems] = useState<EventModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<EventModel | null>(null);

  const [fullName, setFullName] = useState("");
  const [eventName, setEventName] = useState("");
  const [industryType, setIndustryType] = useState<number | "">("");
  const [selectedIndustry, setSelectedIndustry] = useState<number | "">(""); 
  const [country, setCountry] = useState<number | "">("");
  const [state, setState] = useState<number | "">("");
  const [city, setCity] = useState<number | "">("");
  const [eventVenue, setEventVenue] = useState("");
  const [eventLink, setEventLink] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [geoAddress, setGeoAddress] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [eventMode, setEventMode] = useState<number | "">("");
  const [eventType, setEventType] = useState<number | "">("");
  const [eventDetails, setEventDetails] = useState("");
  const [eventBanner, setEventBanner] = useState<File | null>(null);
  const [status, setStatus] = useState("Active");

  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const [rowCount, setRowCount] = useState(0);

  const [countries, setCountries] = useState<any[]>([]);
  const [states, setStates] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [eventModes, setEventModes] = useState<any[]>([]);
  const [eventTypes, setEventTypes] = useState<any[]>([]);

  const load = async (page = paginationModel.page, pageSize = paginationModel.pageSize) => {
    setLoading(true);
    try {
      const start = page * pageSize;
      const data = await eventsService.getList(page + 1, start, pageSize);

      const list = Array.isArray(data?.data)
        ? data.data.map((row: any[]) => ({
            id: Number(row[0]),
            full_name: row[1] ?? "",
            event_name: row[2] ?? "",
            event_venue: row[3] ?? "",
            status: row[4]?.replace(/<[^>]+>/g, "").trim() ?? "",
            actions: row[5] ?? "",
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

  // Countries
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

  // States (depends on country)
  useEffect(() => {
    if (!country) {
      setStates([]);
      setCities([]);
      setState("");
      setCity("");
      return;
    }
    const fetchStates = async () => {
      try {
        const list = await GlobalService.getStates(country);
        setStates(list);
        setCities([]);
        setState("");
        setCity("");
      } catch (err) {
        console.error("Error loading states", err);
      }
    };
    fetchStates();
  }, [country]);

  // Cities (depends on state)
  useEffect(() => {
    if (!state) {
      setCities([]);
      setCity("");
      return;
    }
    const fetchCities = async () => {
      try {
        const list = await GlobalService.getCities(state);
        setCities(list);
        setCity("");
      } catch (err) {
        console.error("Error loading cities", err);
      }
    };
    fetchCities();
  }, [state]);

  // Event Modes
  useEffect(() => {
    const fetchEventModes = async () => {
      try {
        const list = await GlobalService.getEventModes();
        setEventModes(list);
      } catch (err) {
        console.error("Error loading event modes", err);
      }
    };
    fetchEventModes();
  }, []);

  // Event Types
  useEffect(() => {
    const fetchEventTypes = async () => {
      try {
        const list = await GlobalService.getEventTypes();
        setEventTypes(list);
      } catch (err) {
        console.error("Error loading event types", err);
      }
    };
    fetchEventTypes();
  }, []);


  const resetForm = () => {
    setEditing(null);
    setFullName("");
    setEventName("");
    setIndustryType("");
    setSelectedIndustry("");
    setCountry("");
    setState("");
    setCity("");
    setEventVenue("");
    setEventLink("");
    setLatitude("");
    setLongitude("");
    setGeoAddress("");
    setEventDate("");
    setStartTime("");
    setEndTime("");
    setEventMode("");
    setEventType("");
    setEventDetails("");
    setEventBanner(null);
    setStatus("Active");
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("user_id", fullName);
      formData.append("full_name", fullName || "");
      formData.append("event_name", eventName || "");
      formData.append("industry_type", industryType !== "" ? industryType.toString() : "");
      formData.append("selected_industry", selectedIndustry !== "" ? selectedIndustry.toString() : "");
      formData.append("country_id", country !== "" ? country.toString() : "");
      formData.append("state_id", state !== "" ? state.toString() : "");
      formData.append("city_id", city !== "" ? city.toString() : "");
      formData.append("event_venue", eventVenue || "");
      formData.append("event_link", eventLink || "");
      formData.append("event_lat", latitude || "");
      formData.append("event_lng", longitude || "");
      formData.append("event_geo_address", geoAddress || "");
      formData.append("event_date", eventDate || "");
      formData.append("event_start_time", startTime || "");
      formData.append("event_end_time", endTime || "");
      formData.append("event_mode_id", eventMode !== "" ? eventMode.toString() : "");
      formData.append("event_type_id", eventType !== "" ? eventType.toString() : "");
      formData.append("event_details", eventDetails || "");
      if (eventBanner) formData.append("event_banner", eventBanner);
      formData.append("status", status === "Active" ? "1" : "0");

      const res = await eventsService.save(formData, editing?.id);

      if (res?.status === "Success") {
        toast.success(editing ? CONSTANTS.MESSAGES.UPDATE_SUCCESS : CONSTANTS.MESSAGES.SAVE_SUCCESS);
        resetForm();
        await load();
      } else {
        toast.error(res?.info || CONSTANTS.MESSAGES.SOMETHING_WENT_WRONG);
      }
    } catch (err) {
      console.error(err);
      toast.error(CONSTANTS.MESSAGES.SOMETHING_WENT_WRONG);
    }
  };

  const onEdit = (item: EventModel) => {
    setEditing(item);

    setFullName(item.user_id?.toString() ?? "");
    setEventName(item.event_name ?? "");
    setIndustryType(item.industry_type ?? "");
    setSelectedIndustry(item.industry_id ?? "");
    setCountry(item.country_id ?? "");
    setState(item.state_id ?? "");
    setCity(item.city_id ?? "");
    setEventVenue(item.event_venue ?? "");
    setEventLink(item.event_link ?? "");
    setLatitude(item.event_lat ?? "");
    setLongitude(item.event_lng ?? "");
    setGeoAddress(item.event_geo_address ?? "");
    setEventDate(item.event_date ?? "");
    setStartTime(item.event_start_time ?? "");
    setEndTime(item.event_end_time ?? "");
    setEventMode(item.event_mode_id ?? "");
    setEventType(item.event_type_id ?? "");
    setEventDetails(item.event_details ?? "");
    setEventBanner(null);
    setStatus(item.status === 1 ? "Active" : "Inactive");
  };

  const onDelete = async (item: EventModel) => {
    if (!item.id) return;
    if (!window.confirm(CONSTANTS.MESSAGES.DELETE_CONFIRM)) return;

    try {
      const res = await eventsService.delete(item.id);
      if (res?.status === "Success") {
        toast.success(res.info || CONSTANTS.MESSAGES.DELETE_SUCCESS);
        await load();
      } else {
        toast.error(res?.info || CONSTANTS.MESSAGES.SOMETHING_WENT_WRONG);
      }
    } catch (err) {
      console.error(err);
      toast.error(CONSTANTS.MESSAGES.SOMETHING_WENT_WRONG);
    }
  };

  const columns = useMemo(
    () => [
      { field: EventLabels.ID, headerName: EVENTS_STRINGS.TABLE.HEADER_ID, width: 100 },
      { field: EventLabels.FULL_NAME, headerName: EVENTS_STRINGS.TABLE.HEADER_FULL_NAME, width: 200 },
      { field: EventLabels.NAME, headerName: EVENTS_STRINGS.TABLE.HEADER_NAME, width: 200 },
      { field: EventLabels.VENUE, headerName: EVENTS_STRINGS.TABLE.HEADER_VENUE, width: 250 },
      {
        field: EventLabels.STATUS,
        headerName: EVENTS_STRINGS.TABLE.HEADER_STATUS,
        width: 140,
        renderCell: (params: any) => (
          <span
            className="text-center p-1 rounded"
            style={{
              backgroundColor: params.value.toLowerCase().includes("active") ? `${COLORS.green}30` : `${COLORS.red}30`,
              color: params.value.toLowerCase().includes("active") ? COLORS.green : COLORS.red,
            }}
          >
            {params.value}
          </span>
        ),
      },
      {
        field: EventLabels.ACTIONS,
        headerName: EVENTS_STRINGS.TABLE.HEADER_ACTIONS,
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
      <h4 className="my-4">{EVENTS_STRINGS.TITLE}</h4>
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
              <h5 className="mb-0">{editing ? EVENTS_STRINGS.FORM.EDIT : EVENTS_STRINGS.FORM.ADD}</h5>
            </div>
            <div className="card-body">
              <form onSubmit={onSubmit} encType="multipart/form-data">
                <div className="row g-3">
                  <select className="form-select" value={fullName} onChange={(e) => setFullName(e.target.value)} required>
                    <option value="">Select User</option>
                    <option value="54">Test User</option>
                  </select>
                  <div className="col-md-12">
                    <label className="form-label" style={STYLES.field_label}>Event Name *</label>
                    <input type="text" className="form-control" value={eventName} onChange={(e) => setEventName(e.target.value)} required />
                  </div>
                  <div className="col-md-12">
                    <label className="form-label" style={STYLES.field_label}>Industry Type *</label>
                    <select className="form-select" value={industryType ?? ""} onChange={(e) => setIndustryType(Number(e.target.value))} required>
                      <option value="">Select Industry Type</option>
                      <option value={1}>Industry 1</option>
                      <option value={2}>Industry 2</option>
                    </select>
                  </div>
                  <div className="col-md-12">
                    <label className="form-label" style={STYLES.field_label}> Country *</label>
                    <select className="form-select" value={country} onChange={(e) => setCountry(Number(e.target.value))} required>
                      <option value="">Select Country</option>
                      {countries.map((c) => (
                        <option key={c.country_id} value={c.country_id}>{c.country_name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-12">
                    <label className="form-label" style={STYLES.field_label}> State *</label>
                    <select className="form-select" value={state} onChange={(e) => setState(Number(e.target.value))} required>
                      <option value="">Select State</option>
                      {states.map((s) => (
                        <option key={s.state_id} value={s.state_id}>{s.state_name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-12">
                    <label className="form-label" style={STYLES.field_label}> City *</label>
                    <select className="form-select" value={city} onChange={(e) => setCity(Number(e.target.value))} required>
                      <option value="">Select City</option>
                      {cities.map((c) => (
                        <option key={c.city_id} value={c.city_id}>{c.city_name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-12">
                    <label className="form-label" style={STYLES.field_label}>Event Venue *</label>
                    <input type="text" className="form-control" value={eventVenue} onChange={(e) => setEventVenue(e.target.value)} required />
                  </div>
                  <div className="col-md-12">
                    <label className="form-label" style={STYLES.field_label}>Event Link</label>
                    <input type="text" className="form-control" value={eventLink} onChange={(e) => setEventLink(e.target.value)} />
                  </div>
                  <div className="col-md-12">
                    <label className="form-label" style={STYLES.field_label}>Latitude *</label>
                    <input type="text" className="form-control" value={latitude} onChange={(e) => setLatitude(e.target.value)} required />
                  </div>
                  <div className="col-md-12">
                    <label className="form-label" style={STYLES.field_label}>Longitude *</label>
                    <input type="text" className="form-control" value={longitude} onChange={(e) => setLongitude(e.target.value)} required />
                  </div>
                  <div className="col-md-12">
                    <label className="form-label" style={STYLES.field_label}>Event GEO Address *</label>
                    <input type="text" className="form-control" value={geoAddress} onChange={(e) => setGeoAddress(e.target.value)} required />
                  </div>
                  <div className="col-md-12">
                    <label className="form-label" style={STYLES.field_label}>Date *</label>
                    <input type="date" className="form-control" value={eventDate} onChange={(e) => setEventDate(e.target.value)} required />
                  </div>
                  <div className="col-md-12">
                    <label className="form-label" style={STYLES.field_label}>Start Time *</label>
                    <input type="time" className="form-control" value={startTime} onChange={(e) => setStartTime(e.target.value)} required />
                  </div>
                  <div className="col-md-12">
                    <label className="form-label" style={STYLES.field_label}>End Time *</label>
                    <input type="time" className="form-control" value={endTime} onChange={(e) => setEndTime(e.target.value)} required />
                  </div>
                  <div className="col-md-12">
                    <label className="form-label" style={STYLES.field_label}>Event Mode *</label>
                    <select className="form-select" value={eventMode} onChange={(e) => setEventMode(Number(e.target.value))} required>
                      <option value="">Select Event Mode</option>
                      {eventModes.map((m) => (
                        <option key={m.event_mode_id} value={m.event_mode_id}>{m.event_mode}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-12">
                    <label className="form-label" style={STYLES.field_label}>Event Type *</label>
                    <select className="form-select" value={eventType} onChange={(e) => setEventType(Number(e.target.value))} required>
                      <option value="">Select Event Type</option>
                      {eventTypes.map((t) => (
                        <option key={t.event_type_id} value={t.event_type_id}>{t.event_type}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-12">
                    <label className="form-label" style={STYLES.field_label}>Event Details *</label>
                    <textarea className="form-control" value={eventDetails} onChange={(e) => setEventDetails(e.target.value)} required />
                  </div>
                  <div className="col-md-12">
                    <label className="form-label" style={STYLES.field_label}>Event Banner *</label>
                    <input type="file" className="form-control" onChange={(e) => setEventBanner(e.target.files?.[0] ?? null)} />
                  </div>
                  <div className="col-md-12">
                    <label className="form-label" style={STYLES.field_label}>Status *</label>
                    <select className="form-select" value={status} onChange={(e) => setStatus(e.target.value)} required>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                <div className="d-flex gap-2 mt-3">
                  <button type="submit" className="btn" style={{ backgroundColor: COLORS.purple, color: COLORS.white }}>
                    {editing ? "Update" : "Save"}
                  </button>
                  <button type="button" className="btn btn-outline-secondary" onClick={resetForm}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventsList;
