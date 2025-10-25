import React, { useMemo, useState } from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import { FiMonitor, FiEdit } from "react-icons/fi";
import { RequestorModel } from "../models/requestor_model";
import { MeetingModel, MeetingModelLabels } from "../models/meeting_model";
import { InvestorDetailModel } from "../models/investor_detail_model";
import InvestorMeetingsDialog from "../components/InvestorMeetingsDialog";
import ImageDetailsDialog from "../components/ImageDetailsDialogProps";
import { MEETINGS_STRINGS } from "../utils/strings/pages/meetings_strings";
import { COLORS } from "../utils/theme/colors";
import { toast } from "react-toastify";
import { CONSTANTS } from "../utils/strings/constants";
import meetingsSchedulesService from "../services/meetings_schedules_service";
import { useEffect } from "react";
import { STYLES } from "../utils/typography/styles";

const MeetingsSchedulesPage: React.FC = () => {
  const [items, setItems] = useState<MeetingModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [openInvestorDetails, setOpenInvestorDetails] = useState(false);
  const [openInvestorMeetings, setOpenInvestorMeetings] = useState(false);
  const [selectedInvestor, setSelectedInvestor] = useState<InvestorDetailModel | null>(null);
  const [selectedInvestorMeetings, setSelectedInvestorMeetings] = useState<MeetingModel[]>([]);
  const [openUserDetails, setOpenUserDetails] = useState(false);
  const [selectedUser, setSelectedUser] = useState<RequestorModel | null>(null);
  const [selectedMeeting, setSelectedMeeting] = useState<MeetingModel | null>(null);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const [rowCount, setRowCount] = useState(0);

  const loadMeetings = async (page = paginationModel.page, pageSize = paginationModel.pageSize) => {
    setLoading(true);
    try {
      const response = await meetingsSchedulesService.getMeetingsList(page + 1, pageSize);
      
      if (response.status && response.data) {
        const meetings: MeetingModel[] = response.data.meeting_requests || [];
        console.log("Parsed meetings:", meetings); 
        setItems(meetings);
        setRowCount(response.data.pagination?.total_records || 0);
      } else {
        toast.error(response.message || CONSTANTS.MESSAGES.SOMETHING_WENT_WRONG);
        setItems([]);
      }
    } catch (err) {
      console.error("Error loading meetings:", err);
      toast.error(CONSTANTS.MESSAGES.SOMETHING_WENT_WRONG);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMeetings(paginationModel.page, paginationModel.pageSize);
  }, [paginationModel]);

  const handleOpenInvestorDetails = async (investorId: string) => {
    try {
      const response = await meetingsSchedulesService.getInvestorDetails(investorId);
      
      if (response.status && response.data) {
        setSelectedInvestor(response.data);
        setOpenInvestorDetails(true);
      } else {
        toast.error(response.message || CONSTANTS.MESSAGES.SOMETHING_WENT_WRONG);
      }
    } catch (err) {
      console.error("Error loading investor details:", err);
      toast.error(CONSTANTS.MESSAGES.SOMETHING_WENT_WRONG);
    }
  };

  const handleOpenInvestorMeetings = async (investorId: string) => {
    try {
      const response = await meetingsSchedulesService.getInvestorMeetings(investorId);
      
      if (response.status && response.data) {
        const meetings: MeetingModel[] = response.data.meeting_requests || [];
        setSelectedInvestorMeetings(meetings);
        setOpenInvestorMeetings(true);
      } else {
        toast.error(response.message || CONSTANTS.MESSAGES.SOMETHING_WENT_WRONG);
      }
    } catch (err) {
      console.error("Error loading investor meetings:", err);
      toast.error(CONSTANTS.MESSAGES.SOMETHING_WENT_WRONG);
    }
  };

  const handleOpenUserDetails = async (userId: string) => {
    try {
      const response = await meetingsSchedulesService.getRequestorDetails(userId);
      console.log("User details:", response); 
      if (response.status && response.data) {
        setSelectedUser(response.data);
        setOpenUserDetails(true);
      } else {
        toast.error(response.message || CONSTANTS.MESSAGES.SOMETHING_WENT_WRONG);
      }
    } catch (err) {
      console.error("Error loading user details:", err);
      toast.error(CONSTANTS.MESSAGES.SOMETHING_WENT_WRONG);
    }
  };

  const onEdit = (item: MeetingModel) => {
    setSelectedMeeting(item);
  };

  const handleReset = () => {
    setSelectedMeeting(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!selectedMeeting) return;
    const { name, value } = e.target;
    setSelectedMeeting((prev) => (prev ? { ...prev, [name]: value } : prev));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMeeting) return;

    try {
      const payload = {
        request_id: selectedMeeting.request_id,
        meeting_date: selectedMeeting.meeting_date,
        meeting_time: selectedMeeting.meeting_time,
        request_status: selectedMeeting.schedule_status,
      };

      const response = await meetingsSchedulesService.updateMeetingRequest(payload);
      
      if (response.status) {
        toast.success(response.data.message || "Meeting updated successfully");
        setSelectedMeeting(null);
        await loadMeetings(paginationModel.page, paginationModel.pageSize);
      } else {
        toast.error(response.message || CONSTANTS.MESSAGES.SOMETHING_WENT_WRONG);
      }
    } catch (err) {
      console.error("Error updating meeting:", err);
      toast.error(CONSTANTS.MESSAGES.SOMETHING_WENT_WRONG);
    }
  };

  const to12Hour = (time: string): string => {
    if (!time) return "";
    const trimmed = time.trim();

    const ampmMatch = trimmed.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (ampmMatch) {
      const hours = Math.max(1, Math.min(12, parseInt(ampmMatch[1], 10)));
      const minutes = ampmMatch[2];
      const ampm = ampmMatch[3].toUpperCase();
      return `${hours}:${minutes} ${ampm}`;
    }

    const hhmmMatch = trimmed.match(/^(\d{1,2}):(\d{2})$/);
    if (hhmmMatch) {
      let hours24 = parseInt(hhmmMatch[1], 10);
      const minutes = hhmmMatch[2];
      const ampm = hours24 >= 12 ? "PM" : "AM";
      hours24 = hours24 % 12;
      const hours12 = hours24 === 0 ? 12 : hours24;
      return `${hours12}:${minutes} ${ampm}`;
    }

    return trimmed;
  };

  const normalizeToAmPm = (input: string): string => to12Hour(input);

    const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedMeeting) return;
    const ampm = normalizeToAmPm(e.target.value);
    setSelectedMeeting(prev => (prev ? { ...prev, meeting_time: ampm } : prev));
  };

  const to24Hour = (time12h: string): string => {
    if (!time12h) return "";
    const match = time12h.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (!match) return time12h;

    let hours = parseInt(match[1], 10);
    const minutes = match[2];
    const ampm = match[3].toUpperCase();

    if (ampm === "PM" && hours < 12) hours += 12;
    if (ampm === "AM" && hours === 12) hours = 0;

    return `${hours.toString().padStart(2, "0")}:${minutes}`;
  };

  const columns = useMemo(
    () => [
      { field: MeetingModelLabels.MEETING_ID, headerName: MEETINGS_STRINGS.TABLE.HEADER_MEETING_ID, width: 120 },
      {
        field: MeetingModelLabels.REQUESTER_NAME,
        headerName: MEETINGS_STRINGS.TABLE.HEADER_REQUESTOR_NAME,
        width: 180,
        renderCell: (params: any) => {
          return (
            <span
              style={{ color: "blue", cursor: "pointer" }}
              onClick={() => handleOpenUserDetails(params.row.request_id)}
            >
              {params.row.requester_name || "No Name"}
            </span>
          );
        },
      },
      { 
        field: MeetingModelLabels.INVESTOR_NAME,
        headerName: MEETINGS_STRINGS.TABLE.HEADER_INVESTOR_NAME,
        width: 180,
        renderCell: (params: any) => (
          <span
            style={{ color: "blue", cursor: "pointer" }}
            onClick={() => handleOpenInvestorDetails(params.row.investor_id)}
          >
            {params.row.investor_name}
          </span>
        ),
      },
      { field: MeetingModelLabels.DURATION, headerName: MEETINGS_STRINGS.TABLE.HEADER_MEETING_DURATION, width: 120 },
      { field: MeetingModelLabels.MEETING_TYPE, headerName: MEETINGS_STRINGS.TABLE.HEADER_MEETING_TYPE, width: 120 },
      { field: MeetingModelLabels.MEETING_TIME, headerName: MEETINGS_STRINGS.TABLE.HEADER_MEETING_TIME, width: 120, renderCell: (params: any) => to12Hour(params.value), },
      { field: MeetingModelLabels.MEETING_DATE, headerName: MEETINGS_STRINGS.TABLE.HEADER_MEETING_DATE, width: 140 },
      { field: MeetingModelLabels.SCHEDULE_STATUS, headerName: MEETINGS_STRINGS.TABLE.HEADER_MEETING_STATUS, width: 140 },
      {
        field: "actions",
        headerName: MEETINGS_STRINGS.TABLE.HEADER_ACTIONS,
        width: 160,
        sortable: false,
        filterable: false,
        renderCell: (params: any) => (
          <div className="d-flex align-items-center gap-3 w-100 h-100">
            <FiMonitor
              size={18}
              style={{ cursor: "pointer" }}
              title="View Investor Meetings"
              onClick={() => handleOpenInvestorMeetings(params.row.investor_id)}
            />
            <FiEdit
              className="icon-hover"
              size={18}
              style={{ cursor: "pointer" }}
              onClick={() => onEdit(params.row)}
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
              {MEETINGS_STRINGS.TITLE}
            </div>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-8">
          <Box sx={{ height: 800, width: "100%" }}>
            <DataGrid
              rows={items}
              columns={columns}
              getRowId={(row) => row.meeting_id}
              loading={loading}
              pageSizeOptions={[5, 10, 20, 50]}
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              paginationMode="server"
              rowCount={rowCount}
            />
          </Box>
        </div>

        <div className="col-lg-4">
          <div className="card shadow-sm" style={{ backgroundColor: COLORS.white }} >

            <div className="card-header" style={{ backgroundColor: COLORS.lightGray }}>
              <h5 className="mb-0">Edit Meeting</h5>
            </div>
            <div className="card-body"> 
              <form onSubmit={handleSubmit}>
              {/* Requestor Name */}
              <div className="mb-3">
                <label className="form-label fw-semibold">
                  {MEETINGS_STRINGS.TABLE.HEADER_REQUESTOR_NAME}
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={selectedMeeting?.requester_name || ""}
                  placeholder="(Auto-filled)"
                  disabled
                />
              </div>

              {/* Investor Name */}
              <div className="mb-3">
                <label className="form-label fw-semibold">
                  {MEETINGS_STRINGS.TABLE.HEADER_INVESTOR_NAME}
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={selectedMeeting?.investor_name || ""}
                  placeholder="(Auto-filled)"
                  disabled
                />
              </div>

              {/* Duration */}
              <div className="mb-3">
                <label className="form-label fw-semibold">
                  {MEETINGS_STRINGS.TABLE.HEADER_MEETING_DURATION}
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={selectedMeeting?.duration || ""}
                  placeholder="(Auto-filled)"
                  disabled
                />
              </div>

              {/* Type */}
              <div className="mb-3">
                <label className="form-label fw-semibold">
                  {MEETINGS_STRINGS.TABLE.HEADER_MEETING_TYPE}
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={selectedMeeting?.meeting_type || ""}
                  placeholder="(Auto-filled)"
                  disabled
                />
              </div>

              <hr className="my-4" />

              {/* Time */}
              <div className="mb-3">
                <label className="form-label fw-semibold">
                  {MEETINGS_STRINGS.TABLE.HEADER_MEETING_TIME}
                </label>
                <input
                  type="time"
                  className="form-control"
                  name="meeting_time"
                  placeholder="e.g., 9:00 AM"
                  value={to24Hour(selectedMeeting?.meeting_time || "")}
                  onChange={handleTimeChange}
                />
              </div>

              {/* Date */}
              <div className="mb-3">
                <label className="form-label fw-semibold">
                  {MEETINGS_STRINGS.TABLE.HEADER_MEETING_DATE}
                </label>
                <input
                  type="date"
                  className="form-control"
                  name="meeting_date"
                  value={selectedMeeting?.meeting_date || ""}
                  onChange={handleChange}
                />
              </div>

              {/* Meeting Status */}
              <div className="mb-3">
                <label className="form-label fw-semibold">
                  {MEETINGS_STRINGS.TABLE.HEADER_MEETING_STATUS}
                </label>
                <select
                  className="form-select"
                  name="schedule_status"
                  value={selectedMeeting?.schedule_status || ""}
                  onChange={handleChange}
                >
                  <option value="">{`Select ${MEETINGS_STRINGS.TABLE.HEADER_MEETING_STATUS}`}</option>
                  <option value="Pending">Pending</option>
                  <option value="Scheduled">Scheduled</option>
                  <option value="Completed">Completed</option>
                  <option value="Missed">Missed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              {/* Buttons */}
              <div className="d-flex justify-content-end gap-2 mt-4">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleReset}
                >
                  Reset
                </button>
                <button 
                  type="submit" 
                  className="btn"  style={{ backgroundColor: COLORS.purple, color: COLORS.white }}
                  disabled={!selectedMeeting}
                >
                  Save
                </button>
              </div>
            </form>
            </div>
          
          </div>
        </div>
      </div>

      <ImageDetailsDialog
        open={openInvestorDetails}
        onClose={() => setOpenInvestorDetails(false)}
        title="Investor Details"
        imageUrl={selectedInvestor?.investor_profile?.image}
        fields={
          selectedInvestor
            ? [
                { label: "Full Name", value: selectedInvestor.user_details?.full_name },
                { label: "Profile", value: selectedInvestor.investor_profile?.profile },
                { label: "Investment Stage", value: selectedInvestor.investor_profile?.investment_stage },
                { label: "Availability", value: selectedInvestor.investor_profile?.availability },
                { label: "Meeting City", value: selectedInvestor.investor_profile?.meeting_city },
                { label: "Countries to Invest", value: selectedInvestor.investor_profile?.countries_to_invest },
                { label: "Investment Industry", value: selectedInvestor.investor_profile?.investment_industry },
                { label: "Language", value: selectedInvestor.investor_profile?.language },
                { label: "Average Rating", value: selectedInvestor.investor_profile?.avg_rating },
                { label: "Country", value: selectedInvestor.investor_profile?.country },
                { label: "State", value: selectedInvestor.investor_profile?.state },
                { label: "City", value: selectedInvestor.investor_profile?.city },
                { label: "Investment Range", value: selectedInvestor.investor_profile?.investment_range },
                { label: "Status", value: selectedInvestor.investor_profile?.status === 1 ? "Active" : "Inactive" },
                { label: "Approval Status", value: selectedInvestor.investor_profile?.approval_status === 1 ? "Approved" : "Pending" },
                { label: "Email", value: selectedInvestor.user_details?.email },
                { label: "Mobile", value: selectedInvestor.user_details?.mobile },
                { label: "Address", value: selectedInvestor.user_details?.address },
                { label: "LinkedIn URL", value: selectedInvestor.user_details?.linkedin_url },
                { label: "Summary", value: selectedInvestor.user_details?.summary },
                { label: "Total Meetings", value: selectedInvestor.meeting_statistics?.total_meetings },
                { label: "Pending Meetings", value: selectedInvestor.meeting_statistics?.pending_meetings },
                { label: "Scheduled Meetings", value: selectedInvestor.meeting_statistics?.scheduled_meetings },
                { label: "Completed Meetings", value: selectedInvestor.meeting_statistics?.completed_meetings },
                { label: "Missed Meetings", value: selectedInvestor.meeting_statistics?.missed_meetings },
              ]
            : []
        }
      />

      <ImageDetailsDialog
        open={openUserDetails}
        onClose={() => setOpenUserDetails(false)}
        title="Requester Details"
        imageUrl={selectedUser?.profile_photo || ""}
        fields={
          selectedUser
            ? [
                { label: "Full Name", value: selectedUser.full_name },
                { label: "Mobile", value: selectedUser.mobile },
                { label: "Email", value: selectedUser.email },
                { label: "Country", value: selectedUser.country_name },
                { label: "State", value: selectedUser.state_name },
                { label: "City", value: selectedUser.city_name },
              ]
            : []
        }
      />

      <InvestorMeetingsDialog
        open={openInvestorMeetings}
        onClose={() => setOpenInvestorMeetings(false)}
        meetings={selectedInvestorMeetings}
      />
    </div>
  );
};

export default MeetingsSchedulesPage;
