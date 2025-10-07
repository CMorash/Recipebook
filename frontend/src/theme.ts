import { createTheme } from '@mui/material/styles'

const theme = createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: '#10B981', // Bright green
        light: '#34D399',
        dark: '#059669',
      },
      secondary: {
        main: '#F59E0B', // Amber
        light: '#FBBF24',
        dark: '#D97706',
      },
      background: {
        default: '#111827',
        paper: '#1F2937',
      },
      text: {
        primary: '#F9FAFB',
        secondary: '#D1D5DB',
      },
    },
  typography: {
    fontFamily: '"Inter", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
  },
    shape: {
      borderRadius: 12,
    },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05))',
        },
      },
    },
  },
  })
  

export default theme

