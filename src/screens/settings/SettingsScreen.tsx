/**
 * Tela de Configurações
 * Quarta tab - Configurações e perfil do usuário
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import Card from '../../components/Card';
import Avatar from '../../components/Avatar';
import Button from '../../components/Button';
import theme from '../../theme';

interface SettingItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  onPress: () => void;
  danger?: boolean;
}

function SettingItem({ icon, title, subtitle, onPress, danger }: SettingItemProps) {
  return (
    <Card variant="default" onPress={onPress} style={styles.settingCard}>
      <View style={styles.settingContent}>
        <Ionicons 
          name={icon} 
          size={24} 
          color={danger ? theme.colors.danger[600] : theme.colors.text.secondary} 
        />
        <View style={styles.settingText}>
          <Text style={[styles.settingTitle, danger && styles.dangerText]}>
            {title}
          </Text>
          {subtitle && (
            <Text style={styles.settingSubtitle}>{subtitle}</Text>
          )}
        </View>
        <Ionicons 
          name="chevron-forward" 
          size={20} 
          color={theme.colors.text.tertiary} 
        />
      </View>
    </Card>
  );
}

export default function SettingsScreen() {
  const { user, signOut } = useAuth();

  function handleLogout() {
    Alert.alert(
      'Sair',
      'Tem certeza que deseja sair?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
            } catch (error: any) {
              Alert.alert(
                'Erro',
                'Ocorreu um erro ao sair. Tente novamente.'
              );
            }
          },
        },
      ]
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Configurações</Text>
      </View>

      {/* Profile Card */}
      <Card variant="elevated" style={styles.profileCard}>
        <View style={styles.profileHeader}>
          <Avatar 
            name={user?.name} 
            size="lg"
            backgroundColor={theme.colors.primary[600]}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{user?.name}</Text>
            <Text style={styles.profileEmail}>{user?.email}</Text>
          </View>
        </View>
      </Card>

      {/* Account Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Conta</Text>
        
        <SettingItem
          icon="person-outline"
          title="Editar Perfil"
          subtitle="Alterar nome e informações"
          onPress={() => console.log('Edit profile')}
        />
        
        <SettingItem
          icon="lock-closed-outline"
          title="Alterar Senha"
          subtitle="Trocar senha de acesso"
          onPress={() => console.log('Change password')}
        />
        
        <SettingItem
          icon="shield-checkmark-outline"
          title="Privacidade"
          subtitle="Configurações de privacidade"
          onPress={() => console.log('Privacy')}
        />
      </View>

      {/* App Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Aplicativo</Text>
        
        <SettingItem
          icon="notifications-outline"
          title="Notificações"
          subtitle="Gerenciar notificações"
          onPress={() => console.log('Notifications')}
        />
        
        <SettingItem
          icon="moon-outline"
          title="Tema"
          subtitle="Claro ou escuro"
          onPress={() => console.log('Theme')}
        />
        
        <SettingItem
          icon="language-outline"
          title="Idioma"
          subtitle="Português (Brasil)"
          onPress={() => console.log('Language')}
        />
      </View>

      {/* Support */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Suporte</Text>
        
        <SettingItem
          icon="help-circle-outline"
          title="Central de Ajuda"
          onPress={() => console.log('Help')}
        />
        
        <SettingItem
          icon="information-circle-outline"
          title="Sobre"
          subtitle="Versão 1.0.0"
          onPress={() => console.log('About')}
        />
      </View>

      {/* Logout Button */}
      <View style={styles.logoutSection}>
        <Button
          title="Sair da Conta"
          variant="danger"
          onPress={handleLogout}
        />
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Facility Car App</Text>
        <Text style={styles.footerVersion}>Versão 1.0.0</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.secondary,
  },
  header: {
    backgroundColor: theme.colors.white,
    paddingHorizontal: theme.layout.containerPadding,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  title: {
    fontSize: theme.typography.fontSize.xxl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
  },
  profileCard: {
    margin: theme.layout.containerPadding,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileInfo: {
    marginLeft: theme.spacing.md,
    flex: 1,
  },
  profileName: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xxs,
  },
  profileEmail: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
  },
  section: {
    paddingHorizontal: theme.layout.containerPadding,
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  settingCard: {
    marginBottom: theme.spacing.sm,
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    flex: 1,
    marginLeft: theme.spacing.md,
  },
  settingTitle: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text.primary,
  },
  settingSubtitle: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xxs,
  },
  dangerText: {
    color: theme.colors.danger[600],
  },
  logoutSection: {
    paddingHorizontal: theme.layout.containerPadding,
    marginBottom: theme.spacing.xl,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
  },
  footerText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.tertiary,
    marginBottom: theme.spacing.xxs,
  },
  footerVersion: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.tertiary,
  },
});
