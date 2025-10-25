import React, { useEffect, useState, useMemo } from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import { FiTrash2, FiEdit, FiEye  } from "react-icons/fi";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import GlobalService from "../services/global_service";
import jobsService from "../services/jobs_service";
import { JOBS_STRINGS } from "../utils/strings/pages/jobs_strings";
import { CONSTANTS } from "../utils/strings/constants";
import { JobModel, JobLabels } from "../models/job_model";
import { COLORS } from "../utils/theme/colors";
import { STYLES } from "../utils/typography/styles";
import DetailsDialog from "../components/DetailsDialog";

const JobsList: React.FC = () => {
  const [items, setItems] = useState<JobModel[]>([]);
  const [loading, setLoading] = useState(false);

  const [editing, setEditing] = useState<JobModel | null>(null);
  const [userName, setUserName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [countryId, setCountryId] = useState<number | "">("");
  const [stateId, setStateId] = useState<number | "">("");
  const [cityId, setCityId] = useState<number | "">("");
  const [address, setAddress] = useState("");
  const [jobLat, setJobLat] = useState<number | "">("");
  const [jobLng, setJobLng] = useState<number | "">("");
  const [jobTypeId, setJobTypeId] = useState<number | "">("");
  const [payId, setPayId] = useState<number | "">("");
  const [jobDescription, setJobDescription] = useState("");
  const [status, setStatus] = useState("Active");

  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const [rowCount, setRowCount] = useState(0);

  const [countries, setCountries] = useState<any[]>([]);
  const [states, setStates] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [jobTypes, setJobTypes] = useState<any[]>([]);
  const [pays, setPays] = useState<any[]>([]);

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRow, setSelectedRow] = useState<JobModel | null>(null);

  const handleViewClick = (row: JobModel) => {
    setSelectedRow(row);
    setOpenDialog(true);
  };

  const load = async (page = paginationModel.page, pageSize = paginationModel.pageSize) => {
    setLoading(true);
    try {
      const start = page * pageSize;
      const { data, recordsTotal } = await jobsService.getList(page + 1, start, pageSize);

      const list: JobModel[] = Array.isArray(data)
        ? data.map((row: any) => ({
            row_id: Number(row.row_id),
            job_id: row.job_id ?? "",
            job_title: row.job_title ?? "", 
            user_id: row.user_id ?? "",
            user_name: row.user_name ?? "",
            company_name: row.company_name ?? "",
            country_id: row.country_id ?? "",
            country_name: row.country_name ?? "",
            state_id: row.state_id ?? "",
            state_name: row.state_name ?? "",
            city_id: row.city_id ?? "",
            city_name: row.city_name ?? "",
            address: row.address ?? "",
            latitude: row.latitude ?? "",
            longitude: row.longitude ?? "",
            job_type_id: row.job_type_id ?? "",
            job_type_name: row.job_type_name ?? "",
            pay_id: row.pay_id ?? "",
            pay_name: row.pay_name ?? "",
            job_description: row.job_description ?? "",
            status: row.status ?? "Inactive",
          }))
        : [];

      setItems(list);
      setRowCount(recordsTotal ?? 0);
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
    const fetchJobTypes = async () => {
      try {
        const list = await GlobalService.getJobTypes();
        setJobTypes(list);
      } catch (err) {
        console.error("Error loading job types", err);
      }
    };

    const fetchPays = async () => {
      try {
        const list = await GlobalService.getPayList();
        setPays(list);
      } catch (err) {
        console.error("Error loading pay list", err);
      }
    };

    fetchJobTypes();
    fetchPays();
  }, []);

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
    setUserName("");
    setJobTitle("");
    setCompanyName("");
    setCountryId("");
    setStateId("");
    setCityId("");
    setAddress("");
    setJobLat("");
    setJobLng("");
    setJobTypeId("");
    setPayId("");
    setJobDescription("");
    setStatus("");
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
     
    try {
      const payload: any = {
        user_id: userName,
        job_title: jobTitle,
        company_name: companyName,
        country_id: countryId || "",
        state_id: stateId || "",
        city_id: cityId || "",
        address,
        job_lat: jobLat || "",
        job_lng: jobLng || "",
        job_type_id: jobTypeId || "",
        pay_id: payId || "",
        job_description: jobDescription,
        status: status === "Active" ? 1 : 0,
      };

      if (editing && editing.job_id) {
        payload.row_id = editing.job_id;
      }

      const res = await jobsService.save(payload);

      const success =
        res &&
        (res.status === true ||
          res.rcode === 200 ||
          res.success === true ||
          (typeof res.status === "string" && res.status.toLowerCase().includes("success")));

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

  const onEdit = async (item: JobModel) => {
    setEditing(item);
    setUserName(item.user_id ?? "");
    setJobTitle(item.job_title ?? "");
    setCompanyName(item.company_name ?? "");
    setAddress(item.address ?? "");
    setJobLat(item.latitude ? Number(item.latitude) : "");
    setJobLng(item.longitude ? Number(item.longitude) : "");
    setJobDescription(item.job_description ?? "");
    setStatus(item.status ?? "Active");
    setJobTypeId(item.job_type_id ? Number(item.job_type_id) : "");
    setPayId(item.pay_id ? Number(item.pay_id) : "");

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
  };

  const onDelete = async (jobId: number) => {
    if (!jobId) return;
    if (!window.confirm(CONSTANTS.MESSAGES.DELETE_CONFIRM)) return;

    try {
      const res = await jobsService.delete(jobId);

      const success =
        res &&
        (res.success === true || (res.status && res.status.toString().toLowerCase() === "success"));

      if (success) {
        toast.success(res.info || CONSTANTS.MESSAGES.DELETE_SUCCESS);

        setItems(prev => prev.filter(item => item.job_id !== jobId.toString()));
        setRowCount(prev => prev - 1);
      } else {
        toast.error(res.message || CONSTANTS.MESSAGES.SOMETHING_WENT_WRONG);
      }
    } catch (err) {
      console.error(err);
      toast.error(CONSTANTS.MESSAGES.SOMETHING_WENT_WRONG);
    }
  };

  const columns = useMemo(
    () => [
      { field: JobLabels.ROW_ID, headerName: JOBS_STRINGS.TABLE.HEADER_ROW_ID, width: 150 },
      { field: JobLabels.USER_NAME, headerName: JOBS_STRINGS.TABLE.HEADER_FULL_NAME, width: 150 },
      { field: JobLabels.JOB_TITLE, headerName: JOBS_STRINGS.TABLE.HEADER_JOB_TITLE, width: 150 },
      { field: JobLabels.COMPANY_NAME, headerName: JOBS_STRINGS.TABLE.HEADER_COMPANY_NAME, width: 150 },
      {
        field: JobLabels.STATUS,
        headerName: JOBS_STRINGS.TABLE.HEADER_STATUS,
        width: 120,
        renderCell: (params: any) => {
          const isActive = params.value?.toString().toLowerCase() === "active";
          return (
            <span
              className="text-center p-1 rounded"
              style={{
                backgroundColor: isActive ? `${COLORS.green}30` : `${COLORS.red}30`,
                color: isActive ? COLORS.green : COLORS.red,
              }}
            >
              {isActive ? JOBS_STRINGS.TABLE.STATUS_ACTIVE : JOBS_STRINGS.TABLE.STATUS_INACTIVE}
            </span>
          );
        },
      },
      {
        field: JobLabels.ACTIONS,
        headerName: JOBS_STRINGS.TABLE.HEADER_ACTIONS,
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
            <FiTrash2
              size={18}
              style={{ cursor: "pointer" }}
              onClick={() => onDelete(params.row.job_id)}
            />
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
              {JOBS_STRINGS.TITLE}
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
              <h5 className="mb-0">{editing ? JOBS_STRINGS.FORM.EDIT : JOBS_STRINGS.FORM.ADD}</h5>
            </div>
            <div className="card-body">
              <form onSubmit={onSubmit} encType="multipart/form-data">
                <div className="row g-3">

                  {/* Full Name */}
                  <div className="col-md-12">
                    <label className="form-label" style={STYLES.field_label}>
                      {JOBS_STRINGS.FORM.FIELD_LABELS.FULL_NAME}
                      <span style={{ color: COLORS.red}}> *</span></label>
                    <select
                      className="form-select"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
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

                  {/* Job Title */}
                  <div className="col-md-12">
                    <label className="form-label" style={STYLES.field_label}>
                      {JOBS_STRINGS.FORM.FIELD_LABELS.JOB_TITLE}
                      <span style={{ color: COLORS.red}}> *</span></label>
                      <input
                        type="text"
                        className="form-control"
                        value={jobTitle}
                        maxLength={CONSTANTS.MAX_LENGTHS.FIELD_100}
                        onChange={(e) => setJobTitle(e.target.value)}
                        required
                      />
                  </div>

                  {/* Company Name */}
                  <div className="col-md-12">
                    <label className="form-label" style={STYLES.field_label}>
                      {JOBS_STRINGS.FORM.FIELD_LABELS.COMPANY_NAME} 
                      <span style={{ color: COLORS.red}}> *</span>
                    </label>
                      <input
                      type="text"
                      className="form-control"
                      value={companyName}
                      maxLength={CONSTANTS.MAX_LENGTHS.FIELD_100}
                      onChange={(e) => setCompanyName(e.target.value)}
                      required
                    />
                  </div>

                  {/* Country */}
                  <div className="col-md-12">
                    <label className="form-label" style={STYLES.field_label}>
                      {JOBS_STRINGS.FORM.FIELD_LABELS.COUNTRY} 
                      <span style={{ color: COLORS.red}}> *</span>
                    </label>
                    <select
                      className="form-select"
                      value={countryId}
                      onChange={(e) => setCountryId(e.target.value ? Number(e.target.value) : "")}
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
                      {JOBS_STRINGS.FORM.FIELD_LABELS.STATE}
                      <span style={{ color: COLORS.red}}> *</span>
                    </label>
                    <select
                      className="form-select"
                      value={stateId}
                      onChange={(e) => setStateId(e.target.value ? Number(e.target.value) : "")}
                      disabled={!countryId}
                      required
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
                      {JOBS_STRINGS.FORM.FIELD_LABELS.CITY} 
                      <span style={{ color: COLORS.red}}> *</span>
                    </label>
                    <select
                      className="form-select"
                      value={cityId}
                      onChange={(e) => setCityId(e.target.value ? Number(e.target.value) : "")}
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

                  {/* Address */}
                  <div className="col-md-12">
                    <label className="form-label" style={STYLES.field_label}>
                     {JOBS_STRINGS.FORM.FIELD_LABELS.ADDRESS}
                      <span style={{ color: COLORS.red}}> *</span></label>
                      <input
                      type="text"
                      className="form-control"
                      value={address}
                      maxLength={CONSTANTS.MAX_LENGTHS.FIELD_150}
                      onChange={(e) => setAddress(e.target.value)}
                      required
                    />
                  </div>

                  {/* Latitude */}
                  <div className="col-md-12">
                    <label className="form-label" style={STYLES.field_label}>
                      {JOBS_STRINGS.FORM.FIELD_LABELS.LAT} 
                      <span style={{ color: COLORS.red}}> *</span></label>
                    <input 
                      type="number" 
                      className="form-control" 
                      value={jobLat} 
                      onChange={(e) => {
                        const val = e.target.value;
                        if (/^\d*$/.test(val)) {
                          setJobLat(Number(val));
                        }
                      }}
                      required />
                  </div>

                  {/* Longitude */}
                  <div className="col-md-12">
                    <label className="form-label" style={STYLES.field_label}>
                      {JOBS_STRINGS.FORM.FIELD_LABELS.LNG}
                      <span style={{ color: COLORS.red}}> *</span></label>
                    <input 
                      type="number" 
                      className="form-control" 
                      value={jobLat} 
                      onChange={(e) => {
                        const val = e.target.value;
                        if (/^\d*$/.test(val)) {
                          setJobLng(Number(val));
                        }
                      }}
                      required />
                  </div>

                  {/* Job Type */}
                  <div className="col-md-12">
                    <label className="form-label" style={STYLES.field_label}>
                      {JOBS_STRINGS.FORM.FIELD_LABELS.TYPE} 
                      <span style={{ color: COLORS.red}}> *</span></label>
                    <select
                      className="form-select"
                      value={jobTypeId}
                      onChange={(e) => setJobTypeId(e.target.value ? Number(e.target.value) : "")}
                      required
                    >
                      <option value="">Select Job Type</option>
                      {jobTypes.map((jt) => (
                        <option key={jt.job_type_id} value={jt.job_type_id}>
                          {jt.job_type}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Pay */}
                  <div className="col-md-12">
                    <label className="form-label" style={STYLES.field_label}>
                      {JOBS_STRINGS.FORM.FIELD_LABELS.PAY}  
                      <span style={{ color: COLORS.red}}> *</span></label>
                    <select
                      className="form-select"
                      value={payId}
                      onChange={(e) => setPayId(e.target.value ? Number(e.target.value) : "")}
                      required
                    >
                      <option value="">Select Pay</option>
                      {pays.map((p) => (
                        <option key={p.pay_id} value={p.pay_id}>
                          {p.pay}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Description */}
                  <div className="col-md-12">
                    <label className="form-label" style={STYLES.field_label}>
                      {JOBS_STRINGS.FORM.FIELD_LABELS.DESCRIPTION} 
                      <span style={{ color: COLORS.red}}> *</span></label>
                      <textarea
                    className="form-control"
                    value={jobDescription}
                    maxLength={CONSTANTS.MAX_LENGTHS.FIELD_200}
                    onChange={(e) => setJobDescription(e.target.value)}
                    required
                  />
                  </div>

                  {/* Status */}
                  <div className="col-md-12">
                    <label className="form-label" style={STYLES.field_label}>
                      {JOBS_STRINGS.FORM.FIELD_LABELS.STATUS}  
                      <span style={{ color: COLORS.red}}> *</span></label>
                    <select className="form-select" value={status} onChange={(e) => setStatus(e.target.value)} required>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                {/* Buttons */}
                <div className="d-flex gap-2 mt-3">
                  <button type="submit" className="btn" style={{ backgroundColor: COLORS.purple, color: COLORS.white }}>
                    {editing ? "Update" : "Save"}
                  </button>
                  {editing ? 
                   <button type="button" className="btn btn-outline-secondary" onClick={resetForm}>
                    {CONSTANTS.BUTTONS.CANCEL}
                  </button> : <div></div> }
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
          title="Job Details"
          fields={[
            { label: "Job ID", value: selectedRow.job_id },
            { label: "Job Title", value: selectedRow.job_title },
            { label: "User Name", value: selectedRow.user_name },
            { label: "Company Name", value: selectedRow.company_name },
            { label: "Country", value: selectedRow.country_name },
            { label: "State", value: selectedRow.state_name },
            { label: "City", value: selectedRow.city_name },
            { label: "Address", value: selectedRow.address },
            { label: "Latitude", value: selectedRow.latitude },
            { label: "Longitude", value: selectedRow.longitude },
            { label: "Job Type", value: selectedRow.job_type_name },
            { label: "Pay", value: selectedRow.pay_name },
            { label: "Job Description", value: selectedRow.job_description },
            { label: "Status", value: selectedRow.status },
          ]}
        />
      )}

    </div>
  );
};

export default JobsList;
