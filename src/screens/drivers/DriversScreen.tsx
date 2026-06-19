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
import { useTheme } from '../../hooks/useTheme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const renderDriver = ({ item }: { item: Driver }) => (
    <Card variant="default" onPress={() => console.log('Driver:', item.id)} style={styles.card}>
      <View style={styles.cardContent}>
        <Avatar
          name={item.name}
          size="md"
          backgroundColor={theme.secondary}
        />

        <View style={styles.driverInfo}>
          <View style={styles.driverHeader}>
            <Text style={[styles.driverName, { color: theme.text }]}>{item.name}</Text>
            <Badge
              label={item.status === 'active' ? 'Ativo' : 'Inativo'}
              variant={item.status === 'active' ? 'success' : 'neutral'}
              size="sm"
            />
          </View>

          <View style={styles.driverDetails}>
            <View style={styles.detailRow}>
              <Ionicons name="mail-outline" size={14} color={theme.textMuted} />
              <Text style={[styles.detailText, { color: theme.textMuted }]}>{item.email}</Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="call-outline" size={14} color={theme.textMuted} />
              <Text style={[styles.detailText, { color: theme.textMuted }]}>{item.phone}</Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="car-outline" size={14} color={theme.textMuted} />
              <Text style={[styles.detailText, { color: theme.textMuted }]}>{item.trips} viagens</Text>
            </View>
          </View>
        </View>
      </View>
    </Card>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background, paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
        <Text style={[styles.title, { color: theme.text }]}>Motoristas</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => console.log('Add driver')}
        >
          <Ionicons name="person-add" size={24} color={theme.primary} />
        </TouchableOpacity>
      </View>

      {/* Summary */}
      <View style={[styles.summary, { backgroundColor: theme.surface }]}>
        <View style={styles.summaryItem}>
          <Text style={[styles.summaryValue, { color: theme.secondary }]}>{mockDrivers.length}</Text>
          <Text style={[styles.summaryLabel, { color: theme.textMuted }]}>Total</Text>
        </View>
        <View style={[styles.summaryDivider, { backgroundColor: theme.border }]} />
        <View style={styles.summaryItem}>
          <Text style={[styles.summaryValue, { color: theme.secondary }]}>
            {mockDrivers.filter(d => d.status === 'active').length}
          </Text>
          <Text style={[styles.summaryLabel, { color: theme.textMuted }]}>Ativos</Text>
        </View>
        <View style={[styles.summaryDivider, { backgroundColor: theme.border }]} />
        <View style={styles.summaryItem}>
          <Text style={[styles.summaryValue, { color: theme.secondary }]}>
            {mockDrivers.reduce((sum, d) => sum + d.trips, 0)}
          </Text>
          <Text style={[styles.summaryLabel, { color: theme.textMuted }]}>Viagens</Text>
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
    padding: 8,
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
  cardContent: {
    flexDirection: 'row',
  },
  driverInfo: {
    flex: 1,
    marginLeft: 16,
  },
  driverHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  driverName: {
    fontSize: 16,
    fontWeight: '600',
  },
  driverDetails: {
    gap: 4,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontSize: 14,
  },
});
