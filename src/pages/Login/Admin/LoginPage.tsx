import { Box, Paper, Typography, TextField, Button } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function LoginPage() {
  const [secretKey, setSecretKey] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Здесь позже добавим запрос к Rails API (через fetch/axios)
    console.log("Ключ:", secretKey);
  };

  const toLogin = () => {
    navigate("/login")
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
            label="Ключ администратора"
            type="password"
            fullWidth
            value={secretKey}
            onChange={(e) => setSecretKey(e.target.value)}
          />

          <Button type="submit">
            Войти
          </Button>

          <Button
            type="submit"
            onClick={toLogin}
          >
            Я - Сотрудник
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}

export default LoginPage