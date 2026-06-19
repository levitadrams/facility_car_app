/**
 * App Principal
 * Configuração inicial do aplicativo com Provider de Autenticação
 */

import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/contexts/AuthContext';
import { ThemeProvider } from './src/contexts/ThemeContext';
import Routes from './src/navigation';

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <StatusBar style="auto" />
          <Routes />
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
