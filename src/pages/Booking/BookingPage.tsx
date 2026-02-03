import { Box, FormControl, Select, MenuItem, InputLabel, Paper, Typography, Button } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import theme from "../../theme";
import { useServices } from "../../api/hooks/services/useServices";
import { useMastersByService } from "../../api/hooks/masters/useMasterByService";
import type { Slot } from "../../api/masters";
import { useMasterAvailableDates } from "../../api/hooks/masters/useMasterAvailableDates";
import { useMasterAvailableSlots } from "../../api/hooks/masters/useMasterAvailableSlots";
import { useCreateNote } from "../../api/hooks/notes/useCreateNote";

export function BookingPage() {
  const navigate = useNavigate();

  // Выбор услуги и мастера
  const [selectedServiceId, setSelectedServiceId] = useState<number | "">("");
  const [selectedMasterId, setSelectedMasterId] = useState<number | "">("");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);

  // Пока клиент оставим заглушкой (будет форма позже)
  const clientId = 1; // TODO: заменить на реальный client_id

  // Данные по услугам
  const { data: services = [], isLoading: servicesLoading } = useServices();

  // Данные по мастерам для выбранной услуги
  const { data: masters = [], isLoading: mastersLoading } = useMastersByService(Number(selectedServiceId));

  const { data: availableDates = [], isLoading: datesLoading } =
    useMasterAvailableDates(Number(selectedMasterId));

  const { data: availableSlots = [], isLoading: slotsLoading } =
    useMasterAvailableSlots(Number(selectedMasterId), selectedDate);

  const createNoteMutation = useCreateNote();

  const toLogin = () => navigate("/login");

  const handleConfirm = () => {
    if (!selectedMasterId || !selectedServiceId || !selectedDate || !selectedSlot || !clientId) return;

    const payload = {
      master_id: selectedMasterId,
      service_id: selectedServiceId,
      client_id: clientId,
      start_at: new Date(`${selectedDate}T${selectedSlot.start_time}`).toISOString(),
      end_at: new Date(`${selectedDate}T${selectedSlot.end_time}`).toISOString(),
    };

    createNoteMutation.mutate(payload, {
      onSuccess: (data) => {
        console.log("Запись создана:", data);
        setSelectedDate(null);
        setSelectedSlot(null);
      },
      onError: (err) => {
        console.error("Ошибка при создании записи:", err);
      },
    });
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Paper sx={{ p: 3, minWidth: '100vh', display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography variant="h5" component="h1" textAlign="center" mb={2}>
          Запись в наш центр
        </Typography>

        {/* Селект услуг */}
        <FormControl variant="standard" sx={{ m: 1, minWidth: '100%' }}>
          <InputLabel id="service-label">Выберите услугу</InputLabel>
          <Select
            labelId="service-label"
            value={selectedServiceId}
            onChange={(e) => {
              setSelectedServiceId(Number(e.target.value));
              setSelectedMasterId(""); // сброс выбора мастера при смене услуги
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
        <FormControl variant="standard" sx={{ m: 1, minWidth: '100%' }}>
          <InputLabel id="master-label">Выберите мастера</InputLabel>
          <Select
            labelId="master-label"
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

        <FormControl
          variant="standard"
          sx={{ m: 1, minWidth: "100%" }}
          disabled={!selectedMasterId || datesLoading}
        >
          <InputLabel id="date-label">Выберите дату</InputLabel>
          <Select
            labelId="date-label"
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
          <Box sx={{ m: 1 }}>
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
                      variant={
                        selectedSlot?.start_time === slot.start_time
                          ? "contained"
                          : "outlined"
                      }
                      onClick={() => setSelectedSlot(slot)}
                    >
                      {slot.start_time} – {slot.end_time}
                    </Button>
                  ))}
            </Box>
          </Box>
        )}

        {selectedDate && selectedSlot && (
          <Box sx={{ mt: 2 }}>
            <Button
              type="button"
              variant="contained"
              color="primary"
              disabled={!selectedMasterId || !selectedDate || !selectedSlot}
              onClick={handleConfirm}
              sx={{ width: "100%" }}
            >
              Подтвердить
            </Button>
          </Box>
        )}
      </Paper>

      {/* Кнопка входа */}
      <Button
        type="button"
        onClick={toLogin}
        sx={{ backgroundColor: theme.palette.secondary.light }}
      >
        Вход сотрудника
      </Button>
    </Box>
  );
}

export default BookingPage;
