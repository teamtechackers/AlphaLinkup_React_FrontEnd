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

  // form states
  const [userId, setUserId] = useState<number | "">("");
  const [fullName, setFullName] = useState("");
  const [eventName, setEventName] = useState("");
  const [industryType, setIndustryType] = useState<number | "">("");
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

  // dropdown lists
  const [countries, setCountries] = useState<any[]>([]);
  const [states, setStates] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [eventModes, setEventModes] = useState<any[]>([]);
  const [eventTypes, setEventTypes] = useState<any[]>([]);

  const [editing, setEditing] = useState<EventModel | null>(null);

  // pagination
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const [rowCount, setRowCount] = useState(0);

  // load data
  const load = async (page = paginationModel.page, pageSize = paginationModel.pageSize) => {
    setLoading(true);
    try {
      const draw = page + 1;
      const start = page * pageSize;
      const length = pageSize;
      const res = await eventsService.getList(draw, start, length);

      if (res?.status === true || res?.status === "Success") {
        const list = Array.isArray(res.events_list)
          ? res.events_list.map((row: any) => ({
              row_id: Number(row.row_id),
              event_id: row.event_id ?? "",
              user_name: row.user_name ?? "",
              event_name: row.event_name ?? "",
              event_venue: row.event_venue ?? "",
              event_link: row.event_link ?? "",
              latitude: row.latitude ?? "",
              longitude: row.longitude ?? "",
              event_geo_address: row.event_geo_address ?? "",
              date: row.date ?? "",
              start_time: row.start_time ?? "",
              end_time: row.end_time ?? "",
              event_details: row.event_details ?? "",
              status: row.status ?? "Inactive",
              industry_id: row.industry_id ?? "",
              country_id: row.country_id ?? "",
              state_id: row.state_id ?? "",
              city_id: row.city_id ?? "",
              event_mode_id: row.event_mode_id ?? "",
              event_type_id: row.event_type_id ?? "",
              event_banner: row.event_banner ?? null,
            }))
          : [];

        setItems(list);
        setRowCount(res.recordsTotal ?? 0);
      } else {
        setItems([]);
        toast.error(res.message || CONSTANTS.MESSAGES.SOMETHING_WENT_WRONG);
      }
    } catch {
      toast.error(CONSTANTS.MESSAGES.SOMETHING_WENT_WRONG);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(paginationModel.page, paginationModel.pageSize);
  }, [paginationModel]);

  // dropdown fetchers
  useEffect(() => {
    GlobalService.getCountries().then(setCountries).catch(console.error);
    GlobalService.getEventModes().then(setEventModes).catch(console.error);
    GlobalService.getEventTypes().then(setEventTypes).catch(console.error);
  }, []);

  useEffect(() => {
    if (country) {
      GlobalService.getStates(country).then(setStates).catch(console.error);
    } else {
      setStates([]);
      setState("");
    }
  }, [country]);

  useEffect(() => {
    if (state) {
      GlobalService.getCities(state).then(setCities).catch(console.error);
    } else {
      setCities([]);
      setCity("");
    }
  }, [state]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      user_id: userId,
      event_name: eventName,
      industry_type: industryType,
      country_id: country,
      state_id: state,
      city_id: city,
      event_venue: eventVenue,
      event_link: eventLink,
      event_lat: latitude,
      event_lng: longitude,
      event_geo_address: geoAddress,
      event_date: eventDate,
      event_start_time: startTime,
      event_end_time: endTime,
      event_mode_id: eventMode,
      event_type_id: eventType,
      event_details: eventDetails,
      status: status === "Active" ? 1 : 0,
      ...(editing ? { row_id: Number(editing.event_id) } : {}),
    };

    console.log("Submitting event payload:", payload, "Row ID:", editing?.event_id);

    try {
      const res = await eventsService.save(payload, editing ? Number(editing.event_id) : undefined);
      console.log("Save response:", res);

      if (res.status === "Success" || res.status === true) {
        toast.success(res.info || res.message);
        resetForm();
        await load();
      } else {
        toast.error(res.info || res.message);
      }
    } catch (err) {
      console.error("Save error:", err);
      toast.error(CONSTANTS.MESSAGES.SOMETHING_WENT_WRONG);
    }
  };

  const resetForm = () => {
    setEditing(null);
    setFullName("");
    setEventName("");
    setIndustryType("");
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

  const onEdit = (item: EventModel) => {
    setEditing(item);
    setUserId(item.user_id ? Number(item.user_id) : "");
    setFullName(item.user_name ?? "");
    setEventName(item.event_name ?? "");
    setIndustryType(item.industry_id ? Number(item.industry_id) : "");
    setCountry(item.country_id ? Number(item.country_id) : "");
    setState(item.state_id ? Number(item.state_id) : "");
    setCity(item.city_id ? Number(item.city_id) : "");
    setEventVenue(item.event_venue ?? "");
    setEventLink(item.event_link ?? "");
    setLatitude(item.latitude ?? "");
    setLongitude(item.longitude ?? "");
    setGeoAddress(item.event_geo_address ?? "");
    setEventDate(item.date ?? "");
    setStartTime(item.start_time ?? "");
    setEndTime(item.end_time ?? "");
    setEventMode(item.event_mode_id ? Number(item.event_mode_id) : "");
    setEventType(item.event_type_id ? Number(item.event_type_id) : "");
    setEventDetails(item.event_details ?? "");
    setEventBanner(null);
    setStatus(item.status ?? "Active");
  };

  const onDelete = async (item: EventModel) => {
    if (!item.event_id) return;
    if (!window.confirm(CONSTANTS.MESSAGES.DELETE_CONFIRM)) return;

    try {
      const res = await eventsService.delete(Number(item.event_id));
      const success =
        res &&
        (res.status === true ||
          res.status === "Success" ||
          res.success === true ||
          res.rcode === 200);

      if (success) {
        toast.success(res.info || res.message || CONSTANTS.MESSAGES.DELETE_SUCCESS);
        await load();
      } else {
        toast.error(res.info || res.message || CONSTANTS.MESSAGES.SOMETHING_WENT_WRONG);
      }
    } catch {
      toast.error(CONSTANTS.MESSAGES.SOMETHING_WENT_WRONG);
    }
  };

  const columns = useMemo(
    () => [
      { field: EventLabels.EVENT_ID, headerName: EVENTS_STRINGS.TABLE.HEADER_ID, width: 100 },
      { field: EventLabels.USER_NAME, headerName: EVENTS_STRINGS.TABLE.HEADER_FULL_NAME, flex: 1 },
      { field: EventLabels.EVENT_NAME, headerName: EVENTS_STRINGS.TABLE.HEADER_EVENT_NAME, flex: 1 },
      { field: EventLabels.EVENT_VENUE, headerName: EVENTS_STRINGS.TABLE.HEADER_EVENT_VENUE, flex: 1 },
      {
        field: EventLabels.STATUS,
        headerName: EVENTS_STRINGS.TABLE.HEADER_STATUS,
        width: 120,
        renderCell: (params: any) => (
          <span
            className="text-center p-1 rounded"
            style={{
              backgroundColor: params.value === "Active" ? `${COLORS.green}30` : `${COLORS.red}30`,
              color: params.value === "Active" ? COLORS.green : COLORS.red,
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
      <h4 className="my-4">{EVENTS_STRINGS.TITLE}</h4>
      <div className="row g-4 w-100">
        {/* Table */}
        <div className="col-lg-8 p-0">
          <Box sx={{ height: 800, width: "100%" }}>
            <DataGrid
              rows={items}
              columns={columns}
              loading={loading}
              getRowId={(row) => Number(row.event_id)}
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
                  <div className="col-md-12">
                    <label className="form-label" style={STYLES.field_label}>User *</label>
                    <select
                      className="form-select"
                      value={userId}
                      onChange={(e) => setUserId(Number(e.target.value))}
                      required
                    >
                      <option value="">Select User</option>
                      <option value={55}>Test User</option>
                    </select>
                  </div>
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
                    <label className="form-label" style={STYLES.field_label}> City </label>
                    <select
                      className="form-select"
                      value={city}
                      onChange={(e) => setCity(Number(e.target.value))}>
                      <option value="">Select City</option>
                      {cities.map((c) => (
                        <option key={c.city_id} value={c.city_id}>
                          {c.city_name}
                        </option>
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