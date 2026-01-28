import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import type { FC, ChangeEvent } from "react";
import type { CreateServiceMasterForm } from "../../types/serviceMaster";

interface Master {
  id: number;
  name: string;
}

interface CreateServiceMasterDialogProps {
  open: boolean;
  form: CreateServiceMasterForm;
  masters: Master[];
  onClose: () => void;
  onChange: (e: ChangeEvent<{ name?: string; value: unknown }>) => void;
  onSubmit: () => void;
}

const CreateServiceMasterDialog: FC<CreateServiceMasterDialogProps> = ({
  open,
  form,
  masters,
  onClose,
  onChange,
  onSubmit,
}) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Добавить мастера</DialogTitle>

      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1, width: "100%" }}>
        <FormControl fullWidth>
          <InputLabel>Мастер</InputLabel>
          <Select
            label="Мастер"
            name="master_id"
            value={form.master_id}
            onChange={onChange as any}
            sx={{width: '100%'}}
          >
            {masters.map((m) => (
              <MenuItem key={m.id} value={m.id}>
                {m.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Отмена</Button>
        <Button
          variant="contained"
          onClick={onSubmit}
          disabled={!form.master_id}
        >
          Добавить
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateServiceMasterDialog;
