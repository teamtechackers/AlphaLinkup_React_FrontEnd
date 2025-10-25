import React, { useEffect, useState, useMemo } from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import { FiTrash2, FiEdit, FiEye } from "react-icons/fi";
import { toast } from "react-toastify";

import investorsService from "../services/investors_service";
import { INVESTORS_STRINGS } from "../utils/strings/pages/investors_strings";
import { InvestorModel, InvestorLabels } from "../models/investor_model";
import { COLORS } from "../utils/theme/colors";
import { STYLES } from "../utils/typography/styles";
import GlobalService from "../services/global_service";
import { CONSTANTS } from "../utils/strings/constants";
import DetailsDialog from "../components/DetailsDialog";

const InvestorsList: React.FC = () => {
  const [items, setItems] = useState<InvestorModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<InvestorModel | null>(null);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const [rowCount, setRowCount] = useState(0);

  const [userId, setUserId] = useState<number | "">("");
  const [name, setName] = useState("");
  const [countryId, setCountryId] = useState<number | "">("");
  const [stateId, setStateId] = useState<number | "">("");
  const [cityId, setCityId] = useState<number | "">("");
  const [fundSizeId, setFundSizeId] = useState<number | "">("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [bio, setBio] = useState("");
  const [profile, setProfile] = useState("");
  const [investmentStage, setInvestmentStage] = useState("");
  const [meetingCity, setMeetingCity] = useState("");
  const [countriesToInvest, setCountriesToInvest] = useState("");
  const [investmentIndustry, setInvestmentIndustry] = useState("");
  const [language, setLanguage] = useState("");

  const [uploadedImage, setUploadedImage] = useState<File | null>(null);

  const [countries, setCountries] = useState<any[]>([]);
  const [states, setStates] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [fundSizes, setFundSizes] = useState<any[]>([]);

  const [availability, setAvailability] = useState<string>("");
  const [approvalStatus, setApprovalStatus] = useState<string>("");
  const [status, setStatus] = useState<string>("");

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRow, setSelectedRow] = useState<InvestorModel | null>(null);

  const handleViewClick = (row: InvestorModel) => {
    setSelectedRow(row);
    setOpenDialog(true);
  };

  const load = async (page = paginationModel.page, pageSize = paginationModel.pageSize) => {
    setLoading(true);
    try {
      const start = page * pageSize;
      const data = await investorsService.getList(page + 1, start, pageSize);

    const list = Array.isArray(data?.investors_list)
      ? data.investors_list.map((row: any): InvestorModel => ({
          row_id: Number(row.row_id),
          investor_id: Number(row.investor_id),
          user_id: Number(row.user_id),
          user_name: row.user_name ?? "",
          name: row.name ?? "",
          country_id: Number(row.country_id) || 0,
          state_id: Number(row.state_id) || 0,
          city_id: Number(row.city_id) || 0,
          fund_size_id: Number(row.fund_size_id) || 0,
          linkedin_url: row.linkedin_url ?? "",
          bio: row.bio ?? "",
          image: row.profile_image_url ?? "",
          profile: row.profile ?? "",
          investment_stage: row.investment_stage ?? "",
          meeting_city: row.meeting_city ?? "",
          countries_to_invest: row.countries_to_invest ?? "",
          investment_industry: row.investment_industry ?? "",
          language: row.language ?? "",
          reference_no: row.reference_no ?? "",
          availability: row.availability_status ?? "",
          approval_status: row.approval_status ?? "",
          status: row.status ?? "",
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

  useEffect(() => {
    const loadFundSizes = async () => {
      const data = await GlobalService.getFundSizes();
      setFundSizes(data);
    };
    loadFundSizes();
  }, []);

  const resetForm = () => {
    setEditing(null);
    setUserId("");
    setName("");
    setCountryId("");
    setStateId("");
    setCityId("");
    setFundSizeId("");
    setLinkedinUrl("");
    setBio("");
    setProfile("");
    setInvestmentStage("");
    setAvailability("1");
    setMeetingCity("");
    setCountriesToInvest("");
    setInvestmentIndustry("");
    setLanguage("");
    setApprovalStatus("1");
    setStatus("1");
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("user_id", "MQ");
      formData.append("token", "cb28a886fa1802bb98441a69d0566909");
      formData.append("name", name);
      formData.append("country_id", String(countryId));
      formData.append("state_id", stateId ? String(stateId) : "0");
      formData.append("city_id", cityId ? String(cityId) : "0");
      formData.append("fund_size_id", fundSizeId ? String(fundSizeId) : "0");
      formData.append("linkedin_url", linkedinUrl);
      formData.append("bio", bio);
      formData.append("profile", profile);
      formData.append("investment_stage", investmentStage);
      formData.append("availability", availability);
      formData.append("meeting_city", meetingCity);
      formData.append("countries_to_invest", countriesToInvest);
      formData.append("investment_industry", investmentIndustry);
      formData.append("language", language);
      formData.append("approval_status", approvalStatus);
      formData.append("status", status);
      formData.append("user_for_investor", userId ? String(userId) : "0");

      if (uploadedImage) {formData.append("image", uploadedImage);}
      if (editing?.investor_id) formData.append("row_id", String(editing.investor_id));

      console.log("FormData to submit:");
      Array.from(formData.entries()).forEach(([key, value]) => {
        console.log(key, value);
      });

      const res = await investorsService.save(formData);

      if (res.status) {
        toast.success(res.message);
        resetForm();
        await load();
      } else {
        toast.error(res.message);
      }
    } catch (err) {
      toast.error(CONSTANTS.MESSAGES.SOMETHING_WENT_WRONG);
    } finally {
      setLoading(false);
    }
  };

  const onEdit = async (item: InvestorModel) => {
    setEditing(item);

    setUserId(item.user_id ?? "");

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

    setFundSizeId(item.fund_size_id ?? "");
    setName(item.name ?? "");
    setLinkedinUrl(item.linkedin_url ?? "");
    setBio(item.bio ?? "");
    setProfile(item.profile ?? "");
    setInvestmentStage(item.investment_stage ?? "");
    setAvailability(item.availability ?? "1");
    setMeetingCity(item.meeting_city ?? "");
    setCountriesToInvest(item.countries_to_invest ?? "");
    setInvestmentIndustry(item.investment_industry ?? "");
    setLanguage(item.language ?? "");
    setApprovalStatus(item.approval_status ?? "1");
    setStatus(item.status ?? "1"); 
  };

  const onDelete = async (item: InvestorModel) => {
    if (!item.investor_id) return;
    if (!window.confirm("Are you sure you want to delete this investor?")) return;
    try {
      const res = await investorsService.delete(item.investor_id);
      if (res.status === "Success" || res.success) {
        toast.success(CONSTANTS.MESSAGES.DELETE_SUCCESS);
        await load();
      } else {
        toast.error(res.message);
      }
    } catch (err) {
      console.error(err);
      toast.error(CONSTANTS.MESSAGES.SOMETHING_WENT_WRONG);
    }
  };

  const columns = useMemo(
    () => [
      { field: InvestorLabels.ID, headerName: INVESTORS_STRINGS.TABLE.HEADER_ID, width: 100 },
      { field: InvestorLabels.FULL_NAME, headerName: INVESTORS_STRINGS.TABLE.HEADER_FULL_NAME, width: 150 },
      { field: InvestorLabels.REFERENCE_NO, headerName: INVESTORS_STRINGS.TABLE.HEADER_REFERENCE_NO, width: 150 },
      { field: InvestorLabels.NAME, headerName: INVESTORS_STRINGS.TABLE.HEADER_NAME, width: 150 },
      {
        field: InvestorLabels.APPROVAL_STATUS,
        headerName: INVESTORS_STRINGS.TABLE.HEADER_APPROVAL_STATUS,
        width: 120,
        renderCell: (params: any) => (
          <span
            className="text-center p-1 rounded"
            style={{
              backgroundColor: params.value.toLowerCase().includes("pending") ? `${COLORS.orange}30` : `${COLORS.green}30`,
              color: params.value.toLowerCase().includes("pending") ? COLORS.orange : COLORS.green,
            }}
          >
            {params.value}
          </span>
        ),
      },
      {
        field: InvestorLabels.STATUS,
        headerName: INVESTORS_STRINGS.TABLE.HEADER_STATUS,
        width: 100,
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
        field: InvestorLabels.ACTIONS,
        headerName: INVESTORS_STRINGS.TABLE.HEADER_ACTIONS,
        width: 120,
        sortable: false,
        filterable: false,
        renderCell: (params: any) => (
          <div className="d-flex align-items-center gap-3 w-100 h-100">
            <FiEdit className="icon-hover" size={18} style={{ cursor: "pointer" }} onClick={() => onEdit(params.row)} />
            <FiEye
              size={18}
              style={{ cursor: "pointer" }}
              onClick={() => handleViewClick(params.row)}
              title="View Details"
            />
            <FiTrash2 className="icon-hover" size={18} style={{ cursor: "pointer" }} onClick={() => onDelete(params.row)} />
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
              {INVESTORS_STRINGS.TITLE}
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
              getRowId={(row) => row.investor_id}
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
              <h5 className="mb-0">{editing ? INVESTORS_STRINGS.FORM.EDIT : INVESTORS_STRINGS.FORM.ADD}</h5>
            </div>
            <div className="card-body">
              <form onSubmit={onSubmit}>
                <div className="row g-3 align-items-start">
                  {/* Full Name */}
                  <div className="col-md-12">
                    <label className="form-label" style={STYLES.field_label}>
                      {INVESTORS_STRINGS.FORM.FIELD_LABELS.FULL_NAME} 
                      <span style={{ color: COLORS.red}}> *</span>
                    </label>
                    <select
                      className="form-select"
                      value={userId}
                      onChange={(e) => setUserId(e.target.value ? Number(e.target.value) : "")}
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

                  {/* Name */}
                  <div className="col-md-12">
                    <label className="form-label" style={STYLES.field_label}>
                      {INVESTORS_STRINGS.FORM.FIELD_LABELS.NAME} 
                      <span style={{ color: COLORS.red}}> *</span>
                    </label>
                    <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} 
                    maxLength={CONSTANTS.MAX_LENGTHS.FIELD_100}
                    required />
                  </div>

                  {/* Country */}
                  <div className="col-md-12">
                    <label className="form-label" style={STYLES.field_label}>
                      {INVESTORS_STRINGS.FORM.FIELD_LABELS.COUNTRY} 
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
                      {INVESTORS_STRINGS.FORM.FIELD_LABELS.STATE} 
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
                      {INVESTORS_STRINGS.FORM.FIELD_LABELS.CITY} 
                      <span style={{ color: COLORS.red}}> *</span>
                    </label>
                    <select
                      className="form-select"
                      value={cityId}
                      onChange={(e) => setCityId(e.target.value ? Number(e.target.value) : "")}
                      required
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


                  {/* Linkedin URL */}
                  <div className="col-md-12">
                    <label className="form-label" style={STYLES.field_label}>
                      {INVESTORS_STRINGS.FORM.FIELD_LABELS.LINKEDIN_URL} 
                      <span style={{ color: COLORS.red}}> *</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={linkedinUrl}
                      onChange={(e) => setLinkedinUrl(e.target.value)}
                      required
                      maxLength={CONSTANTS.MAX_LENGTHS.FIELD_200}
                    />
                  </div>

                  {/* Bio */}
                  <div className="col-md-12">
                    <label className="form-label" style={STYLES.field_label}>
                      {INVESTORS_STRINGS.FORM.FIELD_LABELS.BIO} 
                      <span style={{ color: COLORS.red}}> *</span>
                    </label>
                    <textarea
                      className="form-control"
                      value={bio}
                      maxLength={CONSTANTS.MAX_LENGTHS.FIELD_200}
                      onChange={(e) => setBio(e.target.value)}
                      required
                    />
                  </div>

                  {/* Profile Image */}
                  <div className="col-md-12">
                    <label className="form-label" style={STYLES.field_label}>
                     {INVESTORS_STRINGS.FORM.FIELD_LABELS.PROFILE_IMAGE} 
                      <span style={{ color: COLORS.red}}> *</span>
                    </label>
                    <input
                      type="file"
                      className="form-control"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setUploadedImage(e.target.files[0]);
                        }
                      }}
                    />
                  </div>

                  {/* Availability Status */}
                  <div className="col-md-12">
                    <label className="form-label" style={STYLES.field_label}>
                      {INVESTORS_STRINGS.FORM.FIELD_LABELS.AVAILABILITY} 
                      <span style={{ color: COLORS.red}}> *</span>
                    </label>
                    <select
                      className="form-select"
                      value={availability}
                      onChange={(e) => setAvailability(e.target.value)}
                      required
                    >
                      <option value="">Select Availability Status</option>
                      <option value="1">In-Person</option>
                      <option value="2">Virtual</option>
                      <option value="3">Both</option>
                    </select>
                  </div>

                  {/* Profile */}
                  <div className="col-md-12">
                    <label className="form-label" style={STYLES.field_label}>
                     {INVESTORS_STRINGS.FORM.FIELD_LABELS.PROFILE} 
                      <span style={{ color: COLORS.red}}> *</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={profile}
                      onChange={(e) => setProfile(e.target.value)}
                      required
                      maxLength={CONSTANTS.MAX_LENGTHS.FIELD_200}
                    />
                  </div>

                  {/* Investment Stage */}
                  <div className="col-md-12">
                    <label className="form-label" style={STYLES.field_label}>
                      {INVESTORS_STRINGS.FORM.FIELD_LABELS.INVESTMENT_STAGE} 
                      <span style={{ color: COLORS.red}}> *</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={investmentStage}
                      onChange={(e) => setInvestmentStage(e.target.value)}
                      required
                      maxLength={CONSTANTS.MAX_LENGTHS.FIELD_200}
                    />
                  </div>

                  {/* Meeting City */}
                  <div className="col-md-12">
                    <label className="form-label" style={STYLES.field_label}>
                      {INVESTORS_STRINGS.FORM.FIELD_LABELS.MEETING_CITY} 
                      <span style={{ color: COLORS.red}}> *</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={meetingCity}
                      onChange={(e) => setMeetingCity(e.target.value)}
                      required
                      maxLength={CONSTANTS.MAX_LENGTHS.FIELD_200}
                    />
                  </div>

                  {/* Countries to Invest */}
                  <div className="col-md-12">
                    <label className="form-label" style={STYLES.field_label}>
                      {INVESTORS_STRINGS.FORM.FIELD_LABELS.COUNTRIES_TO_INVEST} 
                      <span style={{ color: COLORS.red}}> *</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={countriesToInvest}
                      onChange={(e) => setCountriesToInvest(e.target.value)}
                      required
                      maxLength={CONSTANTS.MAX_LENGTHS.FIELD_200}
                    />
                  </div>

                  {/* Investment Industry */}
                  <div className="col-md-12">
                    <label className="form-label" style={STYLES.field_label}>
                      {INVESTORS_STRINGS.FORM.FIELD_LABELS.INVESTMENT_INDUSTRY} 
                      <span style={{ color: COLORS.red}}> *</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={investmentIndustry}
                      onChange={(e) => setInvestmentIndustry(e.target.value)}
                      required
                      maxLength={CONSTANTS.MAX_LENGTHS.FIELD_200}
                    />
                  </div>

                  {/* Language */}
                  <div className="col-md-12">
                    <label className="form-label" style={STYLES.field_label}>
                      {INVESTORS_STRINGS.FORM.FIELD_LABELS.LANGUAGE} 
                      <span style={{ color: COLORS.red}}> *</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      required
                      maxLength={CONSTANTS.MAX_LENGTHS.FIELD_200}
                    />
                  </div>

                  {/* Fund Size */}
                  <div className="col-md-12">
                    <label className="form-label" style={STYLES.field_label}>
                      {INVESTORS_STRINGS.FORM.FIELD_LABELS.FUND_SIZE} 
                      <span style={{ color: COLORS.red}}> *</span>
                    </label>
                    <select className="form-select" value={fundSizeId} onChange={(e) => setFundSizeId(Number(e.target.value))} required>
                      <option value="">Select Fund Size</option>
                      {fundSizes.map(fs => (
                        <option key={fs.fund_size_id} value={fs.fund_size_id}>
                          {fs.investment_range}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Approval Status */}
                  <div className="col-md-12">
                    <label className="form-label" style={STYLES.field_label}>
                      {INVESTORS_STRINGS.FORM.FIELD_LABELS.APPROVAL_STATUS} 
                      <span style={{ color: COLORS.red}}> *</span>
                    </label>
                    <select
                      className="form-select"
                      value={approvalStatus}
                      onChange={(e) => setApprovalStatus(e.target.value)}
                      required
                    >
                      <option value="">Select Approval Status</option>
                      <option value="1">Pending</option>
                      <option value="2">Approved</option>
                      <option value="3">Rejected</option>
                    </select>
                  </div>

                  {/* Status */}
                  <div className="col-md-12">
                    <label className="form-label" style={STYLES.field_label}>
                      {INVESTORS_STRINGS.FORM.FIELD_LABELS.STATUS} 
                      <span style={{ color: COLORS.red}}> *</span>
                    </label>
                    <select
                      className="form-select"
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      required
                    >
                      <option value="">Select Status</option>
                      <option value="1">Active</option>
                      <option value="0">Inactive</option>
                    </select>
                  </div>

                  {/* Buttons */}
                  <div className="col-12 mt-3 d-flex justify-content-between">
                    <button type="submit" className="btn"  style={{ backgroundColor: COLORS.purple, color: COLORS.white }}>{editing ? "Update" : "Save"}</button>
                    {editing && <button type="button" className="btn btn-secondary" onClick={resetForm}>Cancel</button>}
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>

        {selectedRow && (
          <DetailsDialog
            open={openDialog}
            onClose={() => setOpenDialog(false)}
            title="Investor Details"
            fields={[
              { label: "Investor ID", value: selectedRow.investor_id },
              { label: "User Name", value: selectedRow.user_name },
              { label: "Name", value: selectedRow.name },
              { label: "Country", value: selectedRow.country_id },
              { label: "State", value: selectedRow.state_id },
              { label: "City", value: selectedRow.city_id },
              { label: "Fund Size", value: (() => {
                  switch (selectedRow.fund_size_id) {
                    case 1: return "Small";
                    case 2: return "Medium";
                    case 3: return "Large";
                    default: return "N/A";
                  }
                })()
              },
              { label: "LinkedIn URL", value: selectedRow.linkedin_url },
              { label: "Bio", value: selectedRow.bio },
              { label: "Profile", value: selectedRow.profile },
              { label: "Investment Stage", value: selectedRow.investment_stage },
              { label: "Availability", value: (() => {
                  switch (selectedRow.availability) {
                    case "1": return "In-Person";
                    case "2": return "Virtual";
                    case "3": return "Both";
                    default: return "N/A";
                  }
                })()
              },
              { label: "Meeting City", value: selectedRow.meeting_city },
              { label: "Countries to Invest", value: selectedRow.countries_to_invest },
              { label: "Investment Industry", value: selectedRow.investment_industry },
              { label: "Language", value: selectedRow.language },
              { label: "Approval Status", value: (() => {
                  switch (selectedRow.approval_status) {
                    case "1": return "Pending";
                    case "2": return "Approved";
                    case "3": return "Rejected";
                    default: return "N/A";
                  }
                })()
              },
              { label: "Status", value: selectedRow.status === "1" ? "Active" : "Inactive" },
            ]}
          />
        )}

      </div>
    </div>
  );
};

export default InvestorsList;
