import { useQuery } from "@tanstack/react-query";
import { fetchLatestMaterialRun } from "../../material_forecast";
import type { RunMeta } from "../../price_analysis";

export function useLatestMaterialRun() {
  return useQuery<RunMeta | null>({
    queryKey: ["material_forecast", "latest_run"],
    queryFn: fetchLatestMaterialRun,
    refetchInterval: (query) => {
      const data = query.state.data;
      if (!data) return false;
      return data.status === "queued" || data.status === "running" ? 3000 : false;
    },
    refetchOnWindowFocus: true,
  });
}
