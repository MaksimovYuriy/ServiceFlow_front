import type { AxiosResponse } from "axios";
import { api } from "./axios";
import { type JsonApiResponse, type JsonApiArrayResponse, type JsonApiResource } from "./jsonapi";

/* ===== TYPES ===== */

export interface UserResponseAttributes {
  email: string;
  phone: string | null;
  active: boolean;
}

export type User = {
  id: number;
  email: string;
  phone: string | null;
  active: boolean;
};

export interface CreateUserPayload {
  email: string;
  phone: string | null;
  active: boolean;
  password: string;
  password_confirmation: string;
}

export interface UpdateUserPayload {
  id: number;
  email: string;
  phone: string | null;
  active: boolean;
}


/* ===== GET USERS ===== */

export function fetchUsers() {
  return api
    .get<JsonApiArrayResponse<UserResponseAttributes>>("/api/users")
    .then(response =>
      response.data.data.map(
        (item: JsonApiResource<UserResponseAttributes>) => ({
          id: Number(item.id),
          email: item.attributes.email,
          phone: item.attributes.phone,
          active: item.attributes.active,
        })
      )
    );
}

/* ===== CREATE USER ===== */

export function createUser(payload: CreateUserPayload) {
  return api
    .post<JsonApiResponse<UserResponseAttributes>>("/api/users", {
      data: {
        type: "users",
        attributes: {
          email: payload.email,
          phone: payload.phone,
          active: payload.active,
          password: payload.password,
          password_confirmation: payload.password_confirmation,
        },
      },
    }
  )
  .then((response: AxiosResponse<JsonApiResponse<UserResponseAttributes>>) => {
    const item: JsonApiResource<UserResponseAttributes> = response.data.data;

    return {
      id: Number(item.id),
      email: item.attributes.email,
      phone: item.attributes.phone,
      active: item.attributes.active,
    };
  });
}

/* ===== UPDATE USER ===== */

export function updateUser(payload: UpdateUserPayload) {
  return api
    .patch<JsonApiResponse<UserResponseAttributes>>(
      `/api/users/${payload.id}`,
      {
        data: {
          type: "users",
          id: String(payload.id),
          attributes: {
            email: payload.email,
            phone: payload.phone,
            active: payload.active,
          },
        },
      }
    )
    .then((response: AxiosResponse<JsonApiResponse<UserResponseAttributes>>) => {
      const item: JsonApiResource<UserResponseAttributes> = response.data.data;

      return {
        id: Number(item.id),
        email: item.attributes.email,
        phone: item.attributes.phone,
        active: item.attributes.active,
      };
    });
}

