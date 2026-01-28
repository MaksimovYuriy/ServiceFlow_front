import { api } from "./middlewares/axios";
import type { AxiosResponse } from "axios";

export interface ServiceMaster {
  id: number;
  service_id: number;
  master_id: number;
  master_name: string;
}

export interface CreateServiceMasterPayload {
  service_id: number;
  master_id: number;
}

/* ===== GET SERVICE MASTERS ===== */
export function fetchServiceMasters(serviceId: number) {
  return api
    .get<{ data: ServiceMaster[] }>(`/api/service_masters?filter[service_id]=${serviceId}`)
    .then((response) => response.data.data);
}

/* ===== CREATE SERVICE MASTER ===== */
export function createServiceMaster(payload: CreateServiceMasterPayload) {
  return api
    .post<{ data: ServiceMaster }>(
      `/api/service_masters`,
      {
        data: {
          type: "service_masters",
          attributes: {
            service_id: payload.service_id,
            master_id: payload.master_id,
          },
        },
      }
    )
    .then((response) => response.data.data);
}

/* ===== DELETE SERVICE MASTER ===== */
export function deleteServiceMaster(id: number) {
  return api.delete(`/api/service_masters/${id}`);
}
