'use client';

import { createTheme, alpha, ThemeOptions } from '@mui/material/styles';

// AstraCore Material You Color Tokens - Light Mode
const lightColors = {
  // Primary - Celestial Core Blue
  primary: '#00529D', // 40
  onPrimary: '#FFFFFF', // 100
  primaryContainer: '#D3E6FF', // 90
  onPrimaryContainer: '#001A33', // 10
  inversePrimary: '#8BC0FF', // 80

  // Secondary - Cosmic Magenta
  secondary: '#93018F', // 40
  onSecondary: '#FFFFFF', // 100
  secondaryContainer: '#F9D7F6', // 90
  onSecondaryContainer: '#30002D', // 10

  // Tertiary - Solar Amber
  tertiary: '#B48B00', // 40
  onTertiary: '#FFFFFF', // 100
  tertiaryContainer: '#FAECC7', // 90
  onTertiaryContainer: '#332800', // 10

  // Error
  error: '#BA1A1A',
  onError: '#FFFFFF',
  errorContainer: '#FFDAD6',
  onErrorContainer: '#410002',

  // Surface - Nebula Gray
  background: '#FCFCFD', // N 99
  onBackground: '#1A1A1D', // N 10
  surface: '#FCFCFD', // N 99
  onSurface: '#1A1A1D', // N 10
  surfaceVariant: '#ECECF3', // NV 90
  onSurfaceVariant: '#474750', // NV 30
  surfaceTint: '#00529D', // Primary 40

  // Surface Containers
  surfaceContainerLowest: '#FFFFFF', // N 100
  surfaceContainerLow: '#F4F4F5', // N 95
  surfaceContainer: '#E9E9EA', // N 90
  surfaceContainerHigh: '#D2D2D3', // N 80
  surfaceContainerHighest: '#AEAEAF', // N 70

  // Outline - Orion Steel
  outline: '#72727D', // NV 50
  outlineVariant: '#D9D9E2', // NV 80

  // Inverse
  inverseSurface: '#2C2C2F', // N 20
  inverseOnSurface: '#F4F4F5', // N 95

  // Shadow & Scrim
  shadow: 'rgba(0, 0, 0, 0.2)',
  scrim: 'rgba(0, 0, 0, 0.32)',
};

// AstraCore Material You Color Tokens - Dark Mode
const darkColors = {
  // Primary - Celestial Core Blue
  primary: '#8BC0FF', // 80
  onPrimary: '#002E57', // 20
  primaryContainer: '#00407A', // 30
  onPrimaryContainer: '#D3E6FF', // 90
  inversePrimary: '#00529D', // 40

  // Secondary - Cosmic Magenta
  secondary: '#F19CE7', // 80
  onSecondary: '#51004E', // 20
  secondaryContainer: '#72006F', // 30
  onSecondaryContainer: '#F9D7F6', // 90

  // Tertiary - Solar Amber
  tertiary: '#F8DD94', // 80
  onTertiary: '#604900', // 20
  tertiaryContainer: '#8A6A00', // 30
  onTertiaryContainer: '#FAECC7', // 90

  // Error
  error: '#FFB4AB',
  onError: '#690005',
  errorContainer: '#93000A',
  onErrorContainer: '#FFDAD6',

  // Surface - Nebula Gray
  background: '#1A1A1D', // N 10
  onBackground: '#E9E9EA', // N 90
  surface: '#1A1A1D', // N 10
  onSurface: '#E9E9EA', // N 90
  surfaceVariant: '#474750', // NV 30
  onSurfaceVariant: '#D9D9E2', // NV 80
  surfaceTint: '#8BC0FF', // Primary 80

  // Surface Containers
  surfaceContainerLowest: '#000000', // N 0
  surfaceContainerLow: '#1A1A1D', // N 10
  surfaceContainer: '#2C2C2F', // N 20
  surfaceContainerHigh: '#3D3D40', // N 30
  surfaceContainerHighest: '#515154', // N 40

  // Outline - Orion Steel
  outline: '#93939F', // NV 60
  outlineVariant: '#474750', // NV 30

  // Inverse
  inverseSurface: '#E9E9EA', // N 90
  inverseOnSurface: '#2C2C2F', // N 20

  // Shadow & Scrim
  shadow: 'rgba(0, 0, 0, 0.2)',
  scrim: 'rgba(0, 0, 0, 0.32)',
};

// Material You Elevation Shadows
const elevationShadows = {
  0: 'none',
  1: '0px 1px 2px 0px rgba(0, 0, 0, 0.3), 0px 1px 3px 1px rgba(0, 0, 0, 0.15)',
  2: '0px 1px 2px 0px rgba(0, 0, 0, 0.3), 0px 2px 6px 2px rgba(0, 0, 0, 0.15)',
  3: '0px 1px 3px 0px rgba(0, 0, 0, 0.3), 0px 4px 8px 3px rgba(0, 0, 0, 0.15)',
  4: '0px 2px 3px 0px rgba(0, 0, 0, 0.3), 0px 6px 10px 4px rgba(0, 0, 0, 0.15)',
  5: '0px 4px 4px 0px rgba(0, 0, 0, 0.3), 0px 8px 12px 6px rgba(0, 0, 0, 0.15)',
};

