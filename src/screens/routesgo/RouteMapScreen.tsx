/**
 * Tela de Visualização de Rota no Mapa (RotasGo)
 *
 * Exibe:
 * - Mapa com origem, destino e polyline da rota
 * - Informações inferiores (distância, tempo, origem, destino)
 * - Botão para abrir no Google Maps
 */

import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, useNavigation, RouteProp, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../../hooks/useTheme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getRoute } from '../../services/routeMapService';
import { RouteMapData } from '../../types/route';
import { DestinationsStackParamList } from '../../navigation/DestinationsStack';
import RouteMap from '../../components/routesgo/RouteMap';
import RouteInfoCard from '../../components/routesgo/RouteInfoCard';
import RouteLoading from '../../components/routesgo/RouteLoading';
import RouteError from '../../components/routesgo/RouteError';
import TrafficToggleButton from '../../components/routesgo/TrafficToggleButton';

type NavigationProp = NativeStackNavigationProp<DestinationsStackParamList, 'RouteMap'>;
type RouteParams = RouteProp<DestinationsStackParamList, 'RouteMap'>;

export default function RouteMapScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteParams>();
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const { destinationId, destinationName, destinationLatitude, destinationLongitude } =
    route.params;

  const [routeData, setRouteData] = useState<RouteMapData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showsTraffic, setShowsTraffic] = useState(false);
  const [mapKey, setMapKey] = useState(0);

  const TRAFFIC_STORAGE_KEY = '@facilitycar:traffic_enabled';

  const fetchRoute = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Solicitar permissão de localização
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Permissão de localização negada. A rota não pode ser calculada sem sua localização atual.');
        setLoading(false);
        return;
      }

      // Obter localização atual
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const originLat = location.coords.latitude;
      const originLng = location.coords.longitude;

      // Chamar API
      const data = await getRoute(destinationId, originLat, originLng);
      setRouteData(data);
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro ao calcular a rota.');
    } finally {
      setLoading(false);
    }
  }, [destinationId]);

  useEffect(() => {
    fetchRoute();
  }, [fetchRoute]);

  // Força remontagem do mapa ao entrar na tela, resetando o zoom ao padrão
  useFocusEffect(
    useCallback(() => {
      setMapKey((prev) => prev + 1);
    }, [])
  );

  // Salvar preferência quando alterada
  useEffect(() => {
    const saveTrafficPreference = async () => {
      try {
        await AsyncStorage.setItem(TRAFFIC_STORAGE_KEY, String(showsTraffic));
      } catch {
        // Falha silenciosa
      }
    };
    saveTrafficPreference();
  }, [showsTraffic]);

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        {/* Header */}
        <View style={[styles.header, { paddingTop: insets.top, backgroundColor: theme.surface }]}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color={theme.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.text }]} numberOfLines={1}>
            {destinationName}
          </Text>
          <View style={styles.backButton} />
        </View>
        <RouteLoading />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        {/* Header */}
        <View style={[styles.header, { paddingTop: insets.top, backgroundColor: theme.surface }]}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color={theme.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.text }]} numberOfLines={1}>
            {destinationName}
          </Text>
          <View style={styles.backButton} />
        </View>
        <RouteError
          title="Erro ao carregar rota"
          message={error}
          onRetry={fetchRoute}
        />
      </View>
    );
  }

  if (!routeData) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        {/* Header */}
        <View style={[styles.header, { paddingTop: insets.top, backgroundColor: theme.surface }]}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color={theme.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.text }]} numberOfLines={1}>
            {destinationName}
          </Text>
          <View style={styles.backButton} />
        </View>
        <RouteError
          title="Rota não encontrada"
          message="Não foi possível encontrar uma rota para este destino."
          onRetry={fetchRoute}
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top, backgroundColor: theme.surface }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]} numberOfLines={1}>
          Rota para {routeData.destination.name}
        </Text>
        <View style={styles.backButton} />
      </View>

      {/* Mapa (~80% da tela) */}
      <View style={styles.mapContainer}>
        <RouteMap key={mapKey} routeData={routeData} showsTraffic={showsTraffic} />
      </View>

      {/* Botão flutuante de trânsito */}
      <View style={[styles.trafficButtonContainer, { top: insets.top + 64 }]}>
        <TrafficToggleButton
          enabled={showsTraffic}
          onToggle={() => setShowsTraffic((prev) => !prev)}
        />
      </View>

      {/* Card de informações inferiores */}
      <View style={styles.infoContainer}>
        <RouteInfoCard routeData={routeData} />
      </View>
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
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '700',
    marginHorizontal: 8,
  },
  mapContainer: {
    flex: 1,
  },
  infoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  trafficButtonContainer: {
    position: 'absolute',
    right: 16,
    zIndex: 20,
  },
});
