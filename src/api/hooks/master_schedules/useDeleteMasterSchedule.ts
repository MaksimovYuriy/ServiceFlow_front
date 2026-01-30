import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteMasterSchedule } from "../../master_shedules";

export function useDeleteMasterSchedule(masterId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (scheduleId: number) => deleteMasterSchedule(masterId, scheduleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["master_schedules", masterId] });
    },
  });
}