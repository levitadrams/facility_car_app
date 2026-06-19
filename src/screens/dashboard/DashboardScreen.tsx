/**
 * Tela do Dashboard
 * Tela principal após autenticação
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/Button';
import Card from '../../components/Card';
import Avatar from '../../components/Avatar';
import { useTheme } from '../../hooks/useTheme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function DashboardScreen() {
  const { user, signOut } = useAuth();
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  /**
   * Confirma e realiza o logout
   */
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
    <View style={[styles.container, { backgroundColor: theme.background, paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.text }]}>Dashboard</Text>
          <Text style={[styles.welcome, { color: theme.textMuted }]}>Bem-vindo(a)!</Text>
        </View>

        {/* User Info Card */}
        <Card variant="elevated" style={styles.userCard}>
          <View style={styles.userHeader}>
            <Avatar
              name={user?.name}
              size="lg"
              backgroundColor={theme.primary}
            />
            <View style={styles.userTextContainer}>
              <Text style={[styles.userName, { color: theme.text }]}>{user?.name}</Text>
              <Text style={[styles.userEmail, { color: theme.textMuted }]}>{user?.email}</Text>
            </View>
          </View>
        </Card>

        {/* Actions */}
        <View style={styles.actions}>
          <Button
            title="Sair"
            onPress={handleLogout}
            variant="outline"
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 64,
    paddingBottom: 24,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 4,
  },
  welcome: {
    fontSize: 18,
  },
  userCard: {
    marginBottom: 24,
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userTextContainer: {
    marginLeft: 16,
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 14,
  },
  actions: {
    marginTop: 'auto',
  },
});
