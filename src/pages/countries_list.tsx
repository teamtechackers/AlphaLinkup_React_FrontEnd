import React, { useEffect, useState, useMemo } from "react";
import Box from "@mui/material/Box";
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import countriesService from "../services/countries_service";
import { COUNTRIES_STRINGS } from "../utils/strings/pages/countries_strings";
import { CONSTANTS } from "../utils/strings/constants";
import { CountryModel, CountryModelLabels } from "../models/country_model";
import { COLORS } from "../utils/theme/colors";
import { FiTrash2, FiEdit } from "react-icons/fi";
import { STYLES } from "../utils/typography/styles";

const CountriesList: React.FC = () => {
  const [items, setItems] = useState<CountryModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<CountryModel | null>(null);
  const [name, setName] = useState("");
  const [status, setStatus] = useState("1");
  const [message, setMessage] = useState<{ type: typeof CONSTANTS.MESSAGE_TAGS.SUCCESS | typeof CONSTANTS.MESSAGE_TAGS.ERROR; text: string } | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await countriesService.getCountriesList();
      const list = Array.isArray(data?.countries) ? data.countries : [];
      setItems(list as CountryModel[]);
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
      await countriesService.saveCountry(payload);

      setMessage({ type: CONSTANTS.MESSAGE_TAGS.SUCCESS, text: CONSTANTS.MESSAGES.SAVE_SUCCESS });
      setEditing(null);
      setName("");
      setStatus("1");
      await load();
    } catch (err) {
      console.error(err);
      setMessage({ type: CONSTANTS.MESSAGE_TAGS.ERROR, text: CONSTANTS.MESSAGES.SAVE_FAILED });
    }
  };

  const onEdit = (item: CountryModel) => {
    setEditing(item);
    setName(item.name || "");
    setStatus(String(item.status ?? "1"));
  };

  const onDelete = async (item: CountryModel) => {
    if (!item.id) return;
    await countriesService.deleteCountry(item.id);
    await load();
  };

  // Columns for DataGrid
  const columns = useMemo(
    () => [
      { field: CountryModelLabels.ID, headerName: COUNTRIES_STRINGS.TABLE.HEADER_ID, width: 100 },
      { field: CountryModelLabels.NAME, headerName: COUNTRIES_STRINGS.TABLE.HEADER_NAME, flex: 1 },
      {
        field: CountryModelLabels.STATUS,
        headerName: COUNTRIES_STRINGS.TABLE.HEADER_STATUS,
        width: 120,
        renderCell: (params: any) => (
          <span
            className="text-center p-1 rounded"
            style={{
              backgroundColor: params.value === 1 ? `${COLORS.green}30` : `${COLORS.red}30`,
              color: params.value === 1 ? COLORS.green : COLORS.red,
            }}
          >
            {params.value === 1 ? COUNTRIES_STRINGS.TABLE.STATUS_ACTIVE : COUNTRIES_STRINGS.TABLE.STATUS_INACTIVE}
          </span>
        ),
      },
      {
        field: CountryModelLabels.ACTIONS,
        headerName: COUNTRIES_STRINGS.TABLE.HEADER_ACTIONS,
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
      <h4 className="my-4">{COUNTRIES_STRINGS.TITLE}</h4>
      <div className="row g-4 w-100">
        
        {/* Table */}
        <div className="col-lg-8 p-0">
          <Box sx={{ height: 800, width: '100%' }}>
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
              <h5 className="mb-0">{editing ? COUNTRIES_STRINGS.FORM.EDIT_COUNTRY : COUNTRIES_STRINGS.FORM.ADD_COUNTRY}</h5>
            </div>
            <div className="card-body">
              <form onSubmit={onSubmit}>
                <div className="row g-3 align-items-end">
                  {/* Country Name */}
                  <div className="col-md-6">
                    <label className="form-label" style={STYLES.field_label}>
                      {COUNTRIES_STRINGS.TABLE.HEADER_NAME} *
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
                  <div className="col-md-6">
                    <label className="form-label" style={STYLES.field_label}>
                      {COUNTRIES_STRINGS.TABLE.HEADER_STATUS} *
                    </label>
                    <select
                      className="form-select"
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                    >
                      <option value="1">{COUNTRIES_STRINGS.TABLE.STATUS_ACTIVE}</option>
                      <option value="0">{COUNTRIES_STRINGS.TABLE.STATUS_INACTIVE}</option>
                    </select>
                  </div>
                </div>

                {/* Buttons row */}
                <div className="d-flex gap-2 mt-3">
                  <button
                    type="submit"
                    className="btn"
                    style={{ backgroundColor: COLORS.purple, color: COLORS.white }}
                  >
                    {editing ? CONSTANTS.BUTTONS.UPDATE : CONSTANTS.BUTTONS.SAVE}
                  </button>
                  {editing && (
                    <button
                     style={{ backgroundColor: COLORS.red, color: COLORS.white }}
                      type="button"
                      className="btn"
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

export default CountriesList;
