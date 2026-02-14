import { useMutation, useQueryClient } from "@tanstack/react-query";
import { completeNote } from "../../notes";

export function useCompleteNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: completeNote,
    onSuccess: () => {
      // просто обновляем кэш, нам больше ничего не нужно
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });
}
