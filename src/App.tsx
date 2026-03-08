import './App.css'
import { AppRouter } from './routes/AppRouter';
import { SnackbarProvider } from './context/SnackbarContext';
import { QueryProvider } from './providers/QueryProvider';

function App() {
  return (
    <SnackbarProvider>
      <QueryProvider>
        <AppRouter />
      </QueryProvider>
    </SnackbarProvider>
  );
}

export default App
