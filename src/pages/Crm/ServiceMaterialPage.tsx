import {
  Box,
  Button,
  Paper,
  Stack,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from "@mui/material";
import Navbar from "../../components/Navbar";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { useState, type ChangeEvent } from "react";
import CreateServiceMaterialDialog from "../../components/dialogues/CreateServiceMaterialDialog";

type Service = { id: number; title: string };
type ServiceMaterial = { id: number; material: string; required_quantity: number };
type Material = { id: number; title: string };
type CreateServiceMaterialForm = { material_id: number | ""; required_quantity: number };

// Моки
const services: Service[] = [
  { id: 1, title: "Стрижка" },
  { id: 2, title: "Окрашивание" },
  { id: 3, title: "Маникюр" },
];

const materials: Material[] = [
  { id: 1, title: "Краска" },
  { id: 2, title: "Перчатки" },
  { id: 3, title: "Фольга" },
  { id: 4, title: "Ножницы" },
];

const initialServiceMaterialsMap: Record<number, ServiceMaterial[]> = {
  1: [{ id: 1, material: "Ножницы", required_quantity: 1 }],
  2: [{ id: 2, material: "Краска", required_quantity: 5 }],
  3: [{ id: 3, material: "Лак", required_quantity: 2 }],
};

const ServiceMaterialPage = () => {
  const [selectedServiceId, setSelectedServiceId] = useState<number | "">("");
  const [serviceMaterialsMap, setServiceMaterialsMap] = useState(initialServiceMaterialsMap);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState<CreateServiceMaterialForm>({ material_id: "", required_quantity: 0 });

  const selectedMaterials = selectedServiceId !== "" ? serviceMaterialsMap[selectedServiceId] ?? [] : [];

  const handleFormChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: name === "required_quantity" ? Number(value) : value,
    }));
  };

  const handleAddMaterial = () => {
    if (selectedServiceId === "" || !form.material_id || !form.required_quantity) return;

    const newMaterial: ServiceMaterial = {
      id: Date.now(),
      material: materials.find(m => m.id === form.material_id)?.title || "Unknown",
      required_quantity: form.required_quantity,
    };

    setServiceMaterialsMap(prev => ({
      ...prev,
      [selectedServiceId]: [...(prev[selectedServiceId] ?? []), newMaterial],
    }));

    setForm({ material_id: "", required_quantity: 0 });
    setDialogOpen(false);
  };

  // Колонки таблицы теперь внутри компонента
  const columns: GridColDef[] = [
    { field: "material", headerName: "Материал", flex: 1 },
    { field: "required_quantity", headerName: "Расход", flex: 1, editable: true },
    {
      field: "actions",
      headerName: "Действия",
      flex: 0.5,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Button
          variant="outlined"
          color="error"
          size="small"
          onClick={() => {
            if (selectedServiceId !== "") {
              setServiceMaterialsMap(prev => ({
                ...prev,
                [selectedServiceId as number]: prev[selectedServiceId as number].filter(
                  m => m.id !== params.row.id
                ),
              }));
            }
          }}
        >
          Удалить
        </Button>
      ),
    },
  ];

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
              onChange={(e) => setSelectedServiceId(e.target.value as number)}
            >
              <MenuItem value=""><em>Выберите услугу</em></MenuItem>
              {services.map(service => (
                <MenuItem key={service.id} value={service.id}>{service.title}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Paper>

        {/* Блок трат */}
        <Paper sx={{ p: 2 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">Траты материалов</Typography>
            <Button variant="contained" disabled={selectedServiceId === ""} onClick={() => setDialogOpen(true)}>
              Добавить трату
            </Button>
          </Stack>

          {selectedServiceId === "" ? (
            <Box sx={{ py: 6, textAlign: "center", color: "text.secondary" }}>
              <Typography>Выберите услугу, чтобы увидеть траты материалов</Typography>
            </Box>
          ) : (
            <DataGrid
              rows={selectedMaterials}
              columns={columns}
              autoHeight
              disableRowSelectionOnClick
              processRowUpdate={(newRow) => {
                setServiceMaterialsMap(prev => ({
                  ...prev,
                  [selectedServiceId as number]: prev[selectedServiceId as number].map(m =>
                    m.id === newRow.id ? { ...m, required_quantity: newRow.required_quantity } : m
                  ),
                }));
                return newRow;
              }}
              sx={{ width: "100%" }}
            />
          )}
        </Paper>

        {/* Модалка добавления */}
        <CreateServiceMaterialDialog
          open={dialogOpen}
          form={form}
          materials={materials}
          onClose={() => setDialogOpen(false)}
          onChange={handleFormChange}
          onSubmit={handleAddMaterial}
        />
      </Box>
    </div>
  );
};

export default ServiceMaterialPage;
