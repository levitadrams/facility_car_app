import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../hooks/useTheme';

interface TrafficToggleButtonProps {
  enabled: boolean;
  onToggle: () => void;
}

/**
 * Botão flutuante para ativar/desativar camada de trânsito em tempo real.
 *
 * Quando ativado, exibe ícone e label verde.
 * Quando desativado, exibe ícone e label cinza.
 */
export default function TrafficToggleButton({ enabled, onToggle }: TrafficToggleButtonProps) {
  const theme = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: enabled ? theme.success : theme.surface,
          borderColor: enabled ? theme.success : theme.border,
        },
      ]}
      onPress={onToggle}
      activeOpacity={0.8}
    >
      <Ionicons
        name={enabled ? 'car' : 'car-outline'}
        size={20}
        color={enabled ? '#fff' : theme.textMuted}
      />
      <Text
        style={[
          styles.label,
          { color: enabled ? '#fff' : theme.textMuted },
        ]}
      >
        {enabled ? 'Trânsito ON' : 'Trânsito'}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 24,
    borderWidth: 1,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
  },
});
