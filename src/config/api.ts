/**
 * Configurações da API
 *
 * Centraliza URLs, timeouts e headers padrão.
 */

export const apiConfig = {
  /**
   * URL base da API
   * Pode ser sobrescrita via variável de ambiente.
   */
  baseURL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000/api',

  /**
   * Timeout padrão para requisições (ms)
   */
  timeout: 15000, // 15 segundos

  /**
   * Timeout para upload de arquivos (ms)
   */
  uploadTimeout: 60000, // 60 segundos

  /**
   * Headers padrão
   */
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
} as const;
