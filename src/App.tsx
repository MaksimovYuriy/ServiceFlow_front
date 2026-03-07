import './App.css'
import { AppRouter } from './routes/AppRouter';
import { SnackbarProvider } from './context/SnackbarContext';

function App() {
  return (
    <SnackbarProvider>
      <AppRouter />
    </SnackbarProvider>
  );
}

export default App
