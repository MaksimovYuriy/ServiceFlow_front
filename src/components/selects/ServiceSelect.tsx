import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";

export const ServiceSelect = ({
  value,
  services,
  loading,
  onChange,
}: any) => (
  <FormControl fullWidth>
    <InputLabel>Услуга</InputLabel>
    <Select
      value={value}
      label="Услуга"
      onChange={(e) => onChange(+e.target.value)}
    >
      <MenuItem value="">
        <em>Выберите услугу</em>
      </MenuItem>
      {loading
        ? <MenuItem disabled>Загрузка...</MenuItem>
        : services.map((s: any) => (
            <MenuItem key={s.id} value={s.id}>{s.title}</MenuItem>
          ))}
    </Select>
  </FormControl>
);
