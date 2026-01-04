import { Box, Button, Paper } from "@mui/material";
import Navbar from "../../components/Navbar";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import React, { useCallback, useState } from "react";
import CreateServiceDialog, { type CreateServiceForm } from "../../components/dialogues/CreateServiceDialog";
import { createUser } from "../../api/users";

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', minWidth: 80, flex: 0.5 },
  { field: 'title', headerName: 'Title', minWidth: 250, flex: 1, editable: true },
  { field: 'description', headerName: 'Description', minWidth: 500, flex: 1, editable: true },
  { field: 'duration', headerName: 'Duration', minWidth: 150, flex: 0.6, editable: true },
  { field: 'price', headerName: 'Price', minWidth: 100, flex: 1, editable: true },
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
          autoHeight
        />
      </Paper>
    </Box>
  )
);
ServiceDataGrid.displayName = 'ServiceDataGrid';

const ServicePage = () => {
  const services: any[] = [];
  const loading = false;
  const handleRowUpdate = (newRow: any) => {
    console.log('Row updated:', newRow);
    return newRow;
  };

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
        onSubmit={() => {}}
      />

      <ServiceDataGrid
        services={services}
        loading={loading}
        onRowUpdate={handleRowUpdate}
      />
    </div>
  );
}

export default ServicePage
