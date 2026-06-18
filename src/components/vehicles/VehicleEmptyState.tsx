/**
 * Componente VehicleEmptyState
 * Estado vazio para lista de veículos
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Button from '../Button';
import theme from '../../theme';

interface VehicleEmptyStateProps {
  onAddVehicle?: () => void;
}

export default function VehicleEmptyState({ onAddVehicle }: VehicleEmptyStateProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Ionicons name="car-sport-outline" size={48} color={theme.colors.text.tertiary} />
      </View>
      <Text style={styles.title}>Nenhum veículo cadastrado</Text>
      <Text style={styles.subtitle}>
        Cadastre seu primeiro veículo para começar a gerenciar manutenções e rotas.
      </Text>
      {onAddVehicle && (
        <Button
          title="Cadastrar Veículo"
          onPress={onAddVehicle}
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
    padding: theme.spacing.xl,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.background.tertiary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  title: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
    lineHeight: 22,
  },
  button: {
    minWidth: 200,
  },
});
