import React, { useEffect, useState, useMemo } from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import { FiTrash2, FiEdit, FiEye } from "react-icons/fi";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import eventsService from "../services/events_service";
import { EVENTS_STRINGS } from "../utils/strings/pages/events_strings";
import { CONSTANTS } from "../utils/strings/constants";
import { EventModel, EventLabels } from "../models/event_model";
import { COLORS } from "../utils/theme/colors";
import { STYLES } from "../utils/typography/styles";
import GlobalService from "../services/global_service";
import DetailsDialog from "../components/DetailsDialog";
import { VARIABLES } from "../utils/strings/variables";

const EventsList: React.FC = () => {
  const [items, setItems] = useState<EventModel[]>([]);
  const [loading, setLoading] = useState(false);

  const [userId, setUserId] = useState<number | "">("");
  const [fullName, setFullName] = useState("");
  const [eventName, setEventName] = useState("");
  const [industryType, setIndustryType] = useState<number | "">("");
  const [countryId, setCountryId] = useState<number | "">("");
  const [stateId, setStateId] = useState<number | "">("");
  const [cityId, setCityId] = useState<number | "">("");
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

  const [countries, setCountries] = useState<any[]>([]);
  const [states, setStates] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [eventModes, setEventModes] = useState<any[]>([]);
  const [eventTypes, setEventTypes] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [industryTypes, setIndustryTypes] = useState<any[]>([]);

  const [editing, setEditing] = useState<EventModel | null>(null);

  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [previewBanner, setPreviewBanner] = useState<string>("");

  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const [rowCount, setRowCount] = useState(0);

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRow, setSelectedRow] = useState<EventModel | null>(null);

  const handleViewClick = (row: EventModel) => {
    setSelectedRow(row);
    setOpenDialog(true);
  };

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
              user_id: row.user_id ?? "",  
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
    GlobalService.getIndustryTypes().then(setIndustryTypes).catch(console.error); 
  }, []);

  useEffect(() => {
    if (countryId) {
      GlobalService.getStates(countryId).then(setStates).catch(console.error);
    } else {
      setStates([]);
      setStateId("");
    }
  }, [countryId]);

  useEffect(() => {
    if (stateId) {
      GlobalService.getCities(stateId).then(setCities).catch(console.error);
    } else {
      setCities([]);
      setCityId("");
    }
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

    const formData = new FormData();
    if (editing) formData.append("row_id", String(editing.event_id));

    formData.append("user_id", String(userId));
    formData.append("event_name", eventName);
    formData.append("industry_type", String(industryType));
    formData.append("country_id", String(countryId));
    formData.append("state_id", String(stateId));
    formData.append("city_id", String(1));
    formData.append("event_venue", eventVenue);
    formData.append("event_link", eventLink);
    formData.append("event_lat", latitude);
    formData.append("event_lng", longitude);
    formData.append("event_geo_address", geoAddress);
    formData.append("event_date", eventDate);
    formData.append("event_start_time", startTime);
    formData.append("event_end_time", endTime);
    formData.append("event_mode_id", String(eventMode));
    formData.append("event_type_id", String(eventType));
    formData.append("event_details", eventDetails);
    formData.append("status", status === "Active" ? "1" : "0");

    if (eventBanner) {
      formData.append("event_banner_file", eventBanner);
    }

    console.group("Submitting Event FormData");
    Array.from(formData.entries()).forEach(([key, value]) => {
    console.log(`${key}:`, value);
    });
    console.groupEnd();

    try {
      const res = await eventsService.save(formData, VARIABLES.USER_ID, VARIABLES.TOKEN);
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
    setCountryId("");
    setStateId("");
    setCityId("");
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
    setPreviewBanner("");
    setEventBanner(null);
    setStatus("Active");
  };

  const onEdit = async (item: EventModel) => {
    setEditing(item);

    console.group("Editing Event");
      console.log("Raw item:", item);
      console.table(item);
      console.groupEnd();

    setUserId(item.user_id ? Number(item.user_id) : "");
    setEventName(item.event_name ?? "");
    setIndustryType(item.industry_id ? Number(item.industry_id) : "");
    
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
            <FiEye
              size={18}
              style={{ cursor: "pointer" }}
              onClick={() => handleViewClick(params.row)}
              title="View Details"
            />
            <FiTrash2 size={18} style={{ cursor: "pointer" }} onClick={() => onDelete(params.row)} />
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
              {EVENTS_STRINGS.TITLE}
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
                    <label className="form-label" style={STYLES.field_label}>
                      {EVENTS_STRINGS.FORM.FIELD_LABELS.FULL_NAME}
                      <span style={{ color: COLORS.red}}> *</span>
                    </label>
                    <select
                      className="form-select"
                      value={userId}
                      onChange={(e) => setUserId(Number(e.target.value))}
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

                  <div className="col-md-12">
                    <label className="form-label" style={STYLES.field_label}>
                      {EVENTS_STRINGS.FORM.FIELD_LABELS.NAME}
                      <span style={{ color: COLORS.red}}> *</span></label>
                    <input type="text" className="form-control" value={eventName} onChange={(e) => setEventName(e.target.value)} required
                    maxLength={CONSTANTS.MAX_LENGTHS.FIELD_100}  
                    />
                  </div>

                  <div className="col-md-12">
                    <label className="form-label" style={STYLES.field_label}>
                      {EVENTS_STRINGS.FORM.FIELD_LABELS.INDUSTRY_TYPE}
                      <span style={{ color: COLORS.red }}> *</span>
                    </label>
                    <select
                      className="form-select"
                      value={industryType ?? ""}
                      onChange={(e) => setIndustryType(Number(e.target.value))}
                      required
                    >
                      <option value="">Select Industry Type</option>
                      {industryTypes.map((ind) => (
                        <option key={ind.industry_type_id} value={ind.industry_type_id}>
                          {ind.industry_type_name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-12">
                    <label className="form-label" style={STYLES.field_label}>
                      {EVENTS_STRINGS.FORM.FIELD_LABELS.COUNTRY}
                      <span style={{ color: COLORS.red}}> *</span>
                    </label>
                    <select className="form-select" value={countryId} onChange={(e) => setCountryId(Number(e.target.value))} required>
                      <option value="">Select Country</option>
                      {countries.map((c) => (
                        <option key={c.country_id} value={c.country_id}>{c.country_name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-12">
                    <label className="form-label" style={STYLES.field_label}>
                      {EVENTS_STRINGS.FORM.FIELD_LABELS.STATE}
                      <span style={{ color: COLORS.red}}> *</span>
                    </label>
                    <select className="form-select" value={stateId} onChange={(e) => setStateId(Number(e.target.value))} required>
                      <option value="">Select State</option>
                      {states.map((s) => (
                        <option key={s.state_id} value={s.state_id}>{s.state_name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-12">
                    <label className="form-label" style={STYLES.field_label}>
                      {EVENTS_STRINGS.FORM.FIELD_LABELS.CITY}
                      <span style={{ color: COLORS.red}}> *</span>
                    </label>
                    <select
                      className="form-select"
                      value={cityId}
                      onChange={(e) => setCityId(Number(e.target.value))}>
                      <option value="">Select City</option>
                      {cities.map((c) => (
                        <option key={c.city_id} value={c.city_id}>
                          {c.city_name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-12">
                    <label className="form-label" style={STYLES.field_label}>
                      {EVENTS_STRINGS.FORM.FIELD_LABELS.VENUE}
                      <span style={{ color: COLORS.red}}> *</span>
                    </label>
                    <input type="text" className="form-control" value={eventVenue} onChange={(e) => setEventVenue(e.target.value)} required 
                    maxLength={CONSTANTS.MAX_LENGTHS.FIELD_100}
                    />
                  </div>

                  <div className="col-md-12">
                    <label className="form-label" style={STYLES.field_label}>
                      {EVENTS_STRINGS.FORM.FIELD_LABELS.LINK}
                      <span style={{ color: COLORS.red}}> *</span>
                    </label>
                    <input type="text" className="form-control" value={eventLink} onChange={(e) => setEventLink(e.target.value)} required
                    maxLength={CONSTANTS.MAX_LENGTHS.FIELD_200}
                    />
                  </div>

                  <div className="col-md-12">
                    <label className="form-label" style={STYLES.field_label}>
                      {EVENTS_STRINGS.FORM.FIELD_LABELS.LAT}
                      <span style={{ color: COLORS.red}}> *</span>
                    </label>
                    <input type="number" className="form-control" value={latitude}  required
                    onChange={(e) => {
                      const val = e.target.value;
                      if (/^\d*$/.test(val)) {
                        setLatitude(val);
                      }
                    }}
                    />
                  </div>

                  <div className="col-md-12">
                    <label className="form-label" style={STYLES.field_label}>
                      {EVENTS_STRINGS.FORM.FIELD_LABELS.LNG}
                      <span style={{ color: COLORS.red}}> *</span>
                    </label>
                    <input type="number" className="form-control" value={longitude}  required
                    onChange={(e) => {
                      const val = e.target.value;
                      if (/^\d*$/.test(val)) {
                        setLongitude(val);
                      }
                    }}
                    />
                  </div>

                  <div className="col-md-12">
                    <label className="form-label" style={STYLES.field_label}>
                      {EVENTS_STRINGS.FORM.FIELD_LABELS.GEO_ADDRESS}
                      <span style={{ color: COLORS.red}}> *</span>
                    </label>
                    <input type="text" className="form-control" value={geoAddress} onChange={(e) => setGeoAddress(e.target.value)} required 
                    maxLength={CONSTANTS.MAX_LENGTHS.FIELD_200}/>
                  </div>

                  <div className="col-md-12">
                    <label className="form-label" style={STYLES.field_label}>
                      {EVENTS_STRINGS.FORM.FIELD_LABELS.DATE}
                      <span style={{ color: COLORS.red}}> *</span>  
                    </label>
                    <input type="date" className="form-control" value={eventDate} onChange={(e) => setEventDate(e.target.value)} required />
                  </div>

                  <div className="col-md-12">
                    <label className="form-label" style={STYLES.field_label}>
                      {EVENTS_STRINGS.FORM.FIELD_LABELS.START_TIME}
                      <span style={{ color: COLORS.red}}> *</span>
                    </label>
                    <input type="time" className="form-control" value={startTime} onChange={(e) => setStartTime(e.target.value)} required />
                  </div>

                  <div className="col-md-12">
                    <label className="form-label" style={STYLES.field_label}>
                      {EVENTS_STRINGS.FORM.FIELD_LABELS.END_TIME}
                      <span style={{ color: COLORS.red}}> *</span>
                    </label>
                    <input type="time" className="form-control" value={endTime} onChange={(e) => setEndTime(e.target.value)} required />
                  </div>

                  <div className="col-md-12">
                    <label className="form-label" style={STYLES.field_label}>
                      {EVENTS_STRINGS.FORM.FIELD_LABELS.MODE}
                      <span style={{ color: COLORS.red}}> *</span>
                    </label>
                    <select className="form-select" value={eventMode} onChange={(e) => setEventMode(Number(e.target.value))} required>
                      <option value="">Select Event Mode</option>
                      {eventModes.map((m) => (
                        <option key={m.event_mode_id} value={m.event_mode_id}>{m.event_mode}</option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-12">
                    <label className="form-label" style={STYLES.field_label}>
                      {EVENTS_STRINGS.FORM.FIELD_LABELS.TYPE}
                      <span style={{ color: COLORS.red}}> *</span>
                    </label>
                    <select className="form-select" value={eventType} onChange={(e) => setEventType(Number(e.target.value))} required>
                      <option value="">Select Event Type</option>
                      {eventTypes.map((t) => (
                        <option key={t.event_type_id} value={t.event_type_id}>{t.event_type}</option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-12">
                    <label className="form-label" style={STYLES.field_label}>
                      {EVENTS_STRINGS.FORM.FIELD_LABELS.DETAILS}
                      <span style={{ color: COLORS.red}}> *</span>
                    </label>
                    <textarea className="form-control" value={eventDetails} onChange={(e) => setEventDetails(e.target.value)} required 
                      maxLength={CONSTANTS.MAX_LENGTHS.FIELD_200}
                      />
                  </div>

                  <div className="col-md-12">
                    <label className="form-label" style={STYLES.field_label}>
                      {EVENTS_STRINGS.FORM.FIELD_LABELS.BANNER}
                      <span style={{ color: COLORS.red}}> *</span>
                    </label>
                    <input
                      type="file"
                      className="form-control"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0] ?? null;
                        setEventBanner(file);
                        setPreviewBanner(file ? URL.createObjectURL(file) : "");
                      }}
                      required={!editing}
                    />
                    {previewBanner && (
                      <div className="mt-2">
                        <img src={previewBanner} alt="Preview" width={150} className="rounded shadow-sm" />
                      </div>
                    )}
                  </div>

                  <div className="col-md-12">
                    <label className="form-label" style={STYLES.field_label}>
                      {EVENTS_STRINGS.FORM.FIELD_LABELS.STATUS}
                      <span style={{ color: COLORS.red}}> *</span>
                    </label>
                    <select className="form-select" value={status} onChange={(e) => setStatus(e.target.value)} required>
                      <option value="Active">{EVENTS_STRINGS.FORM.FIELD_LABELS.STATUS_ACTIVE}</option>
                      <option value="Inactive">{EVENTS_STRINGS.FORM.FIELD_LABELS.STATUS_INACTIVE}</option>
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

      {selectedRow && (
        <DetailsDialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          title="Event Details"
          fields={[
            { label: "Event ID", value: selectedRow.event_id },
            { label: "Event Name", value: selectedRow.event_name },
            { label: "User Name", value: selectedRow.user_name },
            { label: "Industry Type", value: selectedRow.industry_id },
            { label: "Country", value: selectedRow.country_id },
            { label: "State", value: selectedRow.state_id },
            { label: "City", value: selectedRow.city_id },
            { label: "Event Venue", value: selectedRow.event_venue },
            { label: "Event Link", value: selectedRow.event_link },
            { label: "Latitude", value: selectedRow.latitude },
            { label: "Longitude", value: selectedRow.longitude },
            { label: "Geo Address", value: selectedRow.event_geo_address },
            { label: "Date", value: selectedRow.date },
            { label: "Start Time", value: selectedRow.start_time },
            { label: "End Time", value: selectedRow.end_time },
            { label: "Event Mode", value: selectedRow.event_mode_id },
            { label: "Event Type", value: selectedRow.event_type_id },
            { label: "Event Details", value: selectedRow.event_details },
            { label: "Status", value: selectedRow.status },
            { label: "Event Banner", value: selectedRow.event_banner },
          ]}
        />
      )}

    </div>
  );
};

export default EventsList;