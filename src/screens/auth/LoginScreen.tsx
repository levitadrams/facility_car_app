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
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../contexts/AuthContext';
import Input from '../../components/Input';
import Button from '../../components/Button';
import theme from '../../theme';

/**
 * Schema de validação com Zod
 */
const loginSchema = z.object({
  email: z
    .string({ required_error: 'Email é obrigatório' })
    .email('Email inválido')
    .min(1, 'Email é obrigatório'),
  password: z
    .string({ required_error: 'Senha é obrigatória' })
    .min(8, 'Senha deve ter no mínimo 8 caracteres'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginScreen() {
  const { signIn } = useAuth();
  const [loading, setLoading] = useState(false);

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
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Driver Control</Text>
            <Text style={styles.subtitle}>Faça login para continuar</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Email"
                  placeholder="seu@email.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.email?.message}
                  editable={!loading}
                />
              )}
            />

            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Senha"
                  placeholder="Sua senha"
                  secureTextEntry
                  autoCapitalize="none"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.password?.message}
                  editable={!loading}
                />
              )}
            />

            <Button
              title="Entrar"
              onPress={handleSubmit(onSubmit)}
              loading={loading}
              style={styles.button}
            />
          </View>

          {/* Links */}
          <View style={styles.linksContainer}>
            <TouchableOpacity disabled={loading}>
              <Text style={styles.link}>Esqueci minha senha</Text>
            </TouchableOpacity>

            <TouchableOpacity disabled={loading}>
              <Text style={styles.link}>Criar conta</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.secondary,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.layout.containerPadding,
    paddingTop: theme.spacing.xxxl,
    paddingBottom: theme.layout.containerPadding,
  },
  header: {
    marginBottom: theme.spacing.xxl,
  },
  title: {
    fontSize: theme.typography.fontSize.xxxl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.secondary,
  },
  form: {
    marginBottom: theme.spacing.lg,
  },
  button: {
    marginTop: theme.spacing.sm,
  },
  linksContainer: {
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  link: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.primary[600],
    fontWeight: theme.typography.fontWeight.medium,
  },
});
