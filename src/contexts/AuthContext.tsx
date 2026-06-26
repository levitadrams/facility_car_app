/**
 * Context de Autenticação
 * Gerencia o estado global de autenticação do aplicativo
 */

import React, { createContext, useState, useEffect, useContext, ReactNode, useRef } from 'react';
import { Alert, AppState, AppStateStatus } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContextData, LoginCredentials, RegisterData, User } from '../types/auth';
import * as authService from '../services/authService';
import * as authStorage from '../storage/authStorage';
import { ApiError } from '../types/api';
import { authConfig } from '../config/auth';
import { biometricsConfig } from '../config/biometrics';

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  // Controle de inatividade
  const appState = useRef(AppState.currentState);
  const backgroundTimestamp = useRef<number | null>(null);
  
  // Usa configuração centralizada de autenticação
  const INACTIVITY_TIMEOUT = authConfig.inactivityTimeout;

  /**
   * Carrega os dados de autenticação ao iniciar o app
   */
  useEffect(() => {
    loadStorageData();
  }, []);

  /**
   * Monitora o estado do aplicativo para detectar inatividade
   * Desloga automaticamente se o app ficar em segundo plano por muito tempo
   */
  useEffect(() => {
    // Só monitora se o usuário estiver autenticado
    if (!user || !token) {
      return;
    }

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription.remove();
    };
  }, [user, token]);

  /**
   * Manipula mudanças no estado do aplicativo
   */
  function handleAppStateChange(nextAppState: AppStateStatus): void {
    // App indo para segundo plano
    if (
      appState.current.match(/active/) &&
      nextAppState.match(/inactive|background/)
    ) {
      // Registra o timestamp de quando o app foi para segundo plano
      backgroundTimestamp.current = Date.now();
      console.log('App foi para segundo plano:', new Date(backgroundTimestamp.current).toLocaleTimeString());
    }

    // App voltando para primeiro plano
    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      checkInactivityTimeout();
    }

    appState.current = nextAppState;
  }

  /**
   * Verifica se o tempo de inatividade excedeu o limite
   */
  async function checkInactivityTimeout(): Promise<void> {
    if (!backgroundTimestamp.current) {
      return;
    }

    const currentTime = Date.now();
    const inactiveTime = currentTime - backgroundTimestamp.current;
    const inactiveMinutes = Math.floor(inactiveTime / 60000);

    console.log(`App voltou ao primeiro plano. Tempo inativo: ${inactiveMinutes} minutos`);

    // Se o tempo de inatividade excedeu o limite, desloga
    if (inactiveTime > INACTIVITY_TIMEOUT) {
      console.log('Tempo de inatividade excedido. Deslogando usuário...');
      
      Alert.alert(
        'Sessão Expirada',
        `Por segurança, sua sessão foi encerrada após ${Math.floor(INACTIVITY_TIMEOUT / 60000)} minutos de inatividade.`,
        [
          {
            text: 'OK',
            onPress: async () => {
              await signOut();
            },
          },
        ],
        { cancelable: false }
      );
    } else {
      console.log('Tempo de inatividade dentro do limite. Usuário continua logado.');
    }

    // Reseta o timestamp
    backgroundTimestamp.current = null;
  }

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
          setLoading(false);
          return;
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

      // Salva credenciais para auto-login por biometria
      try {
        const useBiometrics = await AsyncStorage.getItem(biometricsConfig.storageKey);
        if (useBiometrics === 'true') {
          await AsyncStorage.setItem(biometricsConfig.emailKey, credentials.email);
          await AsyncStorage.setItem(biometricsConfig.passwordKey, credentials.password);
        }
      } catch {
        // Falha silenciosa
      }
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
   * Realiza o registro de novo usuário
   */
  async function signUp(data: RegisterData): Promise<void> {
    try {
      await authService.register(data);
      // Não faz login automático, apenas registra
    } catch (error) {
      const apiError = error as ApiError;

      // Trata erros específicos
      if (apiError.status === 422 && apiError.errors) {
        // Erros de validação
        const firstError = Object.values(apiError.errors)[0];
        throw new Error(firstError?.[0] || 'Erro ao criar conta');
      } else if (apiError.status === 0) {
        throw new Error('Sem conexão com o servidor');
      }

      throw new Error(apiError.message || 'Erro ao criar conta');
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
        signUp,
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
