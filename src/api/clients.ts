import type { AxiosResponse } from "axios";
import { api } from "./middlewares/axios";
import { type JsonApiResponse, type JsonApiArrayResponse, type JsonApiResource } from "./middlewares/jsonapi";

/* ===== TYPES ===== */

export interface ClientResponseAttributes {
  full_name: string;
  phone: string;
  telegram: string | null;
}

export type Client = {
  id: number;
  full_name: string;
  phone: string;
  telegram: string | null;
};

/* ===== GET CLIENTS ===== */

export function fetchClients() {
  return api
    .get<JsonApiArrayResponse<ClientResponseAttributes>>("/api/clients")
    .then(response =>
      response.data.data.map(
        (item: JsonApiResource<ClientResponseAttributes>) => ({
          id: Number(item.id),
          full_name: item.attributes.full_name,
          phone: item.attributes.phone,
          telegram: item.attributes.telegram,
        })
      )
    );
}
