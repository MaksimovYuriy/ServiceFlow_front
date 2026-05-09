import { useQuery } from "@tanstack/react-query";
import { fetchMaterialRunsHistory } from "../../material_forecast";
import type { RunsHistory } from "../../price_analysis";

export function useMaterialRunsHistory() {
  return useQuery<RunsHistory>({
    queryKey: ["material_forecast", "history"],
    queryFn: fetchMaterialRunsHistory,
    retry: false,
    staleTime: Infinity,
  });
}
