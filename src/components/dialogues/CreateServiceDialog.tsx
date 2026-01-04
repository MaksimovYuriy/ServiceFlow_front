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

export interface CreateServiceForm {
  title: string;
  description: string;
  duration: string;
  price: number;
  active: boolean;
}

interface CreateServiceModalProps {
  open: boolean;
  form: CreateServiceForm;
  onClose: () => void;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
}

const CreateServiceDialog: FC<CreateServiceModalProps> = ({
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
          label="Description"
          name="description"
          value={form.description}
          onChange={onChange}
          fullWidth
        />

        <TextField
          label="Duration"
          name="duration"
          value={form.duration}
          onChange={onChange}
          fullWidth
        />

        <TextField
          label="Price"
          name="price"
          value={form.price}
          onChange={onChange}
          fullWidth
        />

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <input
            type="checkbox"
            name="active"
            checked={form.active}
            onChange={onChange}
          />
          <span>Active</span>
        </Box>
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
