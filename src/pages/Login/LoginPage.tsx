import { Box, Paper, Typography, TextField, Button } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import theme from "../../theme";

export function LoginPage() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Здесь позже добавим запрос к Rails API (через fetch/axios)
    console.log("Логин:", login);
    console.log("Пароль:", password);
  };

  const toAdminLogin = () => {
    navigate("/admin/login")
  }

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
            label="Логин"
            fullWidth
            value={login}
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
            type="submit"
            onClick={toAdminLogin}
          >
            Я - Администратор
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
