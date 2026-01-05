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

export interface CreateMasterForm {
  first_name: string;
  middle_name: string;
  last_name: string;
  phone: string;
  salary: number;
  active: boolean;
}

interface CreateMasterModalProps {
  open: boolean;
  form: CreateMasterForm;
  onClose: () => void;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
}

const CreateServiceDialog: FC<CreateMasterModalProps> = ({
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
          label="First Name"
          name="first_name"
          value={form.first_name}
          onChange={onChange}
          fullWidth
        />

        <TextField
          label="Middle Name"
          name="middle_name"
          value={form.middle_name}
          onChange={onChange}
          fullWidth
        />

        <TextField
          label="Last Name"
          name="last_name"
          value={form.last_name}
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
          label="Salary"
          name="salary"
          value={form.salary}
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
