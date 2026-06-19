/**
 * Tela de Manutenção
 * Terceira tab - Gestão de manutenções de veículos
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

interface Maintenance {
  id: string;
  vehiclePlate: string;
  vehicleName: string;
  type: string;
  description: string;
  date: string;
  cost: number;
  status: 'pending' | 'in-progress' | 'completed';
}

const mockMaintenances: Maintenance[] = [
  {
    id: '1',
    vehiclePlate: 'ABC-1234',
    vehicleName: 'Toyota Corolla',
    type: 'Troca de óleo',
    description: 'Troca de óleo e filtro',
    date: '2026-06-15',
    cost: 250.00,
    status: 'pending',
  },
  {
    id: '2',
    vehiclePlate: 'DEF-5678',
    vehicleName: 'Honda Civic',
    type: 'Revisão',
    description: 'Revisão dos 10.000 km',
    date: '2026-06-12',
    cost: 450.00,
    status: 'in-progress',
  },
  {
    id: '3',
    vehiclePlate: 'GHI-9012',
    vehicleName: 'Volkswagen Polo',
    type: 'Freios',
    description: 'Troca de pastilhas de freio',
    date: '2026-06-10',
    cost: 380.00,
    status: 'completed',
  },
  {
    id: '4',
    vehiclePlate: 'JKL-3456',
    vehicleName: 'Fiat Argo',
    type: 'Pneus',
    description: 'Alinhamento e balanceamento',
    date: '2026-06-08',
    cost: 150.00,
    status: 'completed',
  },
];

export default function MaintenanceScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const getStatusVariant = (status: Maintenance['status']) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'in-progress':
        return 'warning';
      case 'pending':
        return 'info';
    }
  };

  const getStatusLabel = (status: Maintenance['status']) => {
    switch (status) {
      case 'completed':
        return 'Concluída';
      case 'in-progress':
        return 'Em Andamento';
      case 'pending':
        return 'Pendente';
    }
  };

  const getStatusIcon = (status: Maintenance['status']) => {
    switch (status) {
      case 'completed':
        return 'checkmark-circle';
      case 'in-progress':
        return 'time';
      case 'pending':
        return 'alert-circle';
    }
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const renderMaintenance = ({ item }: { item: Maintenance }) => (
    <Card
      variant="default"
      onPress={() => console.log('Maintenance:', item.id)}
      style={styles.card}
    >
      <View style={styles.cardHeader}>
        <View style={styles.vehicleInfo}>
          <View style={styles.vehicleHeader}>
            <Ionicons
              name="car-sport"
              size={20}
              color={theme.primary}
            />
            <Text style={[styles.vehicleName, { color: theme.text }]}>{item.vehicleName}</Text>
          </View>
          <Text style={[styles.vehiclePlate, { color: theme.textMuted }]}>{item.vehiclePlate}</Text>
        </View>
        <Badge
          label={getStatusLabel(item.status)}
          variant={getStatusVariant(item.status)}
          size="sm"
        />
      </View>

      <View style={styles.maintenanceDetails}>
        <View style={styles.detailRow}>
          <Ionicons
            name="construct-outline"
            size={16}
            color={theme.textMuted}
          />
          <Text style={[styles.detailLabel, { color: theme.textMuted }]}>Tipo:</Text>
          <Text style={[styles.detailValue, { color: theme.text }]}>{item.type}</Text>
        </View>

        <View style={styles.detailRow}>
          <Ionicons
            name="document-text-outline"
            size={16}
            color={theme.textMuted}
          />
          <Text style={[styles.detailLabel, { color: theme.textMuted }]}>Descrição:</Text>
          <Text style={[styles.detailValue, { color: theme.text }]}>{item.description}</Text>
        </View>

        <View style={styles.detailRow}>
          <Ionicons
            name="calendar-outline"
            size={16}
            color={theme.textMuted}
          />
          <Text style={[styles.detailLabel, { color: theme.textMuted }]}>Data:</Text>
          <Text style={[styles.detailValue, { color: theme.text }]}>{formatDate(item.date)}</Text>
        </View>

        <View style={styles.detailRow}>
          <Ionicons
            name="cash-outline"
            size={16}
            color={theme.textMuted}
          />
          <Text style={[styles.detailLabel, { color: theme.textMuted }]}>Custo:</Text>
          <Text style={[styles.costValue, { color: theme.accent }]}>{formatCurrency(item.cost)}</Text>
        </View>
      </View>
    </Card>
  );

  const getTotalCost = () => {
    return mockMaintenances.reduce((sum, m) => sum + m.cost, 0);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background, paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
        <Text style={[styles.title, { color: theme.text }]}>Manutenções</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => console.log('Add maintenance')}
        >
          <Ionicons name="add-circle" size={32} color={theme.primary} />
        </TouchableOpacity>
      </View>

      {/* Summary */}
      <View style={[styles.summary, { backgroundColor: theme.surface }]}>
        <View style={styles.summaryItem}>
          <Text style={[styles.summaryValue, { color: theme.accent }]}>{mockMaintenances.length}</Text>
          <Text style={[styles.summaryLabel, { color: theme.textMuted }]}>Total</Text>
        </View>
        <View style={[styles.summaryDivider, { backgroundColor: theme.border }]} />
        <View style={styles.summaryItem}>
          <Text style={[styles.summaryValue, { color: theme.accent }]}>
            {mockMaintenances.filter(m => m.status === 'pending').length}
          </Text>
          <Text style={[styles.summaryLabel, { color: theme.textMuted }]}>Pendentes</Text>
        </View>
        <View style={[styles.summaryDivider, { backgroundColor: theme.border }]} />
        <View style={styles.summaryItem}>
          <Text style={[styles.summaryValue, { color: theme.accent }]}>
            {formatCurrency(getTotalCost())}
          </Text>
          <Text style={[styles.summaryLabel, { color: theme.textMuted }]}>Custo Total</Text>
        </View>
      </View>

      {/* Maintenance List */}
      <FlatList
        data={mockMaintenances}
        renderItem={renderMaintenance}
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
    fontSize: 18,
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
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  vehicleInfo: {
    flex: 1,
  },
  vehicleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 2,
  },
  vehicleName: {
    fontSize: 16,
    fontWeight: '600',
  },
  vehiclePlate: {
    fontSize: 14,
    marginLeft: 24,
  },
  maintenanceDetails: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    flex: 1,
  },
  costValue: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
});
