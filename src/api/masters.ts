import type { AxiosResponse } from "axios";
import { api } from "./middlewares/axios";
import { type JsonApiResponse, type JsonApiArrayResponse, type JsonApiResource } from "./middlewares/jsonapi";

/* ===== TYPES ===== */

export interface MasterResponseAttributes {
  first_name: string;
  middle_name: string;
  last_name: string;
  phone: string;
  salary: number;
  active: boolean;
  full_name: string
}

export type Master = {
  id: number;
  first_name: string;
  middle_name: string;
  last_name: string;
  phone: string;
  salary: number;
  active: boolean;
  full_name: string;
};

export interface CreateMasterPayload {
  first_name: string;
  middle_name: string;
  last_name: string;
  phone: string;
  salary: number;
  active: boolean;
}

export interface UpdateMasterPayload {
  id: number;
  first_name: string;
  middle_name: string;
  last_name: string;
  phone: string;
  salary: number;
  active: boolean;
}

export interface Slot {
  start_time: string;
  end_time: string;
}


/* ===== GET SERVICES ===== */

export function fetchMasters() {
  return api
    .get<JsonApiArrayResponse<MasterResponseAttributes>>("/api/masters")
    .then(response =>
      response.data.data.map(
        (item: JsonApiResource<MasterResponseAttributes>) => ({
          id: Number(item.id),
          first_name: item.attributes.first_name,
          middle_name: item.attributes.middle_name,
          last_name: item.attributes.last_name,
          phone: item.attributes.phone,
          salary: item.attributes.salary,
          active: item.attributes.active,
          full_name: item.attributes.full_name
        })
      )
    );
}

export function fetchMastersByService(serviceId: number) {
  return api
    .get<JsonApiArrayResponse<MasterResponseAttributes>>(`/api/masters?filter[service_id]=${serviceId}`)
    .then(response =>
      response.data.data.map(
        (item: JsonApiResource<MasterResponseAttributes>) => ({
          id: Number(item.id),
          first_name: item.attributes.first_name,
          middle_name: item.attributes.middle_name,
          last_name: item.attributes.last_name,
          phone: item.attributes.phone,
          salary: item.attributes.salary,
          active: item.attributes.active,
          full_name: item.attributes.full_name
        })
      )
    );
}

/* ===== CREATE SERVICE ===== */

export function createMaster(payload: CreateMasterPayload) {
  return api
    .post<JsonApiResponse<MasterResponseAttributes>>("/api/masters", {
      data: {
        type: "masters",
        attributes: {
          first_name: payload.first_name,
          middle_name: payload.middle_name,
          last_name: payload.last_name,
          phone: payload.phone,
          salary: payload.salary,
          active: payload.active,
        },
      },
    }
  )
  .then((response: AxiosResponse<JsonApiResponse<MasterResponseAttributes>>) => {
    const item: JsonApiResource<MasterResponseAttributes> = response.data.data;

    return {
      id: Number(item.id),
      first_name: item.attributes.first_name,
      middle_name: item.attributes.middle_name,
      last_name: item.attributes.last_name,
      phone: item.attributes.phone,
      salary: item.attributes.salary,
      active: item.attributes.active,
      full_name: item.attributes.full_name
    };
  });
}

/* ===== UPDATE SERVICE ===== */

export function updateMaster(payload: UpdateMasterPayload) {
  return api
    .patch<JsonApiResponse<MasterResponseAttributes>>(
      `/api/masters/${payload.id}`,
      {
        data: {
          type: "masters",
          id: String(payload.id),
          attributes: {
            first_name: payload.first_name,
            middle_name: payload.middle_name,
            last_name: payload.last_name,
            phone: payload.phone,
            salary: payload.salary,
            active: payload.active,
          },
        },
      }
    )
    .then((response: AxiosResponse<JsonApiResponse<MasterResponseAttributes>>) => {
      const item: JsonApiResource<MasterResponseAttributes> = response.data.data;

      return {
        id: Number(item.id),
        first_name: item.attributes.first_name,
        middle_name: item.attributes.middle_name,
        last_name: item.attributes.last_name,
        phone: item.attributes.phone,
        salary: item.attributes.salary,
        active: item.attributes.active,
      };
    });
}

export function fetchAvailableDates(masterId: number) {
  return api
    .get<string[]>(`/api/masters/${masterId}/available_dates`)
    .then(response => response.data);
}

export function fetchAvailableSlots(masterId: number, date: string) {
  return api
    .get<Slot[]>(`/api/masters/${masterId}/available_slots`, {
      params: { date },
    })
    .then(response => response.data);
}

