/**
 * Serviço de autenticação
 * Responsável por todas as operações relacionadas à autenticação
 */

import api from './api';
import { LoginCredentials, RegisterData, AuthResponse, User } from '../types/auth';
import { ApiResponse } from '../types/api';

/**
 * Realiza o login do usuário
 */
export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  try {
    const response = await api.post<AuthResponse>('/login', credentials);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Registra um novo usuário
 */
export const register = async (data: RegisterData): Promise<AuthResponse> => {
  try {
    const response = await api.post<AuthResponse>('/register', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Busca os dados do usuário autenticado
 */
export const me = async (): Promise<User> => {
  try {
    const response = await api.get<User>('/me');
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Realiza o logout do usuário (revoga o token atual)
 */
export const logout = async (): Promise<void> => {
  try {
    await api.post('/logout');
  } catch (error) {
    // Mesmo se falhar na API, vamos limpar localmente
    console.error('Erro ao fazer logout na API:', error);
    throw error;
  }
};
