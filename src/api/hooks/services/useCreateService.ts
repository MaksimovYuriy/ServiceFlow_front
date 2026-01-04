import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createService, type CreateServicePayload, type Service } from "../../services";

export function useCreateService() {
  const queryClient = useQueryClient();

  return useMutation<Service, Error, CreateServicePayload>({
    mutationFn: createService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
  });
}
