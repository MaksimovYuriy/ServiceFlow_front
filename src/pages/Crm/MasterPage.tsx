import { Box, Button, Paper, Toolbar } from "@mui/material";
import Navbar from "../../components/Navbar";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import React, { useCallback, useState } from "react";
import { useCreateMaster } from "../../api/hooks/masters/useCreateMaster";
import type { Master } from "../../api/masters";
import type { CreateMasterForm } from "../../components/dialogues/CreateMasterDialog";
import CreateMasterDialog from "../../components/dialogues/CreateMasterDialog";
import { useUpdateMaster } from "../../api/hooks/masters/useUpdateMaster";
import { useMasters } from "../../api/hooks/masters/useMasters";

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', flex: 0.5 },
  { field: 'first_name', headerName: 'First Name', flex: 1, editable: true },
  { field: 'middle_name', headerName: 'Middle Name', flex: 1, editable: true },
  { field: 'last_name', headerName: 'Last Name', flex: 1, editable: true },
  { field: 'phone', headerName: 'Phone', flex: 1, editable: true },
  { field: 'salary', headerName: 'Salary', flex: 1, editable: true },
  { field: 'active', headerName: 'Active?', type: 'boolean', width: 100, flex: 1, editable: true },
];

const MasterDataGrid = React.memo(
  ({ masters, loading, onRowUpdate }: { masters: any[]; loading: boolean; onRowUpdate: any }) => (
    <Box sx={{ display: 'flex', flexDirection: 'column', mt: 4 }}>
      <Paper sx={{ maxWidth: "100%", width: "100vw" }} >
        <DataGrid
          rows={masters}
          columns={columns}
          processRowUpdate={onRowUpdate}
          onProcessRowUpdateError={(err) => console.error(err)}
          sx={{ width: "100%" }}
        />
      </Paper>
    </Box>
  )
);
MasterDataGrid.displayName = 'MasterDataGrid';

const MasterPage = () => {
  const { data: masters = [], isLoading } = useMasters();
  const { mutate: createMaster, isPending } = useCreateMaster();
  const { mutateAsync: updateMasterMutate } = useUpdateMaster();

  const handleOpen = useCallback(() => setOpen(true), []);
  const handleClose = useCallback(() => setOpen(false), []);
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value, type, checked } = e.target;
      setForm(prev => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }, []);

  const initialForm: CreateMasterForm = {
    first_name: "",
    middle_name: "",
    last_name: "",
    phone: "",
    salary: 0,
    active: false
  };

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<CreateMasterForm>(initialForm);

  const handleSubmit = useCallback(() => {
      createMaster(form);
      setForm(initialForm);
      setOpen(false);
    }, [form, createMaster]);

  const handleRowUpdate = async (newRow: Master, oldRow: Master) => {
      try {
        await updateMasterMutate(newRow);
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
        <Button variant="contained" onClick={handleOpen} >Добавить Мастера</Button>
      </Box>

      <CreateMasterDialog
        open={open}
        form={form}
        onClose={handleClose}
        onChange={handleChange}
        onSubmit={handleSubmit}
      />

      <MasterDataGrid
        masters={masters}
        loading={isLoading}
        onRowUpdate={handleRowUpdate}
      />
    </div>
  );
}

export default MasterPage
