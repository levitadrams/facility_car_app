/**
 * Componente MaintenanceEmptyState
 * Estado vazio para lista de manutenções
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Button from '../Button';
import { useTheme } from '../../hooks/useTheme';

interface MaintenanceEmptyStateProps {
  onAddMaintenance?: () => void;
}

export default function MaintenanceEmptyState({ onAddMaintenance }: MaintenanceEmptyStateProps) {
  const theme = useTheme();
  return (
    <View style={styles.container}>
      <View style={[styles.iconContainer, { backgroundColor: theme.borderLight }]}>
        <Ionicons name="construct-outline" size={48} color={theme.textMuted} />
      </View>
      <Text style={[styles.title, { color: theme.text }]}>Nenhuma manutenção cadastrada</Text>
      <Text style={[styles.subtitle, { color: theme.textMuted }]}>
        Cadastre sua primeira manutenção para começar a controlar os custos do seu veículo.
      </Text>
      {onAddMaintenance && (
        <Button
          title="Cadastrar Manutenção"
          onPress={onAddMaintenance}
          style={styles.button}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  button: {
    minWidth: 220,
  },
});
