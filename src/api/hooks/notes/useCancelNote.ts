import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cancelNote } from "../../notes";

export function useCancelNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cancelNote,
    onSuccess: () => {
      // просто обновляем кэш, нам больше ничего не нужно
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });
}