export const getTheme = (mode: 'light' | 'dark') => {
  const isDark = mode === 'dark';
  const colors = isDark ? darkColors : lightColors;

  const themeOptions: ThemeOptions = {
    palette: {
      mode,
      primary: {
        main: colors.primary,
        light: isDark ? '#D3E6FF' : '#2D7FDD',
        dark: isDark ? '#00407A' : '#002E57',
        contrastText: colors.onPrimary,
      },
      secondary: {
        main: colors.secondary,
        light: isDark ? '#F9D7F6' : '#CE48C8',
        dark: isDark ? '#72006F' : '#51004E',
        contrastText: colors.onSecondary,
      },
      tertiary: {
        main: colors.tertiary,
        light: isDark ? '#FAECC7' : '#EBBD33',
        dark: isDark ? '#8A6A00' : '#604900',
        contrastText: colors.onTertiary,
      },
      error: {
        main: colors.error,
        light: colors.errorContainer,
        dark: isDark ? '#93000A' : '#410002',
        contrastText: colors.onError,
      },
      background: {
        default: colors.background,
        paper: colors.surface,
      },
      text: {
        primary: colors.onSurface,
        secondary: colors.onSurfaceVariant,
        disabled: alpha(colors.onSurface, 0.38),
      },
      divider: colors.outlineVariant,
      // Custom Material You tokens
      action: {
        active: colors.onSurface,
        hover: alpha(colors.onSurface, 0.08),
        selected: alpha(colors.primary, 0.12),
        disabled: alpha(colors.onSurface, 0.38),
        disabledBackground: alpha(colors.onSurface, 0.12),
      },
    },
    typography: {
      fontFamily: '"Google Sans", "Roboto Flex", "Roboto", "Helvetica", "Arial", sans-serif',
      // Material You Type Scale
      h1: {
        fontFamily: '"Google Sans", sans-serif',
        fontSize: '3.5625rem', // 57px - Display Large
        lineHeight: 1.12,
        fontWeight: 400,
        letterSpacing: '-0.015625em',
      },
      h2: {
        fontFamily: '"Google Sans", sans-serif',
        fontSize: '2.8125rem', // 45px - Display Medium
        lineHeight: 1.16,
        fontWeight: 400,
        letterSpacing: '0em',
      },
      h3: {
        fontFamily: '"Google Sans", sans-serif',
        fontSize: '2.25rem', // 36px - Display Small
        lineHeight: 1.22,
        fontWeight: 400,
        letterSpacing: '0em',
      },
      h4: {
        fontFamily: '"Google Sans", sans-serif',
        fontSize: '2rem', // 32px - Headline Large
        lineHeight: 1.25,
        fontWeight: 400,
        letterSpacing: '0em',
      },
      h5: {
        fontFamily: '"Google Sans", sans-serif',
        fontSize: '1.75rem', // 28px - Headline Medium
        lineHeight: 1.29,
        fontWeight: 400,
        letterSpacing: '0em',
      },
      h6: {
        fontFamily: '"Google Sans", sans-serif',
        fontSize: '1.5rem', // 24px - Headline Small
        lineHeight: 1.33,
        fontWeight: 400,
        letterSpacing: '0em',
      },
      subtitle1: {
        fontFamily: '"Roboto Flex", sans-serif',
        fontSize: '1rem', // 16px - Title Large
        lineHeight: 1.5,
        fontWeight: 500,
        letterSpacing: '0.009375em',
      },
      subtitle2: {
        fontFamily: '"Roboto Flex", sans-serif',
        fontSize: '0.875rem', // 14px - Title Medium
        lineHeight: 1.43,
        fontWeight: 500,
        letterSpacing: '0.00625em',
      },
      body1: {
        fontFamily: '"Roboto Flex", sans-serif',
        fontSize: '1rem', // 16px - Body Large
        lineHeight: 1.5,
        fontWeight: 400,
        letterSpacing: '0.03125em',
      },
      body2: {
        fontFamily: '"Roboto Flex", sans-serif',
        fontSize: '0.875rem', // 14px - Body Medium
        lineHeight: 1.43,
        fontWeight: 400,
        letterSpacing: '0.015625em',
      },
      button: {
        fontFamily: '"Roboto Flex", sans-serif',
        fontSize: '0.875rem', // 14px - Label Large
        lineHeight: 1.43,
        fontWeight: 500,
        letterSpacing: '0.00625em',
        textTransform: 'none',
      },
      caption: {
        fontFamily: '"Roboto Flex", sans-serif',
        fontSize: '0.75rem', // 12px - Body Small
        lineHeight: 1.33,
        fontWeight: 400,
        letterSpacing: '0.025em',
      },
      overline: {
        fontFamily: '"Roboto Flex", sans-serif',
        fontSize: '0.625rem', // 10px - Label Small
        lineHeight: 1.6,
        fontWeight: 500,
        letterSpacing: '0.09375em',
        textTransform: 'uppercase',
      },
    },
    shape: {
      borderRadius: 12, // Medium (default)
    },
    shadows: [
      'none',
      elevationShadows[1],
      elevationShadows[2],
      elevationShadows[3],
      elevationShadows[4],
      elevationShadows[5],
      elevationShadows[5],
      elevationShadows[5],
      elevationShadows[5],
      elevationShadows[5],
      elevationShadows[5],
      elevationShadows[5],
      elevationShadows[5],
      elevationShadows[5],
      elevationShadows[5],
      elevationShadows[5],
      elevationShadows[5],
      elevationShadows[5],
      elevationShadows[5],
      elevationShadows[5],
      elevationShadows[5],
      elevationShadows[5],
      elevationShadows[5],
      elevationShadows[5],
      elevationShadows[5],
    ],
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 20, // Material You pill shape
            padding: '10px 24px',
            fontWeight: 500,
            textTransform: 'none',
            minWidth: '64px',
            transition: 'all 0.2s cubic-bezier(0.2, 0.0, 0, 1.0)',
          },
          contained: {
            boxShadow: elevationShadows[1],
            '&:hover': {
              boxShadow: elevationShadows[2],
            },
            '&:active': {
              boxShadow: elevationShadows[1],
            },
            '&.Mui-disabled': {
              boxShadow: 'none',
            },
          },
          outlined: {
            borderWidth: '1px',
            '&:hover': {
              borderWidth: '1px',
            },
          },
          text: {
            '&:hover': {
              backgroundColor: alpha(colors.primary, 0.08),
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16, // Large
            backgroundImage: 'none',
            backgroundColor: colors.surfaceContainer,
            boxShadow: elevationShadows[1],
            transition: 'all 0.2s cubic-bezier(0.2, 0.0, 0, 1.0)',
            '&:hover': {
              boxShadow: elevationShadows[2],
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            backgroundColor: colors.surface,
          },
          elevation0: {
            boxShadow: elevationShadows[0],
          },
          elevation1: {
            boxShadow: elevationShadows[1],
          },
          elevation2: {
            boxShadow: elevationShadows[2],
          },
          elevation3: {
            boxShadow: elevationShadows[3],
          },
          elevation4: {
            boxShadow: elevationShadows[4],
          },
          elevation5: {
            boxShadow: elevationShadows[5],
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: colors.surface,
            color: colors.onSurface,
            boxShadow: 'none',
            borderBottom: `1px solid ${colors.outlineVariant}`,
            backgroundImage: 'none',
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 8, // Small
              backgroundColor: colors.surfaceContainerHighest,
              '&:hover': {
                backgroundColor: colors.surfaceContainerHigh,
              },
              '&.Mui-focused': {
                backgroundColor: colors.surfaceContainerHighest,
              },
              '& fieldset': {
                borderColor: colors.outline,
              },
              '&:hover fieldset': {
                borderColor: colors.onSurface,
              },
              '&.Mui-focused fieldset': {
                borderColor: colors.primary,
                borderWidth: '2px',
              },
            },
            '& .MuiInputLabel-root': {
              color: colors.onSurfaceVariant,
              '&.Mui-focused': {
                color: colors.primary,
              },
            },
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            borderRadius: 20, // Material You icon button
            padding: '12px',
            transition: 'all 0.2s cubic-bezier(0.2, 0.0, 0, 1.0)',
            '&:hover': {
              backgroundColor: alpha(colors.onSurface, 0.08),
            },
            '&:active': {
              backgroundColor: alpha(colors.onSurface, 0.12),
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 8, // Small
            height: '32px',
            backgroundColor: colors.surfaceContainerHigh,
            color: colors.onSurface,
            '&:hover': {
              backgroundColor: colors.surfaceContainerHighest,
            },
          },
          filled: {
            backgroundColor: colors.surfaceContainerHighest,
          },
        },
      },
      MuiDivider: {
        styleOverrides: {
          root: {
            borderColor: colors.outlineVariant,
          },
        },
      },
      MuiList: {
        styleOverrides: {
          root: {
            backgroundColor: colors.surface,
          },
        },
      },
      MuiListItemButton: {
        styleOverrides: {
          root: {
            borderRadius: 12, // Medium
            margin: '4px 8px',
            '&:hover': {
              backgroundColor: alpha(colors.onSurface, 0.08),
            },
            '&.Mui-selected': {
              backgroundColor: alpha(colors.primary, 0.12),
              color: colors.primary,
              '&:hover': {
                backgroundColor: alpha(colors.primary, 0.16),
              },
            },
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: colors.surfaceContainer,
            borderRight: `1px solid ${colors.outlineVariant}`,
          },
        },
      },
    },
  };

  return createTheme(themeOptions);
};
