import {
  Box,
  Button,
  Paper,
  Stack,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton
} from "@mui/material";
import Navbar from "../../components/Navbar";
import { DataGrid, type GridColDef, type GridRenderCellParams } from "@mui/x-data-grid";
import React, { useState, useCallback, useMemo } from "react";

import CreateServiceMaterialDialog from "../../components/dialogues/CreateServiceMaterialDialog";
import { useServiceMaterials } from "../../api/hooks/service_materials/useServiceMaterials";
import { useCreateServiceMaterial } from "../../api/hooks/service_materials/useCreateServiceMaterial";
import { useUpdateServiceMaterial } from "../../api/hooks/service_materials/useUpdateServiceMaterial";
import { useDeleteServiceMaterial } from "../../api/hooks/service_materials/useDeleteServiceMaterial";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

// Пример сервисов и материалов (можно получать через API)
const services = [
  { id: 1, title: "Стрижка" },
  { id: 2, title: "Окрашивание" },
  { id: 3, title: "Маникюр" },
];

const materials = [
  { id: 1, title: "Краска" },
  { id: 2, title: "Перчатки" },
  { id: 3, title: "Фольга" },
  { id: 4, title: "Ножницы" },
];

// Типы
type CreateServiceMaterialForm = {
  material_id: number | "";
  required_quantity: number;
};

type ServiceMaterialRow = {
  id: number;
  material_id: number;
  required_quantity: number;
  material_title: string;
};

