import { Autocomplete, TextField } from "@mui/material";

interface MasterSelectProps {
  value: number | "";
  masters: { id: number; name: string }[];
  loading?: boolean;
  onChange: (id: number) => void;
}

export const MasterSelect = ({ value, masters, loading, onChange }: MasterSelectProps) => {
  const selected = masters.find((m) => m.id === value) ?? null;

  return (
    <Autocomplete
      options={masters}
      getOptionLabel={(option) => option.name}
      value={selected}
      loading={loading}
      onChange={(_e, newValue) => {
        if (newValue) onChange(newValue.id);
      }}
      renderInput={(params) => (
        <TextField {...params} label="Мастер" />
      )}
      isOptionEqualToValue={(option, val) => option.id === val.id}
    />
  );
};
