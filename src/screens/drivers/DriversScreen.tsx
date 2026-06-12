/**
 * Tela de Motoristas
 * Terceira tab - Lista de motoristas
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
import Avatar from '../../components/Avatar';
import Badge from '../../components/Badge';
import theme from '../../theme';

interface Driver {
  id: string;
  name: string;
  email: string;
  phone: string;
  trips: number;
  status: 'active' | 'inactive';
}

const mockDrivers: Driver[] = [
  {
    id: '1',
    name: 'João Silva',
    email: 'joao@email.com',
    phone: '(11) 99999-1111',
    trips: 150,
    status: 'active',
  },
  {
    id: '2',
    name: 'Maria Santos',
    email: 'maria@email.com',
    phone: '(11) 99999-2222',
    trips: 200,
    status: 'active',
  },
  {
    id: '3',
    name: 'Pedro Oliveira',
    email: 'pedro@email.com',
    phone: '(11) 99999-3333',
    trips: 80,
    status: 'inactive',
  },
  {
    id: '4',
    name: 'Ana Costa',
    email: 'ana@email.com',
    phone: '(11) 99999-4444',
    trips: 175,
    status: 'active',
  },
];

export default function DriversScreen() {
  const renderDriver = ({ item }: { item: Driver }) => (
    <Card variant="default" onPress={() => console.log('Driver:', item.id)} style={styles.card}>
      <View style={styles.cardContent}>
        <Avatar 
          name={item.name} 
          size="md"
          backgroundColor={theme.colors.secondary[600]}
        />
        
        <View style={styles.driverInfo}>
          <View style={styles.driverHeader}>
            <Text style={styles.driverName}>{item.name}</Text>
            <Badge 
              label={item.status === 'active' ? 'Ativo' : 'Inativo'} 
              variant={item.status === 'active' ? 'success' : 'neutral'}
              size="sm"
            />
          </View>
          
          <View style={styles.driverDetails}>
            <View style={styles.detailRow}>
              <Ionicons name="mail-outline" size={14} color={theme.colors.text.tertiary} />
              <Text style={styles.detailText}>{item.email}</Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="call-outline" size={14} color={theme.colors.text.tertiary} />
              <Text style={styles.detailText}>{item.phone}</Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="car-outline" size={14} color={theme.colors.text.tertiary} />
              <Text style={styles.detailText}>{item.trips} viagens</Text>
            </View>
          </View>
        </View>
      </View>
    </Card>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Motoristas</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => console.log('Add driver')}
        >
          <Ionicons name="person-add" size={24} color={theme.colors.primary[600]} />
        </TouchableOpacity>
      </View>

      {/* Summary */}
      <View style={styles.summary}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>{mockDrivers.length}</Text>
          <Text style={styles.summaryLabel}>Total</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>
            {mockDrivers.filter(d => d.status === 'active').length}
          </Text>
          <Text style={styles.summaryLabel}>Ativos</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>
            {mockDrivers.reduce((sum, d) => sum + d.trips, 0)}
          </Text>
          <Text style={styles.summaryLabel}>Viagens</Text>
        </View>
      </View>

      {/* Driver List */}
      <FlatList
        data={mockDrivers}
        renderItem={renderDriver}
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
    padding: theme.spacing.sm,
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
    color: theme.colors.secondary[600],
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
  cardContent: {
    flexDirection: 'row',
  },
  driverInfo: {
    flex: 1,
    marginLeft: theme.spacing.md,
  },
  driverHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  driverName: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
  },
  driverDetails: {
    gap: theme.spacing.xs,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  detailText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
  },
});
