import { useQuery } from "@tanstack/react-query";
import { fetchMastersByService, type Master } from "../../masters";

export function useMastersByService(serviceId: number) {
  return useQuery<Master[], Error>({
    queryKey: ["masters", serviceId],
    queryFn: () => fetchMastersByService(serviceId),
    staleTime: 1000 * 60, // 1 минута кэширования
    refetchOnWindowFocus: false, // не перезагружать при возврате на страницу
  });
}
