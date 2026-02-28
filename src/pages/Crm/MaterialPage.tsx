import { Box, Button, Paper, IconButton, Stack, TextField } from "@mui/material";
import Navbar from "../../components/Navbar";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import React, { useState } from "react";
import { useMaterials } from "../../api/hooks/materials/useMaterial";
import { useCreateMaterial } from "../../api/hooks/materials/useCreateMaterial";
import { useUpdateMaterial } from "../../api/hooks/materials/useUpdateMaterial";
import type { Material } from "../../api/materials";
import type { CreateMaterialForm } from "../../components/dialogues/CreateMaterialDialog";
import CreateMaterialDialog from "../../components/dialogues/CreateMaterialDialog";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { useAddMaterial } from "../../api/hooks/materials/operations/useAddMaterial";
import { useSubtractMaterial } from "../../api/hooks/materials/operations/useSubstractMaterial";


const getColumns = (
  editingRowId: number | null,
  setEditingRowId: (id: number | null) => void,
  actionType: "inc" | "dec" | null,
  setActionType: (type: "inc" | "dec" | null) => void,
  amount: number,
  setAmount: (value: number) => void,
  addMaterial: (payload: { material_id: number; amount: number }) => void,
  subtractMaterial: (payload: { material_id: number; amount: number }) => void
): GridColDef[] => [
  { field: "id", headerName: "ID", flex: 0.5 },
  { field: "title", headerName: "Title", flex: 1, editable: true },
  { field: "quantity", headerName: "Quantity", flex: 1 },
  { field: "minimal_quantity", headerName: "Minimal Quantity (Alert)", flex: 1, editable: true },
  { field: "price", headerName: "Price per one", flex: 1, editable: true },
  {
    field: "actions",
    headerName: "Actions",
    flex: 1.3,
    sortable: false,
    filterable: false,
    renderCell: (params) => {
      const isEditing = editingRowId === params.row.id;

      if (!isEditing) {
        return (
          <Stack direction="row" spacing={1}>
            <IconButton
              size="small"
              onClick={() => {
                setEditingRowId(params.row.id);
                setActionType("dec");
                setAmount(1);
              }}
            >
              <RemoveIcon />
            </IconButton>

            <IconButton
              size="small"
              onClick={() => {
                setEditingRowId(params.row.id);
                setActionType("inc");
                setAmount(1);
              }}
            >
              <AddIcon />
            </IconButton>
          </Stack>
        );
      }

      return (
        <Stack direction="row" spacing={1} alignItems="center">
          <TextField
            size="small"
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            sx={{ width: 80 }}
            inputProps={{ min: 1 }}
          />

          <IconButton
            size="small"
            onClick={() => {
              if (params.row.id && actionType) {
                if (actionType === "inc") addMaterial({ material_id: params.row.id, amount });
                if (actionType === "dec") subtractMaterial({ material_id: params.row.id, amount });
              }
              setEditingRowId(null);
              setActionType(null);
            }}
          >
            <CheckIcon />
          </IconButton>

          <IconButton size="small" onClick={() => setEditingRowId(null)}>
            <CloseIcon />
          </IconButton>
        </Stack>
      );
    },
  },
];

const MaterialDataGrid = React.memo(
  ({
    materials,
    loading,
    columns,
    onRowUpdate
  }: {
    materials: Material[];
    loading: boolean;
    columns: GridColDef[];
    onRowUpdate: any;
  }) => (
    <Box sx={{ display: "flex", flexDirection: "column", mt: 4 }}>
      <Paper sx={{ maxWidth: "100%", width: "100vw" }}>
        <DataGrid
          rows={materials}
          columns={columns}
          loading={loading}
          processRowUpdate={onRowUpdate}
          disableRowSelectionOnClick
          sx={{ width: "100%" }}
        />
      </Paper>
    </Box>
  )
);
MaterialDataGrid.displayName = "MaterialDataGrid";

const MaterialPage = () => {
  const { data: materials = [], isLoading } = useMaterials();
  const { mutate: createMaterial } = useCreateMaterial();
  const { mutateAsync: updateMaterialMutate } = useUpdateMaterial();

  const { mutate: addMaterial } = useAddMaterial();
  const { mutate: subtractMaterial } = useSubtractMaterial();

  const [open, setOpen] = useState(false);
  const [editingRowId, setEditingRowId] = useState<number | null>(null);
  const [actionType, setActionType] = useState<"inc" | "dec" | null>(null);
  const [amount, setAmount] = useState<number>(1);

  const initialForm: CreateMaterialForm = { title: "", quantity: 0, minimal_quantity: 0, price: 0 };
  const [form, setForm] = useState<CreateMaterialForm>(initialForm);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    createMaterial(form);
    setForm(initialForm);
    setOpen(false);
  };

  const columns = getColumns(
    editingRowId,
    setEditingRowId,
    actionType,
    setActionType,
    amount,
    setAmount,
    addMaterial,
    subtractMaterial
  );

  const handleRowUpdate = async (newRow: Material, oldRow: Material) => {
    try {
      await updateMaterialMutate(newRow);
      return newRow;
    } catch (error) {
      console.error("Ошибка обновления:", error);
      return oldRow;
    }
  };

  return (
    <div>
      <Navbar />

      <Box sx={{ display: "flex", justifyContent: "flex-start", mt: 8 }}>
        <Button variant="contained" onClick={handleOpen}>
          Добавить Материал
        </Button>
      </Box>

      <CreateMaterialDialog
        open={open}
        form={form}
        onClose={handleClose}
        onChange={handleChange}
        onSubmit={handleSubmit}
      />

      <MaterialDataGrid
        materials={materials}
        loading={isLoading}
        columns={columns}
        onRowUpdate={handleRowUpdate}
      />
    </div>
  );
};

export default MaterialPage;
