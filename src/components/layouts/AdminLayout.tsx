import { Box, CircularProgress, Toolbar } from "@mui/material";
import Navbar from "../Navbar";
import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useCurrentUser } from "../../api/hooks/useCurrentUser";

export function AdminLayout({ children }: { children: ReactNode }) {
  const { isLoading, isError } = useCurrentUser();

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div>
      <Navbar />
      <Toolbar />
      <Box
        sx={{
          p: 3,
          "& .MuiDataGrid-root": {
            minWidth: 600,
          },
          "& .MuiPaper-root:has(.MuiDataGrid-root)": {
            overflowX: "auto",
          },
        }}
      >
        {children}
      </Box>
    </div>
  );
}
