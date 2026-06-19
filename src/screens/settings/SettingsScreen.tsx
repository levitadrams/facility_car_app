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
import { useThemeContext } from '../../contexts/ThemeContext';
import Card from '../../components/Card';
import Avatar from '../../components/Avatar';
import Button from '../../components/Button';
import { useTheme } from '../../hooks/useTheme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface SettingItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  onPress: () => void;
  danger?: boolean;
}

function SettingItem({ icon, title, subtitle, onPress, danger, theme }: SettingItemProps & { theme: ReturnType<typeof useTheme> }) {
  return (
    <Card variant="default" onPress={onPress} style={styles.settingCard}>
      <View style={styles.settingContent}>
        <Ionicons
          name={icon}
          size={24}
          color={danger ? theme.danger : theme.textMuted}
        />
        <View style={styles.settingText}>
          <Text style={[styles.settingTitle, { color: danger ? theme.danger : theme.text }]}>
            {title}
          </Text>
          {subtitle && (
            <Text style={[styles.settingSubtitle, { color: theme.textMuted }]}>{subtitle}</Text>
          )}
        </View>
        <Ionicons
          name="chevron-forward"
          size={20}
          color={theme.textMuted}
        />
      </View>
    </Card>
  );
}

export default function SettingsScreen() {
  const { user, signOut } = useAuth();
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { themeMode, setThemeMode } = useThemeContext();

  const themeLabels: Record<string, string> = {
    light: 'Claro',
    dark: 'Escuro',
    system: 'Automático',
  };

  function handleThemePress() {
    Alert.alert(
      'Tema',
      'Escolha o tema do aplicativo',
      [
        {
          text: 'Automático (Sistema)',
          onPress: () => setThemeMode('system'),
          style: themeMode === 'system' ? 'cancel' : 'default',
        },
        {
          text: 'Claro',
          onPress: () => setThemeMode('light'),
        },
        {
          text: 'Escuro',
          onPress: () => setThemeMode('dark'),
        },
        {
          text: 'Cancelar',
          style: 'cancel',
        },
      ]
    );
  }

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
    <ScrollView style={[styles.container, { backgroundColor: theme.background, paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
        <Text style={[styles.title, { color: theme.text }]}>Configurações</Text>
      </View>

      {/* Profile Card */}
      <Card variant="elevated" style={styles.profileCard}>
        <View style={styles.profileHeader}>
          <Avatar
            name={user?.name}
            size="lg"
            backgroundColor={theme.primary}
          />
          <View style={styles.profileInfo}>
            <Text style={[styles.profileName, { color: theme.text }]}>{user?.name}</Text>
            <Text style={[styles.profileEmail, { color: theme.textMuted }]}>{user?.email}</Text>
          </View>
        </View>
      </Card>

      {/* Account Settings */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Conta</Text>

        <SettingItem
          icon="person-outline"
          title="Editar Perfil"
          subtitle="Alterar nome e informações"
          onPress={() => console.log('Edit profile')}
          theme={theme}
        />

        <SettingItem
          icon="lock-closed-outline"
          title="Alterar Senha"
          subtitle="Trocar senha de acesso"
          onPress={() => console.log('Change password')}
          theme={theme}
        />

        <SettingItem
          icon="shield-checkmark-outline"
          title="Privacidade"
          subtitle="Configurações de privacidade"
          onPress={() => console.log('Privacy')}
          theme={theme}
        />
      </View>

      {/* App Settings */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Aplicativo</Text>

        <SettingItem
          icon="notifications-outline"
          title="Notificações"
          subtitle="Gerenciar notificações"
          onPress={() => console.log('Notifications')}
          theme={theme}
        />

        <SettingItem
          icon="moon-outline"
          title="Tema"
          subtitle={themeLabels[themeMode]}
          onPress={handleThemePress}
          theme={theme}
        />

        <SettingItem
          icon="language-outline"
          title="Idioma"
          subtitle="Português (Brasil)"
          onPress={() => console.log('Language')}
          theme={theme}
        />
      </View>

      {/* Support */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Suporte</Text>

        <SettingItem
          icon="help-circle-outline"
          title="Central de Ajuda"
          onPress={() => console.log('Help')}
          theme={theme}
        />

        <SettingItem
          icon="information-circle-outline"
          title="Sobre"
          subtitle="Versão 1.0.0"
          onPress={() => console.log('About')}
          theme={theme}
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
        <Text style={[styles.footerText, { color: theme.textMuted }]}>Facility Car App</Text>
        <Text style={[styles.footerVersion, { color: theme.textMuted }]}>Versão 1.0.0</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 24,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  profileCard: {
    margin: 24,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileInfo: {
    marginLeft: 16,
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 2,
  },
  profileEmail: {
    fontSize: 14,
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  settingCard: {
    marginBottom: 8,
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    flex: 1,
    marginLeft: 16,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  settingSubtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  logoutSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  footerText: {
    fontSize: 14,
    marginBottom: 4,
  },
  footerVersion: {
    fontSize: 12,
  },
});
