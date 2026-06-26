/**
 * Tela de Desbloqueio por Credenciais
 *
 * Exibida quando o usuário escolheu "Credenciais"
 * como método de desbloqueio ao abrir o app.
 *
 * Oferece login rápido com email pré-preenchido.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface CredentialLockScreenProps {
  userEmail: string;
  onUnlock: (password: string) => Promise<void>;
  onLogout: () => void;
  isLoading: boolean;
  errorMessage?: string;
}

export default function CredentialLockScreen({
  userEmail,
  onUnlock,
  onLogout,
  isLoading,
  errorMessage,
}: CredentialLockScreenProps) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit() {
    if (!password.trim()) return;
    await onUnlock(password);
  }

  return (
    <View style={styles.container}>
      {/* Ícone de cadeado */}
      <View style={styles.iconContainer}>
        <Ionicons name="lock-closed" size={64} color="#F5A623" />
      </View>

      {/* Título */}
      <Text style={styles.title}>App Bloqueado</Text>
      <Text style={styles.description}>
        Digite sua senha para continuar.
      </Text>

      {/* Email (pré-preenchido, somente leitura) */}
      <View style={styles.inputContainer}>
        <Ionicons name="mail-outline" size={20} color="#888" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          value={userEmail}
          editable={false}
          placeholderTextColor="#888"
        />
      </View>

      {/* Senha */}
      <View style={styles.inputContainer}>
        <Ionicons name="key-outline" size={20} color="#888" style={styles.inputIcon} />
        <TextInput
          style={[styles.input, styles.inputFlex]}
          placeholder="Senha"
          placeholderTextColor="#888"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
          autoFocus
          onSubmitEditing={handleSubmit}
        />
        <TouchableOpacity
          onPress={() => setShowPassword(!showPassword)}
          style={styles.eyeIcon}
        >
          <Ionicons
            name={showPassword ? 'eye-off-outline' : 'eye-outline'}
            size={20}
            color="#888"
          />
        </TouchableOpacity>
      </View>

      {/* Mensagem de erro */}
      {errorMessage ? (
        <Text style={styles.errorText}>{errorMessage}</Text>
      ) : null}

      {/* Botão desbloquear */}
      <TouchableOpacity
        style={[styles.button, (!password || isLoading) && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={!password || isLoading}
        activeOpacity={0.8}
      >
        {isLoading ? (
          <ActivityIndicator color="#1A1A1A" />
        ) : (
          <Text style={styles.buttonText}>Desbloquear</Text>
        )}
      </TouchableOpacity>

      {/* Link para sair */}
      <TouchableOpacity style={styles.linkButton} onPress={onLogout}>
        <Text style={styles.linkText}>Sair da conta</Text>
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
    marginBottom: 8,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#AAAAAA',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2A2A2A',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 12,
    width: '100%',
    height: 52,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
  },
  inputFlex: {
    flex: 1,
  },
  eyeIcon: {
    padding: 8,
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 14,
    marginBottom: 12,
    textAlign: 'center',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5A623',
    borderRadius: 12,
    paddingVertical: 16,
    width: '100%',
    marginTop: 16,
    marginBottom: 16,
  },
  buttonDisabled: {
    opacity: 0.5,
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
