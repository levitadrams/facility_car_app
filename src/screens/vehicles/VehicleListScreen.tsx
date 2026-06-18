/**
 * Tela de Listagem de Veículos
 * Exibe todos os veículos cadastrados com busca, paginação e ações
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
import { VehiclesStackParamList } from '../../navigation/VehiclesStack';
import { Vehicle } from '../../types/vehicle';
import { getVehicles, deleteVehicle } from '../../services/vehicleService';
import VehicleCard from '../../components/vehicles/VehicleCard';
import VehicleEmptyState from '../../components/vehicles/VehicleEmptyState';
import ConfirmDeleteModal from '../../components/vehicles/ConfirmDeleteModal';
import Input from '../../components/Input';
import theme from '../../theme';

type NavigationProp = NativeStackNavigationProp<VehiclesStackParamList>;

export default function VehicleListScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState<Vehicle | null>(null);

  const fetchVehicles = useCallback(async (pageNum: number = 1, isRefresh: boolean = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else if (pageNum === 1) setLoading(true);

      const response = await getVehicles(pageNum, search || undefined);
      setVehicles((prev) => (pageNum === 1 ? response.data : [...prev, ...response.data]));
      setLastPage(response.meta.last_page);
      setPage(response.meta.current_page);
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Erro ao carregar veículos.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [search]);

  useFocusEffect(
    useCallback(() => {
      fetchVehicles(1);
    }, [fetchVehicles])
  );

  const handleRefresh = () => {
    fetchVehicles(1, true);
  };

  const handleLoadMore = () => {
    if (page < lastPage && !loading) {
      fetchVehicles(page + 1);
    }
  };

  const handleDeletePress = (vehicle: Vehicle) => {
    setVehicleToDelete(vehicle);
    setDeleteModalVisible(true);
  };

  const handleConfirmDelete = async () => {
    if (!vehicleToDelete) return;

    try {
      await deleteVehicle(vehicleToDelete.id);
      setVehicles((prev) => prev.filter((v) => v.id !== vehicleToDelete.id));
      setDeleteModalVisible(false);
      setVehicleToDelete(null);
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Erro ao excluir veículo.');
    }
  };

  const handleSearch = () => {
    fetchVehicles(1);
  };

  const renderVehicle = ({ item }: { item: Vehicle }) => (
    <VehicleCard
      vehicle={item}
      onPress={() => navigation.navigate('VehicleDetails', { vehicle: item })}
      onEdit={() => navigation.navigate('VehicleForm', { vehicle: item })}
      onDelete={() => handleDeletePress(item)}
    />
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Meus Veículos</Text>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputWrapper}>
          <Input
            placeholder="Buscar por placa, marca ou modelo"
            value={search}
            onChangeText={setSearch}
            onSubmitEditing={handleSearch}
            autoCapitalize="characters"
            containerStyle={styles.searchInputContainer}
          />
        </View>
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch} activeOpacity={0.7}>
          <Ionicons name="search" size={22} color={theme.colors.white} />
        </TouchableOpacity>
      </View>

      {/* Vehicle List */}
      <FlatList
        data={vehicles}
        renderItem={renderVehicle}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={
          !loading ? (
            <VehicleEmptyState onAddVehicle={() => navigation.navigate('VehicleForm')} />
          ) : null
        }
      />

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('VehicleForm')}
        activeOpacity={0.85}
      >
        <Ionicons name="add" size={28} color={theme.colors.white} />
      </TouchableOpacity>

      {/* Confirm Delete Modal */}
      <ConfirmDeleteModal
        visible={deleteModalVisible}
        vehicleName={vehicleToDelete?.nickname || `${vehicleToDelete?.brand?.name || ''} ${vehicleToDelete?.model?.name || ''}`.trim() || ''}
        onCancel={() => {
          setDeleteModalVisible(false);
          setVehicleToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
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
  fab: {
    position: 'absolute',
    right: theme.spacing.lg,
    bottom: theme.spacing.xl,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.primary[600],
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: theme.colors.black || '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  searchContainer: {
    backgroundColor: theme.colors.white,
    paddingHorizontal: theme.layout.containerPadding,
    paddingVertical: theme.spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  searchInputWrapper: {
    flex: 1,
  },
  searchInputContainer: {
    marginBottom: 0,
  },
  searchButton: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.primary[600],
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    padding: theme.layout.containerPadding,
  },
});
