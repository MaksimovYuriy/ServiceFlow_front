import { Box, Paper, Typography, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { adminSections } from "../../config/adminSections";
import { AdminLayout } from "../../components/layouts/AdminLayout";

const cardSx = {
  p: 4,
  borderRadius: "16px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
  cursor: "pointer",
  transition: "all 0.2s ease",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 6px 12px rgba(0,0,0,0.15)",
  },
};

export function AdminDashboardPage() {
  const navigate = useNavigate();

  return (
    <AdminLayout>
        <Typography variant="h4" fontWeight={300} mb={4}>
          Панель администратора
        </Typography>
        <Grid container spacing={4}>
            {adminSections.map((section) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={section.title}>
                <Paper
                  sx={cardSx}
                  onClick={() => navigate(section.path)}
                >
                  <Box sx={{ fontSize: 32, color: "primary.main", mb: 1 }}>
                    {section.icon}
                  </Box>
                  <Typography variant="h6" gutterBottom>
                    {section.title}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
    </AdminLayout>
  );
}

export default AdminDashboardPage;
