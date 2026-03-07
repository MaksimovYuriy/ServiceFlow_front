import { useQuery } from "@tanstack/react-query";
import { fetchMaterialForecast } from "../../material_forecast";

export function useMaterialForecast() {
  return useQuery({
    queryKey: ["material_forecast"],
    queryFn: fetchMaterialForecast,
    retry: false,
    staleTime: Infinity,
  });
}
