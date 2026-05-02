import { useQuery } from "@tanstack/react-query";
import { api } from "../middlewares/axios";
import type { JsonApiResponse } from "../middlewares/jsonapi";

export interface CurrentUserAttributes {
  email: string;
  phone: string | null;
  active: boolean;
}

export function useCurrentUser() {
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: () =>
      api
        .get<JsonApiResponse<CurrentUserAttributes>>("/auth/me")
        .then((r) => r.data),
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
}
