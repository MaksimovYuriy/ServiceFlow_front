import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Autocomplete,
} from "@mui/material";
import type { FC, ChangeEvent } from "react";

interface Material {
  id: number;
  title: string;
}

export interface CreateServiceMaterialForm {
  material_id: number | "";
  required_quantity: number;
}

interface CreateServiceMaterialDialogProps {
  open: boolean;
  form: CreateServiceMaterialForm;
  materials: Material[];
  onClose: () => void;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
}

const CreateServiceMaterialDialog: FC<CreateServiceMaterialDialogProps> = ({
  open,
  form,
  materials,
  onClose,
  onChange,
  onSubmit
}) => {
  const selected = materials.find((m) => m.id === form.material_id) ?? null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Добавить трату материала</DialogTitle>

      <DialogContent
        sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
      >
        <Autocomplete
          options={materials}
          getOptionLabel={(option) => option.title}
          value={selected}
          onChange={(_e, newValue) => {
            const syntheticEvent = {
              target: { name: "material_id", value: String(newValue?.id ?? "") },
            } as ChangeEvent<HTMLInputElement>;
            onChange(syntheticEvent);
          }}
          renderInput={(params) => <TextField {...params} label="Материал" />}
          isOptionEqualToValue={(option, val) => option.id === val.id}
        />

        <TextField
          label="Количество"
          name="required_quantity"
          type="number"
          value={form.required_quantity}
          onChange={onChange}
          fullWidth
          inputProps={{ min: 0 }}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Отмена</Button>
        <Button
          variant="contained"
          onClick={onSubmit}
          disabled={!form.material_id || !form.required_quantity}
        >
          Добавить
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateServiceMaterialDialog;
