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
import { VARIABLES } from "../utils/strings/variables";
import PermissionsModal from "../components/PermissionsModal";

const USER_ROLES = [
  { label: "User", value: "user" },
  { label: "Super Admin", value: "superadmin" },
  { label: "Sub Admin", value: "subadmin" },
];

const UsersList: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'users' | 'admins'>('users');
  const [userItems, setUserItems] = useState<UserModel[]>([]);
  const [adminItems, setAdminItems] = useState<UserModel[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Ref to track if we're currently in an edit operation
  const isEditingRef = React.useRef(false);

  const [editing, setEditing] = useState<UserModel | null>(null);

  const [userRole, setUserRole] = useState(USER_ROLES[0].value);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [permissions, setPermissions] = useState<string[]>([]);
  const [isPermissionsModalOpen, setIsPermissionsModalOpen] = useState(false);

  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [countryId, setCountryId] = useState<number | "">("");
  const [stateId, setStateId] = useState<number | "">("");
  const [cityId, setCityId] = useState<number | "">("");
  const [status, setStatus] = useState("1");

  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string>("");
  
  // Add effect to monitor userRole changes
  useEffect(() => {
    console.log("userRole state changed to:", userRole);
  }, [userRole]);

  const [countries, setCountries] = useState<any[]>([]);
  const [states, setStates] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);

  const [userPagination, setUserPagination] = useState({
    page: 0,
    pageSize: 10,
  });
  const [adminPagination, setAdminPagination] = useState({
    page: 0,
    pageSize: 10,
  });
  
  const [userRowCount, setUserRowCount] = useState(0);
  const [adminRowCount, setAdminRowCount] = useState(0);

  const isSubmittingAdmin = userRole === 'superadmin' || userRole === 'subadmin';
  const isSubAdmin = userRole === 'subadmin';

  const loadUsers = async (page = userPagination.page, pageSize = userPagination.pageSize) => {
    setLoading(true);
    try {
      const start = page * pageSize;
      const data = await usersService.getUsersList(page + 1, start, pageSize, true, undefined);

      console.log("Raw API response (users):", data);

      const list = Array.isArray(data?.users_list)
        ? data.users_list.map((row: any) => {
            console.log("Processing user row:", row);
            // Log all properties to see what's available
            console.log("User row properties:", Object.keys(row));
            
            return {
              user_id: Number(row.user_id),
              user_name: row.user_name ?? "",
              phone_number: row.phone_number ?? "",
              email_address: row.email_address ?? "",
              profile_photo: row.profile_photo ?? "",
              role: row.role ?? "",
              address: row.address ?? "",
              country_id: row.country_id ? Number(row.country_id) : null,
              country_name: row.country_name ?? "",
              state_id: row.state_id ? Number(row.state_id) : null,
              state_name: row.state_name ?? "",
              city_id: row.city_id ? Number(row.city_id) : null,
              city_name: row.city_name ?? "",
              status: row.status === "Active" ? "Active" : "Inactive",
              user_role: row.user_role ?? row.role ?? "user",
              username: row.username ?? "",
              permissions: typeof row.permissions === 'string' ? row.permissions.split(',') : [],
              // New fields
              row_id: row.row_id,
              user_type: row.user_type,
              password: row.password,
              is_super_admin: row.is_super_admin,
              permissions_details: Array.isArray(row.permissions) ? row.permissions : null,
              permission_count: row.permission_count,
              all_permissions: row.all_permissions,
            }
          })
        : [];

      console.log("Mapped user list:", list);

      setUserItems(list);
      setUserRowCount(data?.recordsTotal ?? 0);
    } catch (err) {
      console.error(err);
      toast.error(CONSTANTS.MESSAGES.SOMETHING_WENT_WRONG);
    } finally {
      setLoading(false);
    }
  };

  const loadAdmins = async (page = adminPagination.page, pageSize = adminPagination.pageSize) => {
    setLoading(true);
    try {
      const start = page * pageSize;
      const data = await usersService.getUsersList(page + 1, start, pageSize, undefined, true);

      console.log("Raw API response (admins):", data);

      const list = Array.isArray(data?.users_list)
        ? data.users_list.map((row: any) => {
            console.log("Processing admin row:", row);
            // Log all properties to see what's available
            console.log("Admin row properties:", Object.keys(row));
            
            return {
              user_id: Number(row.user_id),
              user_name: row.user_name ?? "",
              phone_number: row.phone_number ?? "",
              email_address: row.email_address ?? "",
              profile_photo: row.profile_photo ?? "",
              role: row.role ?? "",
              address: row.address ?? "",
              country_id: row.country_id ? Number(row.country_id) : null,
              country_name: row.country_name ?? "",
              state_id: row.state_id ? Number(row.state_id) : null,
              state_name: row.state_name ?? "",
              city_id: row.city_id ? Number(row.city_id) : null,
              city_name: row.city_name ?? "",
              status: row.status === "Active" ? "Active" : "Inactive",
              user_role: row.user_role ?? row.role ?? "user",
              username: row.username ?? "",
              permissions: Array.isArray(row.permissions) 
                ? row.permissions.map((p: any) => p.permission_id?.toString()) 
                : typeof row.permissions === 'string' ? row.permissions.split(',') : [],
              // New fields
              row_id: row.row_id,
              user_type: row.user_type,
              password: row.password,
              is_super_admin: row.is_super_admin,
              permissions_details: Array.isArray(row.permissions) ? row.permissions : null,
              permission_count: row.permission_count,
              all_permissions: row.all_permissions,
            }
          })
        : [];

      console.log("Mapped admin list:", list);

      setAdminItems(list);
      setAdminRowCount(data?.recordsTotal ?? 0);
    } catch (err) {
      console.error(err);
      toast.error(CONSTANTS.MESSAGES.SOMETHING_WENT_WRONG);
    } finally {
      setLoading(false);
    }
  };

  // Initial load when component mounts
  useEffect(() => {
    if (activeTab === 'users') {
      loadUsers(userPagination.page, userPagination.pageSize);
    } else {
      loadAdmins(adminPagination.page, adminPagination.pageSize);
    }
  }, []);

  // Effect to reload data when pagination changes for the active tab
  useEffect(() => {
    if (activeTab === 'users') {
      loadUsers(userPagination.page, userPagination.pageSize);
    }
  }, [activeTab, userPagination.page, userPagination.pageSize]);

  useEffect(() => {
    if (activeTab === 'admins') {
      loadAdmins(adminPagination.page, adminPagination.pageSize);
    }
  }, [activeTab, adminPagination.page, adminPagination.pageSize]);

  const resetForm = () => {
    console.log("Resetting form");
    setEditing(null);
    setFullName("");
    setMobile("");
    setEmail("");
    setAddress("");
    setCountryId("");
    setStateId("");
    setCityId("");
    setStatus("1");
    setPreviewImage("");
    setUploadedImage(null);
    setUserRole(USER_ROLES[0].value);
    setUsername("");
    setPassword("");
    setPermissions([]);
    // Reset the editing flag when form is reset
    isEditingRef.current = false;
  };

  const handleSavePermissions = (selectedIds: string[]) => {
    setPermissions(selectedIds);
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
      // Only reset IDs if not currently editing
      if (!isEditingRef.current) {
        setStateId("");
        setCityId("");
      }
      return;
    }
    const fetchStates = async () => {
      try {
        const list = await GlobalService.getStates(countryId.toString());
        setStates(list);
        setCities([]);
        // Only reset cityId when clearing states, don't reset stateId when loading states
        if (!isEditingRef.current) {
          setCityId("");
        }
      } catch (err) {
        console.error("Error loading states", err);
      }
    };
    fetchStates();
  }, [countryId]);

  useEffect(() => {
    if (!stateId) {
      setCities([]);
      // Only reset city ID if not currently editing
      if (!isEditingRef.current) {
        setCityId("");
      }
      return;
    }
    const fetchCities = async () => {
      try {
        const list = await GlobalService.getCities(stateId.toString());
        setCities(list);
        // Don't reset cityId when loading cities for user selection, only reset when clearing
      } catch (err) {
        console.error("Error loading cities", err);
      }
    };
    fetchCities();
  }, [stateId]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submit - userRole:", userRole);
    console.log("Form submit - mobile:", mobile);
    console.log("Form submit - fullName:", fullName);

    const isCurrentSubmittingAdmin = userRole === 'superadmin' || userRole === 'subadmin';
    const isCurrentSubAdmin = userRole === 'subadmin';
    
    if (isCurrentSubmittingAdmin) {
      if (!cityId) {
          toast.error("City is required.");
          return;
      }
      if (!username || (!editing && !password) || (isCurrentSubAdmin && permissions.length === 0)) {
        toast.error("Admin user requires Username, Password (for new users), and SubAdmin requires Permissions.");
        return;
      }
    }

    try {
      const dup = await usersService.checkDuplicateUser(mobile, email, editing?.user_id);
      const isValid = dup && (dup.validate === true || dup.validate === "true" || dup.status === true);
      if (!isValid) {
        toast.error(CONSTANTS.MESSAGES.DUPLICATE_FOUND);
        return;
      }

      const formData = new FormData();

      formData.append("user_id", VARIABLES.USER_ID);
      formData.append("token", VARIABLES.TOKEN);

      if (editing) {
        formData.append("row_id", String(editing.user_id));
      }

      formData.append("user_role", userRole); 

      formData.append("full_name", fullName);
      formData.append("mobile", mobile);
      formData.append("email", email);
      formData.append("address", address);
      formData.append("country_id", countryId.toString());
      formData.append("state_id", stateId.toString());
      formData.append("city_id", cityId.toString());
      formData.append("status", status);

      if (isCurrentSubmittingAdmin) {
        formData.append("username", username);
        if (password) {
          formData.append("password", password);
        }

        if (isCurrentSubAdmin && permissions.length > 0) {
          permissions.forEach((id) => {
            formData.append("permissions[]", id);
          });
        }
      }

      if (uploadedImage) {
        formData.append("profile_photo", uploadedImage);
      }
      
      // Removed: console.log block for FormData payload

      const res = await usersService.saveUser(formData);

      const success =
        res &&
        (res.status === true ||
          (typeof res.status === "string" && res.status.toLowerCase().includes("success")) ||
          res.success === true ||
          res.rcode === 200);

      if (success) {
        toast.success(editing ? CONSTANTS.MESSAGES.UPDATE_SUCCESS : CONSTANTS.MESSAGES.SAVE_SUCCESS);
        resetForm();
        if (activeTab === 'users') {
          await loadUsers();
        } else {
          await loadAdmins();
        }
      } else {
        toast.error(res.message || res.info || CONSTANTS.MESSAGES.SOMETHING_WENT_WRONG);
      }
    } catch (err) {
      console.error(err);
      toast.error(CONSTANTS.MESSAGES.SOMETHING_WENT_WRONG);
    }
  };

  const onEdit = async (item: UserModel) => {
    console.log("=== Starting onEdit ===");
    console.log("Editing item:", item);
    console.log("Item keys:", Object.keys(item));
    console.log("Item user_role:", item.user_role);
    console.log("Item role:", item.role);
    console.log("Item user_type:", item.user_type);
    
    // Set the editing flag
    isEditingRef.current = true;
    
    // Check if the user role exists in our USER_ROLES array
    const availableRoles = USER_ROLES.map(r => r.value);
    console.log("Available roles:", availableRoles);
    
    setEditing(item);
    setFullName(item.user_name ?? "");
    setMobile(item.phone_number ?? "");
    setEmail(item.email_address ?? "");
    setAddress(item.address ?? "");
    setStatus(item.status === "Active" ? "1" : "0");
    setPreviewImage(item.profile_photo ?? "");
    setUploadedImage(null);

    // Determine appropriate role based on user type and active tab
    let itemRole = item.user_role || item.role || USER_ROLES[0].value;
    
    // If we're on the users tab, force role to 'user'
    if (activeTab === 'users') {
      itemRole = 'user';
    } else {
      // If we're on the admins tab, ensure it's an admin role
      if (item.user_type === 'superadmin') {
        itemRole = 'superadmin';
      } else if (item.user_type === 'subadmin') {
        itemRole = 'subadmin';
      }
    }
    
    console.log("Raw itemRole:", itemRole);
    
    // Ensure the role is one of our predefined roles, otherwise default to first role
    const validRole = availableRoles.includes(itemRole) ? itemRole : USER_ROLES[0].value;
    console.log("Setting user role:", validRole);
    setUserRole(validRole);
    console.log("userRole state after setUserRole:", validRole);
    
    // Set username and permissions based on the user type
    if (activeTab === 'admins' || item.user_type !== 'user') {
      setUsername(item.username ?? "");
      // Set permissions based on the new structure
      if (Array.isArray(item.permissions_details)) {
        setPermissions(item.permissions_details.map(p => p.permission_id.toString()));
      } else {
        setPermissions(item.permissions ?? []);
      }
    } else {
      // For regular users, clear admin-specific fields
      setUsername("");
      setPermissions([]);
    }
    
    setPassword("");

    if (item.country_id) {
      setCountryId(item.country_id);
      
      // Wait for the UI to update the country dropdown
      await new Promise(resolve => setTimeout(resolve, 0));
      
      const stateList = await GlobalService.getStates(item.country_id.toString());
      setStates(stateList);

      if (item.state_id) {
        setStateId(item.state_id);
        
        // Wait for the UI to update the state dropdown
        await new Promise(resolve => setTimeout(resolve, 0));
        
        const cityList = await GlobalService.getCities(item.state_id.toString());
        setCities(cityList);

        if (item.city_id) {
          setCityId(item.city_id);
        }
      }
    } else {
      // Reset dependent fields if no country_id
      setStates([]);
      setCities([]);
      setCountryId("");
      setStateId("");
      setCityId("");
    }
    
    // Add a small delay to see if that helps with the UI update
    setTimeout(() => {
      console.log("After timeout - userRole:", validRole);
      // Reset the editing flag after UI update
      isEditingRef.current = false;
    }, 0);
    
    console.log("=== Finished onEdit ===");
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
        if (activeTab === 'users') {
          await loadUsers();
        } else {
          await loadAdmins();
        }
      } else {
        toast.error(res.info || res.message || CONSTANTS.MESSAGES.SOMETHING_WENT_WRONG);
      }
    } catch (err) {
      toast.error(CONSTANTS.MESSAGES.SOMETHING_WENT_WRONG);
    }
  };

  const userColumns = useMemo(
    () => [
      { field: UserModelLabels.USER_ID, headerName: USERS_STRINGS.TABLE.HEADER_ID, width: 100 },
      { field: UserModelLabels.USER_NAME, headerName: USERS_STRINGS.TABLE.HEADER_FULL_NAME, width: 150 },
      // Exclude role column for users tab
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
                ? USERS_STRINGS.FORM.FIELD_LABELS.STATUS_ACTIVE
                : USERS_STRINGS.FORM.FIELD_LABELS.STATUS_INACTIVE}
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
              size={14}
              style={{ cursor: "pointer" }}
              onClick={() => onEdit(params.row)}
            />
            <FiTrash2
              className="icon-hover"
              size={14}
              style={{ cursor: "pointer" }}
              onClick={() => onDelete(params.row)}
            />
          </div>
        ),
      },
    ],
    [userItems]
  );

  const adminColumns = useMemo(
    () => [
      { field: UserModelLabels.USER_ID, headerName: USERS_STRINGS.TABLE.HEADER_ID, width: 100 },
      { field: UserModelLabels.USER_NAME, headerName: USERS_STRINGS.TABLE.HEADER_FULL_NAME, width: 150 },
      { field: UserModelLabels.ROLE, headerName: USERS_STRINGS.TABLE.ROLE, width: 120 },
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
                ? USERS_STRINGS.FORM.FIELD_LABELS.STATUS_ACTIVE
                : USERS_STRINGS.FORM.FIELD_LABELS.STATUS_INACTIVE}
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
              size={14}
              style={{ cursor: "pointer" }}
              onClick={() => onEdit(params.row)}
            />
            <FiTrash2
              className="icon-hover"
              size={14}
              style={{ cursor: "pointer" }}
              onClick={() => onDelete(params.row)}
            />
          </div>
        ),
      },
    ],
    [adminItems]
  );

  // Get the current items and columns based on active tab
  const currentItems = activeTab === 'users' ? userItems : adminItems;
  const currentColumns = activeTab === 'users' ? userColumns : adminColumns;
  const currentPagination = activeTab === 'users' ? userPagination : adminPagination;

  // Handle pagination changes based on active tab
  const handlePaginationChange = (newPaginationModel: any) => {
    if (activeTab === 'users') {
      setUserPagination(newPaginationModel);
    } else {
      setAdminPagination(newPaginationModel);
    }
  };

  return (
    <div className="content">
      <div className="container-fluid" style={{ backgroundColor: COLORS.lightGray }}>

        <div className="row">
          <div className="col-12">
            <div style={STYLES.page_title}>
              {USERS_STRINGS.TITLE}
            </div>
            
            {/* Tabs for Users and Admins */}
            <ul className="nav nav-tabs mt-3">
              <li className="nav-item">
                <button 
                  className={`nav-link ${activeTab === 'users' ? 'active' : ''}`}
                  onClick={() => setActiveTab('users')}
                >
                  Users
                </button>
              </li>
              <li className="nav-item">
                <button 
                  className={`nav-link ${activeTab === 'admins' ? 'active' : ''}`}
                  onClick={() => setActiveTab('admins')}
                >
                  Admins
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="row">

          <div className="col-lg-8">
            <Box sx={{ height: 800, width: "100%" }}>
              <DataGrid
                rows={currentItems}
                columns={currentColumns}
                loading={loading}
                getRowId={(row) => row.user_id}
                disableRowSelectionOnClick
                pageSizeOptions={[5, 10, 20, 50]}
                paginationModel={currentPagination}
                onPaginationModelChange={handlePaginationChange}
                paginationMode="server"
                rowCount={activeTab === 'users' ? userRowCount : adminRowCount}
              />
            </Box>
          </div>

          <div className="col-lg-4">
            <div className="card shadow-sm">
              <div className="card-header" style={{ backgroundColor: COLORS.lightGray }}>
                <h5 className="mb-0">{editing ? (activeTab === 'users' ? 'Edit User' : 'Edit Admin') : (activeTab === 'users' ? 'Add User' : 'Add Admin')}</h5>
              </div>
              <div className="card-body">
                <form onSubmit={onSubmit}>
                  <div className="row g-3 align-items-end">

                    <div className="col-md-12">
                      <label className="form-label" style={STYLES.field_label}>
                        User Role <span style={{ color: COLORS.red}}> *</span>
                      </label>
                      <select
                        className="form-select"
                        value={userRole}
                        onChange={(e) => {
                          console.log("User role changed to:", e.target.value);
                          console.log("Previous userRole state:", userRole);
                          setUserRole(e.target.value);
                          console.log("New userRole state set to:", e.target.value);
                        }}
                        required
                        disabled={activeTab === 'users'}
                      >
                        {USER_ROLES
                          .filter(role => 
                            activeTab === 'users' 
                              ? role.value === 'user' 
                              : ['superadmin', 'subadmin'].includes(role.value)
                          )
                          .map(role => (
                            <option key={role.value} value={role.value}>{role.label}</option>
                          ))
                        }
                      </select>
                    </div>

                    {(activeTab === 'admins' || userRole !== 'user') && (
                      <>
                        <div className="col-md-12">
                          <label className="form-label" style={STYLES.field_label}>
                            Username <span style={{ color: COLORS.red}}> *</span>
                          </label>
                          <input
                            className="form-control"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            type="text"
                            maxLength={CONSTANTS.MAX_LENGTHS.FIELD_100}
                          />
                        </div>
                        <div className="col-md-12">
                          <label className="form-label" style={STYLES.field_label}>
                            Password {editing ? "(Leave blank to keep current)" : <span style={{ color: COLORS.red}}> *</span>}
                          </label>
                          <input
                            className="form-control"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required={!editing}
                            type="password"
                            maxLength={CONSTANTS.MAX_LENGTHS.FIELD_100}
                          />
                        </div>
                      </>
                    )}

                    {(activeTab === 'admins' && userRole === 'subadmin') && (
                      <div className="col-md-12">
                        <label className="form-label d-block" style={STYLES.field_label}>
                            Permissions 
                            <span style={{ color: COLORS.red}}> *</span>
                            {permissions.length === 0 && <span className="ms-2 text-danger small">Required</span>}
                        </label>
                        <button 
                          type="button" 
                          className="btn btn-sm btn-outline-primary w-100" 
                          onClick={() => setIsPermissionsModalOpen(true)}
                        >
                            {permissions.length > 0 ? `Edit Permissions (${permissions.length} selected)` : 'Select Permissions'}
                        </button>
                      </div>
                    )}
                    
                    <div className="col-md-12">
                      <label className="form-label" style={STYLES.field_label}>
                        {USERS_STRINGS.FORM.FIELD_LABELS.FULL_NAME} 
                        <span style={{ color: COLORS.red}}> *</span>
                      </label>
                      <input
                        className="form-control"
                        value={fullName}
                        onChange={(e) => {
                          console.log("Full name changed to:", e.target.value);
                          setFullName(e.target.value);
                        }}
                        required
                        type="text"
                        maxLength={CONSTANTS.MAX_LENGTHS.FIELD_100}
                      />
                    </div>

                    <div className="col-md-12">
                      <label className="form-label" style={STYLES.field_label}>
                        {USERS_STRINGS.FORM.FIELD_LABELS.MOBILE} 
                        <span style={{ color: COLORS.red}}> *</span>
                      </label>
                      <input
                        className="form-control"
                        value={mobile}
                        onChange={(e) => {
                          console.log("Mobile changed to:", e.target.value);
                          const val = e.target.value;
                          if (/^\d*$/.test(val)) {
                            setMobile(val);
                          }
                        }}
                        required
                        type="text"
                        maxLength={CONSTANTS.MAX_LENGTHS.FIELD_100}
                        onWheel={(e) => e.currentTarget.blur()}
                      />
                    </div>

                    <div className="col-md-12">
                      <label className="form-label" style={STYLES.field_label}>
                        {USERS_STRINGS.FORM.FIELD_LABELS.EMAIL} 
                        <span style={{ color: COLORS.red}}> *</span>
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        maxLength={CONSTANTS.MAX_LENGTHS.FIELD_150}
                      />
                    </div>

                    <div className="col-md-12">
                      <label className="form-label" style={STYLES.field_label}>
                        {USERS_STRINGS.FORM.FIELD_LABELS.PROFILE_PHOTO} 
                      </label>
                      <input
                        type="file"
                        className="form-control"
                        accept="image/*"
                        onChange={(e) => setUploadedImage(e.target.files?.[0] ?? null)}
                        required={!editing && !previewImage}
                      />
                      {previewImage && !uploadedImage && <span className="small text-muted">Current photo exists. Upload new to replace.</span>}
                    </div>

                    <div className="col-md-12">
                      <label className="form-label" style={STYLES.field_label}>
                        {USERS_STRINGS.FORM.FIELD_LABELS.ADDRESS} 
                        <span style={{ color: COLORS.red}}> *</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        required
                        maxLength={CONSTANTS.MAX_LENGTHS.FIELD_150}
                      />
                    </div>

                    <div className="col-md-12">
                      <label className="form-label" style={STYLES.field_label}>
                        {USERS_STRINGS.FORM.FIELD_LABELS.COUNTRY} 
                        <span style={{ color: COLORS.red}}> *</span>
                      </label>
                      <select
                        className="form-select"
                        value={countryId === "" ? "" : countryId}
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

                    <div className="col-md-12">
                      <label className="form-label" style={STYLES.field_label}>
                        {USERS_STRINGS.FORM.FIELD_LABELS.STATE} 
                        <span style={{ color: COLORS.red}}> *</span>
                      </label>
                      <select
                        className="form-select"
                        value={stateId === "" ? "" : stateId}
                        onChange={(e) => setStateId(e.target.value ? Number(e.target.value) : "")}
                        required
                        disabled={countryId === "" || states.length === 0}
                      >
                        <option value="">Select State</option>
                        {states.map((s) => (
                          <option key={s.state_id} value={s.state_id}>
                            {s.state_name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="col-md-12">
                      <label className="form-label" style={STYLES.field_label}>
                        {USERS_STRINGS.FORM.FIELD_LABELS.CITY} 
                        <span style={{ color: COLORS.red}}> *</span>
                      </label>
                      <select
                        className="form-select"
                        value={cityId === "" ? "" : cityId}
                        onChange={(e) => setCityId(e.target.value ? Number(e.target.value) : "")}
                        required 
                        disabled={stateId === "" || cities.length === 0}
                      >
                        <option value="">Select City</option>
                        {cities.map((ct) => (
                          <option key={ct.city_id} value={ct.city_id}>
                            {ct.city_name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="col-md-12">
                      <label className="form-label" style={STYLES.field_label}>
                        {USERS_STRINGS.TABLE.HEADER_STATUS} 
                        <span style={{ color: COLORS.red}}> *</span>
                      </label>
                      <select className="form-select" value={status} onChange={(e) => setStatus(e.target.value)} required>
                        <option value="1">{USERS_STRINGS.FORM.FIELD_LABELS.STATUS_ACTIVE}</option>
                        <option value="0">{USERS_STRINGS.FORM.FIELD_LABELS.STATUS_INACTIVE}</option>
                      </select>
                    </div>
                  </div>

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
      
      <PermissionsModal 
        show={isPermissionsModalOpen}
        onClose={() => setIsPermissionsModalOpen(false)}
        currentPermissions={permissions}
        onSave={handleSavePermissions}
      />
    </div>
  );
};

export default UsersList;