import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { useEffect, useMemo, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { AdminLayout } from "../../components/layouts/AdminLayout";
import { useStartMaterialForecast } from "../../api/hooks/material_forecast/useStartMaterialForecast";
import { useLatestMaterialRun } from "../../api/hooks/material_forecast/useLatestMaterialRun";
import { useMaterialResults } from "../../api/hooks/material_forecast/useMaterialResults";
import { useMaterialRunsHistory } from "../../api/hooks/material_forecast/useMaterialRunsHistory";
import type { MaterialPrediction } from "../../api/material_forecast";
import type { RunMeta, RunStatus } from "../../api/price_analysis";
import { useSnackbar } from "../../context/SnackbarContext";

const MONTH_NAMES = [
  "", "Янв", "Фев", "Мар", "Апр", "Май", "Июн",
  "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек",
];

const formatPrice = (value: number) =>
  value.toLocaleString("ru-RU", { maximumFractionDigits: 0 }) + " ₽";

const formatDateTime = (iso: string) =>
  new Date(iso).toLocaleString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const statusChipColor = (status: RunStatus) => {
  switch (status) {
    case "completed":
      return "success";
    case "failed":
      return "error";
    case "running":
      return "info";
    case "queued":
      return "warning";
  }
};

const MaterialForecastPage = () => {
  const { showSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  const { mutate: startForecast, isPending: isStarting } = useStartMaterialForecast();
  const { data: latestRun } = useLatestMaterialRun();
  const { data: history } = useMaterialRunsHistory();

  const hasCompletedInHistory = useMemo(
    () => (history?.runs ?? []).some((r) => r.status === "completed"),
    [history]
  );
  const { data: results } = useMaterialResults(hasCompletedInHistory);

  const prevStatusRef = useRef<RunStatus | null | undefined>(undefined);
  useEffect(() => {
    const prev = prevStatusRef.current;
    const curr = latestRun?.status ?? null;
    prevStatusRef.current = curr;

    const wasActive = prev === "queued" || prev === "running";
    if (!wasActive) return;

    if (curr === "completed") {
      queryClient.invalidateQueries({ queryKey: ["material_forecast", "results"] });
      queryClient.invalidateQueries({ queryKey: ["material_forecast", "history"] });
      showSnackbar("Прогноз готов", "success");
    } else if (curr === "failed") {
      queryClient.invalidateQueries({ queryKey: ["material_forecast", "history"] });
      showSnackbar("Прогноз завершился ошибкой", "error");
    }
  }, [latestRun?.status, queryClient, showSnackbar]);

  const isActiveRun =
    latestRun?.status === "queued" || latestRun?.status === "running";

  const columns: GridColDef[] = useMemo(() => {
    const monthColumns: GridColDef[] = (results?.predictions?.[0]?.months ?? []).map(
      (m, idx) => ({
        field: `month_${idx}`,
        headerName: `${MONTH_NAMES[m.month]} ${m.year}`,
        flex: 0.8,
        valueGetter: (_value: unknown, row: MaterialPrediction & { id: number }) =>
          row.months[idx]?.predicted_usage ?? 0,
      })
    );

    return [
      { field: "title", headerName: "Материал", flex: 1.5 },
      { field: "current_quantity", headerName: "Остаток", flex: 0.7 },
      { field: "minimal_quantity", headerName: "Мин. запас", flex: 0.7 },
      ...monthColumns,
      { field: "total_predicted_usage", headerName: "Итого расход", flex: 0.8 },
      { field: "purchase_qty", headerName: "К закупке", flex: 0.7 },
      {
        field: "purchase_cost",
        headerName: "Стоимость",
        flex: 0.9,
        renderCell: (params) => formatPrice(params.value),
      },
    ];
  }, [results]);

  const rows = useMemo(
    () =>
      (results?.predictions ?? []).map((p) => ({
        id: p.material_id,
        ...p,
      })),
    [results]
  );

  const showEmptyState = latestRun === null;
  const showFailedAlert = latestRun?.status === "failed";
  const showStaleNotice = isActiveRun && results;
  const showFailedStaleNotice = showFailedAlert && results;
  const showResults = !!results;

  return (
    <AdminLayout>
      <Box sx={{ display: "flex", gap: 2, alignItems: "center", flexWrap: "wrap" }}>
        <Button
          variant="contained"
          onClick={() => startForecast()}
          disabled={isStarting || isActiveRun}
        >
          Запустить анализ
        </Button>
      </Box>

      {showEmptyState && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="body1" color="text.secondary">
            Прогноз ещё не проводился. Нажмите кнопку, чтобы получить первые
            рекомендации по закупкам.
          </Typography>
        </Box>
      )}

      {isActiveRun && (
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 3 }}>
          <CircularProgress size={24} />
          <Typography>
            {latestRun?.status === "queued"
              ? "Поставлено в очередь..."
              : `Прогноз выполняется... (${latestRun?.duration_sec ?? 0} сек)`}
          </Typography>
        </Box>
      )}

      {isActiveRun && !results && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Первый прогноз может занять до минуты.
        </Typography>
      )}

      {showStaleNotice && results && (
        <Alert severity="info" sx={{ mt: 3 }}>
          Идёт перерасчёт. Показаны результаты предыдущего запуска от{" "}
          {formatDateTime(results.run.created_at)}.
        </Alert>
      )}

      {showFailedAlert && (
        <Alert severity="error" sx={{ mt: 3 }}>
          Последний запуск завершился ошибкой:{" "}
          {latestRun?.error_message ?? "неизвестная ошибка"}. Можно запустить
          повторно.
        </Alert>
      )}

      {showFailedStaleNotice && results && (
        <Alert severity="info" sx={{ mt: 2 }}>
          Показан результат от {formatDateTime(results.run.created_at)}, последний
          запуск завершился ошибкой.
        </Alert>
      )}

      {showResults && results && (
        <>
          <Box sx={{ display: "flex", gap: 2, mt: 3, flexWrap: "wrap" }}>
            <SummaryCard
              title="Всего материалов"
              value={String(results.summary.total_materials)}
            />
            <SummaryCard
              title="Требуют закупки"
              value={String(results.summary.need_purchase)}
            />
            <SummaryCard
              title="Общая стоимость"
              value={formatPrice(results.summary.total_cost)}
            />
            <SummaryCard
              title="Период прогноза"
              value={`${results.summary.forecast_months} мес.`}
            />
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", mt: 3 }}>
            <Paper sx={{ width: "100%" }}>
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

          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Качество прогноза
            </Typography>
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              <MetricCard
                title="MAE модели"
                value={results.metrics.test_mae.toFixed(3)}
              />
              <MetricCard
                title="MAE наивного метода (lag-1)"
                subtitle="(прогноз = прошлый месяц)"
                value={results.metrics.baseline_lag1_mae.toFixed(3)}
              />
              <MetricCard
                title="MAE среднего за 3 мес"
                value={results.metrics.baseline_avg3_mae.toFixed(3)}
              />
              <MetricCard
                title="Улучшение по MAE"
                value={`+${results.metrics.mae_improvement_pct.toFixed(1)}%`}
                valueColor="success.main"
              />
              <MetricCard
                title="wMAPE модели"
                subtitle="(взвешенная относительная ошибка)"
                value={`${results.metrics.test_wmape.toFixed(1)}%`}
              />
            </Box>
          </Box>
        </>
      )}

      {history && history.runs.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            История запусков (последние 5)
          </Typography>
          <Paper>
            <List dense>
              {history.runs.map((run) => (
                <RunHistoryItem key={run.id} run={run} />
              ))}
            </List>
          </Paper>
        </Box>
      )}
    </AdminLayout>
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

function MetricCard({
  title,
  subtitle,
  value,
  valueColor,
}: {
  title: string;
  subtitle?: string;
  value: string;
  valueColor?: string;
}) {
  return (
    <Card sx={{ minWidth: 200 }}>
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="caption" color="text.secondary" display="block">
            {subtitle}
          </Typography>
        )}
        <Typography variant="h5" fontWeight={600} sx={{ color: valueColor, mt: 1 }}>
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
}

function RunHistoryItem({ run }: { run: RunMeta }) {
  const duration = run.duration_sec != null ? `${run.duration_sec} сек` : "—";
  const secondary =
    run.status === "failed" && run.error_message
      ? `${duration} • ${run.error_message}`
      : duration;

  return (
    <ListItem>
      <Chip
        label={run.status}
        color={statusChipColor(run.status)}
        size="small"
        sx={{ mr: 2, minWidth: 90 }}
      />
      <ListItemText
        primary={formatDateTime(run.created_at)}
        secondary={secondary}
      />
    </ListItem>
  );
}

export default MaterialForecastPage;
