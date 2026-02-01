import { Box, FormControl, Select, MenuItem, InputLabel, Paper, Typography, Button } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import theme from "../../theme";
import { useServices } from "../../api/hooks/services/useServices";
import { useMastersByService } from "../../api/hooks/masters/useMasterByService";

export function BookingPage() {
  const navigate = useNavigate();

  // Выбор услуги и мастера
  const [selectedServiceId, setSelectedServiceId] = useState<number | "">("");
  const [selectedMasterId, setSelectedMasterId] = useState<number | "">("");

  // Данные по услугам
  const { data: services = [], isLoading: servicesLoading } = useServices();

  // Данные по мастерам для выбранной услуги
  const { data: masters = [], isLoading: mastersLoading } = useMastersByService(Number(selectedServiceId));

  const toLogin = () => navigate("/login");

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
            onChange={(e) => setSelectedMasterId(Number(e.target.value))}
            disabled={!selectedServiceId || mastersLoading}
          >
            {masters.map((master) => (
              <MenuItem key={master.id} value={master.id}>
                {master.full_name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
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
