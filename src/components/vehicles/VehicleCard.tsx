/**
 * Componente VehicleCard
 * Card de exibição de veículo na lista
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Vehicle } from '../../types/vehicle';
import { useTheme } from '../../hooks/useTheme';

interface VehicleCardProps {
  vehicle: Vehicle;
  onPress?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function VehicleCard({ vehicle, onPress, onEdit, onDelete }: VehicleCardProps) {
  const theme = useTheme();
  const brandName = vehicle.brand?.name || '';
  const modelName = vehicle.model?.name || '';
  const displayName = vehicle.nickname
    ? `${vehicle.nickname}`
    : `${brandName} ${modelName}`.trim();

  const mileageFormatted = vehicle.current_mileage.toLocaleString('pt-BR');

  return (
    <TouchableOpacity style={[styles.card, { backgroundColor: theme.cardBg, borderColor: theme.border }]} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: theme.primaryLight }]}>
          <Ionicons name="car-sport" size={24} color={theme.primary} />
        </View>
        <View style={styles.info}>
          <Text style={[styles.name, { color: theme.text }]}>{displayName}</Text>
          <Text style={[styles.details, { color: theme.textMuted }]}>
            {brandName} {modelName} • {vehicle.year}
          </Text>
        </View>
      </View>

      <View style={[styles.footer, { borderTopColor: theme.border }]}>
        <View style={styles.footerItem}>
          <Ionicons name="document-text" size={14} color={theme.textMuted} />
          <Text style={[styles.footerText, { color: theme.textMuted }]}>{vehicle.plate}</Text>
        </View>
        <View style={styles.footerItem}>
          <Ionicons name="speedometer" size={14} color={theme.textMuted} />
          <Text style={[styles.footerText, { color: theme.textMuted }]}>{mileageFormatted} km</Text>
        </View>
      </View>

      {(onEdit || onDelete) && (
        <View style={[styles.actions, { borderTopColor: theme.border }]}>
          {onEdit && (
            <TouchableOpacity style={styles.actionButton} onPress={onEdit}>
              <Ionicons name="create-outline" size={18} color={theme.primary} />
              <Text style={[styles.actionText, { color: theme.primary }]}>Editar</Text>
            </TouchableOpacity>
          )}
          {onDelete && (
            <TouchableOpacity style={styles.actionButton} onPress={onDelete}>
              <Ionicons name="trash-outline" size={18} color={theme.danger} />
              <Text style={[styles.actionText, { color: theme.danger }]}>Excluir</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: {
    flex: 1,
    marginLeft: 16,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  details: {
    fontSize: 14,
  },
  footer: {
    flexDirection: 'row',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
  },
  footerText: {
    fontSize: 14,
    marginLeft: 4,
  },
  actions: {
    flexDirection: 'row',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
    paddingVertical: 4,
  },
  actionText: {
    fontSize: 14,
    marginLeft: 4,
    fontWeight: '500',
  },
});
