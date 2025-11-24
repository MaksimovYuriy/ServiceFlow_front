import { Box, Paper, Typography, TextField, Button } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import theme from "../../theme";
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
        onSuccess: (response) => {
          const { token } = response.data.attributes;

          localStorage.setItem("token", token);
          navigate("/admin/dashboard");
        },
        onError: () => {
          alert("Ошибка авторизации");
        }
      }
    );
  };

  const toBooking = () => {
    navigate("/booking")
  }

  return (
    <Box>
      <Paper>
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
            sx={{backgroundColor: theme.palette.secondary.light}}
            type="submit"
            onClick={toBooking}
          >
            Запись на услуги
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}

export default LoginPage
