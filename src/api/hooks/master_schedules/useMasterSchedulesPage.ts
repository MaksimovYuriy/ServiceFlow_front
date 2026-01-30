import { useMemo } from "react";
import type { MasterSchedule } from "../../master_shedules";
import { useMasterSchedules } from "./useMasterSchedules";
import { useCreateMasterSchedule } from "./useCreateMasterSchedule";
import { useDeleteMasterSchedule } from "./useDeleteMasterSchedule";

export interface MasterScheduleRow {
  id: number;
  weekday: number;
  start_time: string;
  end_time: string;
}

export const useMasterSchedulesPage = (masterId: number) => {
  // ===== Получение расписания мастера =====
  const { data = [], isLoading } = useMasterSchedules(masterId);

  // ===== Создание нового интервала =====
  const create = useCreateMasterSchedule(masterId);

  // ===== Удаление интервала =====
  const remove = useDeleteMasterSchedule(masterId);

  // ===== Преобразуем данные в формат для таблицы =====
  const rows: MasterScheduleRow[] = useMemo(
    () =>
      data.map((r: MasterSchedule) => ({
        id: Number(r.id),
        weekday: r.weekday,
        start_time: r.start_time,
        end_time: r.end_time,
      })),
    [data]
  );

  return {
    rows,
    isLoading,
    create,
    remove,
  };
};
