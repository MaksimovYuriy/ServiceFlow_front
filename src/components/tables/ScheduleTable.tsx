import { Box, Button, Typography, Stack } from "@mui/material";
import { DataGrid, type GridColDef, type GridRenderCellParams } from "@mui/x-data-grid";

export interface ScheduleRow {
  id: number;       // id интервала
  weekday: number;  // 0-6
  start_time: string;
  end_time: string;
}

type Props = {
  rows: ScheduleRow[];
  loading: boolean;
  onDelete: (id: number) => void;
};

const weekdays: Record<number, string> = {
  1: "Понедельник",
  2: "Вторник",
  3: "Среда",
  4: "Четверг",
  5: "Пятница",
  6: "Суббота",
  0: "Воскресенье",
};

const weekdayOrder = [1, 2, 3, 4, 5, 6, 0];

export const ScheduleTable = ({ rows, loading, onDelete }: Props) => {
  // Группируем интервалы по дню недели
  const rowsByDay = weekdayOrder.map((dayNum) => {
    const dayRows = rows.filter(r => r.weekday === dayNum);
    return {
      id: dayNum,
      day: weekdays[dayNum],
      intervals: dayRows,
    };
  });

  const columns: GridColDef[] = [
    {
      field: "day",
      headerName: "День недели",
      flex: 1,
      renderCell: (params: GridRenderCellParams) => <Typography>{params.value}</Typography>,
    },
    {
      field: "intervals",
      headerName: "Интервалы",
      flex: 2,
      sortable: false,
      filterable: false,
      renderCell: (params: GridRenderCellParams<{ intervals: ScheduleRow[] }>) => (
        <Stack spacing={1}>
          {params.row.intervals.map((i: ScheduleRow) => (
            <Stack key={i.id} direction="row" spacing={1} alignItems="center">
              <Typography>{`${i.start_time}–${i.end_time}`}</Typography>
              <Button
                size="small"
                color="error"
                variant="outlined"
                onClick={() => onDelete(i.id)}
              >
                Удалить
              </Button>
            </Stack>
          ))}
        </Stack>
      ),
    },
  ];

  return (
    <Box mt={2} sx={{ width: "100%" }}>
      <DataGrid
        rows={rowsByDay}
        columns={columns}
        loading={loading}
        autoHeight
        disableRowSelectionOnClick
      />
    </Box>
  );
};
