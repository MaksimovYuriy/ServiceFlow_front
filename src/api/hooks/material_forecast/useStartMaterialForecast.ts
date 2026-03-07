import { useMutation, useQueryClient } from "@tanstack/react-query";
import { startMaterialForecast } from "../../material_forecast";

export function useStartMaterialForecast() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: startMaterialForecast,
    onSuccess: (data) => {
      queryClient.setQueryData(["material_forecast"], data);
    },
  });
}
