import { useQuery } from "@tanstack/react-query";
import { fetchPriceResults, type PriceResults } from "../../price_analysis";

export function usePriceResults(enabled: boolean) {
  return useQuery<PriceResults>({
    queryKey: ["price_analysis", "results"],
    queryFn: fetchPriceResults,
    enabled,
    retry: false,
    staleTime: Infinity,
  });
}
