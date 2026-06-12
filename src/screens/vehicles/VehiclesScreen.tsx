/**
 * Tela de Veículos
 * Segunda tab - Lista de veículos
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Card from '../../components/Card';
import Badge from '../../components/Badge';
import theme from '../../theme';

interface Vehicle {
  id: string;
  brand: string;
  model: string;
  plate: string;
  year: number;
  status: 'active' | 'maintenance' | 'inactive';
}

const mockVehicles: Vehicle[] = [
  {
    id: '1',
    brand: 'Toyota',
    model: 'Corolla',
    plate: 'ABC-1234',
    year: 2022,
    status: 'active',
  },
  {
    id: '2',
    brand: 'Honda',
    model: 'Civic',
    plate: 'DEF-5678',
    year: 2021,
    status: 'active',
  },
  {
    id: '3',
    brand: 'Volkswagen',
    model: 'Polo',
    plate: 'GHI-9012',
    year: 2020,
    status: 'maintenance',
  },
  {
    id: '4',
    brand: 'Fiat',
    model: 'Argo',
    plate: 'JKL-3456',
    year: 2023,
    status: 'active',
  },
];

export default function VehiclesScreen() {
  const getStatusVariant = (status: Vehicle['status']) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'maintenance':
        return 'warning';
      case 'inactive':
        return 'neutral';
    }
  };

  const getStatusLabel = (status: Vehicle['status']) => {
    switch (status) {
      case 'active':
        return 'Ativo';
      case 'maintenance':
        return 'Manutenção';
      case 'inactive':
        return 'Inativo';
    }
  };

  const renderVehicle = ({ item }: { item: Vehicle }) => (
    <Card variant="default" onPress={() => console.log('Vehicle:', item.id)} style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.iconContainer}>
          <Ionicons name="car-sport" size={24} color={theme.colors.primary[600]} />
        </View>
        <View style={styles.vehicleInfo}>
          <Text style={styles.vehicleName}>
            {item.brand} {item.model}
          </Text>
          <Text style={styles.vehicleDetails}>
            {item.plate} • {item.year}
          </Text>
        </View>
        <Badge 
          label={getStatusLabel(item.status)} 
          variant={getStatusVariant(item.status)}
          size="sm"
        />
      </View>
    </Card>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Veículos</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => console.log('Add vehicle')}
        >
          <Ionicons name="add-circle" size={32} color={theme.colors.primary[600]} />
        </TouchableOpacity>
      </View>

      {/* Summary */}
      <View style={styles.summary}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>{mockVehicles.length}</Text>
          <Text style={styles.summaryLabel}>Total</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>
            {mockVehicles.filter(v => v.status === 'active').length}
          </Text>
          <Text style={styles.summaryLabel}>Ativos</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>
            {mockVehicles.filter(v => v.status === 'maintenance').length}
          </Text>
          <Text style={styles.summaryLabel}>Manutenção</Text>
        </View>
      </View>

      {/* Vehicle List */}
      <FlatList
        data={mockVehicles}
        renderItem={renderVehicle}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.secondary,
  },
  header: {
    backgroundColor: theme.colors.white,
    paddingHorizontal: theme.layout.containerPadding,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  title: {
    fontSize: theme.typography.fontSize.xxl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
  },
  addButton: {
    padding: theme.spacing.xs,
  },
  summary: {
    backgroundColor: theme.colors.white,
    flexDirection: 'row',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.layout.containerPadding,
    marginBottom: theme.spacing.md,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: theme.typography.fontSize.xxl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary[600],
    marginBottom: theme.spacing.xxs,
  },
  summaryLabel: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
  },
  summaryDivider: {
    width: 1,
    backgroundColor: theme.colors.border.light,
    marginHorizontal: theme.spacing.md,
  },
  list: {
    padding: theme.layout.containerPadding,
    gap: theme.spacing.md,
  },
  card: {
    marginBottom: 0,
  },
  cardHeader: {
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
  vehicleInfo: {
    flex: 1,
    marginLeft: theme.spacing.md,
  },
  vehicleName: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xxs,
  },
  vehicleDetails: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
  },
});
