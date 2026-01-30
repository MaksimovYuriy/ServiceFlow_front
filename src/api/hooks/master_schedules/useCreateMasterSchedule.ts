import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createMasterSchedule, type CreateMasterSchedulePayload } from "../../master_shedules";

export function useCreateMasterSchedule(masterId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateMasterSchedulePayload) => createMasterSchedule(masterId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["master_schedules", masterId] });

    },
  });
}
