/**
 * Tela de Listagem de Destinos (RotasGo)
 * Captura localização, busca destinos, consulta OSRM e ordena por proximidade
 */

import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
  ActivityIndicator,
} from 'react-native';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Badge from '../../components/Badge';
import theme from '../../theme';
import { getDestinations, deleteDestination, calculateRoute } from '../../services/destinationService';
import { DestinationWithDistance, RouteDestination } from '../../types/destination';

type NavigationProp = NativeStackNavigationProp<any>;

function formatDistance(meters: number): string {
  if (meters < 1000) return `${Math.round(meters)} m`;
  return `${(meters / 1000).toFixed(1)} km`;
}

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${Math.round(seconds)} s`;
  const mins = Math.round(seconds / 60);
  if (mins < 60) return `${mins} min`;
  const hours = Math.floor(mins / 60);
  const remainingMins = mins % 60;
  return `${hours}h ${remainingMins}min`;
}

export default function DestinationsListScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [destinations, setDestinations] = useState<DestinationWithDistance[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  const fetchLocation = useCallback(async () => {
    setLocationError(null);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocationError('Permissão de localização negada.');
        return null;
      }
      const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
    } catch (err) {
      setLocationError('Não foi possível obter a localização atual.');
      return null;
    }
  }, []);

  const loadDestinations = useCallback(async () => {
    setLoading(true);
    try {
      const loc = await fetchLocation();
      setUserLocation(loc);

      const data = await getDestinations();

      if (loc && data.length > 0) {
        // Consulta OSRM para cada destino
        const enriched: DestinationWithDistance[] = await Promise.all(
          data.map(async (dest: RouteDestination) => {
            try {
              const route = await calculateRoute(
                loc.latitude,
                loc.longitude,
                Number(dest.latitude),
                Number(dest.longitude)
              );
              if (route.code === 'Ok' && route.routes.length > 0) {
                return {
                  ...dest,
                  distance: route.routes[0].distance,
                  duration: route.routes[0].duration,
                } as DestinationWithDistance;
              }
            } catch {
              // Falha silenciosa no cálculo de rota
            }
            return dest as DestinationWithDistance;
          })
        );

        // Ordenar: mais próximo primeiro
        const sorted = enriched.sort((a, b) => {
          const distA = a.distance ?? Infinity;
          const distB = b.distance ?? Infinity;
          return distA - distB;
        });

        setDestinations(sorted);
      } else {
        setDestinations(data);
      }
    } catch (err) {
      Alert.alert('Erro', 'Não foi possível carregar os destinos.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [fetchLocation]);

  useFocusEffect(
    useCallback(() => {
      loadDestinations();
    }, [loadDestinations])
  );

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    loadDestinations();
  }, [loadDestinations]);

  const handleEdit = useCallback((destination: RouteDestination) => {
    navigation.navigate('RouteDestinationForm', { destination });
  }, [navigation]);

  const handleDelete = useCallback((destination: RouteDestination) => {
    Alert.alert(
      'Excluir Destino',
      `Deseja excluir o destino "${destination.name}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteDestination(destination.id);
              setDestinations((prev) => prev.filter((d) => d.id !== destination.id));
            } catch {
              Alert.alert('Erro', 'Não foi possível excluir o destino.');
            }
          },
        },
      ]
    );
  }, []);

  const renderItem = useCallback(
    ({ item, index }: { item: DestinationWithDistance; index: number }) => (
      <Card
        variant="default"
        style={styles.card}
        onLongPress={() => handleDelete(item)}
        delayLongPress={600}
      >
        <View style={styles.cardHeader}>
          <View style={styles.cardInfo}>
            <View style={styles.nameRow}>
              <Ionicons name="location" size={20} color={theme.colors.primary[600]} />
              <Text style={styles.cardTitle}>{item.name}</Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => handleEdit(item)}
            style={styles.editButton}
            activeOpacity={0.7}
          >
            <Ionicons name="create-outline" size={22} color={theme.colors.primary[600]} />
          </TouchableOpacity>
        </View>

        {item.distance !== undefined && item.duration !== undefined && (
          <View style={styles.cardFooter}>
            <View style={styles.metricBox}>
              <Ionicons name="navigate-outline" size={16} color={theme.colors.primary[600]} />
              <Text style={styles.metricValue}>{formatDistance(item.distance)}</Text>
            </View>
            <View style={styles.metricBox}>
              <Ionicons name="time-outline" size={16} color={theme.colors.secondary[600]} />
              <Text style={styles.metricValue}>{formatDuration(item.duration)}</Text>
            </View>
          </View>
        )}
      </Card>
    ),
    [handleEdit, handleDelete]
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>Rotas Inteligentes</Text>
          <TouchableOpacity
            onPress={handleRefresh}
            style={styles.refreshButton}
            activeOpacity={0.7}
          >
            <Ionicons name="refresh" size={24} color={theme.colors.white} />
          </TouchableOpacity>
        </View>

        {userLocation && (
          <Text style={styles.subtitle}>
            Sua localização: {userLocation.latitude.toFixed(4)}, {userLocation.longitude.toFixed(4)}
          </Text>
        )}
        {locationError && (
          <View style={styles.errorBox}>
            <Ionicons name="warning-outline" size={16} color={theme.colors.danger[500]} />
            <Text style={styles.errorText}>{locationError}</Text>
          </View>
        )}
      </View>

      {/* Content */}
      {loading && !refreshing ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={theme.colors.primary[600]} />
          <Text style={styles.loadingText}>Calculando rotas...</Text>
        </View>
      ) : (
        <FlatList
          data={destinations}
          renderItem={renderItem}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="map-outline" size={48} color={theme.colors.text.tertiary} />
              <Text style={styles.emptyTitle}>Nenhum destino cadastrado</Text>
              <Text style={styles.emptySubtitle}>
                Adicione destinos para visualizar as rotas otimizadas
              </Text>
            </View>
          }
        />
      )}

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('RouteDestinationForm')}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={28} color={theme.colors.white} />
      </TouchableOpacity>
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
    paddingBottom: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  refreshButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.primary[600],
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: theme.typography.fontSize.xxl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
  },
  subtitle: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.tertiary,
    marginTop: theme.spacing.xs,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    marginTop: theme.spacing.sm,
    backgroundColor: theme.colors.danger[50],
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
  },
  errorText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.danger[600],
  },
  list: {
    padding: theme.layout.containerPadding,
    gap: theme.spacing.md,
    paddingBottom: theme.spacing.xxl,
  },
  card: {
    marginBottom: 0,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing.md,
  },
  cardInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  cardTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.primary[50],
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardFooter: {
    flexDirection: 'row',
    gap: theme.spacing.lg,
    marginTop: theme.spacing.md,
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.light,
  },
  metricBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  metricValue: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text.primary,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: theme.spacing.md,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.secondary,
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: theme.spacing.xxxl,
  },
  emptyTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
    marginTop: theme.spacing.md,
  },
  emptySubtitle: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xs,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    right: theme.spacing.lg,
    bottom: theme.spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.primary[600],
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
});
