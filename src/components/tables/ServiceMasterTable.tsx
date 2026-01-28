import { Box, Button, Typography } from "@mui/material";
import { DataGrid, type GridColDef, type GridRenderCellParams } from "@mui/x-data-grid";
import type { ServiceMasterRow } from "../../types/serviceMaster";

type Props = {
  rows: ServiceMasterRow[];
  loading: boolean;
  onDelete: (id: number) => void;
};

export const ServiceMasterTable = ({ rows, loading, onDelete }: Props) => {
  const columns: GridColDef[] = [
    {
      field: "master_name",
      headerName: "Мастер",
      flex: 1,
    },
    {
      field: "actions",
      headerName: "Действия",
      flex: 0.5,
      sortable: false,
      filterable: false,
      renderCell: (params: GridRenderCellParams<ServiceMasterRow>) => (
        <Button
          size="small"
          color="error"
          variant="outlined"
          onClick={() => onDelete(params.row.id)}
        >
          Удалить
        </Button>
      ),
    },
  ];

  return (
    <Box mt={2} sx={{ width: "100%" }}>
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
