import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem
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
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Добавить трату материала</DialogTitle>

      <DialogContent
        sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
      >
        <FormControl fullWidth>
          <InputLabel>Материал</InputLabel>
          <Select
            label="Материал"
            name="material_id"
            value={form.material_id}
            onChange={onChange as any}
          >
            {materials.map((material) => (
              <MenuItem key={material.id} value={material.id}>
                {material.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

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
