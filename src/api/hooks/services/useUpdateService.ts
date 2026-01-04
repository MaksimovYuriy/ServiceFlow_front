import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateService, type Service, type UpdateServicePayload } from "../../services";

export function useUpdateService() {
  const queryClient = useQueryClient();

  return useMutation<Service, Error, UpdateServicePayload>({
    mutationFn: updateService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}
