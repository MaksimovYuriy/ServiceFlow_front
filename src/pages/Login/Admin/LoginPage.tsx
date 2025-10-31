import { Box, Paper, Typography, TextField, Button } from "@mui/material";
import { useState } from "react";

export function LoginPage() {
  const [secretKey, setSecretKey] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Здесь позже добавим запрос к Rails API (через fetch/axios)
    console.log("Ключ:", secretKey);
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          width: "100%",
          maxWidth: 400,
          borderRadius: 2,
        }}
      >
        <Typography variant="h5" component="h1" textAlign="center" mb={3}>
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
            variant="outlined"
            fullWidth
            value={secretKey}
            onChange={(e) => setSecretKey(e.target.value)}
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            sx={{ mt: 2 }}
          >
            Войти
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}

export default LoginPage