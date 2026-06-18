/**
 * Tela de Cadastro
 * Registro de novo usuário com validação usando React Hook Form e Zod
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
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { AuthStackParamList } from '../../navigation/AuthRoutes';
import Input from '../../components/Input';
import Button from '../../components/Button';
import PasswordRequirements from '../../components/PasswordRequirements';
import InputMask from '../../components/InputMask';
import { maskPhone, unmaskPhone, maskCPF, unmaskCPF } from '../../utils/masks';
import theme from '../../theme';

/**
 * Schema de validação com Zod
 */
const registerSchema = z
  .object({
    name: z
      .string({ message: 'Nome é obrigatório' })
      .min(3, 'Nome deve ter no mínimo 3 caracteres'),
    email: z
      .string({ message: 'Email é obrigatório' })
      .email('Email inválido')
      .min(1, 'Email é obrigatório'),
    phone: z
      .string({ message: 'Celular é obrigatório' })
      .transform((val) => val.replace(/\D/g, ''))
      .refine((val) => val.length === 11, 'Celular deve ter 11 dígitos (DDD + número)')
      .refine((val) => /^\d+$/.test(val), 'Celular deve conter apenas números'),
    cpf: z
      .string({ message: 'CPF é obrigatório' })
      .transform((val) => val.replace(/\D/g, ''))
      .refine((val) => val.length === 11, 'CPF deve ter 11 dígitos')
      .refine((val) => /^\d+$/.test(val), 'CPF deve conter apenas números'),
    password: z
      .string({ message: 'Senha é obrigatória' })
      .min(8, 'Senha deve ter no mínimo 8 caracteres'),
    password_confirmation: z
      .string({ message: 'Confirmação de senha é obrigatória' }),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: 'As senhas não coincidem',
    path: ['password_confirmation'],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterScreen() {
  const { signUp } = useAuth();
  const navigation = useNavigation<NavigationProp<AuthStackParamList>>();
  const [loading, setLoading] = useState(false);
  const [passwordValue, setPasswordValue] = useState('');

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      cpf: '',
      password: '',
      password_confirmation: '',
    },
  });

  /**
   * Submete o formulário de cadastro
   */
  async function onSubmit(data: RegisterFormData) {
    setLoading(true);

    try {
      await signUp(data);
      Alert.alert(
        'Conta criada com sucesso',
        'Faça login com suas credenciais para acessar o sistema.',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Login'),
          },
        ]
      );
    } catch (error: any) {
      Alert.alert(
        'Erro ao criar conta',
        error.message || 'Ocorreu um erro ao tentar criar sua conta. Tente novamente.'
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
            <Text style={styles.subtitle}>Crie sua conta para começar</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Nome"
                  placeholder="Seu nome completo"
                  autoCapitalize="words"
                  autoCorrect={false}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.name?.message}
                  editable={!loading}
                />
              )}
            />

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
              name="phone"
              render={({ field: { onChange, onBlur, value } }) => (
                <InputMask
                  label="Celular"
                  placeholder="(11) 99999-9999"
                  maskPlaceholder="(  )      -"
                  keyboardType="phone-pad"
                  autoCapitalize="none"
                  autoCorrect={false}
                  maxLength={15}
                  mask={maskPhone}
                  unmask={unmaskPhone}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.phone?.message}
                  editable={!loading}
                />
              )}
            />

            <Controller
              control={control}
              name="cpf"
              render={({ field: { onChange, onBlur, value } }) => (
                <InputMask
                  label="CPF"
                  placeholder="123.456.789-01"
                  maskPlaceholder="   .   .   -"
                  keyboardType="number-pad"
                  autoCapitalize="none"
                  autoCorrect={false}
                  maxLength={14}
                  mask={maskCPF}
                  unmask={unmaskCPF}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.cpf?.message}
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
                  onChangeText={(text) => {
                    onChange(text);
                    setPasswordValue(text);
                  }}
                  onBlur={onBlur}
                  error={errors.password?.message}
                  editable={!loading}
                />
              )}
            />

            <Controller
              control={control}
              name="password_confirmation"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Confirmar Senha"
                  placeholder="Confirme sua senha"
                  secureTextEntry
                  autoCapitalize="none"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.password_confirmation?.message}
                  editable={!loading}
                />
              )}
            />

            <PasswordRequirements password={passwordValue} />

            <Button
              title="Criar Conta"
              onPress={handleSubmit(onSubmit)}
              loading={loading}
              style={styles.button}
            />
          </View>

          {/* Links */}
          <View style={styles.linksContainer}>
            <TouchableOpacity
              disabled={loading}
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={styles.link}>Já tenho uma conta</Text>
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
