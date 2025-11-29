'use client';

import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { getTheme } from '../theme/astracoreTheme';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  resolvedMode: 'light' | 'dark';
  toggleTheme: () => void;
  systemTheme: 'light' | 'dark';
}

const THEME_STORAGE_KEY = 'astracore-theme-mode';

const ThemeContext = createContext<ThemeContextType>({
  mode: 'system',
  setMode: () => {},
  resolvedMode: 'light',
  toggleTheme: () => {},
  systemTheme: 'light',
});

export const useTheme = () => useContext(ThemeContext);

/**
 * Hook to get the system theme preference
 * @returns 'light' | 'dark' based on prefers-color-scheme
 */
export const useSystemTheme = (): 'light' | 'dark' => {
  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window === 'undefined') return 'light';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? 'dark' : 'light');
    };

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, []);

  return systemTheme;
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemTheme = useSystemTheme();
  const [mode, setModeState] = useState<ThemeMode>(() => {
    if (typeof window === 'undefined') return 'system';
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === 'light' || stored === 'dark' || stored === 'system') {
      return stored;
    }
    return 'system';
  });
  
  const [resolvedMode, setResolvedMode] = useState<'light' | 'dark'>(() => {
    if (typeof window === 'undefined') return 'light';
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') {
      return stored;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  // Update resolved mode when mode or system theme changes
  useEffect(() => {
    if (mode === 'system') {
      setResolvedMode(systemTheme);
    } else {
      setResolvedMode(mode);
    }
  }, [mode, systemTheme]);

  // Persist mode to localStorage
  const setMode = useCallback((newMode: ThemeMode) => {
    setModeState(newMode);
    if (typeof window !== 'undefined') {
      localStorage.setItem(THEME_STORAGE_KEY, newMode);
    }
  }, []);

  // Update the HTML class for Tailwind dark mode
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(resolvedMode);
  }, [resolvedMode]);

  const toggleTheme = useCallback(() => {
    setMode((prev) => {
      if (prev === 'light') return 'dark';
      if (prev === 'dark') return 'system';
      return 'light';
    });
  }, [setMode]);

  const theme = useMemo(() => getTheme(resolvedMode), [resolvedMode]);

  const contextValue = useMemo(
    () => ({
      mode,
      setMode,
      resolvedMode,
      toggleTheme,
      systemTheme,
    }),
    [mode, setMode, resolvedMode, toggleTheme, systemTheme]
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
}
