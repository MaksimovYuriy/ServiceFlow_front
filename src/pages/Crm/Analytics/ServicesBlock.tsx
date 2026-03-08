import { Box } from "@mui/material";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import type { ServicesData } from "../../../types/analytics";
import { AnalyticsBlock } from "./AnalyticsBlock";
import { formatPrice } from "./utils";

interface Props {
  data?: ServicesData;
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
}

const COLORS = ["#5C6BC0", "#7986CB", "#9FA8DA", "#C5CAE9", "#E8EAF6", "#3F51B5", "#303F9F", "#1A237E", "#8C9EFF", "#536DFE"];

const columns: GridColDef[] = [
  { field: "title", headerName: "Услуга", flex: 1.5 },
  { field: "notes_count", headerName: "Записей", flex: 0.7 },
  { field: "revenue", headerName: "Выручка", flex: 1, renderCell: (p) => formatPrice(p.value) },
  { field: "revenue_share", headerName: "Доля выручки", flex: 0.8, renderCell: (p) => `${p.value}%` },
];

export function ServicesBlock({ data, isLoading, isError, refetch }: Props) {
  const top = (data?.services ?? []).slice(0, 10);

  return (
    <AnalyticsBlock title="Услуги" isLoading={isLoading} isError={isError} refetch={refetch}>
      {data && (
        <>
          <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap", mb: 2 }}>
            <Box sx={{ width: 250, height: 250, flexShrink: 0 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={top}
                    dataKey="revenue_share"
                    nameKey="title"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                  >
                    {top.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v: number) => `${v}%`} />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Box>

          <DataGrid
            rows={data.services}
            columns={columns}
            autoHeight
            disableRowSelectionOnClick
            hideFooter={data.services.length <= 10}
          />
        </>
      )}
    </AnalyticsBlock>
  );
}
