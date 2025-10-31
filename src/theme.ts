import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light', // можно потом переключить на 'dark'
    primary: {
      main: '#7fc980', // мягкий зелёный
      contrastText: '#fff',
    },
    secondary: {
      main: '#dc004e', // розовый акцент
      contrastText: '#fff',
    },
    background: {
      default: '#f5f7f6', // общий фон страницы
      paper: '#ffffff',   // фон карточек и форм (например, Paper)
    },
    text: {
      primary: '#1a1a1a',
      secondary: '#555',
    },
  },

  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h5: {
      fontWeight: 600,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
      letterSpacing: 0.3,
    },
  },

  shape: {
    borderRadius: 10,
  },

  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '10px 20px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
          },
        },
      },
      defaultProps: {
        size: 'large',
        color: "primary",
        variant: "contained"
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
      defaultProps: {
        variant: "outlined"
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          padding: "32px",
          maxWidth: "400px",
          width: "100%",
          borderRadius: "16px"
        },
      },
      defaultProps: {
        elevation: 3,
      },
    },
  },
});

export default theme;

