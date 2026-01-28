import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteServiceMaster } from "../../service_masters";

export function useDeleteServiceMaster(serviceId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteServiceMaster,
    onSuccess: () => {
      // обновляем кэш для конкретной услуги
      queryClient.invalidateQueries({
        queryKey: ["service_masters", serviceId] as const
      });
    },
  });
}
