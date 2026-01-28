import { useMemo } from "react";
import type { ServiceMasterRow } from "../../../types/serviceMaster";
import { useCreateServiceMaster } from "./useCreateServiceMaster";
import { useDeleteServiceMaster } from "./useDeleteServiceMaster";
import { useServiceMasters } from "./useServiceMasters";

export const useServiceMasterPage = (serviceId: number) => {
  const { data = [], isLoading } = useServiceMasters(serviceId);
  const create = useCreateServiceMaster();
  const remove = useDeleteServiceMaster(serviceId);

  const rows: ServiceMasterRow[] = useMemo(
    () =>
      data.map((m: any) => ({
        id: Number(m.id),
        master_id: Number(m.attributes.master_id),
        master_name: m.attributes.master_name,
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
