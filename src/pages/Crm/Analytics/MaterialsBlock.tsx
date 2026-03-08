import { Grid, Card, CardContent, Typography, Alert, Box } from "@mui/material";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import type { MaterialsData } from "../../../types/analytics";
import { AnalyticsBlock } from "./AnalyticsBlock";
import { formatPrice } from "./utils";

interface Props {
  data?: MaterialsData;
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
}

const columns: GridColDef[] = [
  { field: "title", headerName: "Материал", flex: 1.5 },
  { field: "quantity", headerName: "Остаток", flex: 0.7 },
  { field: "usage", headerName: "Расход за период", flex: 0.9 },
  { field: "price", headerName: "Цена за ед.", flex: 0.7, renderCell: (p) => formatPrice(p.value) },
];

export function MaterialsBlock({ data, isLoading, isError, refetch }: Props) {
  return (
    <AnalyticsBlock title="Материалы" isLoading={isLoading} isError={isError} refetch={refetch}>
      {data && (
        <>
          <Grid container spacing={2} mb={2}>
            <Grid size={{ xs: 6 }}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="body2" color="text.secondary">Стоимость склада</Typography>
                  <Typography variant="h6" fontWeight={600}>{formatPrice(data.total_stock_value)}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 6 }}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="body2" color="text.secondary">Требуют закупки</Typography>
                  <Typography variant="h6" fontWeight={600}>{data.low_stock_count}</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {data.low_stock.length > 0 && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              <Typography variant="subtitle2" mb={0.5}>Материалы ниже минимума:</Typography>
              {data.low_stock.map((item) => (
                <Box key={item.id}>
                  {item.title} — остаток: {item.quantity}, минимум: {item.minimal_quantity}
                </Box>
              ))}
            </Alert>
          )}

          <DataGrid
            rows={data.usage_details}
            columns={columns}
            autoHeight
            disableRowSelectionOnClick
            hideFooter={data.usage_details.length <= 10}
          />
        </>
      )}
    </AnalyticsBlock>
  );
}
