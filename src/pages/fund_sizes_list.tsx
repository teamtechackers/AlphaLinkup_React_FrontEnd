"use client"

import type React from "react"
import { useEffect, useState, useMemo } from "react"
import Box from "@mui/material/Box"
import { DataGrid } from "@mui/x-data-grid"
import fundSizeService from "../services/fund_size_service"
import { FUND_SIZE_STRINGS } from "../utils/strings/pages/fund_size_strings"
import { CONSTANTS } from "../utils/strings/constants"
import { type FundSizeModel, FundSizeModelLabels } from "../models/fund_size_model"
import { COLORS } from "../utils/theme/colors"
import { FiTrash2, FiEdit } from "react-icons/fi"
import { STYLES } from "../utils/typography/styles"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const FundSizeList: React.FC = () => {
  const [items, setItems] = useState<FundSizeModel[]>([])
  const [loading, setLoading] = useState(false)
  const [editing, setEditing] = useState<FundSizeModel | null>(null)
  const [investmentRange, setInvestmentRange] = useState("")
  const [status, setStatus] = useState("1")
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  })

  const load = async () => {
    setLoading(true)
    try {
      const list = await fundSizeService.getFundSizeList()
      setItems(list)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const payload = { id: editing?.id, investment_range: investmentRange, status: Number(status) }
      const res = await fundSizeService.saveFundSize(payload)
  
      const isSuccess = res?.status === true || String(res?.status).toLowerCase() === "success"
  
      if (isSuccess) {
        toast.success(res.info || (editing ? "Fund size updated successfully!" : "Fund size added successfully!"))
        setEditing(null)
        setInvestmentRange("")
        setStatus("1")
        await load()
      } else {
        toast.error(res?.info || CONSTANTS.MESSAGES.SOMETHING_WENT_WRONG)
      }
    } catch (err) {
      console.error(err)
      toast.error(CONSTANTS.MESSAGES.SOMETHING_WENT_WRONG)
    }
  }
  
  const onDelete = async (item: FundSizeModel) => {
    if (!item.id) return
  
    if (!window.confirm("Are you sure you want to delete this fund size?")) {
      return
    }
  
    try {
      const res = await fundSizeService.deleteFundSize(item.id)
      const isSuccess = res?.status === true || String(res?.status).toLowerCase() === "success"
  
      if (isSuccess) {
        toast.success(res.info || "Fund size deleted successfully!")
        await load()
      } else {
        toast.error(res?.info || "Failed to delete fund size")
      }
    } catch (err) {
      console.error(err)
      toast.error(CONSTANTS.MESSAGES.SOMETHING_WENT_WRONG)
    }
  }
  

  const onEdit = (item: FundSizeModel) => {
    setEditing(item)
    setInvestmentRange(item.investment_range || "")
    setStatus(String(item.status ?? "1"))
  }

  // const onDelete = async (item: FundSizeModel) => {
  //   if (!item.id) return

  //   if (!window.confirm("Are you sure you want to delete this fund size?")) {
  //     return
  //   }

  //   try {
  //     const res = await fundSizeService.deleteFundSize(item.id)
  //     if (res?.status?.toLowerCase() === "success") {
  //       toast.success(res.info || "Fund size deleted successfully!")
  //       await load()
  //     } else {
  //       toast.error(res?.info || "Failed to delete fund size")
  //     }
  //   } catch (err) {
  //     console.error(err)
  //     toast.error(CONSTANTS.MESSAGES.SOMETHING_WENT_WRONG)
  //   }
  // }

  const columns = useMemo(
    () => [
      { field: FundSizeModelLabels.ID, headerName: FUND_SIZE_STRINGS.TABLE.HEADER_ID, width: 100 },
      {
        field: FundSizeModelLabels.INVESTMENT_RANGE,
        headerName: FUND_SIZE_STRINGS.TABLE.HEADER_INVESTMENT_RANGE,
        flex: 1,
      },
      {
        field: FundSizeModelLabels.STATUS,
        headerName: FUND_SIZE_STRINGS.TABLE.HEADER_STATUS,
        width: 120,
        renderCell: (params: any) => (
          <span
            className="text-center p-1 rounded"
            style={{
              backgroundColor: params.value === 1 ? `${COLORS.green}30` : `${COLORS.red}30`,
              color: params.value === 1 ? COLORS.green : COLORS.red,
            }}
          >
            {params.value === 1 ? FUND_SIZE_STRINGS.TABLE.STATUS_ACTIVE : FUND_SIZE_STRINGS.TABLE.STATUS_INACTIVE}
          </span>
        ),
      },
      {
        field: FundSizeModelLabels.ACTIONS,
        headerName: FUND_SIZE_STRINGS.TABLE.HEADER_ACTIONS,
        width: 120,
        sortable: false,
        filterable: false,
        renderCell: (params: any) => (
          <div className="d-flex align-items-center gap-3 w-100 h-100">
            <FiEdit className="icon-hover" size={18} style={{ cursor: "pointer" }} onClick={() => onEdit(params.row)} />
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
    [items],
  )

  return (
    <div className="container-fluid vh-100" style={{ backgroundColor: COLORS.lightGray }}>

      {/* Page Title */}
      <div className="row">
        <div className="col-12">
          <div style={STYLES.page_title}>
              {FUND_SIZE_STRINGS.TITLE}
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
              getRowId={(row) => row.id}
              disableRowSelectionOnClick
              pageSizeOptions={[5, 10, 20, 50]}
              paginationModel={paginationModel}
              onPaginationModelChange={(newModel) => setPaginationModel(newModel)}
              paginationMode="client"
              pagination
            />
          </Box>
        </div>

        {/* Form */}
        <div className="col-lg-4">
          <div className="card shadow-sm">
            <div className="card-header" style={{ backgroundColor: COLORS.lightGray }}>
              <h5 className="mb-0">
                {editing ? FUND_SIZE_STRINGS.FORM.EDIT_FUND_SIZE : FUND_SIZE_STRINGS.FORM.ADD_FUND_SIZE}
              </h5>
            </div>
            <div className="card-body">
              <form onSubmit={onSubmit}>
                <div className="row g-3 align-items-end">
                  {/* Investment Range */}
                  <div className="col-md-12">
                    <label className="form-label" style={STYLES.field_label}>
                      {FUND_SIZE_STRINGS.TABLE.HEADER_INVESTMENT_RANGE} *
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={investmentRange}
                      onChange={(e) => setInvestmentRange(e.target.value)}
                      required
                    />
                  </div>

                  {/* Status */}
                  <div className="col-md-12">
                    <label className="form-label" style={STYLES.field_label}>
                      {FUND_SIZE_STRINGS.TABLE.HEADER_STATUS} *
                    </label>
                    <select className="form-select" value={status} onChange={(e) => setStatus(e.target.value)}>
                      <option value="1">{FUND_SIZE_STRINGS.TABLE.STATUS_ACTIVE}</option>
                      <option value="0">{FUND_SIZE_STRINGS.TABLE.STATUS_INACTIVE}</option>
                    </select>
                  </div>
                </div>

                {/* Buttons row */}
                <div className="d-flex gap-2 mt-3">
                  <button type="submit" className="btn" style={{ backgroundColor: COLORS.purple, color: COLORS.white }}>
                    {editing ? CONSTANTS.BUTTONS.UPDATE : CONSTANTS.BUTTONS.SAVE}
                  </button>
                  {editing && (
                    <button
                      style={{ backgroundColor: COLORS.red, color: COLORS.white }}
                      type="button"
                      className="btn"
                      onClick={() => {
                        setEditing(null)
                        setInvestmentRange("")
                        setStatus("1")
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
  )
}

export default FundSizeList
