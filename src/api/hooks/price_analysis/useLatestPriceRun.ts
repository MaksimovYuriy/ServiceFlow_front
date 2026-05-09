import { useQuery } from "@tanstack/react-query";
import { fetchLatestPriceRun, type RunMeta } from "../../price_analysis";

export function useLatestPriceRun() {
  return useQuery<RunMeta | null>({
    queryKey: ["price_analysis", "latest_run"],
    queryFn: fetchLatestPriceRun,
    refetchInterval: (query) => {
      const data = query.state.data;
      if (!data) return false;
      return data.status === "queued" || data.status === "running" ? 3000 : false;
    },
    refetchOnWindowFocus: true,
  });
}
