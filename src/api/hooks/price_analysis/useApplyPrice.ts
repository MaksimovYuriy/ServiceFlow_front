import { useMutation, useQueryClient } from "@tanstack/react-query";
import { applyServicePrice } from "../../price_analysis";

export function useApplyPrice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ serviceId, price }: { serviceId: number; price: number }) =>
      applyServicePrice(serviceId, price),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
  });
}
