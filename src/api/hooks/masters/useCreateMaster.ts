import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createMaster, type CreateMasterPayload, type Master } from "../../masters";

export function useCreateMaster() {
  const queryClient = useQueryClient();

  return useMutation<Master, Error, CreateMasterPayload>({
    mutationFn: createMaster,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["masters"] });
    },
  });
}
