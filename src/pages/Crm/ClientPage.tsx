import { Box, Button, Paper, Toolbar, Typography } from "@mui/material";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import React, { useCallback } from "react";
import Navbar from "../../components/Navbar";
import { useClients } from "../../api/hooks/clients/useClients";

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', flex: 0.5 },
  { field: 'full_name', headerName: 'Client name', flex: 1, editable: false },
  { field: 'phone', headerName: 'Phone', flex: 1, editable: false },
  { field: 'telegram', headerName: 'Telegram', flex: 1, editable: false }
];

const ClientDataGrid = React.memo(
  ({ clients, loading }: { clients: any[]; loading: boolean; }) => (
    <Box sx={{ display: 'flex', flexDirection: 'column', mt: 4 }}>
      <Paper sx={{ maxWidth: "100%", width: "100vw" }} >
        <DataGrid
          rows={clients}
          columns={columns}
          onProcessRowUpdateError={(err) => console.error(err)}
          sx={{ width: "100%" }}
        />
      </Paper>
    </Box>
  )
);
ClientDataGrid.displayName = 'ClientDataGrid';

const ClientPage = () => {
  const { data: clients = [], isLoading } = useClients();

  return (
    <div>
      <Navbar />
      <Toolbar/>
      <Typography variant="h4" fontWeight={300} mb={4}>
        Наши клиенты
      </Typography>
      <ClientDataGrid
        clients={clients}
        loading={isLoading}
      />
    </div>
  );
}

export default ClientPage
