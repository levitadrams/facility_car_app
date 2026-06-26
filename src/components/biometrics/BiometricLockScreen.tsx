/**
 * Tela de Bloqueio Biométrico
 *
 * Exibida quando o usuário tem biometria ativada e o app
 * retorna do segundo plano ou inicia.
 *
 * Oferece:
 * - Botão para tentar biometria novamente
 * - Link para entrar com senha (logout seguro)
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface BiometricLockScreenProps {
  onRetryBiometry: () => void;
  onLoginWithPassword: () => void;
  isAuthenticating: boolean;
}

export default function BiometricLockScreen({
  onRetryBiometry,
  onLoginWithPassword,
  isAuthenticating,
}: BiometricLockScreenProps) {
  return (
    <View style={styles.container}>
      {/* Ícone de cadeado */}
      <View style={styles.iconContainer}>
        <Ionicons name="lock-closed" size={64} color="#F5A623" />
      </View>

      {/* Título */}
      <Text style={styles.title}>App Bloqueado</Text>

      {/* Descrição */}
      <Text style={styles.description}>
        Use sua biometria para desbloquear o aplicativo e continuar.
      </Text>

      {/* Botão principal: Tentar Biometria */}
      <TouchableOpacity
        style={[styles.button, isAuthenticating && styles.buttonDisabled]}
        onPress={onRetryBiometry}
        disabled={isAuthenticating}
        activeOpacity={0.8}
      >
        {isAuthenticating ? (
          <ActivityIndicator color="#1A1A1A" />
        ) : (
          <>
            <Ionicons
              name="finger-print"
              size={20}
              color="#1A1A1A"
              style={styles.buttonIcon}
            />
            <Text style={styles.buttonText}>Tentar Biometria Novamente</Text>
          </>
        )}
      </TouchableOpacity>

      {/* Link secundário: Entrar com senha */}
      <TouchableOpacity
        style={styles.linkButton}
        onPress={onLoginWithPassword}
        disabled={isAuthenticating}
      >
        <Text style={styles.linkText}>Entrar com senha</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A1A',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(245, 166, 35, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#AAAAAA',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 22,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5A623',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    width: '100%',
    marginBottom: 16,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  linkButton: {
    paddingVertical: 12,
  },
  linkText: {
    fontSize: 14,
    color: '#F5A623',
    textDecorationLine: 'underline',
  },
});
