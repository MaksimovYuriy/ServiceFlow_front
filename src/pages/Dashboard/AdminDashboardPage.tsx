import { Box, Paper, Typography, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { adminSections } from "../../config/adminSections";
import Navbar from "../../components/Navbar";

export function AdminDashboardPage() {
  const navigate = useNavigate();

  return (
    <div>
      <Navbar/>
      <Box>
        <Typography variant="h4" fontWeight={300} mb={4}>
          Панель администратора
        </Typography>

        <Grid container spacing={4}>
          {adminSections.map((section) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={section.title}>
              <Paper
                sx={{
                  transition: "all 0.2s ease",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 6px 12px rgba(0,0,0,0.15)",
                  },
                }}
                onClick={() => navigate(section.path)}
              >
                <Box sx={{ fontSize: 24, color: "primary.main" }}>
                  {section.icon}
                </Box>
                <Typography variant="h6" gutterBottom>
                  {section.title}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
    </div>
  );
}

export default AdminDashboardPage;