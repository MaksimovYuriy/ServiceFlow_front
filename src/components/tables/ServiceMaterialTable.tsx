import {
  Box, Button, Stack, Typography, TextField, IconButton
} from "@mui/material";
import {
  DataGrid, type GridColDef, type GridRenderCellParams
} from "@mui/x-data-grid";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { useMemo, useState } from "react";
import type { ServiceMaterialRow } from "../../types/serviceMaterial";

type Props = {
  rows: ServiceMaterialRow[];
  loading: boolean;
  onUpdate: (id: number, amount: number) => Promise<void>;
  onDelete: (id: number) => void;
};

export const ServiceMaterialTable = ({
  rows,
  loading,
  onUpdate,
  onDelete,
}: Props) => {
  const [editingRowId, setEditingRowId] = useState<number | null>(null);
  const [amount, setAmount] = useState(1);

  const columns = useMemo<GridColDef[]>(() => [
    {
      field: "material_title",
      headerName: "Материал",
      flex: 1,
    },
    {
      field: "required_quantity",
      headerName: "Расход",
      flex: 1,
      renderCell: (params: GridRenderCellParams<ServiceMaterialRow>) => {
        const isEditing = editingRowId === params.row.id;

        if (!isEditing) {
          return (
            <Typography
              sx={{ cursor: "pointer" }}
              onClick={() => {
                setEditingRowId(params.row.id);
                setAmount(params.row.required_quantity);
              }}
            >
              {params.value}
            </Typography>
          );
        }

        return (
          <Stack direction="row" spacing={1}>
            <TextField
              size="small"
              type="number"
              value={amount}
              onChange={(e) => setAmount(+e.target.value)}
              sx={{ width: 80 }}
              autoFocus
            />
            <IconButton
              onClick={async () => {
                await onUpdate(params.row.id, amount);
                setEditingRowId(null);
              }}
            >
              <CheckIcon />
            </IconButton>
            <IconButton onClick={() => setEditingRowId(null)}>
              <CloseIcon />
            </IconButton>
          </Stack>
        );
      },
    },
    {
      field: "actions",
      headerName: "Действия",
      flex: 0.5,
      renderCell: (params) => (
        <Button
          size="small"
          color="error"
          onClick={() => onDelete(params.row.id)}
        >
          Удалить
        </Button>
      ),
    },
  ], [editingRowId, amount, onDelete, onUpdate]);

  return (
    <Box sx={{ mt: 2, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        loading={loading}
        autoHeight
        disableRowSelectionOnClick
      />
    </Box>
  );
};
