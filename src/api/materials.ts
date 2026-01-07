import type { AxiosResponse } from "axios";
import { api } from "./middlewares/axios";
import type { JsonApiArrayResponse, JsonApiResource, JsonApiResponse } from "./middlewares/jsonapi";

/* ===== TYPES ===== */

export interface MaterialResponseAttributes {
  title: string;
  quantity: number;
  minimal_quantity: number;
}

export type Material = {
  id: number;
  title: string;
  quantity: number;
  minimal_quantity: number;
};

export interface CreateMaterialPayload {
  title: string;
  quantity: number;
  minimal_quantity: number;
}

export interface UpdateMaterialPayload {
  id: number;
  title: string;
  quantity: number;
  minimal_quantity: number;
}


/* ===== GET SERVICES ===== */

export function fetchMaterials() {
  return api
    .get<JsonApiArrayResponse<MaterialResponseAttributes>>("/api/materials")
    .then(response =>
      response.data.data.map(
        (item: JsonApiResource<MaterialResponseAttributes>) => ({
          id: Number(item.id),
          title: item.attributes.title,
          quantity: item.attributes.quantity,
          minimal_quantity: item.attributes.minimal_quantity
        })
      )
    );
}

/* ===== CREATE SERVICE ===== */

export function createMaterial(payload: CreateMaterialPayload) {
  return api
    .post<JsonApiResponse<MaterialResponseAttributes>>("/api/materials", {
      data: {
        type: "materials",
        attributes: {
          title: payload.title,
          quantity: payload.quantity,
          minimal_quantity: payload.minimal_quantity
        },
      },
    }
  )
  .then((response: AxiosResponse<JsonApiResponse<MaterialResponseAttributes>>) => {
    const item: JsonApiResource<MaterialResponseAttributes> = response.data.data;

    return {
      id: Number(item.id),
      title: item.attributes.title,
      quantity: item.attributes.quantity,
      minimal_quantity: item.attributes.minimal_quantity
    };
  });
}

/* ===== UPDATE SERVICE ===== */

export function updateMaterial(payload: UpdateMaterialPayload) {
  return api
    .patch<JsonApiResponse<MaterialResponseAttributes>>(
      `/api/materials/${payload.id}`,
      {
        data: {
          type: "materials",
          id: String(payload.id),
          attributes: {
            title: payload.title,
            quantity: payload.quantity,
            minimal_quantity: payload.minimal_quantity
          },
        },
      }
    )
    .then((response: AxiosResponse<JsonApiResponse<MaterialResponseAttributes>>) => {
      const item: JsonApiResource<MaterialResponseAttributes> = response.data.data;

      return {
        id: Number(item.id),
        title: item.attributes.title,
        quantity: item.attributes.quantity,
        minimal_quantity: item.attributes.minimal_quantity
      };
    });
}

