import React, { useEffect, useState, useMemo } from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import { FiTrash2 } from "react-icons/fi";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import accountDeletionRequestsService from "../services/account_deletion_requests_service";
import { ACCOUNT_DELETION_REQUESTS_STRINGS } from "../utils/strings/pages/account_deletion_requests_strings";
import { AccountDeletionRequestModel, AccountDeletionRequestModelLabels } from "../models/account_deletion_request_model";
import { CONSTANTS } from "../utils/strings/constants";
import { COLORS } from "../utils/theme/colors";
import { STYLES } from "../utils/typography/styles";

const AccountDeletionRequestsList: React.FC = () => {
  const [items, setItems] = useState<AccountDeletionRequestModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 0,
    pageSize: 10,
  });
  const [rowCount, setRowCount] = useState(0);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await accountDeletionRequestsService.getAccountDeletionRequestsList();

      console.log("Raw API response:", data);

      const list = Array.isArray(data?.requests)
        ? data.requests.map((row: any) => ({
            user_id: Number(row.user_id) ?? 0,
            full_name: row.full_name ?? "",
            email: row.email ?? "",
            mobile: row.mobile ?? "",
            created_dts: row.created_dts ?? "",
            deleted_request: Number(row.deleted_request) ?? 0,
          }))
        : [];

      console.log("Mapped list:", list);

      setItems(list);
      // Row count will be handled by DataGrid in client mode
      setRowCount(list.length);
    } catch (err) {
      console.error(err);
      toast.error(CONSTANTS.MESSAGES.SOMETHING_WENT_WRONG);
    } finally {
      setLoading(false);
    }
  };

  // Initial load when component mounts
  useEffect(() => {
    loadData();
  }, []);

  // Effect to reload data when pagination changes
  useEffect(() => {
    loadData();
  }, [pagination.page, pagination.pageSize]);

  const onDelete = async (item: AccountDeletionRequestModel) => {
    if (!item.user_id) return;
    if (!window.confirm(ACCOUNT_DELETION_REQUESTS_STRINGS.MESSAGES.DELETE_CONFIRM)) return;

    try {
      // Use the processDeletionRequest method with the numeric user_id
      const res = await accountDeletionRequestsService.processDeletionRequest(item.user_id);

      const success =
        res &&
        (res.status === true ||
          res.status === "Success" ||
          res.success === true ||
          res.rcode === 200);

      if (success) {
        toast.success(
          res.info || res.message || ACCOUNT_DELETION_REQUESTS_STRINGS.MESSAGES.DELETE_SUCCESS
        );
        await loadData();
      } else {
        toast.error(res.info || res.message || CONSTANTS.MESSAGES.SOMETHING_WENT_WRONG);
      }
    } catch (err) {
      toast.error(CONSTANTS.MESSAGES.SOMETHING_WENT_WRONG);
    }
  };

  const columns = useMemo(
    () => [
      { field: AccountDeletionRequestModelLabels.USER_ID, headerName: ACCOUNT_DELETION_REQUESTS_STRINGS.TABLE.HEADER_ID, width: 100 },
      { field: "full_name", headerName: ACCOUNT_DELETION_REQUESTS_STRINGS.TABLE.HEADER_FULL_NAME, flex: 1 },
      { field: "email", headerName: ACCOUNT_DELETION_REQUESTS_STRINGS.TABLE.HEADER_EMAIL, flex: 1 },
      { field: AccountDeletionRequestModelLabels.MOBILE, headerName: ACCOUNT_DELETION_REQUESTS_STRINGS.TABLE.HEADER_MOBILE, flex: 1 },
      {
        field: AccountDeletionRequestModelLabels.ACTIONS,
        headerName: ACCOUNT_DELETION_REQUESTS_STRINGS.TABLE.HEADER_ACTIONS,
        width: 120,
        sortable: false,
        filterable: false,
        renderCell: (params: any) => (
          <div className="d-flex align-items-center w-100 h-100">
            <FiTrash2
              className="icon-hover"
              size={14}
              style={{ cursor: "pointer", color: COLORS.red }}
              onClick={() => onDelete(params.row)}
            />
          </div>
        ),
      },
    ],
    []
  );

  return (
    <div className="content">
      <div className="container-fluid" style={{ backgroundColor: COLORS.lightGray }}>
        <div className="row">
          <div className="col-12">
            <div style={STYLES.page_title}>
              {ACCOUNT_DELETION_REQUESTS_STRINGS.TITLE}
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <Box sx={{ height: 600, width: "100%" }}>
              <DataGrid
                rows={items}
                columns={columns}
                loading={loading}
                localeText={{ noRowsLabel: "No account deletion requests found" }}
                getRowId={(row) => row.user_id}
                disableRowSelectionOnClick
                pageSizeOptions={[5, 10, 20, 50]}
                paginationModel={pagination}
                onPaginationModelChange={setPagination}
                paginationMode="client"
                rowCount={rowCount}
              />
            </Box>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountDeletionRequestsList;