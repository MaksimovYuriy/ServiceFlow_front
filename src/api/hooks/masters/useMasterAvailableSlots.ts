import { useQuery } from "@tanstack/react-query";
import { fetchAvailableSlots, type Slot } from "../../masters";

export function useMasterAvailableSlots(masterId?: number, date?: string | null) {
  return useQuery<Slot[], Error>({
    queryKey: ["masters", masterId, "available_slots", date],
    queryFn: () => fetchAvailableSlots(masterId!, date!),
    enabled: Boolean(masterId && date),
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false,
  });
}