// Компонент DataGrid
const ServiceMaterialDataGrid = React.memo(
  ({
    rows,
    loading,
    columns,
    onRowUpdate
  }: {
    rows: ServiceMaterialRow[];
    loading: boolean;
    columns: GridColDef[];
    onRowUpdate: (newRow: ServiceMaterialRow, oldRow: ServiceMaterialRow) => Promise<ServiceMaterialRow>;
  }) => (
    <Box sx={{ display: "flex", flexDirection: "column", mt: 2, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          loading={loading}
          processRowUpdate={onRowUpdate}
          disableRowSelectionOnClick
          autoHeight
          sx={{ width: "100%" }}
        />
    </Box>
  )
);
ServiceMaterialDataGrid.displayName = "ServiceMaterialDataGrid";

const ServiceMaterialPage = () => {
  const [selectedServiceId, setSelectedServiceId] = useState<number | "">("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRowId, setEditingRowId] = useState<number | null>(null);
  const [amount, setAmount] = useState<number>(1);

  const initialForm: CreateServiceMaterialForm = { material_id: "", required_quantity: 0 };
  const [form, setForm] = useState<CreateServiceMaterialForm>(initialForm);

  // Хуки
  const { data: materialsList = [], isLoading } = useServiceMaterials(Number(selectedServiceId));
  const { mutate: createServiceMaterial } = useCreateServiceMaterial();
  const { mutateAsync: updateServiceMaterialMutate } = useUpdateServiceMaterial();
  const deleteMutation = useDeleteServiceMaterial(Number(selectedServiceId));

  // Обработчики формы
  const handleFormChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "required_quantity" ? Number(value) : Number(value),
    }));
  }, []);

  const handleSubmit = () => {
    if (!selectedServiceId) return;
    if (!form.material_id) return;

    createServiceMaterial({
      service_id: selectedServiceId,
      material_id: Number(form.material_id),
      required_quantity: form.required_quantity,
    });

    setForm(initialForm);
    setDialogOpen(false);
  };

  // Приведение данных для DataGrid
  const rows: ServiceMaterialRow[] = useMemo(() => 
    (materialsList || []).map((m: any) => ({
      id: Number(m.id),
      material_id: m.attributes?.material_id ?? 0,
      required_quantity: m.attributes?.required_quantity ?? 0,
      material_title: m.attributes?.material_title ?? "-",
    })), 
    [materialsList]
  );

  // Обновление строки
  const handleRowUpdate = useCallback(async (newRow: ServiceMaterialRow, oldRow: ServiceMaterialRow) => {
    try {
      await updateServiceMaterialMutate({
        id: newRow.id,
        service_id: Number(selectedServiceId),
        required_quantity: newRow.required_quantity,
      });
      return newRow;
    } catch (error) {
      console.error("Ошибка обновления:", error);
      return oldRow;
    }
  }, [selectedServiceId, updateServiceMaterialMutate]);

  // Функция удаления
  const handleDelete = useCallback((id: number) => {
    deleteMutation.mutate(id);
  }, [deleteMutation]);

  // Колонки DataGrid - исправленная типизация
  const columns = useMemo(() => [
    { 
      field: "material_title", 
      headerName: "Материал", 
      flex: 1 
    },
    {
      field: "required_quantity",
      headerName: "Расход",
      flex: 1,
      editable: true,
      renderCell: (params: GridRenderCellParams<ServiceMaterialRow>) => {
        const isEditing = editingRowId === params.row.id;
        
        if (!isEditing) {
          return (
            <Typography 
              onClick={() => {
                setEditingRowId(params.row.id);
                setAmount(params.row.required_quantity);
              }}
              sx={{ 
                cursor: 'pointer',
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              {params.value}
            </Typography>
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
              inputProps={{ min: 0 }}
              autoFocus
            />
            <IconButton
              size="small"
              onClick={async () => {
                try {
                  await updateServiceMaterialMutate({
                    id: params.row.id,
                    service_id: Number(selectedServiceId),
                    required_quantity: amount,
                  });
                } catch (err) {
                  console.error(err);
                } finally {
                  setEditingRowId(null);
                  setAmount(1);
                }
              }}
            >
              <CheckIcon />
            </IconButton>
            <IconButton 
              size="small" 
              onClick={() => {
                setEditingRowId(null);
                setAmount(1);
              }}
            >
              <CloseIcon />
            </IconButton>
          </Stack>
        );
      },
    },
    {
      field: "actions",
      headerName: "Действия",
      flex: 0.5,
      sortable: false,
      filterable: false,
      renderCell: (params: GridRenderCellParams<ServiceMaterialRow>) => (
        <Button
          variant="outlined"
          color="error"
          size="small"
          onClick={() => handleDelete(params.row.id)}
        >
          Удалить
        </Button>
      ),
    },
  ], [editingRowId, amount, selectedServiceId, updateServiceMaterialMutate, handleDelete]);

  return (
    <div>
      <Navbar />

      <Box sx={{ mt: 8, px: 2 }}>
        {/* Выбор услуги */}
        <Paper sx={{ p: 2, mb: 3 }}>
          <FormControl fullWidth>
            <InputLabel>Услуга</InputLabel>
            <Select
              label="Услуга"
              value={selectedServiceId}
              onChange={(e) => setSelectedServiceId(Number(e.target.value))}
            >
              <MenuItem value="">
                <em>Выберите услугу</em>
              </MenuItem>
              {services.map((service) => (
                <MenuItem key={service.id} value={service.id}>
                  {service.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Paper>

        {/* Таблица */}
        {selectedServiceId ? (
          <Paper sx={{ maxWidth: "100%", width: "100vw" }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">Траты материалов</Typography>
              <Button
                variant="contained"
                onClick={() => setDialogOpen(true)}
              >
                Добавить трату
              </Button>
            </Stack>

            <ServiceMaterialDataGrid
              rows={rows}
              loading={isLoading}
              columns={columns}
              onRowUpdate={handleRowUpdate}
            />
          </Paper>
        ) : (
          <Box sx={{ py: 6, textAlign: "center", color: "text.secondary" }}>
            <Typography>Выберите услугу, чтобы увидеть траты материалов</Typography>
          </Box>
        )}

        {/* Модалка добавления */}
        <CreateServiceMaterialDialog
          open={dialogOpen}
          form={form}
          materials={materials}
          onClose={() => setDialogOpen(false)}
          onChange={handleFormChange}
          onSubmit={handleSubmit}
        />
      </Box>
    </div>
  );
};

export default ServiceMaterialPage;