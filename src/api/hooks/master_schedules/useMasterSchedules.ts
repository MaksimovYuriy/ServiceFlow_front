import { useQuery } from "@tanstack/react-query";
import { fetchMasterSchedules, type MasterSchedule } from "../../master_shedules";

export function useMasterSchedules(masterId: number) {
  return useQuery<MasterSchedule[], Error>({
      queryKey: ["master_schedules", masterId],
      queryFn: () => fetchMasterSchedules(masterId),
      staleTime: 1000 * 60, // 1 минута кэширования
      refetchOnWindowFocus: false, // не перезагружать при возврате на страницу
      enabled: !!masterId // Запрос не выполнится без masterId
    });
}