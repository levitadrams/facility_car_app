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
import theme from '../../theme';

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
              color={theme.colors.primary[600]} 
            />
            <Text style={styles.vehicleName}>{item.vehicleName}</Text>
          </View>
          <Text style={styles.vehiclePlate}>{item.vehiclePlate}</Text>
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
            color={theme.colors.text.tertiary} 
          />
          <Text style={styles.detailLabel}>Tipo:</Text>
          <Text style={styles.detailValue}>{item.type}</Text>
        </View>

        <View style={styles.detailRow}>
          <Ionicons 
            name="document-text-outline" 
            size={16} 
            color={theme.colors.text.tertiary} 
          />
          <Text style={styles.detailLabel}>Descrição:</Text>
          <Text style={styles.detailValue}>{item.description}</Text>
        </View>

        <View style={styles.detailRow}>
          <Ionicons 
            name="calendar-outline" 
            size={16} 
            color={theme.colors.text.tertiary} 
          />
          <Text style={styles.detailLabel}>Data:</Text>
          <Text style={styles.detailValue}>{formatDate(item.date)}</Text>
        </View>

        <View style={styles.detailRow}>
          <Ionicons 
            name="cash-outline" 
            size={16} 
            color={theme.colors.text.tertiary} 
          />
          <Text style={styles.detailLabel}>Custo:</Text>
          <Text style={styles.costValue}>{formatCurrency(item.cost)}</Text>
        </View>
      </View>
    </Card>
  );

  const getTotalCost = () => {
    return mockMaintenances.reduce((sum, m) => sum + m.cost, 0);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Manutenções</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => console.log('Add maintenance')}
        >
          <Ionicons name="add-circle" size={32} color={theme.colors.primary[600]} />
        </TouchableOpacity>
      </View>

      {/* Summary */}
      <View style={styles.summary}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>{mockMaintenances.length}</Text>
          <Text style={styles.summaryLabel}>Total</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>
            {mockMaintenances.filter(m => m.status === 'pending').length}
          </Text>
          <Text style={styles.summaryLabel}>Pendentes</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>
            {formatCurrency(getTotalCost())}
          </Text>
          <Text style={styles.summaryLabel}>Custo Total</Text>
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
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.accent[600],
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
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.md,
  },
  vehicleInfo: {
    flex: 1,
  },
  vehicleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.xxs,
  },
  vehicleName: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
  },
  vehiclePlate: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    marginLeft: theme.spacing.lg,
  },
  maintenanceDetails: {
    gap: theme.spacing.sm,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  detailLabel: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    fontWeight: theme.typography.fontWeight.medium,
  },
  detailValue: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.primary,
    flex: 1,
  },
  costValue: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.accent[600],
    fontWeight: theme.typography.fontWeight.semibold,
    flex: 1,
  },
});
