/**
 * App Principal
 * Configuração inicial do aplicativo com Provider de Autenticação
 */

import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from './src/contexts/AuthContext';
import Routes from './src/navigation';

export default function App() {
  return (
    <AuthProvider>
      <StatusBar style="auto" />
      <Routes />
    </AuthProvider>
  );
}
