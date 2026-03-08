import React, { useState, useCallback, useMemo } from "react";
import { Box, Paper, Stack, Typography, Button } from "@mui/material";
import { AdminLayout } from "../../components/layouts/AdminLayout";

import { ServiceMasterTable } from "../../components/tables/ServiceMasterTable";
import CreateServiceMasterDialog from "../../components/dialogues/CreateServiceMasterDialog";

import { useServices } from "../../api/hooks/services/useServices";
import { useServiceMasterPage } from "../../api/hooks/service_masters/useServiceMasterPage";
import type { CreateServiceMasterForm } from "../../types/serviceMaster";
import { ServiceSelect } from "../../components/selects/ServiceSelect";
import { useMasters } from "../../api/hooks/masters/useMasters";
import { useSnackbar } from "../../context/SnackbarContext";

const ServiceMasterPage = () => {
  const { showSnackbar } = useSnackbar();
  // ===== Выбор услуги =====
  const [selectedServiceId, setSelectedServiceId] = useState<number | "">("");

  const { data: servicesData = [], isLoading: servicesLoading } = useServices();
  const { data: mastersData = [] } = useMasters();

  const services = servicesData.map((s: any) => ({
    id: Number(s.id),
    title: s.title,
  }));

  const masters = mastersData.map((s: any) => ({
    id: Number(s.id),
    name: s.full_name
  }));

  // ===== Диалог добавления мастера =====
  const initialForm: CreateServiceMasterForm = { master_id: "" };
  const [form, setForm] = useState<CreateServiceMasterForm>(initialForm);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleFormChange = useCallback(
    (e: React.ChangeEvent<{ name?: string; value: unknown }>) => {
        const { name, value } = e.target;
        setForm((prev) => ({
        ...prev,
        [name!]: value === "" ? "" : Number(value),
        }));
    },
    []
  );


  // ===== Хук работы с мастерами =====
  const { rows, isLoading, create, remove } = useServiceMasterPage(
    Number(selectedServiceId)
  );

  const usedMastersIds = rows.map(r => r.master_id);
  const availableMasters = masters.filter(m => !usedMastersIds.includes(m.id));

  const handleSubmit = () => {
    if (!selectedServiceId || !form.master_id) return;

    create.mutate({
      service_id: Number(selectedServiceId),
      master_id: Number(form.master_id),
    }, {
      onSuccess: () => showSnackbar("Мастер назначен", "success"),
    });

    setForm(initialForm);
    setDialogOpen(false);
  };

  const handleDelete = (id: number) => {
    remove.mutate(id);
  };

  return (
    <AdminLayout>
        {/* Выбор услуги */}
        <Paper sx={{ p: 2, mb: 3 }}>
          <ServiceSelect
            value={selectedServiceId}
            services={services}
            loading={servicesLoading}
            onChange={setSelectedServiceId}
          />
        </Paper>

        {/* Таблица мастеров */}
        {selectedServiceId ? (
          <Paper sx={{ width: "100%", p: 2 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">Назначенные мастера</Typography>
              <Button
                variant="contained"
                onClick={() => setDialogOpen(true)}
                disabled={isLoading}
              >
                Добавить мастера
              </Button>
            </Stack>

            <ServiceMasterTable
              rows={rows}
              loading={isLoading}
              onDelete={handleDelete}
            />
          </Paper>
        ) : (
          <Box sx={{ py: 6, textAlign: "center", color: "text.secondary" }}>
            <Typography>Выберите услугу, чтобы увидеть назначенных мастеров</Typography>
          </Box>
        )}

        {/* Диалог добавления мастера */}
        <CreateServiceMasterDialog
          open={dialogOpen}
          form={form}
          masters={availableMasters}
          onClose={() => setDialogOpen(false)}
          onChange={handleFormChange}
          onSubmit={handleSubmit}
        />
    </AdminLayout>
  );
};

export default ServiceMasterPage;
