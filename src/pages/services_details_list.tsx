import React, { useEffect, useState, useMemo } from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import { ServiceModel, ServiceModelLabels } from "../models/service_model";
import servicesService from "../services/services_service";
import { SERVICE_STRINGS } from "../utils/strings/pages/services_strings";
import { COLORS } from "../utils/theme/colors";

interface ServicesListPageProps {
  serviceId: string;
}

const ServicesListPage: React.FC<ServicesListPageProps> = ({ serviceId }) => {
  const [items, setItems] = useState<ServiceModel[]>([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    console.log("ServicesListPage.load called with serviceId:", serviceId);

    if (!serviceId) {
      console.warn("No serviceId provided, skipping load");
      setItems([]);
      return;
    }

    setLoading(true);
    try {
      const res = await servicesService.getList(serviceId);
      console.log("API response:", res);

      const list: ServiceModel[] = Array.isArray(res?.services_list) ? res.services_list : [];
      console.log("Parsed services list:", list);

      setItems(list);
    } catch (err) {
      console.error("Error loading services", err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [serviceId]);

  const columns = useMemo(
    () => [
      { field: ServiceModelLabels.SERVICE_NAME, headerName: SERVICE_STRINGS.TABLE.HEADER_SERVICE_NAME, width: 180 },
      { field: ServiceModelLabels.COMPANY_NAME, headerName: SERVICE_STRINGS.TABLE.HEADER_COMPANY_NAME, width: 180 },
      { field: ServiceModelLabels.TITLE, headerName: SERVICE_STRINGS.TABLE.HEADER_TITLE, width: 200 },
      { field: ServiceModelLabels.TAG_LINE, headerName: SERVICE_STRINGS.TABLE.HEADER_TAG_LINE, width: 150 },
      { field: ServiceModelLabels.SERVICE_DESCRIPTION, headerName: SERVICE_STRINGS.TABLE.HEADER_DESCRIPTION, width: 250 },
      {
        field: ServiceModelLabels.AVG_SERVICE_RATING,
        headerName: SERVICE_STRINGS.TABLE.HEADER_RATING,
        width: 100,
      },
      {
        field: ServiceModelLabels.STATUS,
        headerName: SERVICE_STRINGS.TABLE.HEADER_STATUS,
        width: 100,
        renderCell: (params: any) => (
          <span
            style={{
              color: params.value === "1" ? COLORS.green : COLORS.red,
              fontWeight: 500,
            }}
          >
            {params.value === "1" ? SERVICE_STRINGS.TABLE.STATUS_ACTIVE : SERVICE_STRINGS.TABLE.STATUS_INACTIVE}
          </span>
        ),
      },
    ],
    []
  );

  return (
    <Box sx={{ height: 500, width: "100%" }}>
      <DataGrid
        rows={items}
        columns={columns}
        getRowId={(row) => row.usps_id}
        loading={loading}
        pageSizeOptions={[5, 10, 20]}
      />
    </Box>
  );
};

export default ServicesListPage;
