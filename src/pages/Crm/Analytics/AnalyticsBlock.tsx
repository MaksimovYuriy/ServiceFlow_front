import { Box, Typography, CircularProgress, Button, Paper } from "@mui/material";
import type { ReactNode } from "react";

interface AnalyticsBlockProps {
  title: string;
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
  children: ReactNode;
}

export function AnalyticsBlock({ title, isLoading, isError, refetch, children }: AnalyticsBlockProps) {
  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" mb={2}>{title}</Typography>

      {isLoading && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {isError && !isLoading && (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <Typography color="error" mb={1}>Не удалось загрузить</Typography>
          <Button variant="outlined" size="small" onClick={refetch}>Повторить</Button>
        </Box>
      )}

      {!isLoading && !isError && children}
    </Paper>
  );
}
