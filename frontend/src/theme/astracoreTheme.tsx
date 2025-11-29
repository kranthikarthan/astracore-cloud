'use client';

import { createTheme } from '@mui/material/styles';

// Define the AstraCore colors from the CSS variables to use in JS
const colors = {
  primary: {
    main: '#00529D', // 40
    light: '#5A9AF0', // 70
    dark: '#002E57', // 20
    contrastText: '#FFFFFF',
  },
  secondary: {
    main: '#93018F', // 40
    light: '#E36FD9', // 70
    dark: '#51004E', // 20
    contrastText: '#FFFFFF',
  },
  tertiary: {
    main: '#B48B00', // 40
    light: '#F4CF66', // 70
    dark: '#604900', // 20
    contrastText: '#FFFFFF',
  },
  error: {
    main: '#BA1A1A',
    light: '#FFDAD6',
    dark: '#410002',
    contrastText: '#FFFFFF',
  },
  background: {
    default: '#FCFCFD', // 99
    paper: '#FCFCFD', // 99
  },
  text: {
    primary: '#1A1A1D', // 10
    secondary: '#474750', // NV 30
  },
};

// Dark mode colors
const darkColors = {
  primary: {
    main: '#8BC0FF', // 80
    light: '#D3E6FF', // 90
    dark: '#00407A', // 30
    contrastText: '#002E57', // 20
  },
  secondary: {
    main: '#F19CE7', // 80
    light: '#F9D7F6', // 90
    dark: '#72006F', // 30
    contrastText: '#51004E', // 20
  },
  tertiary: {
    main: '#F8DD94', // 80
    light: '#FAECC7', // 90
    dark: '#8A6A00', // 30
    contrastText: '#604900', // 20
  },
  error: {
    main: '#FFB4AB',
    light: '#FFDAD6',
    dark: '#93000A',
    contrastText: '#690005',
  },
  background: {
    default: '#1A1A1D', // 10
    paper: '#1A1A1D', // 10
  },
  text: {
    primary: '#E9E9EA', // 90
    secondary: '#D9D9E2', // NV 80
  },
};

export const getTheme = (mode: 'light' | 'dark') => {
  const isDark = mode === 'dark';
  const palette = isDark ? darkColors : colors;

  return createTheme({
    palette: {
      mode,
      primary: palette.primary,
      secondary: palette.secondary,
      error: palette.error,
      background: palette.background,
      text: palette.text,
    },
    typography: {
      fontFamily: '"Google Sans", "Roboto Flex", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: { fontWeight: 600 },
      h2: { fontWeight: 600 },
      h3: { fontWeight: 600 },
      button: { textTransform: 'none', fontWeight: 500 },
    },
    shape: {
      borderRadius: 12, // md
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 20, // Full pill shape often used in M3
            padding: '10px 24px',
          },
          contained: {
            boxShadow: 'none',
            '&:hover': {
              boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.3), 0px 1px 3px 1px rgba(0, 0, 0, 0.15)',
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16, // lg
            backgroundImage: 'none', // Remove default overlay in dark mode
            backgroundColor: isDark ? '#2C2C2F' : '#FCFCFD', // Surface Container
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
          elevation1: {
            boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.3), 0px 1px 3px 1px rgba(0, 0, 0, 0.15)',
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: isDark ? '#1A1A1D' : '#FCFCFD',
            color: isDark ? '#E9E9EA' : '#1A1A1D',
            boxShadow: 'none',
            borderBottom: `1px solid ${isDark ? '#474750' : '#E9E9EA'}`,
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 8, // sm
            },
          },
        },
      },
    },
  });
};
