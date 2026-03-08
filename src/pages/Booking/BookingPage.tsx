import { Box, FormControl, Select, MenuItem, InputLabel, Paper, Typography, Button, TextField } from "@mui/material";
import { PublicLayout } from "../../components/layouts/PublicLayout";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useServices } from "../../api/hooks/services/useServices";
import { useMastersByService } from "../../api/hooks/masters/useMasterByService";
import type { Slot } from "../../api/masters";
import { useMasterAvailableDates } from "../../api/hooks/masters/useMasterAvailableDates";
import { useMasterAvailableSlots } from "../../api/hooks/masters/useMasterAvailableSlots";
import { useCreateNote } from "../../api/hooks/notes/useCreateNote";
import { useSnackbar } from "../../context/SnackbarContext";

export function BookingPage() {
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();

  const [selectedServiceId, setSelectedServiceId] = useState<number | "">("");
  const [selectedMasterId, setSelectedMasterId] = useState<number | "">("");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);

  const [clientFullName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientTelegram, setClientTelegram] = useState("");

  const { data: services = [], isLoading: servicesLoading } = useServices();
  const { data: masters = [], isLoading: mastersLoading } = useMastersByService(Number(selectedServiceId));
  const { data: availableDates = [], isLoading: datesLoading } =
    useMasterAvailableDates(Number(selectedMasterId));
  const { data: availableSlots = [], isLoading: slotsLoading } =
    useMasterAvailableSlots(Number(selectedMasterId), selectedDate);

  const createNoteMutation = useCreateNote();

  const handleConfirm = () => {
    if (
      !selectedMasterId ||
      !selectedServiceId ||
      !selectedDate ||
      !selectedSlot ||
      !clientFullName ||
      !clientPhone
    ) {
      return;
    }

    const payload = {
      master_id: selectedMasterId,
      service_id: selectedServiceId,
      client: {
        full_name: clientFullName,
        phone: clientPhone,
        telegram: clientTelegram || null,
      },
      start_at: `${selectedDate}T${selectedSlot.start_time}`,
      end_at: `${selectedDate}T${selectedSlot.end_time}`
    };

    createNoteMutation.mutate(payload, {
      onSuccess: () => {
        showSnackbar("Запись успешно создана!", "success");
        setSelectedDate(null);
        setSelectedSlot(null);
        setClientName("");
        setClientPhone("");
        setClientTelegram("");
      },
    });
  };

  return (
    <PublicLayout>
      <Paper sx={{ p: 3, maxWidth: 600, width: "100%", display: "flex", flexDirection: "column", gap: 2 }}>
        <Typography variant="h5" component="h1" textAlign="center" mb={2}>
          Запись в наш центр
        </Typography>

        {/* Селект услуг */}
        <FormControl fullWidth>
          <InputLabel id="service-label">Выберите услугу</InputLabel>
          <Select
            labelId="service-label"
            label="Выберите услугу"
            value={selectedServiceId}
            onChange={(e) => {
              setSelectedServiceId(Number(e.target.value));
              setSelectedMasterId("");
              setSelectedDate(null);
              setSelectedSlot(null);
            }}
            disabled={servicesLoading}
          >
            {services.map((service) => (
              <MenuItem key={service.id} value={service.id}>
                {service.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Селект мастеров */}
        <FormControl fullWidth>
          <InputLabel id="master-label">Выберите мастера</InputLabel>
          <Select
            labelId="master-label"
            label="Выберите мастера"
            value={selectedMasterId}
            onChange={(e) => {
              setSelectedMasterId(Number(e.target.value));
              setSelectedDate(null);
              setSelectedSlot(null);
            }}
            disabled={!selectedServiceId || mastersLoading}
          >
            {masters.map((master) => (
              <MenuItem key={master.id} value={master.id}>
                {master.full_name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Селект даты */}
        <FormControl fullWidth disabled={!selectedMasterId || datesLoading}>
          <InputLabel id="date-label">Выберите дату</InputLabel>
          <Select
            labelId="date-label"
            label="Выберите дату"
            value={selectedDate ?? ""}
            onChange={(e) => {
              setSelectedDate(e.target.value);
              setSelectedSlot(null);
            }}
          >
            {availableDates.map((date) => (
              <MenuItem key={date} value={date}>
                {date}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {selectedDate && (
          <Box>
            <Typography variant="subtitle1" mb={1}>
              Выберите время
            </Typography>

            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              {slotsLoading
                ? Array.from({ length: 3 }).map((_, i) => (
                    <Button key={i} variant="outlined" disabled>
                      ...
                    </Button>
                  ))
                : availableSlots.map((slot) => (
                    <Button
                      key={`${slot.start_time}-${slot.end_time}`}
                      size="small"
                      variant={
                        selectedSlot?.start_time === slot.start_time
                          ? "contained"
                          : "outlined"
                      }
                      onClick={() => setSelectedSlot(slot)}
                      sx={{ px: 2, py: 1 }}
                    >
                      {slot.start_time} – {slot.end_time}
                    </Button>
                  ))}
            </Box>
          </Box>
        )}

        {selectedDate && selectedSlot && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Typography variant="subtitle1">
              Данные клиента
            </Typography>

            <TextField
              label="Имя"
              value={clientFullName}
              onChange={(e) => setClientName(e.target.value)}
              required
              fullWidth
            />

            <TextField
              label="Номер телефона"
              value={clientPhone}
              onChange={(e) => setClientPhone(e.target.value)}
              required
              fullWidth
            />

            <TextField
              label="Telegram (необязательно)"
              value={clientTelegram}
              onChange={(e) => setClientTelegram(e.target.value)}
              placeholder="@username"
              fullWidth
            />
          </Box>
        )}

        {selectedDate && selectedSlot && (
          <Button
            type="button"
            variant="contained"
            color="primary"
            disabled={!selectedMasterId || !selectedDate || !selectedSlot}
            onClick={handleConfirm}
            fullWidth
          >
            Подтвердить
          </Button>
        )}

        <Button
          variant="text"
          color="inherit"
          type="button"
          onClick={() => navigate("/login")}
          sx={{ fontSize: "0.75rem", alignSelf: "center", mt: 2 }}
        >
          Вход сотрудника
        </Button>
      </Paper>
    </PublicLayout>
  );
}

export default BookingPage;
