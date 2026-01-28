import { useMemo } from "react";
import { useServiceMaterials } from "./useServiceMaterials";
import { useCreateServiceMaterial } from "./useCreateServiceMaterial";
import { useUpdateServiceMaterial } from "./useUpdateServiceMaterial";
import { useDeleteServiceMaterial } from "./useDeleteServiceMaterial";


export const useServiceMaterialPage = (serviceId: number) => {
  const { data = [], isLoading } = useServiceMaterials(serviceId);
  const create = useCreateServiceMaterial();
  const update = useUpdateServiceMaterial();
  const remove = useDeleteServiceMaterial(serviceId);

  const rows = useMemo(() => data.map((m: any) => ({
    id: Number(m.id),
    material_id: m.attributes.material_id,
    required_quantity: m.attributes.required_quantity,
    material_title: m.attributes.material_title,
  })), [data]);

  return {
    rows,
    isLoading,
    create,
    update,
    remove,
  };
};
