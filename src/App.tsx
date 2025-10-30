import { Button, Container, Typography } from '@mui/material';
import './App.css'

function App() {
  return (
      <Container>
        <Typography variant="h4" gutterBottom>
          Привет, MUI!
        </Typography>
        <Button variant="contained" color="primary">
          Нажми меня
        </Button>
      </Container>
    );
}

export default App
