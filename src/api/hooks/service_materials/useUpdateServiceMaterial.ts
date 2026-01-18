import { useQueryClient, useMutation } from "@tanstack/react-query";
import { updateServiceMaterial } from "../../service_materials";

export function useUpdateServiceMaterial() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateServiceMaterial,
    onSuccess: (data: { id: number; service_id: number }) => {
      // обновляем кэш для конкретной услуги
      queryClient.invalidateQueries({
        queryKey: ["service_materials", data.service_id] as const
      });
    },
  });
}
