/**
 * Tela de Login
 * Autenticação do usuário com validação usando React Hook Form e Zod
 */

import React, { useState } from 'react';
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
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  /**
   * Submete o formulário de login
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
              Digite seu email e senha para entrar.
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
});
