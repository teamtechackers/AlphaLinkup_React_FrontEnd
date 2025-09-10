// pages/JobsList.tsx
import React, { useEffect, useState, useMemo } from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import { FiTrash2, FiEdit } from "react-icons/fi";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { bootstrapButtonClasses } from "../utils/theme/Bootstrapbutton";
import jobsService from "../services/jobs_service";
import { JOBS_STRINGS } from "../utils/strings/pages/jobs_strings";
import { CONSTANTS } from "../utils/strings/constants";
import { JobModel, JobLabels } from "../models/job_model";
import { COLORS } from "../utils/theme/colors";
import { STYLES } from "../utils/typography/styles";

const JobsList: React.FC = () => {
  const [items, setItems] = useState<JobModel[]>([]);
  const [loading, setLoading] = useState(false);

  const [editing, setEditing] = useState<JobModel | null>(null);
  const [fullName, setFullName] = useState("");
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

  // Load jobs from server
  const load = async (page = paginationModel.page, pageSize = paginationModel.pageSize) => {
    setLoading(true);
    try {
      const start = page * pageSize;
      const data = await jobsService.getList(page + 1, start, pageSize);

      const list = Array.isArray(data?.data)
        ? data.data.map((row: any[]) => ({
            id: Number(row[0]),
            full_name: row[1] ?? "",
            job_title: row[2] ?? "",
            company_name: row[3] ?? "",
            status: row[4]?.replace(/<[^>]+>/g, "").trim() ?? "",
            country_id: null,
            state_id: null,
            city_id: null,
            address: "",
            job_lat: null,
            job_lng: null,
            job_type_id: null,
            pay_id: null,
            job_description: "",
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

  const resetForm = () => {
    setEditing(null);
    setFullName("");
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
    setStatus("Active");
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        id: editing?.id ?? 0,
        user_id: 2, // example user_id, replace dynamically if needed
        full_name: fullName,
        job_title: jobTitle,
        company_name: companyName,
        country_id: Number(countryId),
        state_id: Number(stateId),
        city_id: Number(cityId),
        address,
        job_lat: Number(jobLat),
        job_lng: Number(jobLng),
        job_type_id: Number(jobTypeId),
        pay_id: Number(payId),
        job_description: jobDescription,
        status: status === "Active" ? 1 : 0,
      };

      const res = await jobsService.save(payload);

      const success =
        res &&
        (res.status === true ||
          (typeof res.status === "string" && res.status.toLowerCase().includes("success")) ||
          res.success === true ||
          res.rcode === 200);

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

  const onEdit = (item: JobModel) => {
    setEditing(item);
    setFullName(item.full_name ?? "");
    setJobTitle(item.job_title ?? "");
    setCompanyName(item.company_name ?? "");
    setStatus(item.status ?? "Active");
  };

  const onDelete = async (item: JobModel) => {
    if (!item.id) return;
    if (!window.confirm(CONSTANTS.MESSAGES.DELETE_CONFIRM)) return;

    try {
      const res = await jobsService.delete(item.id);
      const success =
        res &&
        (res.status === "Success" ||
          (typeof res.status === "string" && res.status.toLowerCase().includes("success")) ||
          res.success === true);

      if (success) {
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

  const columns = useMemo(
    () => [
      { field: JobLabels.FULL_NAME, headerName: JOBS_STRINGS.TABLE.HEADER_FULL_NAME, width: 150 },
      { field: JobLabels.JOB_TITLE, headerName: JOBS_STRINGS.TABLE.HEADER_JOB_TITLE, width: 150 },
      { field: JobLabels.COMPANY_NAME, headerName: JOBS_STRINGS.TABLE.HEADER_COMPANY_NAME, width: 150 },
      {
        field: JobLabels.STATUS,
        headerName: JOBS_STRINGS.TABLE.HEADER_STATUS,
        width: 120,
        renderCell: (params: any) => {
          const active = params.value.toLowerCase().includes("active");
          return (
            <span
              className="text-center p-1 rounded"
              style={{
                backgroundColor: active ? `${COLORS.green}30` : `${COLORS.red}30`,
                color: active ? COLORS.green : COLORS.red,
              }}
            >
              {params.value}
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
            <FiTrash2 size={18} style={{ cursor: "pointer" }} onClick={() => onDelete(params.row)} />
          </div>
        ),
      },
    ],
    [items]
  );

  return (
    <div className="container-fluid page-padding-2" style={{ backgroundColor: COLORS.lightGray }}>
      <h4 className="my-4">{JOBS_STRINGS.TITLE}</h4>
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
              <h5 className="mb-0">{editing ? JOBS_STRINGS.FORM.EDIT : JOBS_STRINGS.FORM.ADD}</h5>
            </div>
            <div className="card-body">
              <form onSubmit={onSubmit} encType="multipart/form-data">
                <div className="row g-3">
                  {/* Full Name / Select User */}
                  <div className="col-md-12">
                    <label className="form-label" style={STYLES.field_label}>Full Name *</label>
                    <select className="form-select" value={fullName} onChange={(e) => setFullName(e.target.value)} required>
                      <option value="">Select User</option>
                      <option value="54">Test User</option>
                      {/* Populate dynamically from API if needed */}
                    </select>
                  </div>

                  {/* Job Title */}
                  <div className="col-md-12">
                    <label className="form-label" style={STYLES.field_label}>Job Title *</label>
                    <input type="text" className="form-control" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} required />
                  </div>

                  {/* Company Name */}
                  <div className="col-md-12">
                    <label className="form-label" style={STYLES.field_label}>Company Name *</label>
                    <input type="text" className="form-control" value={companyName} onChange={(e) => setCompanyName(e.target.value)} required />
                  </div>

                  {/* Country */}
                  <div className="col-md-12">
                    <label className="form-label" style={STYLES.field_label}>Country *</label>
                    <select className="form-select" value={countryId} onChange={(e) => setCountryId(Number(e.target.value))} required>
                      <option value="">Select Country</option>
                      <option value={166}>Test Country</option>
                    </select>
                  </div>

                  {/* State */}
                  <div className="col-md-12">
                    <label className="form-label" style={STYLES.field_label}>State *</label>
                    <select className="form-select" value={stateId} onChange={(e) => setStateId(Number(e.target.value))} required>
                      <option value="">Select State</option>
                      <option value={2728}>Test State</option>
                    </select>
                  </div>

                  {/* City */}
                  <div className="col-md-12">
                    <label className="form-label" style={STYLES.field_label}>City *</label>
                    <select className="form-select" value={cityId} onChange={(e) => setCityId(Number(e.target.value))} required>
                      <option value="">Select City</option>
                      <option value={31439}>Test City</option>
                    </select>
                  </div>

                  {/* Address */}
                  <div className="col-md-12">
                    <label className="form-label" style={STYLES.field_label}>Address *</label>
                    <input type="text" className="form-control" value={address} onChange={(e) => setAddress(e.target.value)} required />
                  </div>

                  {/* Latitude */}
                  <div className="col-md-12">
                    <label className="form-label" style={STYLES.field_label}>Latitude *</label>
                    <input type="text" className="form-control" value={jobLat} onChange={(e) => setJobLat(Number(e.target.value))} required />
                  </div>

                  {/* Longitude */}
                  <div className="col-md-12">
                    <label className="form-label" style={STYLES.field_label}>Longitude *</label>
                    <input type="text" className="form-control" value={jobLng} onChange={(e) => setJobLng(Number(e.target.value))} required />
                  </div>

                  {/* Job Type */}
                  <div className="col-md-12">
                    <label className="form-label" style={STYLES.field_label}>Job Type *</label>
                    <select className="form-select" value={jobTypeId} onChange={(e) => setJobTypeId(Number(e.target.value))} required>
                      <option value="">Select Job Type</option>
                      <option value={1}>Full Time</option>
                      <option value={2}>Part Time</option>
                      <option value={3}>Internship</option>
                    </select>
                  </div>

                  {/* Pay */}
                  <div className="col-md-12">
                    <label className="form-label" style={STYLES.field_label}>Pay *</label>
                    <select className="form-select" value={payId} onChange={(e) => setPayId(Number(e.target.value))} required>
                      <option value="">Select Pay</option>
                      <option value={1}>Monthly</option>
                      <option value={2}>Salary</option>
                      <option value={3}>Equity</option>
                    </select>
                  </div>

                  {/* Description */}
                  <div className="col-md-12">
                    <label className="form-label" style={STYLES.field_label}>Description *</label>
                    <textarea className="form-control" value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} required />
                  </div>

                  {/* Status */}
                  <div className="col-md-12">
                    <label className="form-label" style={STYLES.field_label}>Status *</label>
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
                  <button type="button" className={`${bootstrapButtonClasses.outlinesecondary}`} onClick={resetForm}>
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
// btn btn-outline-secondary
export default JobsList;
