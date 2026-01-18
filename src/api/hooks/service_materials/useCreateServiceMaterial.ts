import { useQueryClient, useMutation } from "@tanstack/react-query";
import { createServiceMaterial, type CreateServiceMaterialPayload } from "../../service_materials";

export function useCreateServiceMaterial() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createServiceMaterial,
    onSuccess: (_, variables: CreateServiceMaterialPayload) => {
      // обновляем кэш для конкретной услуги
      queryClient.invalidateQueries({
        queryKey: ["service_materials", variables.service_id] as const
      });
    },
  });
}
