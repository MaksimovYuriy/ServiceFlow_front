import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Stack,
} from "@mui/material";

interface CreateScheduleDialogProps {
  open: boolean;
  masterId: number;
  onClose: () => void;
  onSubmit: (payload: { weekday: number; start_time: string; end_time: string }) => void;
}

export const CreateScheduleDialog: React.FC<CreateScheduleDialogProps> = ({
  open,
  onClose,
  onSubmit,
}) => {
  const [weekday, setWeekday] = useState<number>(1);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("13:00");

  const handleSubmit = () => {
    onSubmit({ weekday, start_time: startTime, end_time: endTime });
    // диалог закроется в page hook через onSuccess
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Добавить интервал</DialogTitle>
      <DialogContent sx={{ mt: 1 }}>
        <Stack spacing={2}>
          <FormControl fullWidth>
            <InputLabel>День недели</InputLabel>
            <Select
              value={weekday}
              label="День недели"
              onChange={(e) => setWeekday(Number(e.target.value))}
            >
              <MenuItem value={1}>Понедельник</MenuItem>
              <MenuItem value={2}>Вторник</MenuItem>
              <MenuItem value={3}>Среда</MenuItem>
              <MenuItem value={4}>Четверг</MenuItem>
              <MenuItem value={5}>Пятница</MenuItem>
              <MenuItem value={6}>Суббота</MenuItem>
              <MenuItem value={7}>Воскресенье</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Время начала"
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            label="Время окончания"
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Отмена</Button>
        <Button variant="contained" onClick={handleSubmit}>
          Добавить
        </Button>
      </DialogActions>
    </Dialog>
  );
};
