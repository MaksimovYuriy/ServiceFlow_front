import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteServiceMaterial } from "../../service_materials";

export function useDeleteServiceMaterial(serviceId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteServiceMaterial,
    onSuccess: () => {
      // обновляем кэш для конкретной услуги
      queryClient.invalidateQueries({
        queryKey: ["service_materials", serviceId] as const
      });
    },
  });
}
