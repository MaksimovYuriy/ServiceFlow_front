import { useMutation } from "@tanstack/react-query";
import { startAnalysis } from "../../price_analysis";

export function useStartAnalysis() {
  return useMutation({
    mutationFn: startAnalysis,
  });
}
