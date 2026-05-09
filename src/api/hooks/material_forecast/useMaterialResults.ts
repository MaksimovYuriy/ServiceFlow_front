import { useQuery } from "@tanstack/react-query";
import { fetchMaterialResults, type MaterialResults } from "../../material_forecast";

export function useMaterialResults(enabled: boolean) {
  return useQuery<MaterialResults>({
    queryKey: ["material_forecast", "results"],
    queryFn: fetchMaterialResults,
    enabled,
    retry: false,
    staleTime: Infinity,
  });
}
