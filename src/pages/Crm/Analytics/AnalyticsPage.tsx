import { useState } from "react";
import { Box, TextField, Typography } from "@mui/material";
import { AdminLayout } from "../../../components/layouts/AdminLayout";
import {
  useSummary,
  useRevenue,
  useAnalyticsMasters,
  useAnalyticsServices,
  useAnalyticsClients,
  useAnalyticsMaterials,
} from "../../../api/hooks/analytics/useAnalytics";
import { getDefaultPeriod } from "./utils";
import { SummaryBlock } from "./SummaryBlock";
import { RevenueBlock } from "./RevenueBlock";
import { MastersBlock } from "./MastersBlock";
import { ServicesBlock } from "./ServicesBlock";
import { ClientsBlock } from "./ClientsBlock";
import { MaterialsBlock } from "./MaterialsBlock";

const AnalyticsPage = () => {
  const defaultPeriod = getDefaultPeriod();
  const [from, setFrom] = useState(defaultPeriod.from);
  const [to, setTo] = useState(defaultPeriod.to);

  const summary = useSummary(from, to);
  const revenue = useRevenue(from, to);
  const masters = useAnalyticsMasters(from, to);
  const services = useAnalyticsServices(from, to);
  const clients = useAnalyticsClients(from, to);
  const materials = useAnalyticsMaterials(from, to);

  return (
    <AdminLayout>
      <Typography variant="h4" fontWeight={300} mb={3}>
        Аналитика
      </Typography>

      {/* Селектор периода */}
      <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap", alignItems: "center" }}>
        <TextField
          label="С"
          type="month"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          InputLabelProps={{ shrink: true }}
          size="small"
        />
        <TextField
          label="По"
          type="month"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          InputLabelProps={{ shrink: true }}
          size="small"
        />
      </Box>

      {/* Блоки */}
      <SummaryBlock
        data={summary.data}
        isLoading={summary.isLoading}
        isError={summary.isError}
        refetch={summary.refetch}
      />

      <RevenueBlock
        data={revenue.data}
        isLoading={revenue.isLoading}
        isError={revenue.isError}
        refetch={revenue.refetch}
      />

      <MastersBlock
        data={masters.data}
        isLoading={masters.isLoading}
        isError={masters.isError}
        refetch={masters.refetch}
      />

      <ServicesBlock
        data={services.data}
        isLoading={services.isLoading}
        isError={services.isError}
        refetch={services.refetch}
      />

      <ClientsBlock
        data={clients.data}
        isLoading={clients.isLoading}
        isError={clients.isError}
        refetch={clients.refetch}
      />

      <MaterialsBlock
        data={materials.data}
        isLoading={materials.isLoading}
        isError={materials.isError}
        refetch={materials.refetch}
      />
    </AdminLayout>
  );
};

export default AnalyticsPage;
