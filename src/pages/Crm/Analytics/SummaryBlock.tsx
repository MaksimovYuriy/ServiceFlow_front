import { Grid, Card, CardContent, Typography } from "@mui/material";
import type { AnalyticsSummary } from "../../../types/analytics";
import { AnalyticsBlock } from "./AnalyticsBlock";
import { formatPrice } from "./utils";

interface Props {
  data?: AnalyticsSummary;
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
}

const cards = (d: AnalyticsSummary) => [
  { label: "Записей всего", value: d.total_notes.toLocaleString("ru-RU") },
  { label: "Выполнено", value: d.completed.toLocaleString("ru-RU") },
  { label: "Отменено", value: d.canceled.toLocaleString("ru-RU") },
  { label: "В ожидании", value: d.pending.toLocaleString("ru-RU") },
  { label: "Выручка", value: formatPrice(d.total_revenue) },
  { label: "Средний чек", value: formatPrice(d.average_check) },
  { label: "Процент отмен", value: `${d.cancellation_rate}%` },
  { label: "Клиентов", value: d.total_clients.toLocaleString("ru-RU") },
  { label: "Мастеров", value: d.total_masters.toLocaleString("ru-RU") },
  { label: "Услуг", value: d.total_services.toLocaleString("ru-RU") },
];

export function SummaryBlock({ data, isLoading, isError, refetch }: Props) {
  return (
    <AnalyticsBlock title="Общая сводка" isLoading={isLoading} isError={isError} refetch={refetch}>
      {data && (
        <Grid container spacing={2}>
          {cards(data).map((c) => (
            <Grid size={{ xs: 6, sm: 4, md: 3 }} key={c.label}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="body2" color="text.secondary">{c.label}</Typography>
                  <Typography variant="h6" fontWeight={600}>{c.value}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </AnalyticsBlock>
  );
}
