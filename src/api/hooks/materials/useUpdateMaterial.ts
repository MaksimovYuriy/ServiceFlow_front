import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateMaterial, type Material, type UpdateMaterialPayload } from "../../materials";

export function useUpdateMaterial() {
  const queryClient = useQueryClient();

  return useMutation<Material, Error, UpdateMaterialPayload>({
    mutationFn: updateMaterial,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["materials"] });
    },
  });
}
