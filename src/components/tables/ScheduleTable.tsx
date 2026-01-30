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

const weekdays = ["Воскресенье","Понедельник","Вторник","Среда","Четверг","Пятница","Суббота"];

export const ScheduleTable = ({ rows, loading, onDelete }: Props) => {
  // Группируем интервалы по дню недели
  const rowsByDay = weekdays.map((day, index) => {
    const dayRows = rows.filter(r => r.weekday === index);
    return {
      id: index,
      day,
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
