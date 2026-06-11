/**
 * Storage para gerenciar autenticação usando AsyncStorage
 * Persiste token e dados do usuário no dispositivo
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../types/auth';

const TOKEN_KEY = '@FacilityCar:token';
const USER_KEY = '@FacilityCar:user';

/**
 * Salva o token de autenticação
 */
export const saveToken = async (token: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(TOKEN_KEY, token);
  } catch (error) {
    console.error('Erro ao salvar token:', error);
    throw error;
  }
};

/**
 * Recupera o token de autenticação
 */
export const getToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(TOKEN_KEY);
  } catch (error) {
    console.error('Erro ao recuperar token:', error);
    return null;
  }
};

/**
 * Remove o token de autenticação
 */
export const removeToken = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(TOKEN_KEY);
  } catch (error) {
    console.error('Erro ao remover token:', error);
    throw error;
  }
};

/**
 * Salva os dados do usuário
 */
export const saveUser = async (user: User): Promise<void> => {
  try {
    const userData = JSON.stringify(user);
    await AsyncStorage.setItem(USER_KEY, userData);
  } catch (error) {
    console.error('Erro ao salvar usuário:', error);
    throw error;
  }
};

/**
 * Recupera os dados do usuário
 */
export const getUser = async (): Promise<User | null> => {
  try {
    const userData = await AsyncStorage.getItem(USER_KEY);
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Erro ao recuperar usuário:', error);
    return null;
  }
};

/**
 * Remove os dados do usuário
 */
export const removeUser = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(USER_KEY);
  } catch (error) {
    console.error('Erro ao remover usuário:', error);
    throw error;
  }
};

/**
 * Limpa todos os dados de autenticação
 */
export const clearAuth = async (): Promise<void> => {
  try {
    await Promise.all([removeToken(), removeUser()]);
  } catch (error) {
    console.error('Erro ao limpar autenticação:', error);
    throw error;
  }
};
