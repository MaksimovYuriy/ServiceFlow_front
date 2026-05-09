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
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { AdminLayout } from "../../components/layouts/AdminLayout";
import { useStartAnalysis } from "../../api/hooks/price_analysis/useStartAnalysis";
import { useLatestPriceRun } from "../../api/hooks/price_analysis/useLatestPriceRun";
import { usePriceResults } from "../../api/hooks/price_analysis/usePriceResults";
import { usePriceRunsHistory } from "../../api/hooks/price_analysis/usePriceRunsHistory";
import { useApplyPrice } from "../../api/hooks/price_analysis/useApplyPrice";
import type { PricePrediction, RunMeta, RunStatus } from "../../api/price_analysis";
import { useSnackbar } from "../../context/SnackbarContext";

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

const statusLabel = (status: RunStatus) => {
  switch (status) {
    case "completed":
      return "completed";
    case "failed":
      return "failed";
    case "running":
      return "running";
    case "queued":
      return "queued";
  }
};

const PriceAnalysisPage = () => {
  const [appliedIds, setAppliedIds] = useState<Set<number>>(new Set());
  const [applyingAll, setApplyingAll] = useState(false);

  const { showSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  const { mutate: startAnalysis, isPending: isStarting } = useStartAnalysis();
  const { data: latestRun } = useLatestPriceRun();
  const { data: history } = usePriceRunsHistory();

  const hasCompletedInHistory = useMemo(
    () => (history?.runs ?? []).some((r) => r.status === "completed"),
    [history]
  );
  const { data: results } = usePriceResults(hasCompletedInHistory);
  const { mutateAsync: applyPrice, isPending: isApplying } = useApplyPrice();

  // Реакция на смену статуса latest run: при переходе в completed/failed
  // подтягиваем свежие данные и показываем snackbar.
  const prevStatusRef = useRef<RunStatus | null | undefined>(undefined);
  useEffect(() => {
    const prev = prevStatusRef.current;
    const curr = latestRun?.status ?? null;
    prevStatusRef.current = curr;

    const wasActive = prev === "queued" || prev === "running";
    if (!wasActive) return;

    if (curr === "completed") {
      queryClient.invalidateQueries({ queryKey: ["price_analysis", "results"] });
      queryClient.invalidateQueries({ queryKey: ["price_analysis", "history"] });
      setAppliedIds(new Set());
      showSnackbar("Анализ завершён", "success");
    } else if (curr === "failed") {
      queryClient.invalidateQueries({ queryKey: ["price_analysis", "history"] });
      showSnackbar("Анализ завершился ошибкой", "error");
    }
  }, [latestRun?.status, queryClient, showSnackbar]);

  const isActiveRun =
    latestRun?.status === "queued" || latestRun?.status === "running";

  const handleStartAnalysis = () => {
    startAnalysis();
  };

  const handleApply = useCallback(
    async (serviceId: number, price: number) => {
      await applyPrice({ serviceId, price });
      setAppliedIds((prev) => new Set(prev).add(serviceId));
      showSnackbar("Цена применена", "success");
    },
    [applyPrice, showSnackbar]
  );

  const handleApplyAll = useCallback(async () => {
    if (!results) return;
    setApplyingAll(true);
    for (const p of results.predictions) {
      if (!appliedIds.has(p.service_id)) {
        await applyPrice({ serviceId: p.service_id, price: p.suggested_price });
        setAppliedIds((prev) => new Set(prev).add(p.service_id));
      }
    }
    setApplyingAll(false);
  }, [results, appliedIds, applyPrice]);

  const columns: GridColDef[] = useMemo(
    () => [
      { field: "service_title", headerName: "Услуга", flex: 1.5 },
      {
        field: "current_price",
        headerName: "Текущая цена",
        flex: 1,
        renderCell: (params) => formatPrice(params.value),
      },
      {
        field: "suggested_price",
        headerName: "Предложенная цена",
        flex: 1,
        renderCell: (params) => formatPrice(params.value),
      },
      {
        field: "difference_pct",
        headerName: "Разница",
        flex: 0.8,
        renderCell: (params) => {
          const value = params.value as number;
          const color = value > 0 ? "success" : value < 0 ? "error" : "default";
          const sign = value > 0 ? "+" : "";
          return <Chip label={`${sign}${value.toFixed(1)}%`} color={color} size="small" />;
        },
      },
      {
        field: "is_active",
        headerName: "Статус",
        flex: 0.7,
        renderCell: (params) =>
          params.value === 1 ? (
            <Chip label="Активна" color="success" size="small" variant="outlined" />
          ) : (
            <Chip label="Неактивна" size="small" variant="outlined" />
          ),
      },
      {
        field: "actions",
        headerName: "Действие",
        flex: 0.8,
        sortable: false,
        filterable: false,
        renderCell: (params) => {
          const id = params.row.service_id as number;
          if (appliedIds.has(id)) {
            return (
              <Chip label="Применено" color="primary" size="small" variant="outlined" />
            );
          }
          return (
            <Button
              size="small"
              variant="contained"
              disabled={isApplying || applyingAll}
              onClick={() => handleApply(id, params.row.suggested_price)}
            >
              Принять
            </Button>
          );
        },
      },
    ],
    [appliedIds, isApplying, applyingAll, handleApply]
  );

  const rows = useMemo(
    () =>
      (results?.predictions ?? []).map((p: PricePrediction) => ({
        id: p.service_id,
        ...p,
      })),
    [results]
  );

  // ----- Состояния -----

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
          onClick={handleStartAnalysis}
          disabled={isStarting || isActiveRun}
        >
          Запустить анализ
        </Button>

        {showResults && !isActiveRun && (
          <Button
            variant="outlined"
            onClick={handleApplyAll}
            disabled={applyingAll || isApplying}
          >
            {applyingAll ? "Применяется..." : "Применить все"}
          </Button>
        )}

        <Typography variant="body2" color="text.secondary">
          Рекомендуется запускать анализ 1-го числа каждого месяца
        </Typography>
      </Box>

      {showEmptyState && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="body1" color="text.secondary">
            Анализ ещё не проводился. Нажмите кнопку, чтобы получить первые
            рекомендации.
          </Typography>
        </Box>
      )}

      {isActiveRun && (
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 3 }}>
          <CircularProgress size={24} />
          <Typography>
            {latestRun?.status === "queued"
              ? "Поставлено в очередь..."
              : `Анализ выполняется... (${latestRun?.duration_sec ?? 0} сек)`}
          </Typography>
        </Box>
      )}

      {isActiveRun && !results && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Первый анализ может занять до минуты.
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
        <Box sx={{ display: "flex", flexDirection: "column", mt: 3 }}>
          <Paper sx={{ width: "100%" }}>
            <DataGrid
              rows={rows}
              columns={columns}
              disableRowSelectionOnClick
              getRowClassName={(params) =>
                params.row.is_active === 0 ? "row-inactive" : ""
              }
              sx={{
                width: "100%",
                "& .row-inactive": {
                  color: "text.disabled",
                  fontStyle: "italic",
                },
              }}
            />
          </Paper>
        </Box>
      )}

      {showResults && results && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Качество прогноза
          </Typography>
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <MetricCard
              title="Средняя ошибка модели (MAE)"
              value={results.metrics.test_mae.toFixed(4)}
            />
            <MetricCard
              title="MAE базового метода"
              subtitle="(цена не меняется)"
              value={results.metrics.baseline_mae.toFixed(4)}
            />
            <MetricCard
              title="Улучшение по MAE"
              value={`+${results.metrics.mae_improvement_pct.toFixed(1)}%`}
              valueColor="success.main"
            />
            <MetricCard
              title="Размер тестовой выборки"
              value={`${results.metrics.test_rows} строк`}
            />
          </Box>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: "block" }}>
            MAE — средняя абсолютная ошибка прогноза коэффициента цены; чем меньше,
            тем точнее. Базовый метод — гипотеза «цена не меняется». Улучшение
            показывает, насколько модель точнее тривиального предположения.
          </Typography>
        </Box>
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
        label={statusLabel(run.status)}
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

export default PriceAnalysisPage;
