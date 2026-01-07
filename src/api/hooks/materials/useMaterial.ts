import { useQuery } from "@tanstack/react-query";
import { fetchMaterials, type Material } from "../../materials";

export function useMaterials() {
  return useQuery<Material[], Error>({
    queryKey: ["materials"],
    queryFn: fetchMaterials,
    staleTime: 1000 * 60, // 1 минута кэширования
    refetchOnWindowFocus: false, // не перезагружать при возврате на страницу
  });
}