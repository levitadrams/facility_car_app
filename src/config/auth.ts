/**
 * Configurações de Autenticação
 *
 * Centraliza todas as constantes e configurações relacionadas
 * ao sistema de autenticação e sessão do aplicativo.
 *
 * Exemplo de uso:
 *   import { authConfig } from '@/config/auth';
 *   const timeout = authConfig.inactivityTimeout;
 */

export const authConfig = {
  /**
   * Tempo máximo que o app pode ficar em segundo plano
   * antes de deslogar o usuário automaticamente.
   *
   * Padrão: 30 minutos (em milissegundos)
   *
   * Recomendações por perfil:
   *   - Motoristas de app: 30 minutos
   *   - Entregadores: 15 minutos
   *   - Administradores: 60 minutos
   */
  inactivityTimeout: 1 * 60 * 1000, // 30 minutos

  /**
   * Tempo de expiração do token em cache (ms)
   * Usado para decidir se precisa revalidar com o backend
   */
  tokenCacheDuration: 5 * 60 * 1000, // 5 minutos

  /**
   * Número máximo de tentativas de login antes de bloquear
   */
  maxLoginAttempts: 5,

  /**
   * Tempo de bloqueio após exceder tentativas (ms)
   */
  lockoutDuration: 15 * 60 * 1000, // 15 minutos
} as const;

/**
 * Chaves usadas no SecureStore / AsyncStorage
 */
export const authStorageKeys = {
  token: '@facilitycar:token',
  user: '@facilitycar:user',
  refreshToken: '@facilitycar:refresh_token',
  lastActive: '@facilitycar:last_active_timestamp',
} as const;
