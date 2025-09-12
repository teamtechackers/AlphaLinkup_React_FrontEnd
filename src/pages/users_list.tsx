import React, { useEffect, useState, useMemo } from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import { FiTrash2, FiEdit } from "react-icons/fi";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import usersService from "../services/users_service";
import { USERS_STRINGS } from "../utils/strings/pages/users_strings";
import { CONSTANTS } from "../utils/strings/constants";
import { UserModel, UserModelLabels } from "../models/user_model";
import { COLORS } from "../utils/theme/colors";
import { STYLES } from "../utils/typography/styles";
import GlobalService from "../services/global_service";

const UsersList: React.FC = () => {
  const [items, setItems] = useState<UserModel[]>([]);
  const [loading, setLoading] = useState(false);

  const [editing, setEditing] = useState<UserModel | null>(null);
  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [address, setAddress] = useState("");
  const [countryId, setCountryId] = useState<string>("");
  const [stateId, setStateId] = useState<string>("");
  const [cityId, setCityId] = useState<string>("");
  const [status, setStatus] = useState("1");

  const [countries, setCountries] = useState<any[]>([]);
  const [states, setStates] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [rowCount, setRowCount] = useState(0);

  const load = async (page = paginationModel.page, pageSize = paginationModel.pageSize) => {
    setLoading(true);
    try {
      const start = page * pageSize;
      const data = await usersService.getUsersList(page + 1, start, pageSize);

      const list = Array.isArray(data?.users_list)
        ? data.users_list.map((row: any) => ({
            user_id: Number(row.user_id),
            user_name: row.user_name ?? "",
            phone_number: row.phone_number ?? "",
            email_address: row.email_address ?? "",
            profile_photo: row.profile_photo ?? "",
            address: row.address ?? "",
            country_id: row.country_id ? Number(row.country_id) : null,
            country_name: row.country_name ?? "",
            state_id: row.state_id ? Number(row.state_id) : null,
            state_name: row.state_name ?? "",
            city_id: row.city_id ? Number(row.city_id) : null,
            city_name: row.city_name ?? "",
            status: row.status === "Active" ? "Active" : "Inactive",
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
    setMobile("");
    setEmail("");
    setProfilePhoto(null);
    setAddress("");
    setCountryId("");
    setStateId("");
    setCityId("");
    setStatus("1");
  };

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

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const dup = await usersService.checkDuplicateUser(mobile, email, editing?.user_id);
      const isValid = dup && (dup.validate === true || dup.validate === "true" || dup.status === true);
      if (!isValid) {
        toast.error(CONSTANTS.MESSAGES.DUPLICATE_FOUND);
        return;
      }

      const payload: UserModel = {
      user_id: editing?.user_id ?? 0,
      user_name: fullName,
      phone_number: mobile,
      email_address: email,
      profile_photo: profilePhoto ? profilePhoto.name : "",
      address,
      country_id: countryId ? Number(countryId) : undefined,
      state_id: stateId ? Number(stateId) : undefined,
      city_id: cityId ? Number(cityId) : undefined,
      status: status === "1" ? "Active" : "Inactive",
    };

      const res = await usersService.saveUser(payload);

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
        toast.error(res.message || res.info || CONSTANTS.MESSAGES.SOMETHING_WENT_WRONG);
      }
    } catch (err) {
      console.error(err);
      toast.error(CONSTANTS.MESSAGES.SOMETHING_WENT_WRONG);
    }
  };

  const onEdit = (item: UserModel) => {
    setEditing(item);
    setFullName(item.user_name ?? "");
    setMobile(item.phone_number ?? "");
    setEmail(item.email_address ?? "");
    setProfilePhoto(null);
    setAddress(item.address ?? "");
    setCountryId(item.country_id ? String(item.country_id) : "");
    setStateId(item.state_id ? String(item.state_id) : "");
    setCityId(item.city_id ? String(item.city_id) : "");
    setStatus(item.status === "Active" ? "1" : "0");
  };

  const onDelete = async (item: UserModel) => {
    if (!item.user_id) return;
    if (!window.confirm(CONSTANTS.MESSAGES.DELETE_CONFIRM)) return;

    try {
      const res = await usersService.deleteUser(item.user_id);

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
    } catch (err) {
      toast.error(CONSTANTS.MESSAGES.SOMETHING_WENT_WRONG);
    }
  };

  const columns = useMemo(
    () => [
      { field: UserModelLabels.USER_ID, headerName: USERS_STRINGS.TABLE.HEADER_ID, width: 100 },
      { field: UserModelLabels.USER_NAME, headerName: USERS_STRINGS.TABLE.HEADER_FULL_NAME, width: 150 },
      { field: UserModelLabels.PHONE_NUMBER, headerName: USERS_STRINGS.TABLE.HEADER_MOBILE, width: 170 },
      { field: UserModelLabels.EMAIL_ADDRESS, headerName: USERS_STRINGS.TABLE.HEADER_EMAIL, width: 220 },
      {
        field: UserModelLabels.STATUS,
        headerName: USERS_STRINGS.TABLE.HEADER_STATUS,
        width: 140,
        renderCell: (params: any) => {
          const isActive = params.value?.toLowerCase() === "active";
          return (
            <span
              className="text-center p-1 rounded"
              style={{
                backgroundColor: isActive ? `${COLORS.green}30` : `${COLORS.red}30`,
                color: isActive ? COLORS.green : COLORS.red,
              }}
            >
              {isActive
                ? USERS_STRINGS.TABLE.STATUS_ACTIVE
                : USERS_STRINGS.TABLE.STATUS_INACTIVE}
            </span>
          );
        },
      },
      {
        field: UserModelLabels.ACTIONS,
        headerName: USERS_STRINGS.TABLE.HEADER_ACTIONS,
        width: 120,
        sortable: false,
        filterable: false,
        renderCell: (params: any) => (
          <div className="d-flex align-items-center gap-3 w-100 h-100">
            <FiEdit
              className="icon-hover"
              size={18}
              style={{ cursor: "pointer" }}
              onClick={() => onEdit(params.row)}
            />
            <FiTrash2
              className="icon-hover"
              size={18}
              style={{ cursor: "pointer" }}
              onClick={() => onDelete(params.row)}
            />
          </div>
        ),
      },
    ],
    [items]
  );

  return (
    <div className="container-fluid page-padding-2 vh-100" style={{ backgroundColor: COLORS.lightGray }}>
      <h4 className="my-4">{USERS_STRINGS.TITLE}</h4>
      <div className="row g-4 w-100">
        {/* Table */}
        <div className="col-lg-8 p-0">
          <Box sx={{ height: 800, width: "100%" }}>
            <DataGrid
              rows={items}
              columns={columns}
              loading={loading}
              getRowId={(row) => row.user_id}
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
              <h5 className="mb-0">{editing ? USERS_STRINGS.FORM.EDIT_USER : USERS_STRINGS.FORM.ADD_USER}</h5>
            </div>
            <div className="card-body">
              <form onSubmit={onSubmit}>
                <div className="row g-3 align-items-end">
                  {/* Full Name */}
                  <div className="col-md-12">
                    <label className="form-label" style={STYLES.field_label}>
                      {USERS_STRINGS.TABLE.HEADER_FULL_NAME} *
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </div>

                  {/* Mobile */}
                  <div className="col-md-12">
                    <label className="form-label" style={STYLES.field_label}>
                      {USERS_STRINGS.TABLE.HEADER_MOBILE} *
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      required
                    />
                  </div>

                  {/* Email */}
                  <div className="col-md-12">
                    <label className="form-label" style={STYLES.field_label}>
                      {USERS_STRINGS.TABLE.HEADER_EMAIL} *
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  {/* Profile Photo */}
                  <div className="col-md-12">
                    <label className="form-label" style={STYLES.field_label}>
                      Profile Photo
                    </label>
                    <input
                      type="file"
                      className="form-control"
                      accept="image/*"
                      onChange={(e) => setProfilePhoto(e.target.files?.[0] || null)}
                    />
                  </div>

                  {/* Address */}
                  <div className="col-md-12">
                    <label className="form-label" style={STYLES.field_label}>
                      Address *
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </div>

                  {/* Country */}
                  <div className="col-md-12">
                    <label className="form-label" style={STYLES.field_label}>
                      Country *
                    </label>
                    <select
                      className="form-select"
                      value={countryId}
                      onChange={(e) => setCountryId(e.target.value)}
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
                      State *
                    </label>
                    <select
                      className="form-select"
                      value={stateId}
                      onChange={(e) => setStateId(e.target.value)}
                      disabled={!countryId}
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
                      City *
                    </label>
                    <select
                      className="form-select"
                      value={cityId}
                      onChange={(e) => setCityId(e.target.value)}
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

                  {/* Status */}
                  <div className="col-md-12">
                    <label className="form-label" style={STYLES.field_label}>
                      {USERS_STRINGS.TABLE.HEADER_STATUS} *
                    </label>
                    <select className="form-select" value={status} onChange={(e) => setStatus(e.target.value)}>
                      <option value="1">{USERS_STRINGS.TABLE.STATUS_ACTIVE}</option>
                      <option value="0">{USERS_STRINGS.TABLE.STATUS_INACTIVE}</option>
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
                      onClick={resetForm}
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

export default UsersList;
