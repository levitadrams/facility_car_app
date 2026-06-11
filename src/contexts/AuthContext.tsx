/**
 * Context de Autenticação
 * Gerencia o estado global de autenticação do aplicativo
 */

import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { Alert } from 'react-native';
import { AuthContextData, LoginCredentials, User } from '../types/auth';
import * as authService from '../services/authService';
import * as authStorage from '../storage/authStorage';
import { ApiError } from '../types/api';

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  /**
   * Carrega os dados de autenticação ao iniciar o app
   */
  useEffect(() => {
    loadStorageData();
  }, []);

  /**
   * Recupera token e usuário do storage
   */
  async function loadStorageData(): Promise<void> {
    try {
      const storedToken = await authStorage.getToken();
      const storedUser = await authStorage.getUser();

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(storedUser);
        
        // Valida o token buscando os dados atualizados do usuário
        try {
          const userData = await authService.me();
          setUser(userData);
          await authStorage.saveUser(userData);
        } catch (error) {
          // Se o token for inválido, limpa a sessão
          console.error('Token inválido, limpando sessão');
          await handleInvalidSession();
        }
      }
    } catch (error) {
      console.error('Erro ao carregar dados do storage:', error);
    } finally {
      setLoading(false);
    }
  }

  /**
   * Limpa a sessão quando o token é inválido
   */
  async function handleInvalidSession(): Promise<void> {
    setUser(null);
    setToken(null);
    await authStorage.clearAuth();
  }

  /**
   * Realiza o login
   */
  async function signIn(credentials: LoginCredentials): Promise<void> {
    try {
      const response = await authService.login(credentials);
      
      setUser(response.user);
      setToken(response.token);
      
      await authStorage.saveToken(response.token);
      await authStorage.saveUser(response.user);
    } catch (error) {
      const apiError = error as ApiError;
      
      // Trata erros específicos
      if (apiError.status === 401) {
        throw new Error('Email ou senha incorretos');
      } else if (apiError.status === 0) {
        throw new Error('Sem conexão com o servidor');
      } else if (apiError.errors) {
        // Erros de validação
        const firstError = Object.values(apiError.errors)[0];
        throw new Error(firstError?.[0] || 'Erro ao fazer login');
      }
      
      throw new Error(apiError.message || 'Erro ao fazer login');
    }
  }

  /**
   * Realiza o logout
   */
  async function signOut(): Promise<void> {
    try {
      // Tenta fazer logout na API
      await authService.logout();
    } catch (error) {
      console.error('Erro ao fazer logout na API:', error);
      // Continua com logout local mesmo se falhar na API
    } finally {
      // Sempre limpa os dados locais
      setUser(null);
      setToken(null);
      await authStorage.clearAuth();
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook para usar o contexto de autenticação
 */
export function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }

  return context;
}
