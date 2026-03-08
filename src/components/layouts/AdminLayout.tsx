import { Box, Toolbar } from "@mui/material";
import Navbar from "../Navbar";
import type { ReactNode } from "react";

export function AdminLayout({ children }: { children: ReactNode }) {
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
