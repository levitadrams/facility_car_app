/**
 * Tela de Login
 * Autenticação do usuário com validação usando React Hook Form e Zod
 * Suporte a login por biometria (expo-local-authentication)
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as LocalAuthentication from 'expo-local-authentication';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { AuthStackParamList } from '../../navigation/AuthRoutes';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { useTheme } from '../../hooks/useTheme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { biometricsConfig } from '../../config/biometrics';

/**
 * Schema de validação com Zod
 */
const loginSchema = z.object({
  email: z
    .string({ message: 'Email é obrigatório' })
    .email('Email inválido')
    .min(1, 'Email é obrigatório'),
  password: z
    .string({ message: 'Senha é obrigatória' })
    .min(8, 'Senha deve ter no mínimo 8 caracteres'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginScreen() {
  const { signIn } = useAuth();
  const navigation = useNavigation<NavigationProp<AuthStackParamList>>();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [biometricAutoLogin, setBiometricAutoLogin] = useState(false);
  const [hasBiometricHardware, setHasBiometricHardware] = useState(false);
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  /**
   * REGRA A & B: Verifica configuração de biometria ao abrir a tela
   */
  useEffect(() => {
    async function checkBiometricConfig() {
      try {
        const hardware = await LocalAuthentication.hasHardwareAsync();
        setHasBiometricHardware(hardware);

        const useBiometrics = await AsyncStorage.getItem(biometricsConfig.storageKey);

        if (useBiometrics === 'true' && hardware) {
          // REGRA A: Biometria ativada → dispara sensor imediatamente
          setBiometricAutoLogin(true);
          await attemptBiometricLogin();
        } else {
          // REGRA B: Biometria desativada → mostra campos normais
          setBiometricAutoLogin(false);
        }
      } catch {
        setBiometricAutoLogin(false);
      }
    }

    checkBiometricConfig();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Tenta login via biometria (lê credenciais salvas)
   */
  async function attemptBiometricLogin(): Promise<void> {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: biometricsConfig.promptMessage,
        cancelLabel: biometricsConfig.cancelLabel,
        fallbackLabel: biometricsConfig.fallbackLabel,
        disableDeviceFallback: false,
      });

      if (result.success) {
        // Biometria confirmada → busca credenciais salvas
        const savedEmail = await AsyncStorage.getItem(biometricsConfig.emailKey);
        const savedPassword = await AsyncStorage.getItem(biometricsConfig.passwordKey);

        if (savedEmail && savedPassword) {
          setLoading(true);
          try {
            await signIn({ email: savedEmail, password: savedPassword });
            // Login automático bem-sucedido — navegação automática pelo AuthContext
          } catch (error: any) {
            Alert.alert('Erro ao fazer login', error.message || 'Credenciais salvas inválidas. Faça login manualmente.');
            setBiometricAutoLogin(false);
          } finally {
            setLoading(false);
          }
        } else {
          // Não tem credenciais salvas — mostra formulário
          setBiometricAutoLogin(false);
        }
      } else {
        // Usuário cancelou ou falhou → mostra formulário de login
        setBiometricAutoLogin(false);
      }
    } catch {
      setBiometricAutoLogin(false);
    }
  }

  /**
   * Botão "Entrar com Biometria" (REGRA B)
   */
  async function handleBiometricButton(): Promise<void> {
    await attemptBiometricLogin();
  }

  /**
   * Submete o formulário de login manual
   */
  async function onSubmit(data: LoginFormData) {
    setLoading(true);

    try {
      await signIn(data);
      // A navegação será automática via AuthContext
    } catch (error: any) {
      Alert.alert(
        'Erro ao fazer login',
        error.message || 'Ocorreu um erro ao tentar fazer login. Tente novamente.'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={[
        styles.container,
        {
          backgroundColor: theme.surface,
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
        },
      ]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          {/* Back Button */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color={theme.text} />
          </TouchableOpacity>

          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.text }]}>Bem-vindo de volta 👋</Text>
            <Text style={[styles.subtitle, { color: theme.textMuted }]}>
              {biometricAutoLogin
                ? 'Autenticando com biometria...'
                : 'Digite seu email e senha para entrar.'}
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Email"
                  placeholder="Email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.email?.message}
                  editable={!loading}
                  leftIcon={<Ionicons name="mail-outline" size={20} color={theme.textMuted} />}
                />
              )}
            />

            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Senha"
                  placeholder="Password"
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.password?.message}
                  editable={!loading}
                  leftIcon={<Ionicons name="lock-closed-outline" size={20} color={theme.textMuted} />}
                  rightIcon={
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                      <Ionicons
                        name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                        size={20}
                        color={theme.textMuted}
                      />
                    </TouchableOpacity>
                  }
                />
              )}
            />

            {/* Remember Me + Forgot Password */}
            <View style={styles.rememberRow}>
              <TouchableOpacity
                style={styles.rememberButton}
                onPress={() => setRememberMe(!rememberMe)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={rememberMe ? 'checkbox-outline' : 'square-outline'}
                  size={20}
                  color={rememberMe ? theme.primary : theme.textMuted}
                />
                <Text style={[styles.rememberText, { color: theme.text }]}>Lembrar-me</Text>
              </TouchableOpacity>

              <TouchableOpacity disabled={loading} activeOpacity={0.7}>
                <Text style={[styles.forgotText, { color: theme.primary }]}>Esqueci minha senha?</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Divider */}
          <View style={[styles.divider, { backgroundColor: theme.border }]} />

          {/* Sign Up Link */}
          <View style={styles.signUpRow}>
            <Text style={[styles.signUpText, { color: theme.textMuted }]}>
              Não tem uma conta?{' '}
            </Text>
            <TouchableOpacity
              disabled={loading}
              onPress={() => navigation.navigate('Register')}
              activeOpacity={0.7}
            >
              <Text style={[styles.signUpLink, { color: theme.primary }]}>Cadastre-se</Text>
            </TouchableOpacity>
          </View>

          {/* Spacer to push button down */}
          <View style={styles.spacer} />

          {/* Sign In Button */}
          <Button
            title="Entrar"
            onPress={handleSubmit(onSubmit)}
            loading={loading}
            size="lg"
            style={styles.signInButton}
          />

          {/* REGRA B: Botão "Entrar com Biometria" — só aparece se biometria desativada mas hardware disponível */}
          {!biometricAutoLogin && hasBiometricHardware && (
            <TouchableOpacity
              style={styles.biometricButton}
              onPress={handleBiometricButton}
              disabled={loading}
              activeOpacity={0.8}
            >
              <Ionicons
                name="finger-print-outline"
                size={28}
                color={theme.primary}
              />
              <Text style={[styles.biometricButtonText, { color: theme.primary }]}>
                Entrar com Biometria
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
  },
  form: {
    marginBottom: 16,
  },
  rememberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    marginBottom: 8,
  },
  rememberButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rememberText: {
    fontSize: 14,
    fontWeight: '500',
  },
  forgotText: {
    fontSize: 14,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    marginVertical: 16,
  },
  signUpRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signUpText: {
    fontSize: 14,
  },
  signUpLink: {
    fontSize: 14,
    fontWeight: '600',
  },
  spacer: {
    flex: 1,
  },
  signInButton: {
    marginTop: 16,
    borderRadius: 28,
  },
  biometricButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    marginTop: 12,
    gap: 10,
    minHeight: 56,
  },
  biometricButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
