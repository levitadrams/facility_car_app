/**
 * Tela de Histórico de Manutenção
 * Exibe histórico completo de manutenções de um veículo
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MaintenancesStackParamList } from '../../navigation/MaintenancesStack';
import { Maintenance } from '../../types/maintenance';
import { getMaintenances, deleteMaintenance } from '../../services/maintenanceService';
import MaintenanceCard from '../../components/maintenances/MaintenanceCard';
import ConfirmDeleteModal from '../../components/maintenances/ConfirmDeleteModal';
import { useTheme } from '../../hooks/useTheme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type NavigationProp = NativeStackNavigationProp<MaintenancesStackParamList>;
type RouteProps = RouteProp<MaintenancesStackParamList, 'MaintenanceHistory'>;

interface GroupedMaintenances {
  year: string;
  items: Maintenance[];
}

export default function MaintenanceHistoryScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const { vehicleId, vehicleName } = route.params || {};
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const [maintenances, setMaintenances] = useState<Maintenance[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [maintenanceToDelete, setMaintenanceToDelete] = useState<Maintenance | null>(null);

  const fetchHistory = useCallback(async (isRefresh: boolean = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      const response = await getMaintenances(1, { vehicle_id: vehicleId });
      // Sort: most recent first
      const sorted = response.data.sort(
        (a, b) => new Date(b.performed_at).getTime() - new Date(a.performed_at).getTime()
      );
      setMaintenances(sorted);
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Erro ao carregar histórico.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [vehicleId]);

  React.useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const totalCost = maintenances.reduce((sum, m) => sum + Number(m.cost), 0);
  const lastMaintenance = maintenances.length > 0 ? maintenances[0] : null;

  const grouped: GroupedMaintenances[] = maintenances.reduce((acc, item) => {
    const year = new Date(item.performed_at + 'T00:00:00').getFullYear().toString();
    const existing = acc.find((g) => g.year === year);
    if (existing) {
      existing.items.push(item);
    } else {
      acc.push({ year, items: [item] });
    }
    return acc;
  }, [] as GroupedMaintenances[]);

  const handleDeletePress = (maintenance: Maintenance) => {
    setMaintenanceToDelete(maintenance);
    setDeleteModalVisible(true);
  };

  const handleConfirmDelete = async () => {
    if (!maintenanceToDelete) return;
    try {
      await deleteMaintenance(maintenanceToDelete.id);
      setMaintenances((prev) => prev.filter((m) => m.id !== maintenanceToDelete.id));
      setDeleteModalVisible(false);
      setMaintenanceToDelete(null);
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Erro ao excluir manutenção.');
    }
  };

  const renderItem = ({ item }: { item: Maintenance }) => (
    <MaintenanceCard
      maintenance={item}
      onEdit={() => navigation.navigate('MaintenanceForm', { maintenance: item })}
      onDelete={() => handleDeletePress(item)}
    />
  );

  const renderGroup = ({ item }: { item: GroupedMaintenances }) => (
    <View style={styles.group}>
      <Text style={[styles.groupYear, { color: theme.textMuted }]}>{item.year}</Text>
      {item.items.map((m) => (
        <View key={m.id} style={styles.groupItem}>
          {renderItem({ item: m })}
        </View>
      ))}
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background, paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]} numberOfLines={1}>
          {vehicleName || 'Histórico'}
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Summary */}
      <View style={[styles.summary, { backgroundColor: theme.surface }]}>
        <View style={styles.summaryItem}>
          <Text style={[styles.summaryValue, { color: theme.primary }]} numberOfLines={1}>{maintenances.length}</Text>
          <Text style={[styles.summaryLabel, { color: theme.textMuted }]} numberOfLines={1}>Total</Text>
        </View>
        <View style={[styles.summaryDivider, { backgroundColor: theme.border }]} />
        <View style={styles.summaryItem}>
          <Text style={[styles.summaryValue, { color: theme.accent }]} numberOfLines={1}>
            {totalCost.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </Text>
          <Text style={[styles.summaryLabel, { color: theme.textMuted }]} numberOfLines={1}>Investido</Text>
        </View>
        <View style={[styles.summaryDivider, { backgroundColor: theme.border }]} />
        <View style={styles.summaryItem}>
          <Text style={[styles.summaryValue, { color: theme.primary }]} numberOfLines={1}>
            {lastMaintenance
              ? new Date(lastMaintenance.performed_at + 'T00:00:00').toLocaleDateString('pt-BR')
              : '-'}
          </Text>
          <Text style={[styles.summaryLabel, { color: theme.textMuted }]} numberOfLines={1}>Última</Text>
        </View>
      </View>

      {/* List */}
      {maintenances.length === 0 && !loading ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="construct-outline" size={48} color={theme.textMuted} />
          <Text style={[styles.emptyTitle, { color: theme.text }]}>Nenhuma manutenção encontrada</Text>
          <Text style={[styles.emptySubtitle, { color: theme.textMuted }]}>
            Este veículo ainda não possui manutenções registradas.
          </Text>
        </View>
      ) : (
        <FlatList
          data={grouped}
          keyExtractor={(item) => item.year}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => fetchHistory(true)} />
          }
          renderItem={renderGroup}
        />
      )}

      {/* Confirm Delete Modal */}
      <ConfirmDeleteModal
        visible={deleteModalVisible}
        maintenanceName={maintenanceToDelete?.maintenance_type?.name || ''}
        onCancel={() => {
          setDeleteModalVisible(false);
          setMaintenanceToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
    marginHorizontal: 12,
  },
  headerSpacer: {
    width: 24,
  },
  summary: {
    flexDirection: 'row',
    paddingVertical: 16,
    paddingHorizontal: 12,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'transparent',
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
    minWidth: 0,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  summaryLabel: {
    fontSize: 13,
  },
  summaryDivider: {
    width: 1,
    marginHorizontal: 6,
  },
  list: {
    padding: 24,
    paddingBottom: 100,
  },
  group: {
    marginBottom: 16,
  },
  groupYear: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  groupItem: {
    marginBottom: 12,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
});
