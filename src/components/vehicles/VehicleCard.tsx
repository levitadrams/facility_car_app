/**
 * Componente VehicleCard
 * Card de exibição de veículo na lista
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Vehicle } from '../../types/vehicle';
import theme from '../../theme';

interface VehicleCardProps {
  vehicle: Vehicle;
  onPress?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function VehicleCard({ vehicle, onPress, onEdit, onDelete }: VehicleCardProps) {
  const brandName = vehicle.brand?.name || '';
  const modelName = vehicle.model?.name || '';
  const displayName = vehicle.nickname
    ? `${vehicle.nickname}`
    : `${brandName} ${modelName}`.trim();

  const mileageFormatted = vehicle.current_mileage.toLocaleString('pt-BR');

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Ionicons name="car-sport" size={24} color={theme.colors.primary[600]} />
        </View>
        <View style={styles.info}>
          <Text style={styles.name}>{displayName}</Text>
          <Text style={styles.details}>
            {brandName} {modelName} • {vehicle.year}
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.footerItem}>
          <Ionicons name="document-text" size={14} color={theme.colors.text.tertiary} />
          <Text style={styles.footerText}>{vehicle.plate}</Text>
        </View>
        <View style={styles.footerItem}>
          <Ionicons name="speedometer" size={14} color={theme.colors.text.tertiary} />
          <Text style={styles.footerText}>{mileageFormatted} km</Text>
        </View>
      </View>

      {(onEdit || onDelete) && (
        <View style={styles.actions}>
          {onEdit && (
            <TouchableOpacity style={styles.actionButton} onPress={onEdit}>
              <Ionicons name="create-outline" size={18} color={theme.colors.primary[600]} />
              <Text style={styles.actionText}>Editar</Text>
            </TouchableOpacity>
          )}
          {onDelete && (
            <TouchableOpacity style={styles.actionButton} onPress={onDelete}>
              <Ionicons name="trash-outline" size={18} color={theme.colors.danger[600]} />
              <Text style={[styles.actionText, styles.actionTextDanger]}>Excluir</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.primary[50],
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: {
    flex: 1,
    marginLeft: theme.spacing.md,
  },
  name: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  details: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
  },
  footer: {
    flexDirection: 'row',
    marginTop: theme.spacing.sm,
    paddingTop: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.light,
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: theme.spacing.lg,
  },
  footerText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    marginLeft: theme.spacing.xs,
  },
  actions: {
    flexDirection: 'row',
    marginTop: theme.spacing.sm,
    paddingTop: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.light,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: theme.spacing.lg,
    paddingVertical: theme.spacing.xs,
  },
  actionText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.primary[600],
    marginLeft: theme.spacing.xs,
    fontWeight: theme.typography.fontWeight.medium,
  },
  actionTextDanger: {
    color: theme.colors.danger[600],
  },
});
