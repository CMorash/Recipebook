import { createTheme } from '@mui/material/styles'

const theme = createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: '#51503C',
        light: '#91907C',
        dark: '#31302C',
      },
      secondary: {
        main: '#3B3C35',
        light: '#4B4C45',
        dark: '#2B2C25',
      },
      background: {
        default: '#3E3A37',
        paper: '#73736C',
      },
      text: {
        primary: '#EAE9E6',
        secondary: '#DAD9D6',
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

