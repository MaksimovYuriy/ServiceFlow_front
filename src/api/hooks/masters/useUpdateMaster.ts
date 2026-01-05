import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateMaster, type Master, type UpdateMasterPayload } from "../../masters";

export function useUpdateMaster() {
  const queryClient = useQueryClient();

  return useMutation<Master, Error, UpdateMasterPayload>({
    mutationFn: updateMaster,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["masters"] });
    },
  });
}
