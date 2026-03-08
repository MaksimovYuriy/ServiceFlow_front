import { Grid, Card, CardContent, Typography } from "@mui/material";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import type { ClientsData } from "../../../types/analytics";
import { AnalyticsBlock } from "./AnalyticsBlock";
import { formatPrice } from "./utils";

interface Props {
  data?: ClientsData;
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
}

const columns: GridColDef[] = [
  { field: "name", headerName: "Клиент", flex: 1.2 },
  { field: "phone", headerName: "Телефон", flex: 1 },
  { field: "visits", headerName: "Визитов", flex: 0.6 },
  { field: "total_spent", headerName: "Потрачено", flex: 0.8, renderCell: (p) => formatPrice(p.value) },
];

export function ClientsBlock({ data, isLoading, isError, refetch }: Props) {
  const stats = data
    ? [
        { label: "Уникальных", value: data.unique_clients },
        { label: "Новых", value: data.new_clients },
        { label: "Повторных", value: data.repeat_clients },
      ]
    : [];

  return (
    <AnalyticsBlock title="Клиенты" isLoading={isLoading} isError={isError} refetch={refetch}>
      {data && (
        <>
          <Grid container spacing={2} mb={2}>
            {stats.map((s) => (
              <Grid size={{ xs: 4 }} key={s.label}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="body2" color="text.secondary">{s.label}</Typography>
                    <Typography variant="h6" fontWeight={600}>{s.value.toLocaleString("ru-RU")}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Typography variant="subtitle2" mb={1}>Топ-10 клиентов</Typography>
          <DataGrid
            rows={data.top_clients}
            columns={columns}
            autoHeight
            disableRowSelectionOnClick
            hideFooter
          />
        </>
      )}
    </AnalyticsBlock>
  );
}
