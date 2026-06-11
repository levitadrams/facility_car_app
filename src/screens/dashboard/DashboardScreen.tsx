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
import theme from '../../theme';

export default function DashboardScreen() {
  const { user, signOut } = useAuth();

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
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Dashboard</Text>
          <Text style={styles.welcome}>Bem-vindo(a)!</Text>
        </View>

        {/* User Info Card */}
        <Card variant="elevated" style={styles.userCard}>
          <View style={styles.userHeader}>
            <Avatar 
              name={user?.name} 
              size="lg"
              backgroundColor={theme.colors.primary[600]}
            />
            <View style={styles.userTextContainer}>
              <Text style={styles.userName}>{user?.name}</Text>
              <Text style={styles.userEmail}>{user?.email}</Text>
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
    backgroundColor: theme.colors.background.secondary,
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.layout.containerPadding,
    paddingTop: theme.spacing.xxxl,
    paddingBottom: theme.layout.containerPadding,
  },
  header: {
    marginBottom: theme.spacing.xl,
  },
  title: {
    fontSize: theme.typography.fontSize.xxxl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  welcome: {
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.text.secondary,
  },
  userCard: {
    marginBottom: theme.spacing.lg,
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userTextContainer: {
    marginLeft: theme.spacing.md,
    flex: 1,
  },
  userName: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xxs,
  },
  userEmail: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
  },
  actions: {
    marginTop: 'auto',
  },
});
