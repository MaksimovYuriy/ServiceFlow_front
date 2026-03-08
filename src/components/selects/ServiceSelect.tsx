import { Autocomplete, TextField } from "@mui/material";

interface ServiceSelectProps {
  value: number | "" | null;
  services: { id: number; title: string }[];
  loading?: boolean;
  onChange: (id: number) => void;
}

export const ServiceSelect = ({ value, services, loading, onChange }: ServiceSelectProps) => {
  const selected = services.find((s) => s.id === value) ?? null;

  return (
    <Autocomplete
      options={services}
      getOptionLabel={(option) => option.title}
      value={selected}
      loading={loading}
      onChange={(_e, newValue) => {
        if (newValue) onChange(newValue.id);
      }}
      renderInput={(params) => (
        <TextField {...params} label="Услуга" />
      )}
      isOptionEqualToValue={(option, val) => option.id === val.id}
    />
  );
};
