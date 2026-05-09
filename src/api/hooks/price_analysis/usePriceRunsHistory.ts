import { useQuery } from "@tanstack/react-query";
import { fetchPriceRunsHistory, type RunsHistory } from "../../price_analysis";

export function usePriceRunsHistory() {
  return useQuery<RunsHistory>({
    queryKey: ["price_analysis", "history"],
    queryFn: fetchPriceRunsHistory,
    retry: false,
    staleTime: Infinity,
  });
}
