import {
  Box,
  Button,
  Paper,
  Typography,
  Chip,
  CircularProgress,
} from "@mui/material";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { AdminLayout } from "../../components/layouts/AdminLayout";
import { useStartAnalysis } from "../../api/hooks/price_analysis/useStartAnalysis";
import { usePredictions } from "../../api/hooks/price_analysis/usePredictions";
import { useApplyPrice } from "../../api/hooks/price_analysis/useApplyPrice";
import type { Prediction } from "../../api/price_analysis";
import { useSnackbar } from "../../context/SnackbarContext";

const formatPrice = (value: number) =>
  value.toLocaleString("ru-RU", { maximumFractionDigits: 0 }) + " \u20BD";

const PriceAnalysisPage = () => {
  const [polling, setPolling] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [appliedIds, setAppliedIds] = useState<Set<number>>(new Set());
  const [applyingAll, setApplyingAll] = useState(false);
  const pollingTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const { showSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const { mutate: startAnalysis, isPending: isStarting } = useStartAnalysis();
  const { data: predictions, isError } = usePredictions(polling);
  const { mutateAsync: applyPrice, isPending: isApplying } = useApplyPrice();

  const hasResults = predictions && predictions.length > 0;

  useEffect(() => {
    if (hasResults && analyzing) {
      setPolling(false);
      setAnalyzing(false);
    }
  }, [hasResults, analyzing]);

  useEffect(() => {
    return () => clearTimeout(pollingTimer.current);
  }, []);

  const handleStartAnalysis = () => {
    clearTimeout(pollingTimer.current);
    setPolling(false);
    setAnalyzing(true);
    setAppliedIds(new Set());
    queryClient.removeQueries({ queryKey: ["predictions"] });
    startAnalysis(undefined, {
      onSuccess: () => {
        pollingTimer.current = setTimeout(() => setPolling(true), 5000);
      },
    });
  };

  const handleApply = useCallback(
    async (serviceId: number, price: number) => {
      await applyPrice({ serviceId, price });
      setAppliedIds((prev) => new Set(prev).add(serviceId));
      showSnackbar("Цена применена", "success");
    },
    [applyPrice]
  );

  const handleApplyAll = useCallback(async () => {
    if (!predictions) return;
    setApplyingAll(true);
    for (const p of predictions) {
      if (!appliedIds.has(p.service_id)) {
        await applyPrice({ serviceId: p.service_id, price: p.suggested_price });
        setAppliedIds((prev) => new Set(prev).add(p.service_id));
      }
    }
    setApplyingAll(false);
  }, [predictions, appliedIds, applyPrice]);

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
      (predictions ?? []).map((p: Prediction) => ({
        id: p.service_id,
        ...p,
      })),
    [predictions]
  );

  const isAnalyzing = analyzing && !hasResults;

  return (
    <AdminLayout>
      <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
        <Button
          variant="contained"
          onClick={handleStartAnalysis}
          disabled={isStarting || isAnalyzing}
        >
          Запустить анализ
        </Button>

        {hasResults && (
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

      {isAnalyzing && (
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 4 }}>
          <CircularProgress size={24} />
          <Typography>Анализ выполняется...</Typography>
        </Box>
      )}

      {hasResults && (
        <Box sx={{ display: "flex", flexDirection: "column", mt: 4 }}>
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
    </AdminLayout>
  );
};

export default PriceAnalysisPage;
