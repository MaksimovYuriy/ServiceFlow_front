import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createMaterial, type CreateMaterialPayload, type Material } from "../../materials";

export function useCreateMaterial() {
  const queryClient = useQueryClient();

  return useMutation<Material, Error, CreateMaterialPayload>({
    mutationFn: createMaterial,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["materials"] });
    },
  });
}
