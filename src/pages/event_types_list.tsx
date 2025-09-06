import React, { useEffect, useState, useMemo } from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import { FiTrash2, FiEdit } from "react-icons/fi";
import { toast } from "react-toastify";

import eventTypesService from "../services/event_types_service";
import { EventTypeModel, EventTypeModelLabels } from "../models/event_type_model";
import { EVENT_TYPES_STRINGS } from "../utils/strings/pages/event_types_strings";
import { CONSTANTS } from "../utils/strings/constants";
import { COLORS } from "../utils/theme/colors";
import { STYLES } from "../utils/typography/styles";

const EventTypesList: React.FC = () => {
  const [items, setItems] = useState<EventTypeModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<EventTypeModel | null>(null);
  const [name, setName] = useState("");
  const [status, setStatus] = useState("1");

  const load = async () => {
    setLoading(true);
    try {
      const data = await eventTypesService.getEventTypesList();
      const list = Array.isArray(data?.event_type_list) ? data.event_type_list : [];
      setItems(list as EventTypeModel[]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = { id: editing?.id ?? 0, name, status: Number(status) };
      const res = await eventTypesService.saveEventType(payload);

      if (res.status === "Success" || res.status === true) {
        toast.success(res.info || res.message);
        setEditing(null);
        setName("");
        setStatus("1");
        await load();
      } else {
        toast.error(res.info || res.message);
      }
    } catch {
      toast.error(CONSTANTS.MESSAGES.SOMETHING_WENT_WRONG);
    }
  };

  const onEdit = (item: EventTypeModel) => {
    setEditing(item);
    setName(item.name || "");
    setStatus(String(item.status ?? "1"));
  };

  const onDelete = async (item: EventTypeModel) => {
    if (!item.id) return;
    try {
      const res = await eventTypesService.deleteEventType(item.id);
      if (res.status === "Success" || res.status === true) {
        toast.success(res.info || res.message);
        await load();
      } else {
        toast.error(res.info || res.message);
      }
    } catch {
      toast.error(CONSTANTS.MESSAGES.SOMETHING_WENT_WRONG);
    }
  };

  const columns = useMemo(
    () => [
      { field: EventTypeModelLabels.ID, headerName: EVENT_TYPES_STRINGS.TABLE.HEADER_ID, width: 100 },
      { field: EventTypeModelLabels.NAME, headerName: EVENT_TYPES_STRINGS.TABLE.HEADER_NAME, flex: 1 },
      {
        field: EventTypeModelLabels.STATUS,
        headerName: EVENT_TYPES_STRINGS.TABLE.HEADER_STATUS,
        width: 120,
        renderCell: (params: any) => (
          <span
            className="text-center p-1 rounded"
            style={{
              backgroundColor: params.value === 1 ? `${COLORS.green}30` : `${COLORS.red}30`,
              color: params.value === 1 ? COLORS.green : COLORS.red,
            }}
          >
            {params.value === 1
              ? EVENT_TYPES_STRINGS.TABLE.STATUS_ACTIVE
              : EVENT_TYPES_STRINGS.TABLE.STATUS_INACTIVE}
          </span>
        ),
      },
      {
        field: EventTypeModelLabels.ACTIONS,
        headerName: EVENT_TYPES_STRINGS.TABLE.HEADER_ACTIONS,
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
    <div className="container-fluid page-padding-2 vh-100" style={{ backgroundColor: COLORS.lightGray }}>
      <h4 className="my-4">{EVENT_TYPES_STRINGS.TITLE}</h4>
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
              paginationModel={{ page: 0, pageSize: 10 }}
              pagination
            />
          </Box>
        </div>

        {/* Form */}
        <div className="col-lg-4">
          <div className="card shadow-sm">
            <div className="card-header" style={{ backgroundColor: COLORS.lightGray }}>
              <h5 className="mb-0">
                {editing ? EVENT_TYPES_STRINGS.FORM.EDIT_EVENT_TYPE : EVENT_TYPES_STRINGS.FORM.ADD_EVENT_TYPE}
              </h5>
            </div>
            <div className="card-body">
              <form onSubmit={onSubmit}>
                <div className="row g-3 align-items-end">
                  {/* Name */}
                  <div className="col-md-12">
                    <label className="form-label" style={STYLES.field_label}>
                      {EVENT_TYPES_STRINGS.TABLE.HEADER_NAME} *
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>

                  {/* Status */}
                  <div className="col-md-12">
                    <label className="form-label" style={STYLES.field_label}>
                      {EVENT_TYPES_STRINGS.TABLE.HEADER_STATUS} *
                    </label>
                    <select className="form-select" value={status} onChange={(e) => setStatus(e.target.value)}>
                      <option value="1">{EVENT_TYPES_STRINGS.TABLE.STATUS_ACTIVE}</option>
                      <option value="0">{EVENT_TYPES_STRINGS.TABLE.STATUS_INACTIVE}</option>
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
                      onClick={() => {
                        setEditing(null);
                        setName("");
                        setStatus("1");
                      }}
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

export default EventTypesList;
