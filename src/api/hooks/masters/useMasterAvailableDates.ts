import { useQuery } from "@tanstack/react-query";
import { fetchAvailableDates } from "../../masters";

export function useMasterAvailableDates(masterId?: number) {
  return useQuery<string[], Error>({
    queryKey: ["masters", masterId, "available_dates"],
    queryFn: () => fetchAvailableDates(masterId!),
    enabled: Boolean(masterId),
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false,
  });
}
