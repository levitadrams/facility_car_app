/**
 * Configurações de Autenticação Biométrica
 *
 * Centraliza chaves e constantes relacionadas à biometria.
 *
 * Uso:
 *   import { biometricsConfig } from '@/config/biometrics';
 */

export const biometricsConfig = {
  /**
   * Chave usada no AsyncStorage para verificar
   * se o usuário ativou a biometria.
   */
  storageKey: '@app_use_biometrics',

  /**
   * Chave usada no AsyncStorage para armazenar
   * email do usuário quando biometria está ativa.
   */
  emailKey: '@app_biometric_email',

  /**
   * Chave usada no AsyncStorage para armazenar
   * senha do usuário quando biometria está ativa.
   */
  passwordKey: '@app_biometric_password',

  /**
   * Mensagem exibida no prompt nativo de biometria.
   */
  promptMessage: 'Autentique-se para entrar no app',

  /**
   * Texto alternativo para fallback (botão Cancelar no iOS).
   */
  cancelLabel: 'Cancelar',

  /**
   * Exibe fallback para senha caso biometria falhe.
   */
  fallbackLabel: 'Usar senha',
} as const;
