// pages/InvestorsList.tsx
import React, { useEffect, useState, useMemo } from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import { FiTrash2, FiEdit } from "react-icons/fi";
import { toast } from "react-toastify";
import {bootstrapButtonClasses} from "../utils/theme/Bootstrapbutton";
import investorsService from "../services/investors_service";
import { INVESTORS_STRINGS } from "../utils/strings/pages/investors_strings";
import { InvestorModel, InvestorLabels } from "../models/investor_model";
import { COLORS } from "../utils/theme/colors";
import { STYLES } from "../utils/typography/styles";
import { buttonBaseClasses } from "@mui/material";

const APPROVAL_STATUS = ["Pending", "Approved", "Rejected"];
const OVERALL_STATUS = ["Active", "Inactive"];

const InvestorsList: React.FC = () => {
  const [items, setItems] = useState<InvestorModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<InvestorModel | null>(null);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const [rowCount, setRowCount] = useState(0);

  // Form fields
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
  const [availability, setAvailability] = useState("");
  const [meetingCity, setMeetingCity] = useState("");
  const [countriesToInvest, setCountriesToInvest] = useState("");
  const [investmentIndustry, setInvestmentIndustry] = useState("");
  const [language, setLanguage] = useState("");
  const [approvalStatus, setApprovalStatus] = useState("Pending");
  const [overallStatus, setOverallStatus] = useState("Active");

  const load = async (page = paginationModel.page, pageSize = paginationModel.pageSize) => {
    setLoading(true);
    try {
      const start = page * pageSize;
      const data = await investorsService.getList(page + 1, start, pageSize);

      const list = Array.isArray(data?.data)
        ? data.data.map((row: any[]) => ({
            id: Number(row[0]),
            full_name: row[1] ?? "",
            reference_no: row[2] ?? "",
            name: row[3] ?? "",
            approval_status: row[4]?.replace(/<[^>]+>/g, "").trim() ?? "",
            status: row[5]?.replace(/<[^>]+>/g, "").trim() ?? "",
          }))
        : [];

      setItems(list);
      setRowCount(data?.recordsTotal ?? 0);
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(paginationModel.page, paginationModel.pageSize);
  }, [paginationModel]);

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
    setAvailability("");
    setMeetingCity("");
    setCountriesToInvest("");
    setInvestmentIndustry("");
    setLanguage("");
    setApprovalStatus("Pending");
    setOverallStatus("Active");
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!userId) {
        toast.error("Please select a user");
        return;
      }

      const payload = {
        id: editing?.id ?? 0,
        user_id: userId,
        name,
        country_id: countryId,
        state_id: stateId,
        city_id: cityId,
        fund_size_id: fundSizeId,
        linkedin_url: linkedinUrl,
        bio,
        profile,
        investment_stage: investmentStage,
        availability,
        meeting_city: meetingCity,
        countries_to_invest: countriesToInvest,
        investment_industry: investmentIndustry,
        language,
        approval_status: approvalStatus,
        status: overallStatus === "Active" ? 1 : 0,
      };
      const res = await investorsService.save(payload);
      if (res.status === true || res.success) {
        toast.success(editing ? "Updated Successfully" : "Saved Successfully");
        resetForm();
        await load();
      } else {
        toast.error(res.message || "Something went wrong!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong!");
    }
  };

  const onEdit = (item: InvestorModel) => {
    setEditing(item);
    setUserId(item.user_id ?? "");
    setName(item.name ?? "");

    const approvalMap: Record<number, string> = {
      1: "Pending",
      2: "Approved",
      3: "Rejected",
    };

    const approvalValue =
      typeof item.approval_status === "number"
        ? approvalMap[item.approval_status] ?? "Pending"
        : item.approval_status ?? "Pending";

    setApprovalStatus(approvalValue);
    setOverallStatus(item.status === 1 ? "Active" : "Inactive");
  };

  const onDelete = async (item: InvestorModel) => {
    if (!item.id) return;
    if (!window.confirm("Are you sure you want to delete this investor?")) return;
    try {
      const res = await investorsService.delete(item.id);
      if (res.status === "Success" || res.success) {
        toast.success("Deleted Successfully");
        await load();
      } else {
        toast.error(res.message || "Something went wrong!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong!");
    }
  };

  const columns = useMemo(
    () => [
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
            <FiTrash2 className="icon-hover" size={18} style={{ cursor: "pointer" }} onClick={() => onDelete(params.row)} />
          </div>
        ),
      },
    ],
    [items]
  );

  return (
    <div className="container-fluid page-padding-2" style={{ backgroundColor: COLORS.lightGray }}>
      <h4 className="my-4">{INVESTORS_STRINGS.TITLE}</h4>
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
              <h5 className="mb-0">{editing ? INVESTORS_STRINGS.FORM.EDIT : INVESTORS_STRINGS.FORM.ADD}</h5>
            </div>
            <div className="card-body">
              <form onSubmit={onSubmit}>
                <div className="row g-3 align-items-start">
                  {/* Full Name */}
                  <div className="col-md-12">
                    <label className="form-label" style={STYLES.field_label}>Select User *</label>
                    <select
                      className="form-select"
                      value={userId}
                      onChange={(e) => setUserId(Number(e.target.value))}
                      required
                    >
                      <option value="">Select User</option>
                      <option value={54}>Test User</option>
                      {/* Add more users dynamically here if needed */}
                    </select>
                  </div>

                  {/* Name */}
                  <div className="col-md-12">
                    <label className="form-label" style={STYLES.field_label}>Name *</label>
                    <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} required />
                  </div>

                  {/* Country / State / City */}
                  <div className="col-md-12">
                    <label className="form-label" style={STYLES.field_label}>Country *</label>
                    <select className="form-select" value={countryId} onChange={(e) => setCountryId(Number(e.target.value))} required>
                      <option value="">Select Country</option>
                      <option value={166}>Test Country</option>
                    </select>
                  </div>

                  <div className="col-md-12">
                    <label className="form-label" style={STYLES.field_label}>State *</label>
                    <select className="form-select" value={stateId} onChange={(e) => setStateId(Number(e.target.value))} required>
                      <option value="">Select State</option>
                      <option value={2728}>Test State</option>
                    </select>
                  </div>

                  <div className="col-md-12">
                    <label className="form-label" style={STYLES.field_label}>City *</label>
                    <select className="form-select" value={cityId} onChange={(e) => setCityId(Number(e.target.value))} required>
                      <option value="">Select City</option>
                      <option value={31439}>Test City</option>
                    </select>
                  </div>

                  {/* Linkedin URL */}
                  <div className="col-md-12">
                    <label className="form-label" style={STYLES.field_label}>Linkedin URL *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={linkedinUrl}
                      onChange={(e) => setLinkedinUrl(e.target.value)}
                      required
                    />
                  </div>

                  {/* Bio */}
                  <div className="col-md-12">
                    <label className="form-label" style={STYLES.field_label}>Bio *</label>
                    <textarea
                      className="form-control"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      required
                    />
                  </div>

                  {/* Profile Image */}
                  <div className="col-md-12">
                    <label className="form-label" style={STYLES.field_label}>Profile Image *</label>
                    <input
                      type="file"
                      className="form-control"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          // You can handle file upload here
                          console.log(e.target.files[0]);
                        }
                      }}
                    />
                  </div>

                  {/* Availability Status */}
                  <div className="col-md-12">
                    <label className="form-label" style={STYLES.field_label}>Availability Status *</label>
                    <select
                      className="form-select"
                      value={availability}
                      onChange={(e) => setAvailability(e.target.value)}
                      required
                    >
                      <option value="">Select Availability Status</option>
                      <option value="In-Person">In-Person</option>
                      <option value="Virtual">Virtual</option>
                      <option value="Both">Both</option>
                    </select>
                  </div>
                  {/* Profile */}
                  <div className="col-md-12">
                    <label className="form-label" style={STYLES.field_label}>Profile *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={profile}
                      onChange={(e) => setProfile(e.target.value)}
                      required
                    />
                  </div>
                  {/* Investment Stage */}
                  <div className="col-md-12">
                    <label className="form-label" style={STYLES.field_label}>Investment Stage *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={investmentStage}
                      onChange={(e) => setInvestmentStage(e.target.value)}
                      required
                    />
                  </div>
                  {/* Meeting City */}
                  <div className="col-md-12">
                    <label className="form-label" style={STYLES.field_label}>Meeting City *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={meetingCity}
                      onChange={(e) => setMeetingCity(e.target.value)}
                      required
                    />
                  </div>

                  {/* Countries to Invest */}
                  <div className="col-md-12">
                    <label className="form-label" style={STYLES.field_label}>Countries to Invest *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={countriesToInvest}
                      onChange={(e) => setCountriesToInvest(e.target.value)}
                      required
                    />
                  </div>
                  {/* Investment Industry */}
                  <div className="col-md-12">
                    <label className="form-label" style={STYLES.field_label}>Investment Industry *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={investmentIndustry}
                      onChange={(e) => setInvestmentIndustry(e.target.value)}
                      required
                    />
                  </div>

                  {/* Language */}
                  <div className="col-md-12">
                    <label className="form-label" style={STYLES.field_label}>Language *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      required
                    />
                  </div>
                  {/* Example */}
                  <div className="col-md-12">
                    <label className="form-label" style={STYLES.field_label}>Fund Size *</label>
                    <select className="form-select" value={fundSizeId} onChange={(e) => setFundSizeId(Number(e.target.value))} required>
                      <option value="">Select Fund Size</option>
                      <option value={1}>Small</option>
                      <option value={2}>Medium</option>
                      <option value={3}>Large</option>
                    </select>
                  </div>
                    <div className="col-12 mt-3 d-flex justify-content-between">
                    <button type="submit" className={`${bootstrapButtonClasses.primary}`}>{editing ? "Update" : "Save"}</button>
                    {editing && <button type="button" className="btn btn-secondary" onClick={resetForm}>Cancel</button>}
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default InvestorsList;
