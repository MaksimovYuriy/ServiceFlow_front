import { useQuery } from "@tanstack/react-query";
import { fetchServices, type Service } from "../../services";

export function useServices() {
  return useQuery<Service[], Error>({
    queryKey: ["services"],
    queryFn: fetchServices,
    staleTime: 1000 * 60, // 1 минута кэширования
    refetchOnWindowFocus: false, // не перезагружать при возврате на страницу
  });
}