import { Box } from "@mui/material";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import type { RevenueData } from "../../../types/analytics";
import { AnalyticsBlock } from "./AnalyticsBlock";
import { formatMonth, formatPrice } from "./utils";

interface Props {
  data?: RevenueData;
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
}

export function RevenueBlock({ data, isLoading, isError, refetch }: Props) {
  const chartData = (data?.monthly ?? []).map((m) => ({
    ...m,
    label: formatMonth(m.month),
  }));

  return (
    <AnalyticsBlock title="Выручка по месяцам" isLoading={isLoading} isError={isError} refetch={refetch}>
      {data && (
        <Box sx={{ width: "100%", height: 350 }}>
          <ResponsiveContainer>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" tick={{ fontSize: 12 }} />
              <YAxis tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}к`} />
              <Tooltip
                formatter={(value: number, name: string) => {
                  if (name === "revenue") return [formatPrice(value), "Выручка"];
                  if (name === "notes_count") return [value, "Записей"];
                  if (name === "canceled_count") return [value, "Отменено"];
                  return [value, name];
                }}
                labelFormatter={(label: string) => label}
              />
              <Bar dataKey="revenue" fill="#5C6BC0" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      )}
    </AnalyticsBlock>
  );
}
