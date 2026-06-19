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
import { useTheme } from '../../hooks/useTheme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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
  const theme = useTheme();
  const insets = useSafeAreaInsets();
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
        <View style={[styles.iconContainer, { backgroundColor: theme.primaryLight }]}>
          <Ionicons name="car-sport" size={24} color={theme.primary} />
        </View>
        <View style={styles.vehicleInfo}>
          <Text style={[styles.vehicleName, { color: theme.text }]}>
            {item.brand} {item.model}
          </Text>
          <Text style={[styles.vehicleDetails, { color: theme.textMuted }]}>
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
    <View style={[styles.container, { backgroundColor: theme.background, paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
        <Text style={[styles.title, { color: theme.text }]}>Veículos</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => console.log('Add vehicle')}
        >
          <Ionicons name="add-circle" size={32} color={theme.primary} />
        </TouchableOpacity>
      </View>

      {/* Summary */}
      <View style={[styles.summary, { backgroundColor: theme.surface }]}>
        <View style={styles.summaryItem}>
          <Text style={[styles.summaryValue, { color: theme.primary }]}>{mockVehicles.length}</Text>
          <Text style={[styles.summaryLabel, { color: theme.textMuted }]}>Total</Text>
        </View>
        <View style={[styles.summaryDivider, { backgroundColor: theme.border }]} />
        <View style={styles.summaryItem}>
          <Text style={[styles.summaryValue, { color: theme.primary }]}>
            {mockVehicles.filter(v => v.status === 'active').length}
          </Text>
          <Text style={[styles.summaryLabel, { color: theme.textMuted }]}>Ativos</Text>
        </View>
        <View style={[styles.summaryDivider, { backgroundColor: theme.border }]} />
        <View style={styles.summaryItem}>
          <Text style={[styles.summaryValue, { color: theme.primary }]}>
            {mockVehicles.filter(v => v.status === 'maintenance').length}
          </Text>
          <Text style={[styles.summaryLabel, { color: theme.textMuted }]}>Manutenção</Text>
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
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  addButton: {
    padding: 4,
  },
  summary: {
    flexDirection: 'row',
    paddingVertical: 16,
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 2,
  },
  summaryLabel: {
    fontSize: 14,
  },
  summaryDivider: {
    width: 1,
    marginHorizontal: 16,
  },
  list: {
    padding: 24,
    gap: 16,
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
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  vehicleInfo: {
    flex: 1,
    marginLeft: 16,
  },
  vehicleName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  vehicleDetails: {
    fontSize: 14,
  },
});
