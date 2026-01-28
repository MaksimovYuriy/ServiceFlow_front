import { useQueryClient, useMutation } from "@tanstack/react-query";
import { createServiceMaster, type CreateServiceMasterPayload } from "../../service_masters";


export function useCreateServiceMaster() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createServiceMaster,
    onSuccess: (_, variables: CreateServiceMasterPayload) => {
      // обновляем кэш для конкретной услуги
      queryClient.invalidateQueries({
        queryKey: ["service_masters", variables.service_id] as const
      });
    },
  });
}
