import {
  Box,
  Button,
  Paper,
  Typography,
  CircularProgress,
  Card,
  CardContent,
} from "@mui/material";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { useMemo } from "react";
import Navbar from "../../components/Navbar";
import { useMaterialForecast } from "../../api/hooks/material_forecast/useMaterialForecast";
import { useStartMaterialForecast } from "../../api/hooks/material_forecast/useStartMaterialForecast";
import type { ForecastPrediction } from "../../api/material_forecast";

const MONTH_NAMES = [
  "", "Янв", "Фев", "Мар", "Апр", "Май", "Июн",
  "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек",
];

const formatPrice = (value: number) =>
  value.toLocaleString("ru-RU", { maximumFractionDigits: 0 }) + " ₽";

const MaterialForecastPage = () => {
  const { data: forecast, isError } = useMaterialForecast();
  const { mutate: startForecast, isPending } = useStartMaterialForecast();

  const noData = isError || !forecast;
  const hasResults = !!forecast;

  const columns: GridColDef[] = useMemo(() => {
    const monthColumns: GridColDef[] = (forecast?.predictions?.[0]?.months ?? []).map(
      (m, idx) => ({
        field: `month_${idx}`,
        headerName: `${MONTH_NAMES[m.month]} ${m.year}`,
        flex: 0.8,
        valueGetter: (_value: unknown, row: ForecastPrediction & { id: number }) =>
          row.months[idx]?.predicted_usage ?? 0,
      })
    );

    return [
      { field: "title", headerName: "Материал", flex: 1.5 },
      {
        field: "current_quantity",
        headerName: "Остаток",
        flex: 0.7,
      },
      {
        field: "minimal_quantity",
        headerName: "Мин. запас",
        flex: 0.7,
      },
      ...monthColumns,
      {
        field: "total_predicted_usage",
        headerName: "Итого расход",
        flex: 0.8,
      },
      {
        field: "purchase_qty",
        headerName: "К закупке",
        flex: 0.7,
      },
      {
        field: "purchase_cost",
        headerName: "Стоимость",
        flex: 0.9,
        renderCell: (params) => formatPrice(params.value),
      },
    ];
  }, [forecast]);

  const rows = useMemo(
    () =>
      (forecast?.predictions ?? []).map((p) => ({
        id: p.material_id,
        ...p,
      })),
    [forecast]
  );

  return (
    <div>
      <Navbar />

      <Box sx={{ display: "flex", gap: 2, alignItems: "center", mt: 8 }}>
        <Button
          variant="contained"
          onClick={() => startForecast()}
          disabled={isPending}
        >
          Запустить анализ
        </Button>

        {isPending && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <CircularProgress size={20} />
            <Typography variant="body2" color="text.secondary">
              Анализ выполняется (~30 сек)...
            </Typography>
          </Box>
        )}
      </Box>

      {noData && !isPending && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="body1" color="text.secondary">
            Анализ ещё не проводился. Нажмите «Запустить анализ», чтобы получить
            прогноз.
          </Typography>
        </Box>
      )}

      {hasResults && (
        <>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              mt: 3,
              flexWrap: "wrap",
            }}
          >
            <SummaryCard
              title="Всего материалов"
              value={String(forecast.summary.total_materials)}
            />
            <SummaryCard
              title="Требуют закупки"
              value={String(forecast.summary.need_purchase)}
            />
            <SummaryCard
              title="Общая стоимость"
              value={formatPrice(forecast.summary.total_cost)}
            />
            <SummaryCard
              title="Период прогноза"
              value={`${forecast.summary.forecast_months} мес.`}
            />
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", mt: 3 }}>
            <Paper sx={{ maxWidth: "100%", width: "100vw" }}>
              <DataGrid
                rows={rows}
                columns={columns}
                disableRowSelectionOnClick
                getRowClassName={(params) =>
                  params.row.purchase_qty > 0
                    ? "row-needs-purchase"
                    : "row-no-purchase"
                }
                sx={{
                  width: "100%",
                  "& .row-needs-purchase": {
                    backgroundColor: "rgba(255, 167, 38, 0.12)",
                  },
                  "& .row-no-purchase": {
                    color: "text.disabled",
                  },
                }}
              />
            </Paper>
          </Box>
        </>
      )}
    </div>
  );
};

function SummaryCard({ title, value }: { title: string; value: string }) {
  return (
    <Card sx={{ minWidth: 180 }}>
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {title}
        </Typography>
        <Typography variant="h5" fontWeight={600}>
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default MaterialForecastPage;
