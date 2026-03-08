import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Typography,
  Button,
  CircularProgress,
  Select,
} from "@mui/material";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { useState, useMemo } from "react";
import { AdminLayout } from "../../components/layouts/AdminLayout";
import { generateNextDates } from "../../lib/generateDates";
import { useNotesByDate } from "../../api/hooks/notes/useNotesByDate";
import { useCompleteNote } from "../../api/hooks/notes/useCompleteNote";
import { useCancelNote } from "../../api/hooks/notes/useCancelNote";
import { useSnackbar } from "../../context/SnackbarContext";

const NotesManagmentPage = () => {
  const dateOptions = generateNextDates(14);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const { showSnackbar } = useSnackbar();

  const { data: notes = [], isLoading, isError } = useNotesByDate(selectedDate || null);

  const completeNoteMutation = useCompleteNote();
  const cancelNoteMutation = useCancelNote();

  const handleComplete = (id: number) => {
    completeNoteMutation.mutate(id, {
      onSuccess: () => showSnackbar("Запись подтверждена", "success"),
    });
  };

  const handleCancel = (id: number) => {
    cancelNoteMutation.mutate(id, {
      onSuccess: () => showSnackbar("Запись отменена", "success"),
    });
  };

  const columns: GridColDef[] = useMemo(() => [
    { field: "client_name", headerName: "Клиент", flex: 1 },
    { field: "service_title", headerName: "Услуга", flex: 1 },
    { field: "master_name", headerName: "Мастер", flex: 1 },
    { field: "time", headerName: "Время", flex: 0.6 },
    { field: "total_price", headerName: "Цена, ₽", flex: 0.6 },
    { field: "status", headerName: "Статус", flex: 1 },
    {
      field: "actions",
      headerName: "Действия",
      flex: 1,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        const isPending = params.row.status === "pending";

        return (
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              size="small"
              variant="contained"
              color="success"
              disabled={!isPending}
              onClick={() => handleComplete(params.row.id)}
            >
              Подтвердить
            </Button>
            <Button
              size="small"
              variant="outlined"
              color="error"
              disabled={!isPending}
              onClick={() => handleCancel(params.row.id)}
            >
              Отменить
            </Button>
          </Box>
        );
      },
    },
  ], [completeNoteMutation, cancelNoteMutation]);

  return (
    <AdminLayout>
        <Typography variant="h5" mb={2}>
          Управление записями
        </Typography>

        <FormControl sx={{ minWidth: 240, mb: 3 }}>
          <InputLabel id="date-label">Дата</InputLabel>
          <Select
            labelId="date-label"
            value={selectedDate}
            label="Дата"
            onChange={(e) => setSelectedDate(e.target.value)}
          >
            {dateOptions.map((date) => (
              <MenuItem key={date.value} value={date.value}>
                {date.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Paper sx={{ width: "100%", height: 500 }}>
          {!selectedDate && (
            <Box
              sx={{
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "text.secondary",
              }}
            >
              Выберите дату
            </Box>
          )}

          {selectedDate && isLoading && (
            <Box sx={{ p: 3, textAlign: "center" }}>
              <CircularProgress />
            </Box>
          )}

          {selectedDate && !isLoading && !isError && (
            <DataGrid
              rows={notes}
              columns={columns}
              hideFooter
              disableRowSelectionOnClick
              sx={{ width: "100%" }}
            />
          )}

          {selectedDate && isError && (
            <Box sx={{ p: 3, color: "error.main" }}>
              Ошибка загрузки записей
            </Box>
          )}
        </Paper>
    </AdminLayout>
  );
};

export default NotesManagmentPage;
