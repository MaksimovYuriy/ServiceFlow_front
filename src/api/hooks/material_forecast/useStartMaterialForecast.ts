import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import {
  startMaterialForecast,
  type ForecastInProgressError,
} from "../../material_forecast";
import type { RunMeta } from "../../price_analysis";
import { useSnackbar } from "../../../context/SnackbarContext";

export function useStartMaterialForecast() {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();

  return useMutation<RunMeta, unknown, void>({
    mutationFn: startMaterialForecast,
    meta: { skipGlobalErrorHandler: true },
    onSuccess: (run) => {
      queryClient.setQueryData(["material_forecast", "latest_run"], run);
      queryClient.invalidateQueries({ queryKey: ["material_forecast", "history"] });
    },
    onError: (error) => {
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        const data = error.response.data as ForecastInProgressError;
        queryClient.setQueryData(["material_forecast", "latest_run"], data.run);
        showSnackbar("Прогноз уже выполняется", "info");
      } else {
        showSnackbar("Не удалось запустить прогноз", "error");
      }
    },
  });
}
