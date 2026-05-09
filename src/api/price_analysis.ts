import { api } from "./middlewares/axios";

/* ===== TYPES ===== */

export type RunStatus = "queued" | "running" | "completed" | "failed";

export interface RunMeta {
  id: number;
  status: RunStatus;
  started_at: string | null;
  finished_at: string | null;
  duration_sec: number | null;
  error_message: string | null;
  created_at: string;
}

export interface PricePrediction {
  service_id: number;
  service_title: string;
  current_price: number;
  suggested_price: number;
  difference: number;
  difference_pct: number;
  is_active: number;
}

export interface PriceMetrics {
  test_mae: number;
  test_mse: number;
  test_wmape: number;
  baseline_mae: number;
  baseline_mse: number;
  baseline_wmape: number;
  mae_improvement_pct: number;
  train_rows: number;
  val_rows: number;
  test_rows: number;
  best_val_loss: number;
}

export interface PriceResults {
  run: RunMeta;
  predictions: PricePrediction[];
  metrics: PriceMetrics;
}

export interface RunsHistory {
  runs: RunMeta[];
}

export interface AnalysisInProgressError {
  error: "analysis_in_progress";
  run: RunMeta;
}

/* ===== START ANALYSIS ===== */

export function startPriceAnalysis() {
  return api
    .post<RunMeta>("/api/price_analysis")
    .then((response) => response.data);
}

/* ===== GET RESULTS ===== */

export function fetchPriceResults() {
  return api
    .get<PriceResults>("/api/price_analysis")
    .then((response) => response.data);
}

/* ===== GET LATEST RUN ===== */

export function fetchLatestPriceRun() {
  return api
    .get<RunMeta | null>("/api/price_analysis/runs/latest")
    .then((response) => response.data);
}

/* ===== GET RUNS HISTORY ===== */

export function fetchPriceRunsHistory() {
  return api
    .get<RunsHistory>("/api/price_analysis/runs")
    .then((response) => response.data);
}

/* ===== APPLY PRICE ===== */

export function applyServicePrice(serviceId: number, price: number) {
  return api.patch(`/api/services/${serviceId}`, {
    data: {
      type: "services",
      id: String(serviceId),
      attributes: { price },
    },
  });
}
