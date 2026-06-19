/**
 * Componente MaintenanceCard
 * Card de exibição de manutenção na lista
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Maintenance } from '../../types/maintenance';
import { useTheme } from '../../hooks/useTheme';

interface MaintenanceCardProps {
  maintenance: Maintenance;
  onPress?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function MaintenanceCard({ maintenance, onPress, onEdit, onDelete }: MaintenanceCardProps) {
  const theme = useTheme();

  const vehicleName = maintenance.vehicle?.nickname
    || `${maintenance.vehicle?.brand?.name || ''} ${maintenance.vehicle?.model?.name || ''}`.trim()
    || 'Veículo';
  const vehiclePlate = maintenance.vehicle?.plate || '';

  const mileageFormatted = Number(maintenance.current_mileage).toLocaleString('pt-BR');
  const costFormatted = Number(maintenance.cost).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
  const dateFormatted = maintenance.performed_at
    ? new Date(maintenance.performed_at + 'T00:00:00').toLocaleDateString('pt-BR')
    : '-';

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: theme.cardBg, borderColor: theme.border }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: theme.primaryLight }]}>
          <Ionicons name="construct" size={24} color={theme.primary} />
        </View>
        <View style={styles.info}>
          <Text style={[styles.name, { color: theme.text }]}>{vehicleName}</Text>
          {vehiclePlate ? (
            <Text style={[styles.plate, { color: theme.textMuted }]}>{vehiclePlate}</Text>
          ) : null}
        </View>
      </View>

      <View style={[styles.body, { borderTopColor: theme.border }]}>
        <Text style={[styles.type, { color: theme.text }]}>{maintenance.maintenance_type?.name || 'Manutenção'}</Text>
        <View style={styles.details}>
          <View style={styles.detailItem}>
            <Ionicons name="calendar-outline" size={14} color={theme.textMuted} />
            <Text style={[styles.detailText, { color: theme.textMuted }]}>{dateFormatted}</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="speedometer-outline" size={14} color={theme.textMuted} />
            <Text style={[styles.detailText, { color: theme.textMuted }]}>{mileageFormatted} km</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="cash-outline" size={14} color={theme.textMuted} />
            <Text style={[styles.detailText, { color: theme.accent }]}>{costFormatted}</Text>
          </View>
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
    borderWidth: 1,
    marginBottom: 12,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
  },
  plate: {
    fontSize: 13,
    marginTop: 2,
  },
  body: {
    padding: 16,
    borderTopWidth: 1,
  },
  type: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 8,
  },
  details: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontSize: 13,
  },
  actions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    paddingVertical: 10,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '500',
  },
});
