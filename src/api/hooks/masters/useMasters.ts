import { useQuery } from "@tanstack/react-query";
import { fetchMasters, type Master } from "../../masters";

export function useMasters() {
  return useQuery<Master[], Error>({
    queryKey: ["masters"],
    queryFn: fetchMasters,
    staleTime: 1000 * 60, // 1 минута кэширования
    refetchOnWindowFocus: false, // не перезагружать при возврате на страницу
  });
}