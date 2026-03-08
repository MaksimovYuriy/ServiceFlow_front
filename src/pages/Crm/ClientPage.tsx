import { Box, Paper, Typography } from "@mui/material";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import React from "react";
import { AdminLayout } from "../../components/layouts/AdminLayout";
import { useClients } from "../../api/hooks/clients/useClients";

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', flex: 0.5 },
  { field: 'full_name', headerName: 'Client name', flex: 1, editable: false },
  { field: 'phone', headerName: 'Phone', flex: 1, editable: false },
  { field: 'telegram', headerName: 'Telegram', flex: 1, editable: false }
];

const ClientDataGrid = React.memo(
  ({ clients, loading }: { clients: any[]; loading: boolean; }) => (
    <Paper sx={{ width: "100%" }}>
        <DataGrid
          rows={clients}
          columns={columns}
          onProcessRowUpdateError={() => {}}
          sx={{ width: "100%" }}
        />
      </Paper>
  )
);
ClientDataGrid.displayName = 'ClientDataGrid';

const ClientPage = () => {
  const { data: clients = [], isLoading } = useClients();

  return (
    <AdminLayout>
        <Typography variant="h4" fontWeight={300} mb={4}>
          Наши клиенты
        </Typography>
        <ClientDataGrid
          clients={clients}
          loading={isLoading}
        />
    </AdminLayout>
  );
}

export default ClientPage
