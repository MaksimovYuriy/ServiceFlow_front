import { Paper, Typography, TextField, Button, Box } from "@mui/material";
import { PublicLayout } from "../../components/layouts/PublicLayout";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLogin } from "../../api/hooks/useLogin";

export function LoginPage() {
  const [email, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const loginMutation = useLogin();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    loginMutation.mutate(
      { email, password },
      {
        onSuccess: () => {
          navigate("/admin/dashboard");
        },
      }
    );
  };

  return (
    <PublicLayout>
      <Paper sx={{ p: 4, maxWidth: 400, width: "100%" }}>
        <Typography variant="h5" component="h1" textAlign="center" mb={2}>
          Вход в систему
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <TextField
            label="Почта"
            fullWidth
            value={email}
            onChange={(e) => setLogin(e.target.value)}
          />

          <TextField
            label="Пароль"
            type="password"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button type="submit">
            Войти
          </Button>

          <Button
            variant="text"
            color="inherit"
            type="button"
            onClick={() => navigate("/booking")}
            sx={{ fontSize: "0.875rem" }}
          >
            Запись на услуги
          </Button>
        </Box>
      </Paper>
    </PublicLayout>
  );
}

export default LoginPage
