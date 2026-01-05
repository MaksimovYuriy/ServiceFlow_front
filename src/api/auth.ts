import { useNavigate, type NavigateFunction } from "react-router-dom";
import { api } from "./middlewares/axios";
import type { JsonApiResource, JsonApiResponse } from "./middlewares/jsonapi";
import { QueryClient } from "@tanstack/react-query";

export interface LoginAttributes {
  email: string;
  password: string;
}

export interface LoginResponseAttributes {
  token: string;
}

export function loginRequest(payload: LoginAttributes) {
  return api.post<JsonApiResponse<LoginResponseAttributes>>("/auth/sign_in", {
    data: {
      type: "login",
      attributes: payload,
    },
  });
}

export function logout(navigate: NavigateFunction) {
  sessionStorage.removeItem("token");
  sessionStorage.clear();
  navigate('/login')
}
