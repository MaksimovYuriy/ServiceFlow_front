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

export interface CreateUserForm {
  email: string;
  phone: string;
  active: boolean;
  password: string;
  password_confirmation: string;
}

interface CreateUserModalProps {
  open: boolean;
  form: CreateUserForm;
  onClose: () => void;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
}

const CreateUserDialog: FC<CreateUserModalProps> = ({
  open,
  form,
  onClose,
  onChange,
  onSubmit
}) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Создать пользователя</DialogTitle>

      <DialogContent
        sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
      >
        <TextField
          label="Email"
          name="email"
          value={form.email}
          onChange={onChange}
          fullWidth
        />

        <TextField
          label="Phone"
          name="phone"
          value={form.phone}
          onChange={onChange}
          fullWidth
        />

        <TextField
          label="Password"
          type="password"
          name="password"
          value={form.password}
          onChange={onChange}
          fullWidth
        />

        <TextField
          label="Password Confirmation"
          type="password"
          name="password_confirmation"
          value={form.password_confirmation}
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

export default CreateUserDialog;
