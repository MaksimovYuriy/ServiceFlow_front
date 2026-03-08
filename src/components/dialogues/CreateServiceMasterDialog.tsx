import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Autocomplete,
  TextField,
} from "@mui/material";
import { useState, type FC } from "react";

interface Master {
  id: number;
  name: string;
}

interface CreateServiceMasterDialogProps {
  open: boolean;
  form: { master_id: number | "" };
  masters: Master[];
  onClose: () => void;
  onChange: (e: { target: { name: string; value: unknown } }) => void;
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
  const selected = masters.find((m) => m.id === form.master_id) ?? null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Добавить мастера</DialogTitle>

      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
        <Autocomplete
          options={masters}
          getOptionLabel={(option) => option.name}
          value={selected}
          onChange={(_e, newValue) => {
            onChange({ target: { name: "master_id", value: newValue?.id ?? "" } });
          }}
          renderInput={(params) => <TextField {...params} label="Мастер" />}
          isOptionEqualToValue={(option, val) => option.id === val.id}
        />
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
