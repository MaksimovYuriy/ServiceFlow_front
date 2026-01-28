import { useQuery } from "@tanstack/react-query";
import { fetchServiceMasters, type ServiceMaster } from "../../service_masters";

export function useServiceMasters(serviceId: number) {
  return useQuery<ServiceMaster[], Error>({
      queryKey: ["service_masters", serviceId],
      queryFn: () => fetchServiceMasters(serviceId),
      staleTime: 1000 * 60, // 1 минута кэширования
      refetchOnWindowFocus: false, // не перезагружать при возврате на страницу
      enabled: !!serviceId // Запрос не выполнится без serviceId
    });
}
