import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import type { MastersData } from "../../../types/analytics";
import { AnalyticsBlock } from "./AnalyticsBlock";
import { formatPrice } from "./utils";

interface Props {
  data?: MastersData;
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
}

const columns: GridColDef[] = [
  { field: "name", headerName: "Мастер", flex: 1.5 },
  { field: "completed_notes", headerName: "Записей", flex: 0.7 },
  { field: "revenue", headerName: "Выручка", flex: 1, renderCell: (p) => formatPrice(p.value) },
  { field: "cancellation_rate", headerName: "% отмен", flex: 0.7, renderCell: (p) => `${p.value}%` },
  { field: "weekly_schedule_hours", headerName: "Часов/нед.", flex: 0.8 },
  { field: "total_booked_hours", headerName: "Отработано ч.", flex: 0.8 },
];

export function MastersBlock({ data, isLoading, isError, refetch }: Props) {
  return (
    <AnalyticsBlock title="Мастера" isLoading={isLoading} isError={isError} refetch={refetch}>
      {data && (
        <DataGrid
          rows={data.masters}
          columns={columns}
          autoHeight
          disableRowSelectionOnClick
          hideFooter={data.masters.length <= 10}
          initialState={{ sorting: { sortModel: [{ field: "revenue", sort: "desc" }] } }}
        />
      )}
    </AnalyticsBlock>
  );
}
