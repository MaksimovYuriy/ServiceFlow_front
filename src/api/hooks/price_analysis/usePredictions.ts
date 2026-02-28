import { useQuery } from "@tanstack/react-query";
import { fetchPredictions } from "../../price_analysis";

export function usePredictions(polling: boolean) {
  return useQuery({
    queryKey: ["predictions"],
    queryFn: fetchPredictions,
    enabled: polling,
    refetchInterval: polling ? 4000 : false,
    retry: false,
    staleTime: Infinity,
  });
}
