import { api } from "./middlewares/axios";
import type { RunMeta, RunsHistory } from "./price_analysis";

/* ===== TYPES ===== */

export interface ForecastMonth {
  month: number;
  year: number;
  predicted_usage: number;
}

export interface MaterialPrediction {
  material_id: number;
  title: string;
  current_quantity: number;
  minimal_quantity: number;
  unit_price: number;
  months: ForecastMonth[];
  total_predicted_usage: number;
  purchase_qty: number;
  purchase_cost: number;
}

export interface MaterialSummary {
  total_materials: number;
  need_purchase: number;
  total_cost: number;
  forecast_months: number;
}

export interface MaterialMetrics {
  test_mae: number;
  test_mse: number;
  test_wmape: number;
  baseline_lag1_mae: number;
  baseline_lag1_wmape: number;
  baseline_avg3_mae: number;
  baseline_avg3_wmape: number;
  mae_improvement_pct: number;
  train_rows: number;
  val_rows: number;
  test_rows: number;
  best_val_loss: number;
}

export interface MaterialResults {
  run: RunMeta;
  predictions: MaterialPrediction[];
  summary: MaterialSummary;
  metrics: MaterialMetrics;
}

export interface ForecastInProgressError {
  error: "forecast_in_progress";
  run: RunMeta;
}

/* ===== START FORECAST ===== */

export function startMaterialForecast() {
  return api
    .post<RunMeta>("/api/material_forecast")
    .then((response) => response.data);
}

/* ===== GET RESULTS ===== */

export function fetchMaterialResults() {
  return api
    .get<MaterialResults>("/api/material_forecast")
    .then((response) => response.data);
}

/* ===== GET LATEST RUN ===== */

export function fetchLatestMaterialRun() {
  return api
    .get<RunMeta | null>("/api/material_forecast/runs/latest")
    .then((response) => response.data);
}

/* ===== GET RUNS HISTORY ===== */

export function fetchMaterialRunsHistory() {
  return api
    .get<RunsHistory>("/api/material_forecast/runs")
    .then((response) => response.data);
}
