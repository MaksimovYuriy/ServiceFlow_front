import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import { Box, Button, Paper } from "@mui/material";
import Navbar from '../../components/Navbar';
import type { CreateUserForm } from '../../components/dialogues/CreateUserDialog';
import { useCallback, useState } from 'react';
import CreateUserDialog from '../../components/dialogues/CreateUserDialog';
import React from 'react';
import { useUsers } from '../../api/hooks/useUsers';
import { useCreateUser } from '../../api/hooks/useCreateUser';
import { createUser, type User } from '../../api/users';
import { useUpdateUser } from '../../api/hooks/useUpdateUser';

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', minWidth: 80, flex: 0.5 },
  { field: 'email', headerName: 'Email', minWidth: 250, flex: 1, editable: true },
  { field: 'phone', headerName: 'Телефон', minWidth: 180, flex: 1, editable: true },
  { field: 'active', headerName: 'Активен', type: 'boolean', minWidth: 120, flex: 0.6, editable: true },
];

const initialForm: CreateUserForm = {
  email: "",
  phone: "",
  active: false,
  password: "",
  password_confirmation: "",
};

// Добавляем onRowUpdate в пропсы
const UserDataGrid = React.memo(
  ({ users, loading, onRowUpdate }: { users: any[]; loading: boolean; onRowUpdate: any }) => (
    <Box sx={{ display: 'flex', flexDirection: 'column', mt: 4 }}>
      <Paper sx={{ maxWidth: "100%", width: "100%" }}>
        <DataGrid
          rows={users}
          columns={columns}
          processRowUpdate={onRowUpdate} // используем переданный колбэк
          onProcessRowUpdateError={(err) => console.error(err)}
          autoHeight
        />
      </Paper>
    </Box>
  )
);
UserDataGrid.displayName = 'UserDataGrid';


const UserPage = () => {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<CreateUserForm>(initialForm);

  const handleOpen = useCallback(() => setOpen(true), []);
  const handleClose = useCallback(() => setOpen(false), []);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }, []);

  // Используем хук для загрузки пользователей
  const { data: users = [], isLoading } = useUsers();
  const { mutate: createUser, isPending } = useCreateUser();
  const { mutateAsync: updateUserMutate } = useUpdateUser();


  const handleSubmit = useCallback(() => {
    createUser(form);
    setForm(initialForm);
    setOpen(false);
  }, [form, createUser]);

  const handleRowUpdate = async (newRow: User, oldRow: User) => {
    try {
      await updateUserMutate(newRow);
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
    </div>
  );
};

export default UserPage;
