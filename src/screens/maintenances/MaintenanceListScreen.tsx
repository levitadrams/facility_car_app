/**
 * Tela de Listagem de Manutenções
 * Exibe todas as manutenções cadastradas com busca, paginação e ações
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
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MaintenancesStackParamList } from '../../navigation/MaintenancesStack';
import { Maintenance } from '../../types/maintenance';
import { getMaintenances, deleteMaintenance } from '../../services/maintenanceService';
import MaintenanceCard from '../../components/maintenances/MaintenanceCard';
import MaintenanceEmptyState from '../../components/maintenances/MaintenanceEmptyState';
import ConfirmDeleteModal from '../../components/maintenances/ConfirmDeleteModal';
import { useTheme } from '../../hooks/useTheme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type NavigationProp = NativeStackNavigationProp<MaintenancesStackParamList>;

export default function MaintenanceListScreen() {
  const navigation = useNavigation<NavigationProp>();
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [maintenances, setMaintenances] = useState<Maintenance[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [maintenanceToDelete, setMaintenanceToDelete] = useState<Maintenance | null>(null);

  const fetchMaintenances = useCallback(async (pageNum: number = 1, isRefresh: boolean = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else if (pageNum === 1) setLoading(true);

      const response = await getMaintenances(pageNum);
      setMaintenances((prev) => (pageNum === 1 ? response.data : [...prev, ...response.data]));
      setLastPage(response.meta.last_page);
      setPage(response.meta.current_page);
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Erro ao carregar manutenções.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchMaintenances(1);
    }, [fetchMaintenances])
  );

  const handleRefresh = () => {
    fetchMaintenances(1, true);
  };

  const handleLoadMore = () => {
    if (page < lastPage && !loading) {
      fetchMaintenances(page + 1);
    }
  };

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

  const renderMaintenance = ({ item }: { item: Maintenance }) => (
    <MaintenanceCard
      maintenance={item}
      onPress={() => {
        const vehicleName = item.vehicle?.nickname
          || `${item.vehicle?.brand?.name || ''} ${item.vehicle?.model?.name || ''}`.trim()
          || 'Veículo';
        navigation.navigate('MaintenanceHistory', {
          vehicleId: item.vehicle?.id ?? 0,
          vehicleName,
        });
      }}
      onEdit={() => navigation.navigate('MaintenanceForm', { maintenance: item })}
      onDelete={() => handleDeletePress(item)}
    />
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background, paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
        <Text style={[styles.title, { color: theme.text }]}>Manutenções</Text>
      </View>

      {/* Maintenance List */}
      <FlatList
        data={maintenances}
        renderItem={renderMaintenance}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={
          !loading ? (
            <MaintenanceEmptyState onAddMaintenance={() => navigation.navigate('MaintenanceForm')} />
          ) : null
        }
      />

      {/* FAB */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: theme.fab }]}
        onPress={() => navigation.navigate('MaintenanceForm')}
        activeOpacity={0.85}
      >
        <Ionicons name="add" size={28} color={theme.textInverse} />
      </TouchableOpacity>

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
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 24,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  filterContainer: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'transparent',
  },
  list: {
    padding: 24,
    paddingBottom: 100,
  },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});
