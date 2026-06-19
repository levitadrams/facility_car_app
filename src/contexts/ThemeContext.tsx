/**
 * ThemeContext
 * Gerencia a preferência de tema (light/dark/system) com persistência no AsyncStorage
 */

import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
  themeMode: ThemeMode;
  resolvedTheme: 'light' | 'dark';
  setThemeMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  themeMode: 'system',
  resolvedTheme: 'light',
  setThemeMode: () => {},
});

const STORAGE_KEY = '@facilitycar:themeMode';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemTheme = useColorScheme();
  const [themeMode, setThemeModeState] = useState<ThemeMode>('system');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((stored) => {
        if (stored === 'light' || stored === 'dark' || stored === 'system') {
          setThemeModeState(stored);
        }
      })
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  const resolvedTheme: 'light' | 'dark' =
    themeMode === 'system' ? (systemTheme === 'dark' ? 'dark' : 'light') : themeMode;

  const setThemeMode = useCallback(async (mode: ThemeMode) => {
    setThemeModeState(mode);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, mode);
    } catch {
      // ignore
    }
  }, []);

  if (!loaded) {
    return <>{children}</>;
  }

  return (
    <ThemeContext.Provider value={{ themeMode, resolvedTheme, setThemeMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeContext() {
  return useContext(ThemeContext);
}
