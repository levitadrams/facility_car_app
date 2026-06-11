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

        {/* User Info */}
        <View style={styles.userInfo}>
          <Text style={styles.label}>Nome:</Text>
          <Text style={styles.value}>{user?.name}</Text>

          <Text style={[styles.label, styles.labelSpacing]}>Email:</Text>
          <Text style={styles.value}>{user?.email}</Text>
        </View>

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
    backgroundColor: '#F5F5F5',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 24,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  welcome: {
    fontSize: 18,
    color: '#666',
  },
  userInfo: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  label: {
    fontSize: 14,
    color: '#999',
    fontWeight: '500',
  },
  labelSpacing: {
    marginTop: 16,
  },
  value: {
    fontSize: 16,
    color: '#333',
    marginTop: 4,
    fontWeight: '500',
  },
  actions: {
    marginTop: 'auto',
  },
});
