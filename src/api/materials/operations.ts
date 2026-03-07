import type { AxiosResponse } from "axios";
import { api } from "../middlewares/axios";

export interface OperationPayload {
  material_id: number;
  amount: number;
}

export interface OperationResponse {
  status: string;
  message: string;
}

/* ===== ADD ===== */
export function add(payload: OperationPayload) {
  return api
    .post<OperationResponse>(`/api/materials/add`, {
      material_id: payload.material_id,
      amount: payload.amount,
    })
    .then((response: AxiosResponse<OperationResponse>) => response.data);
}

/* ===== SUBTRACT ===== */
export function subtract(payload: OperationPayload) {
  return api
    .post<OperationResponse>(`/api/materials/subtract`, {
      material_id: payload.material_id,
      amount: payload.amount,
    })
    .then((response: AxiosResponse<OperationResponse>) => response.data);
}
