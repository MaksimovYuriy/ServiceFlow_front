import { api } from "./middlewares/axios";

/* ===== TYPES ===== */

export interface Prediction {
  service_id: number;
  service_title: string;
  current_price: number;
  suggested_price: number;
  difference: number;
  difference_pct: number;
  is_active: number;
}

export interface PredictionsResponse {
  predictions: Prediction[];
}

/* ===== START ANALYSIS ===== */

export function startAnalysis() {
  return api
    .post<{ status: string }>("/api/price_analysis")
    .then((response) => response.data);
}

/* ===== GET PREDICTIONS ===== */

export function fetchPredictions() {
  return api
    .get<PredictionsResponse>("/api/price_analysis")
    .then((response) => response.data.predictions);
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
