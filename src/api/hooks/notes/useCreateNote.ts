import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNote, type CreateNotePayload } from "../../notes";

export function useCreateNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createNote,
    onSuccess: (_, variables: CreateNotePayload) => {
      // обновляем кэш для мастера и/или списка записей
      queryClient.invalidateQueries({
        queryKey: ["masters", variables.master_id, "available_slots"],
      });
      queryClient.invalidateQueries({
        queryKey: ["notes"], // если у тебя есть общий хук для всех заметок
      });
    },
  });
}
