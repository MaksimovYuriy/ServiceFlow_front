import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import { Box, Button, Paper } from "@mui/material";
import { AdminLayout } from '../../components/layouts/AdminLayout';
import type { CreateUserForm } from '../../components/dialogues/CreateUserDialog';
import { useCallback, useState } from 'react';
import CreateUserDialog from '../../components/dialogues/CreateUserDialog';
import React from 'react';
import { useUsers } from '../../api/hooks/users/useUsers';
import { useCreateUser } from '../../api/hooks/users/useCreateUser';
import type { User } from '../../api/users';
import { useUpdateUser } from '../../api/hooks/users/useUpdateUser';
import { useSnackbar } from '../../context/SnackbarContext';

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 80 },
  { field: 'email', headerName: 'Email', flex: 1, editable: true },
  { field: 'phone', headerName: 'Телефон', flex: 1, editable: true },
  { field: 'active', headerName: 'Активен', type: 'boolean', width: 120, editable: true },
];

const initialForm: CreateUserForm = {
  email: "",
  phone: "",
  active: false,
  password: "",
  password_confirmation: "",
};

const UserDataGrid = React.memo(
  ({ users, loading, onRowUpdate }: { users: User[]; loading: boolean; onRowUpdate: (newRow: User, oldRow: User) => Promise<User> }) => (
    <Paper sx={{ width: "100%" }}>
        <DataGrid
          rows={users}
          columns={columns}
          processRowUpdate={onRowUpdate}
          onProcessRowUpdateError={() => {}}
          sx={{ width: "100%" }}
        />
      </Paper>
  )
);
UserDataGrid.displayName = 'UserDataGrid';


const UserPage = () => {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<CreateUserForm>(initialForm);
  const { showSnackbar } = useSnackbar();

  const handleOpen = useCallback(() => setOpen(true), []);
  const handleClose = useCallback(() => setOpen(false), []);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }, []);

  const { data: users = [], isLoading } = useUsers();
  const { mutate: createUser } = useCreateUser();
  const { mutateAsync: updateUserMutate } = useUpdateUser();

  const handleSubmit = useCallback(() => {
    createUser(form, {
      onSuccess: () => showSnackbar("Пользователь создан", "success"),
    });
    setForm(initialForm);
    setOpen(false);
  }, [form, createUser, showSnackbar]);

  const handleRowUpdate = async (newRow: User, oldRow: User) => {
    try {
      await updateUserMutate(newRow);
      showSnackbar("Обновлено", "success");
      return newRow;
    } catch {
      return oldRow;
    }
  };

  return (
    <AdminLayout>
        <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2 }}>
          <Button variant="contained" onClick={handleOpen}>Добавить пользователя</Button>
        </Box>

        <CreateUserDialog
          open={open}
          form={form}
          onClose={handleClose}
          onChange={handleChange}
          onSubmit={handleSubmit}
        />

        <UserDataGrid
          users={users}
          loading={isLoading}
          onRowUpdate={handleRowUpdate}
        />
    </AdminLayout>
  );
};

export default UserPage;
