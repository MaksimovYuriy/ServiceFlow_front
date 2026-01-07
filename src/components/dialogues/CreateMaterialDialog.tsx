import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box
} from "@mui/material";
import type { FC, ChangeEvent } from "react";

export interface CreateMaterialForm {
  title: string,
  quantity: number,
  minimal_quantity: number
}

interface CreateMaterialModalProps {
  open: boolean;
  form: CreateMaterialForm;
  onClose: () => void;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
}

const CreateServiceDialog: FC<CreateMaterialModalProps> = ({
  open,
  form,
  onClose,
  onChange,
  onSubmit
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Создать пользователя</DialogTitle>

      <DialogContent
        sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
      >
        <TextField
          label="Title"
          name="title"
          value={form.title}
          onChange={onChange}
          fullWidth
        />

        <TextField
          label="Quantity"
          name="quantity"
          value={form.quantity}
          onChange={onChange}
          fullWidth
        />

        <TextField
          label="Minimal Qunatity (Alert)"
          name="minimal_quantity"
          value={form.minimal_quantity}
          onChange={onChange}
          fullWidth
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Отмена</Button>
        <Button variant="contained" onClick={onSubmit}>
          Создать
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateServiceDialog;
