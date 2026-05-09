import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import {
  startPriceAnalysis,
  type AnalysisInProgressError,
  type RunMeta,
} from "../../price_analysis";
import { useSnackbar } from "../../../context/SnackbarContext";

export function useStartAnalysis() {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();

  return useMutation<RunMeta, unknown, void>({
    mutationFn: startPriceAnalysis,
    meta: { skipGlobalErrorHandler: true },
    onSuccess: (run) => {
      queryClient.setQueryData(["price_analysis", "latest_run"], run);
      queryClient.invalidateQueries({ queryKey: ["price_analysis", "history"] });
    },
    onError: (error) => {
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        const data = error.response.data as AnalysisInProgressError;
        queryClient.setQueryData(["price_analysis", "latest_run"], data.run);
        showSnackbar("Анализ уже выполняется", "info");
      } else {
        showSnackbar("Не удалось запустить анализ", "error");
      }
    },
  });
}
