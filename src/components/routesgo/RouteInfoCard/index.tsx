import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../hooks/useTheme';
import { RouteMapData } from '../../../types/route';

interface RouteInfoCardProps {
  routeData: RouteMapData;
}

export default function RouteInfoCard({ routeData }: RouteInfoCardProps) {
  const theme = useTheme();

  const originLat = routeData.origin.latitude;
  const originLng = routeData.origin.longitude;
  const destLat = routeData.destination.latitude;
  const destLng = routeData.destination.longitude;

  const handleOpenGoogleMaps = () => {
    const url = `https://www.google.com/maps/dir/?api=1&origin=${originLat},${originLng}&destination=${destLat},${destLng}&travelmode=driving`;
    Linking.openURL(url).catch(() => {
      // Fallback: tenta abrir via intent do Google Maps
      const mapsUrl = `comgooglemaps://?daddr=${destLat},${destLng}&directions_mode=driving`;
      Linking.openURL(mapsUrl).catch(() => {
        // Se falhar, o Linking.openURL(url) já tentou o navegador
      });
    });
  };

  const formatDuration = (minutes: number): string => {
    if (minutes < 1) return '1 min';
    if (minutes < 60) return `${Math.round(minutes)} min`;
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return `${hours}h ${mins}min`;
  };

  const formatDistance = (km: number): string => {
    return `${km.toFixed(1).replace('.', ',')} km`;
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.surface }]}>
      {/* Linha superior com distância e tempo */}
      <View style={styles.topRow}>
        <View style={styles.metric}>
          <Ionicons name="navigate-outline" size={20} color={theme.primary} />
          <View>
            <Text style={[styles.metricLabel, { color: theme.textMuted }]}>Distância</Text>
            <Text style={[styles.metricValue, { color: theme.text }]}>
              {formatDistance(routeData.distance_km)}
            </Text>
          </View>
        </View>

        <View style={styles.metric}>
          <Ionicons name="time-outline" size={20} color={theme.secondary} />
          <View>
            <Text style={[styles.metricLabel, { color: theme.textMuted }]}>Tempo Estimado</Text>
            <Text style={[styles.metricValue, { color: theme.text }]}>
              {formatDuration(routeData.duration_minutes)}
            </Text>
          </View>
        </View>
      </View>

      {/* Linha de origem/destino */}
      <View style={[styles.divider, { backgroundColor: theme.border }]} />

      <View style={styles.locationsRow}>
        <View style={styles.locationItem}>
          <Ionicons name="locate" size={16} color={theme.primary} />
          <View style={styles.locationText}>
            <Text style={[styles.locationLabel, { color: theme.textMuted }]}>Origem</Text>
            <Text style={[styles.locationValue, { color: theme.text }]} numberOfLines={1}>
              {routeData.origin.label}
            </Text>
          </View>
        </View>

        <View style={styles.locationItem}>
          <Ionicons name="location" size={16} color={theme.danger} />
          <View style={styles.locationText}>
            <Text style={[styles.locationLabel, { color: theme.textMuted }]}>Destino</Text>
            <Text style={[styles.locationValue, { color: theme.text }]} numberOfLines={1}>
              {routeData.destination.name}
            </Text>
          </View>
        </View>
      </View>

      {/* Botão Google Maps */}
      <TouchableOpacity
        style={[styles.mapsButton, { backgroundColor: theme.primary }]}
        onPress={handleOpenGoogleMaps}
        activeOpacity={0.8}
      >
        <Ionicons name="map" size={20} color={theme.textInverse} />
        <Text style={[styles.mapsButtonText, { color: theme.textInverse }]}>
          Abrir no Google Maps
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingBottom: 16,
  },
  metric: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  metricLabel: {
    fontSize: 12,
    marginBottom: 2,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    marginHorizontal: -20,
    marginBottom: 16,
  },
  locationsRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  locationText: {
    flex: 1,
    minWidth: 0,
  },
  locationLabel: {
    fontSize: 11,
    marginBottom: 2,
  },
  locationValue: {
    fontSize: 13,
    fontWeight: '600',
  },
  mapsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
  },
  mapsButtonText: {
    fontSize: 15,
    fontWeight: '600',
  },
});
