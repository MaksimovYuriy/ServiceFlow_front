import { type NavigateFunction } from "react-router-dom";
import { api } from "./middlewares/axios";
import type { JsonApiResponse } from "./middlewares/jsonapi";

export interface LoginAttributes {
  email: string;
  password: string;
}

export interface LoginResponseAttributes {
  message: string;
}

export function loginRequest(payload: LoginAttributes) {
  return api.post<JsonApiResponse<LoginResponseAttributes>>("/auth/sign_in", {
    data: {
      type: "login",
      attributes: payload,
    },
  });
}

export async function logout(navigate: NavigateFunction) {
  try {
    await api.delete("/auth/sign_out");
  } catch {
    // даже при ошибке делаем редирект, чтобы пользователь не залип
  }
  navigate("/login");
}
