import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import { useState, useMemo } from "react";

import { AdminLayout } from "../../components/layouts/AdminLayout";

import CreateServiceMaterialDialog from "../../components/dialogues/CreateServiceMaterialDialog";

import { useServices } from "../../api/hooks/services/useServices";
import { useMaterials } from "../../api/hooks/materials/useMaterial";


import type { CreateServiceMaterialForm } from "../../types/serviceMaterial";
import { useServiceMaterialPage } from "../../api/hooks/service_materials/useServiceMaterialPage";
import { ServiceSelect } from "../../components/selects/ServiceSelect";
import { ServiceMaterialTable } from "../../components/tables/ServiceMaterialTable";
import { useSnackbar } from "../../context/SnackbarContext";

const initialForm: CreateServiceMaterialForm = {
  material_id: "",
  required_quantity: 0,
};

const ServiceMaterialPage = () => {
  // ===== Page state =====
  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState<CreateServiceMaterialForm>(initialForm);
  const { showSnackbar } = useSnackbar();

  // ===== Dictionaries =====
  const { data: servicesData = [], isLoading: servicesLoading } = useServices();
  const { data: materialsData = [] } = useMaterials();

  const services = useMemo(
    () =>
      servicesData.map((s: any) => ({
        id: Number(s.id),
        title: s.title,
      })),
    [servicesData]
  );

  const materials = useMemo(
    () =>
      materialsData.map((m: any) => ({
        id: Number(m.id),
        title: m.title,
      })),
    [materialsData]
  );

  // ===== Page logic =====
  const {
    rows,
    isLoading,
    create,
    update,
    remove,
  } = useServiceMaterialPage(selectedServiceId ?? 0);

  const usedMaterialIds = useMemo(
    () => rows.map((r) => r.material_id),
    [rows]
  );

  const availableMaterials = useMemo(
    () => materials.filter((m) => !usedMaterialIds.includes(m.id)),
    [materials, usedMaterialIds]
  );

  // ===== Handlers =====
  const handleCreate = () => {
    if (!selectedServiceId || !form.material_id || !form.required_quantity) return;

    create.mutate({
      service_id: selectedServiceId,
      material_id: form.material_id,
      required_quantity: form.required_quantity,
    }, {
      onSuccess: () => showSnackbar("Материал привязан к услуге", "success"),
    });

    setForm(initialForm);
    setDialogOpen(false);
  };

  const handleUpdate = async (id: number, amount: number) => {
    await update.mutateAsync({
      id,
      service_id: selectedServiceId!,
      required_quantity: amount,
    });
  };


  return (
    <AdminLayout>
        {/* Service select */}
        <Paper sx={{ p: 2, mb: 3 }}>
          <ServiceSelect
            value={selectedServiceId}
            services={services}
            loading={servicesLoading}
            onChange={setSelectedServiceId}
          />
        </Paper>

        {/* Content */}
        {selectedServiceId ? (
          <Paper sx={{ p: 2 }}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
            >
              <Typography variant="h6">
                Траты материалов
              </Typography>
              <Button
                variant="contained"
                onClick={() => setDialogOpen(true)}
              >
                Добавить трату
              </Button>
            </Stack>

            <ServiceMaterialTable
              rows={rows}
              loading={isLoading}
              onUpdate={handleUpdate}
              onDelete={remove.mutate}
            />
          </Paper>
        ) : (
          <Box sx={{ py: 6, textAlign: "center", color: "text.secondary" }}>
            <Typography>
              Выберите услугу, чтобы увидеть траты материалов
            </Typography>
          </Box>
        )}

        {/* Dialog */}
        <CreateServiceMaterialDialog
          open={dialogOpen}
          form={form}
          materials={availableMaterials}
          onClose={() => setDialogOpen(false)}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              [e.target.name]: Number(e.target.value),
            }))
          }
          onSubmit={handleCreate}
        />
    </AdminLayout>
  );
};

export default ServiceMaterialPage;
