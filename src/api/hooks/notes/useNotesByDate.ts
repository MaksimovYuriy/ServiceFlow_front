import { useQuery } from "@tanstack/react-query";
import { fetchNotesByDate, type NoteForTable } from "../../notes";

export function useNotesByDate(date: string | null) {
  return useQuery<NoteForTable[], Error>({
    queryKey: ["notes", date], // кэшируются по дате
    queryFn: () => {
      if (!date) {
        return Promise.resolve([]); // если дата не выбрана, возвращаем пустой массив
      }
      return fetchNotesByDate(date);
    },
    enabled: !!date, // запрос выполняется только если дата задана
    staleTime: 1000 * 60, // 1 минута кэширования
    refetchOnWindowFocus: false, // не перезагружать при возврате на страницу
  });
}
