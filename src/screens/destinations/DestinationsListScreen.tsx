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
import { DestinationsStackParamList } from '../../navigation/DestinationsStack';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Badge from '../../components/Badge';
import { useTheme } from '../../hooks/useTheme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getDestinations, deleteDestination, calculateRouteWithEstimate } from '../../services/destinationService';
import { DestinationWithDistance, RouteDestination } from '../../types/destination';

type NavigationProp = NativeStackNavigationProp<DestinationsStackParamList>;

export default function DestinationsListScreen() {
  const navigation = useNavigation<NavigationProp>();
  const theme = useTheme();
  const insets = useSafeAreaInsets();
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
        // Consulta OSRM para cada destino com estimativa de tempo
        const enriched: DestinationWithDistance[] = await Promise.all(
          data.map(async (dest: RouteDestination) => {
            try {
              const route = await calculateRouteWithEstimate(
                loc.latitude,
                loc.longitude,
                Number(dest.latitude),
                Number(dest.longitude)
              );
              
              if (route) {
                return {
                  ...dest,
                  distance: route.distance,
                  durationCalculated: route.durationCalculated,
                  durationEstimated: route.durationEstimated,
                  // Mantém compatibilidade (duration = tempo estimado)
                  duration: route.durationEstimated,
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

  const handleViewRoute = useCallback((destination: RouteDestination) => {
    navigation.navigate('RouteMap', {
      destinationId: destination.id,
      destinationName: destination.name,
      destinationLatitude: Number(destination.latitude),
      destinationLongitude: Number(destination.longitude),
    });
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
              <Ionicons name="location" size={20} color={theme.primary} />
              <Text style={[styles.cardTitle, { color: theme.text }]} numberOfLines={1} ellipsizeMode="tail">{item.name}</Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => handleEdit(item)}
            style={[styles.editButton, { backgroundColor: theme.secondary }]}
            activeOpacity={0.7}
          >
            <Ionicons name="create-outline" size={22} color={theme.primary} />
          </TouchableOpacity>
        </View>

        {item.distance !== undefined && item.duration !== undefined && (
          <View style={[styles.cardFooter, { borderTopColor: theme.border }]}>
            <View style={styles.metricBox}>
              <Ionicons name="navigate-outline" size={16} color={theme.primary} />
              <Text style={[styles.metricValue, { color: theme.text }]}>{formatDistance(item.distance)}</Text>
            </View>

            {item.durationCalculated !== undefined && item.durationEstimated !== undefined ? (
              <>
                <View style={styles.metricBox}>
                  <Ionicons name="time-outline" size={16} color={theme.textMuted} />
                  <Text style={[styles.metricValueSecondary, { color: theme.textMuted }]}>
                    {formatDuration(item.durationCalculated)}
                  </Text>
                </View>
                <View style={styles.metricBox}>
                  <Ionicons name="time" size={16} color={theme.secondary} />
                  <Text style={[styles.metricValue, { color: theme.text }]}>
                    {formatDuration(item.durationEstimated)}
                  </Text>
                </View>
              </>
            ) : (
              <View style={styles.metricBox}>
                <Ionicons name="time-outline" size={16} color={theme.secondary} />
                <Text style={[styles.metricValue, { color: theme.text }]}>{formatDuration(item.duration)}</Text>
              </View>
            )}
          </View>
        )}

        {/* Botão Ver Rota */}
        <TouchableOpacity
          style={[styles.routeButton, { backgroundColor: theme.primary }]}
          onPress={() => handleViewRoute(item)}
          activeOpacity={0.8}
        >
          <Ionicons name="map-outline" size={18} color={theme.textInverse} />
          <Text style={[styles.routeButtonText, { color: theme.textInverse }]}>Ver Rota</Text>
        </TouchableOpacity>
      </Card>
    ),
    [handleEdit, handleDelete, handleViewRoute, theme]
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
        <View style={styles.headerRow}>
          <Text style={[styles.title, { color: theme.text }]}>Rotas Inteligentes</Text>
          <TouchableOpacity
            onPress={handleRefresh}
            style={[styles.refreshButton, { backgroundColor: theme.primary, marginLeft: 65, marginTop: 10 }]}
            activeOpacity={0.7}
          >
            <Ionicons name="refresh" size={24} color={theme.textInverse} />
          </TouchableOpacity>
          <View style={styles.headerSpacer} />
        </View>

        {userLocation && (
          <Text style={[styles.subtitle, { color: theme.textMuted }]}>
            Sua localização: {userLocation.latitude.toFixed(4)}, {userLocation.longitude.toFixed(4)}
          </Text>
        )}
        {locationError && (
          <View style={[styles.errorBox, { backgroundColor: theme.dangerLight }]}>
            <Ionicons name="warning-outline" size={16} color={theme.danger} />
            <Text style={[styles.errorText, { color: theme.danger }]}>{locationError}</Text>
          </View>
        )}
      </View>

      {/* Content */}
      {loading && !refreshing ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={[styles.loadingText, { color: theme.textMuted }]}>Calculando rotas...</Text>
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
              <Ionicons name="map-outline" size={48} color={theme.textMuted} />
              <Text style={[styles.emptyTitle, { color: theme.text }]}>Nenhum destino cadastrado</Text>
              <Text style={[styles.emptySubtitle, { color: theme.textMuted }]}>
                Adicione destinos para visualizar as rotas otimizadas
              </Text>
            </View>
          }
        />
      )}

      {/* FAB */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: theme.fab }]}
        onPress={() => navigation.navigate('RouteDestinationForm')}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={28} color={theme.textInverse} />
      </TouchableOpacity>
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
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerSpacer: {
    width: 10,
  },
  refreshButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
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
    fontSize: 24,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 12,
    marginTop: 4,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 8,
    padding: 8,
    borderRadius: 8,
  },
  errorText: {
    fontSize: 14,
  },
  list: {
    padding: 24,
    gap: 16,
    paddingBottom: 64,
  },
  card: {
    marginBottom: 0,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
  },
  cardInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    flexShrink: 1,
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardFooter: {
    flexDirection: 'row',
    gap: 24,
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
  },
  metricBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metricValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  metricValueSecondary: {
    fontSize: 14,
    fontWeight: '400',
    textDecorationLine: 'line-through',
  },
  routeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 16,
    paddingVertical: 12,
    borderRadius: 10,
  },
  routeButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 64,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    marginTop: 4,
    textAlign: 'center',
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
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
});

function formatDistance(meters: number | undefined): string {
  if (meters === undefined || meters === null) return '-';
  if (meters < 1000) return `${Math.round(meters)} m`;
  return `${(meters / 1000).toFixed(1)} km`;
}

function formatDuration(seconds: number | undefined): string {
  if (seconds === undefined || seconds === null) return '-';
  if (seconds < 60) return `${Math.round(seconds)} s`;
  const mins = Math.round(seconds / 60);
  if (mins < 60) return `${mins} min`;
  const hours = Math.floor(mins / 60);
  const remainingMins = mins % 60;
  return `${hours}h ${remainingMins}min`;
}
