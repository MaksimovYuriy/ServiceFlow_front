import { useMutation, useQueryClient } from "@tanstack/react-query";
import { add, type OperationPayload, type OperationResponse } from "../../../materials/operations";

export function useAddMaterial() {
  const queryClient = useQueryClient();

  return useMutation<OperationResponse, Error, OperationPayload>({
    mutationFn: add,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["materials"] });
    },
  });
}
