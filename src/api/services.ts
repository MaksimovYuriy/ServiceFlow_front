import type { AxiosResponse } from "axios";
import { api } from "./axios";
import { type JsonApiResponse, type JsonApiArrayResponse, type JsonApiResource } from "./jsonapi";

/* ===== TYPES ===== */

export interface ServiceResponseAttributes {
  title: string;
  description: string;
  duration: string;
  price: number;
  active: boolean;
}

export type Service = {
  id: number;
  title: string;
  description: string;
  duration: string;
  price: number;
  active: boolean;
};

export interface CreateServicePayload {
  title: string;
  description: string;
  duration: string;
  price: number;
  active: boolean;
}

export interface UpdateServicePayload {
  id: number;
  title: string;
  description: string;
  duration: string;
  price: number;
  active: boolean;
}


/* ===== GET SERVICES ===== */

export function fetchServices() {
  return api
    .get<JsonApiArrayResponse<ServiceResponseAttributes>>("/api/services")
    .then(response =>
      response.data.data.map(
        (item: JsonApiResource<ServiceResponseAttributes>) => ({
          id: Number(item.id),
          title: item.attributes.title,
          description: item.attributes.description,
          duration: item.attributes.duration,
          price: item.attributes.price,
          active: item.attributes.active,
        })
      )
    );
}

/* ===== CREATE SERVICE ===== */

export function createService(payload: CreateServicePayload) {
  return api
    .post<JsonApiResponse<ServiceResponseAttributes>>("/api/services", {
      data: {
        type: "services",
        attributes: {
          title: payload.title,
          description: payload.description,
          duration: payload.duration,
          price: payload.price,
          active: payload.active,
        },
      },
    }
  )
  .then((response: AxiosResponse<JsonApiResponse<ServiceResponseAttributes>>) => {
    const item: JsonApiResource<ServiceResponseAttributes> = response.data.data;

    return {
      id: Number(item.id),
      title: item.attributes.title,
      description: item.attributes.description,
      duration: item.attributes.duration,
      price: item.attributes.price,
      active: item.attributes.active,
    };
  });
}

/* ===== UPDATE SERVICE ===== */

export function updateService(payload: UpdateServicePayload) {
  return api
    .patch<JsonApiResponse<ServiceResponseAttributes>>(
      `/api/services/${payload.id}`,
      {
        data: {
          type: "services",
          id: String(payload.id),
          attributes: {
            title: payload.title,
            description: payload.description,
            duration: payload.duration,
            price: payload.price,
            active: payload.active,
          },
        },
      }
    )
    .then((response: AxiosResponse<JsonApiResponse<ServiceResponseAttributes>>) => {
      const item: JsonApiResource<ServiceResponseAttributes> = response.data.data;

      return {
        id: Number(item.id),
        title: item.attributes.title,
        description: item.attributes.description,
        duration: item.attributes.duration,
        price: item.attributes.price,
        active: item.attributes.active,
      };
    });
}

