/**
 * Componente VehicleEmptyState
 * Estado vazio para lista de veículos
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Button from '../Button';
import { useTheme } from '../../hooks/useTheme';

interface VehicleEmptyStateProps {
  onAddVehicle?: () => void;
}

export default function VehicleEmptyState({ onAddVehicle }: VehicleEmptyStateProps) {
  const theme = useTheme();
  return (
    <View style={styles.container}>
      <View style={[styles.iconContainer, { backgroundColor: theme.borderLight }]}>
        <Ionicons name="car-sport-outline" size={48} color={theme.textMuted} />
      </View>
      <Text style={[styles.title, { color: theme.text }]}>Nenhum veículo cadastrado</Text>
      <Text style={[styles.subtitle, { color: theme.textMuted }]}>
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
    minWidth: 200,
  },
});
