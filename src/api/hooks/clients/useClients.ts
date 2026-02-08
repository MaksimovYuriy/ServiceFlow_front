import { useQuery } from "@tanstack/react-query";
import { fetchClients, type Client } from "../../clients";

export function useClients() {
  return useQuery<Client[], Error>({
    queryKey: ["clients"],
    queryFn: fetchClients,
    staleTime: 1000 * 60, // 1 минута кэширования
    refetchOnWindowFocus: false, // не перезагружать при возврате на страницу
  });
}