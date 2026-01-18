import { useQuery } from "@tanstack/react-query";
import { fetchServiceMaterials, type ServiceMaterial } from "../../service_materials";

export function useServiceMaterials(serviceId: number) {
  return useQuery<ServiceMaterial[], Error>({
      queryKey: ["service_materials", serviceId],
      queryFn: () => fetchServiceMaterials(serviceId),
      staleTime: 1000 * 60, // 1 минута кэширования
      refetchOnWindowFocus: false, // не перезагружать при возврате на страницу
      enabled: !!serviceId // Запрос не выполнится без serviceId
    });
}
