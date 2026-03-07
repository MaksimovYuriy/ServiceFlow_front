import { api } from "./middlewares/axios";

/* ===== TYPES ===== */

export interface ForecastMonth {
  month: number;
  year: number;
  predicted_usage: number;
}

export interface ForecastPrediction {
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

export interface ForecastSummary {
  total_materials: number;
  need_purchase: number;
  total_cost: number;
  forecast_months: number;
}

export interface MaterialForecastResponse {
  predictions: ForecastPrediction[];
  summary: ForecastSummary;
}

/* ===== GET FORECAST ===== */

export function fetchMaterialForecast() {
  return api
    .get<MaterialForecastResponse>("/api/material_forecast")
    .then((response) => response.data);
}

/* ===== START FORECAST ===== */

export function startMaterialForecast() {
  return api
    .post<MaterialForecastResponse>("/api/material_forecast")
    .then((response) => response.data);
}
