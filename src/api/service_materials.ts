import { api } from "./middlewares/axios";
import type { AxiosResponse } from "axios";

export interface ServiceMaterial {
  id: number;
  required_quantity: number;
  service_id: number;
  material_id: number;
}

export interface CreateServiceMaterialPayload {
  service_id: number;
  material_id: number;
  required_quantity: number;
}

export interface UpdateServiceMaterialPayload {
  id: number;
  required_quantity: number;
  service_id: number;
}

/* ===== GET SERVICE MATERIALS ===== */
export function fetchServiceMaterials(serviceId: number) {
  return api
    .get<{ data: ServiceMaterial[] }>(`/api/service_materials?filter[service_id]=${serviceId}`)
    .then(response => response.data.data)
}

/* ===== CREATE SERVICE MATERIAL ===== */
export function createServiceMaterial(payload: CreateServiceMaterialPayload) {
  return api
    .post<{ data: ServiceMaterial }>(
      `/api/service_materials`,
      {
        data: {
          type: "service_materials",
          attributes: {
            required_quantity: payload.required_quantity,
            service_id: payload.service_id,
            material_id: payload.material_id,
          },
        },
      }
    )
    .then((response) => response.data.data);
}

/* ===== UPDATE SERVICE MATERIAL ===== */
export function updateServiceMaterial(payload: UpdateServiceMaterialPayload) {
  return api
    .patch<{ data: ServiceMaterial }>(
      `/api/service_materials/${payload.id}`,
      {
        data: {
          type: "service_materials",
          id: String(payload.id),
          attributes: {
            required_quantity: payload.required_quantity,
            // Если нужно, можно сюда добавить material_id или service_id
          },
        },
      }
    )
    .then((response) => response.data.data);
}

/* ===== DELETE SERVICE MATERIAL ===== */
export function deleteServiceMaterial(id: number) {
  return api.delete(`/api/service_materials/${id}`);
}
