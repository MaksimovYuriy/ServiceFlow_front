import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";

interface MasterSelectProps {
  value: number | "";
  masters: { id: number; name: string }[];
  loading?: boolean;
  onChange: (id: number) => void;
}

export const MasterSelect = ({ value, masters, loading, onChange }: MasterSelectProps) => (
  <FormControl fullWidth>
    <InputLabel>Мастер</InputLabel>
    <Select
      value={value}
      label="Мастер"
      onChange={(e) => onChange(+e.target.value)}
    >
      <MenuItem value="">
        <em>Выберите мастера</em>
      </MenuItem>
      {loading
        ? <MenuItem disabled>Загрузка...</MenuItem>
        : masters.map((m) => (
            <MenuItem key={m.id} value={m.id}>{m.name}</MenuItem>
          ))}
    </Select>
  </FormControl>
);
