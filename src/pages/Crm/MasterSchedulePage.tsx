import React, { useState, useCallback } from "react";
import { Box, Paper, Stack, Typography, Button } from "@mui/material";
import { AdminLayout } from "../../components/layouts/AdminLayout";
import { useMasters } from "../../api/hooks/masters/useMasters";
import { MasterSelect } from "../../components/selects/MasterSelect";
import { ScheduleTable } from "../../components/tables/ScheduleTable";
import { CreateScheduleDialog } from "../../components/dialogues/CreateScheduleDialog";
import { useMasterSchedulesPage } from "../../api/hooks/master_schedules/useMasterSchedulesPage";
import { useSnackbar } from "../../context/SnackbarContext";

const MasterSchedulePage = () => {
  const [selectedMasterId, setSelectedMasterId] = useState<number | "">("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const { showSnackbar } = useSnackbar();

  const { data: mastersData = [] } = useMasters();
  const masters = mastersData.map(m => ({ id: Number(m.id), name: m.full_name }));

  const { rows, isLoading, create, remove } = useMasterSchedulesPage(Number(selectedMasterId));

  const handleDelete = useCallback((id: number) => remove.mutate(id), [remove]);

  // ===== Новое: handleCreate принимает payload =====
  const handleCreate = useCallback(
    (payload: { weekday: number; start_time: string; end_time: string }) => {
      create.mutate(payload, {
        onSuccess: () => {
          setDialogOpen(false);
          showSnackbar("Интервал добавлен", "success");
        },
      });
    },
    [create]
  );

  return (
    <AdminLayout>
        <Paper sx={{ p: 2, mb: 3 }}>
          <MasterSelect
            value={selectedMasterId}
            masters={masters}
            onChange={setSelectedMasterId}
          />
        </Paper>

        {selectedMasterId ? (
          <Paper sx={{ width: "100%", p: 2 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">Расписание мастера</Typography>
              <Button
                variant="contained"
                onClick={() => setDialogOpen(true)}
                disabled={isLoading}
              >
                Добавить интервал
              </Button>
            </Stack>

            <ScheduleTable rows={rows} loading={isLoading} onDelete={handleDelete} />
          </Paper>
        ) : (
          <Box sx={{ py: 6, textAlign: "center", color: "text.secondary" }}>
            <Typography>Выберите мастера, чтобы увидеть его расписание</Typography>
          </Box>
        )}

        <CreateScheduleDialog
          open={dialogOpen}
          masterId={Number(selectedMasterId)}
          onClose={() => setDialogOpen(false)}
          onSubmit={handleCreate}
        />
    </AdminLayout>
  );
};

export default MasterSchedulePage;
