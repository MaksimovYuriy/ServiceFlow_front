import { Box, Button, Paper, Toolbar } from "@mui/material";
import Navbar from "../../components/Navbar";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import React, { useCallback, useState } from "react";
import { useMaterials } from "../../api/hooks/materials/useMaterial";
import { useCreateMaterial } from "../../api/hooks/materials/useCreateMaterial";
import { useUpdateMaterial } from "../../api/hooks/materials/useUpdateMaterial";
import type { Material } from "../../api/materials";
import type { CreateMaterialForm } from "../../components/dialogues/CreateMaterialDialog";
import CreateMaterialDialog from "../../components/dialogues/CreateMaterialDialog";

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', flex: 0.5 },
  { field: 'title', headerName: 'Title', flex: 1, editable: true },
  { field: 'quantity', headerName: 'Quantity', flex: 1, editable: true },
  { field: 'minimal_quantity', headerName: 'Minimal Quantity (Alert)', flex: 1, editable: true }
];

const MaterialDataGrid = React.memo(
  ({ materials, loading, onRowUpdate }: { materials: any[]; loading: boolean; onRowUpdate: any }) => (
    <Box sx={{ display: 'flex', flexDirection: 'column', mt: 4 }}>
      <Paper sx={{ maxWidth: "100%", width: "100vw" }} >
        <DataGrid
          rows={materials}
          columns={columns}
          processRowUpdate={onRowUpdate}
          onProcessRowUpdateError={(err) => console.error(err)}
          sx={{ width: "100%" }}
        />
      </Paper>
    </Box>
  )
);
MaterialDataGrid.displayName = 'MaterialDataGrid';

const MaterialPage = () => {
  const { data: materials = [], isLoading } = useMaterials();
  const { mutate: createMaterial, isPending } = useCreateMaterial();
  const { mutateAsync: updateMaterialMutate } = useUpdateMaterial();

  const handleOpen = useCallback(() => setOpen(true), []);
  const handleClose = useCallback(() => setOpen(false), []);
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value, type, checked } = e.target;
      setForm(prev => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }, []);

  const initialForm: CreateMaterialForm = {
    title: "",
    quantity: 0,
    minimal_quantity: 0
  };

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<CreateMaterialForm>(initialForm);

  const handleSubmit = useCallback(() => {
      createMaterial(form);
      setForm(initialForm);
      setOpen(false);
    }, [form, createMaterial]);

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
      <Box sx={{ display: 'flex', justifyContent: 'flex-start', mt: 8 }}>
        <Button variant="contained" onClick={handleOpen} >Добавить Материал</Button>
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
        onRowUpdate={handleRowUpdate}
      />
    </div>
  );
}

export default MaterialPage
