/**
 * Configuração do cliente Axios para comunicação com a API
 * Inclui interceptors para autenticação e tratamento de erros
 */

import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { getToken } from '../storage/authStorage';
import { ApiError } from '../types/api';

// Configuração base da API - ALTERE PARA O IP/URL DO SEU SERVIDOR
const API_BASE_URL = 'http://192.168.0.190:8000/api'; // Exemplo: seu IP local ou URL do servidor

/**
 * Instância do Axios configurada
 */
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 segundos
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

/**
 * Interceptor de requisição
 * Adiciona o token de autenticação no header de todas as requisições
 */
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await getToken();
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

/**
 * Interceptor de resposta
 * Trata erros globais da API
 */
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError<ApiError>) => {
    // Tratamento de erros comuns
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          // Token inválido ou expirado
          console.error('Não autorizado. Token inválido ou expirado.');
          break;
        case 403:
          console.error('Acesso negado.');
          break;
        case 404:
          console.error('Recurso não encontrado.');
          break;
        case 422:
          // Erro de validação
          console.error('Erro de validação:', data.errors);
          break;
        case 500:
          console.error('Erro interno do servidor.');
          break;
        default:
          console.error('Erro na requisição:', data.message || 'Erro desconhecido');
      }
      
      return Promise.reject({
        message: data.message || 'Erro na requisição',
        errors: data.errors,
        status,
      } as ApiError);
    }
    
    if (error.request) {
      // Requisição foi feita mas não houve resposta
      console.error('Sem resposta do servidor. Verifique sua conexão.');
      return Promise.reject({
        message: 'Sem conexão com o servidor. Verifique sua internet.',
        status: 0,
      } as ApiError);
    }
    
    // Erro na configuração da requisição
    console.error('Erro ao configurar requisição:', error.message);
    return Promise.reject({
      message: error.message || 'Erro desconhecido',
      status: 0,
    } as ApiError);
  }
);

export default api;
