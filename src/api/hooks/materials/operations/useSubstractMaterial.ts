import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type OperationResponse, type OperationPayload, subtract } from "../../../materials/operations";

export function useSubtractMaterial() {
  const queryClient = useQueryClient();

  return useMutation<OperationResponse, Error, OperationPayload>({
    mutationFn: subtract,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["materials"] });
    },
  });
}
