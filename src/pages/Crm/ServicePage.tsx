import { Box, Button, Paper } from "@mui/material";
import Navbar from "../../components/Navbar";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import React, { useCallback, useState } from "react";
import CreateServiceDialog, { type CreateServiceForm } from "../../components/dialogues/CreateServiceDialog";
import { useServices } from "../../api/hooks/services/useServices";
import { useCreateService } from "../../api/hooks/services/useCreateService";
import { useUpdateService } from "../../api/hooks/services/useUpdateService";
import type { Service } from "../../api/services";

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', flex: 0.5 },
  { field: 'title', headerName: 'Title', flex: 1, editable: true },
  { field: 'description', headerName: 'Description', flex: 1, editable: true },
  { field: 'duration', headerName: 'Duration', flex: 1, editable: true },
  { field: 'price', headerName: 'Price', flex: 1, editable: true },
  { field: 'active', headerName: 'Active?', type: 'boolean', minWidth: 100, flex: 0.6, editable: true },
];

const ServiceDataGrid = React.memo(
  ({ services, loading, onRowUpdate }: { services: any[]; loading: boolean; onRowUpdate: any }) => (
    <Box sx={{ display: 'flex', flexDirection: 'column', mt: 4 }}>
      <Paper sx={{ maxWidth: "100%", width: "100%" }}>
        <DataGrid
          rows={services}
          columns={columns}
          processRowUpdate={onRowUpdate}
          onProcessRowUpdateError={(err) => console.error(err)}
          sx={{ width: "100%" }}
        />
      </Paper>
    </Box>
  )
);
ServiceDataGrid.displayName = 'ServiceDataGrid';

const ServicePage = () => {
  const { data: services = [], isLoading } = useServices();
  const { mutate: createService, isPending } = useCreateService();
  const { mutateAsync: updateServiceMutate } = useUpdateService();

  const handleOpen = useCallback(() => setOpen(true), []);
  const handleClose = useCallback(() => setOpen(false), []);
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value, type, checked } = e.target;
      setForm(prev => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }, []);

  const initialForm: CreateServiceForm = {
    title: "",
    description: "",
    duration: "",
    price: 0,
    active: false
  };

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<CreateServiceForm>(initialForm);

  const handleSubmit = useCallback(() => {
      createService(form);
      setForm(initialForm);
      setOpen(false);
    }, [form, createService]);

  const handleRowUpdate = async (newRow: Service, oldRow: Service) => {
      try {
        await updateServiceMutate(newRow);
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
        <Button variant="contained" onClick={handleOpen} >Добавить Услугу</Button>
      </Box>

      <CreateServiceDialog
        open={open}
        form={form}
        onClose={handleClose}
        onChange={handleChange}
        onSubmit={handleSubmit}
      />

      <ServiceDataGrid
        services={services}
        loading={isLoading}
        onRowUpdate={handleRowUpdate}
      />
    </div>
  );
}

export default ServicePage
