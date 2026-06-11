/**
 * Navegação Principal
 * Gerencia qual stack de navegação exibir baseado no estado de autenticação
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';
import AuthRoutes from './AuthRoutes';
import AppRoutes from './AppRoutes';
import Loading from '../components/Loading';

export default function Routes() {
  const { user, loading } = useAuth();

  // Exibe loading enquanto verifica autenticação
  if (loading) {
    return <Loading message="Carregando..." />;
  }

  return (
    <NavigationContainer>
      {user ? <AppRoutes /> : <AuthRoutes />}
    </NavigationContainer>
  );
}
