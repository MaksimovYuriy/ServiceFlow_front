import type { AxiosResponse } from "axios";
import { api } from "./middlewares/axios";
import type { JsonApiResponse, JsonApiResource, JsonApiArrayResponse } from "./middlewares/jsonapi";

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
  client: {
    full_name: string,
    phone: string,
    telegram?: string | null
  }
}

export interface NoteForTable {
  id: number;
  client_name: string;
  service_title: string;
  master_name: string;
  start_at: string;
  total_price: number | null;
  status: string;
  time: string; 
}


export function createNote(payload: CreateNotePayload) {
  return api
    .post<JsonApiResponse<NoteResponseAttributes>>("/api/notes", {
      data: {
        type: "notes",
        attributes: {
          master_id: payload.master_id,
          service_id: payload.service_id,
          start_at: payload.start_at,
          end_at: payload.end_at,
          client: {
            full_name: payload.client.full_name,
            phone: payload.client.phone,
            telegram: payload.client.telegram
          }
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

export function fetchNotesByDate(date: string) {
  return api
    .get<JsonApiArrayResponse<NoteForTable>>(`/api/notes?filter[date]=${date}`)
    .then((response) =>
      response.data.data.map((item: JsonApiResource<NoteForTable>) => {
        const attrs = item.attributes;
        return {
          id: Number(item.id),
          client_name: attrs.client_name,
          master_name: attrs.master_name,
          service_title: attrs.service_title,
          start_at: attrs.start_at,
          total_price: attrs.total_price,
          status: attrs.status,
          time: new Date(attrs.start_at).toLocaleTimeString("ru-RU", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };
      })
    );
}

export function completeNote(id: number) {
  return api
    .patch<{ success: boolean }>(`/api/notes/${id}/complete`, {
      data: {
        type: "notes",
        attributes: {
          status: "completed",
        },
      },
    })
    .then((response) => response.data.success);
}

