import type { AxiosResponse } from "axios";
import { api } from "./middlewares/axios";
import type { JsonApiResponse, JsonApiResource } from "./middlewares/jsonapi";

export interface NoteResponseAttributes {
  service_id: number;
  master_id: number;
  client_id: number;
  start_at: string;
  end_at: string;
  status: "pending" | "canceled" | "completed";
  total_price: number | null;
}

export interface CreateNotePayload {
  master_id: number;
  service_id: number;
  start_at: string;
  end_at: string;
  client_id: number;
}

export function createNote(payload: CreateNotePayload) {
  return api
    .post<JsonApiResponse<NoteResponseAttributes>>("/api/notes", {
      data: {
        type: "notes",
        attributes: {
          master_id: payload.master_id,
          service_id: payload.service_id,
          client_id: payload.client_id,
          start_at: payload.start_at,
          end_at: payload.end_at,
        },
      },
    })
    .then((response: AxiosResponse<JsonApiResponse<NoteResponseAttributes>>) => {
      const item: JsonApiResource<NoteResponseAttributes> = response.data.data;
      return {
        id: Number(item.id),
        ...item.attributes,
      };
    });
}
