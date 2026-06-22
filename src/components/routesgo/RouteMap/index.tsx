import React, { useRef, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { RouteMapData } from '../../../types/route';

interface RouteMapProps {
  routeData: RouteMapData;
  showsTraffic?: boolean;
}

export default function RouteMap({ routeData, showsTraffic = false }: RouteMapProps) {
  const mapRef = useRef<MapView>(null);

  const origin = {
    latitude: routeData.origin.latitude,
    longitude: routeData.origin.longitude,
  };

  const destination = {
    latitude: routeData.destination.latitude,
    longitude: routeData.destination.longitude,
  };

  const polylineCoords = routeData.geometry.map((coord) => ({
    latitude: coord.latitude,
    longitude: coord.longitude,
  }));

  useEffect(() => {
    if (mapRef.current && polylineCoords.length > 0) {
      const allCoords = [origin, ...polylineCoords, destination];
      mapRef.current.fitToCoordinates(allCoords, {
        edgePadding: {
          top: 60,
          right: 40,
          bottom: 40,
          left: 40,
        },
        animated: true,
      });
    }
  }, [routeData]);

  return (
    <MapView
      ref={mapRef}
      style={styles.map}
      showsTraffic={showsTraffic}
      initialRegion={{
        latitude: (origin.latitude + destination.latitude) / 2,
        longitude: (origin.longitude + destination.longitude) / 2,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }}
    >
      {/* Marcador Origem */}
      <Marker
        coordinate={origin}
        title="Minha Localização"
        pinColor="#3B82F6"
      />

      {/* Marcador Destino */}
      <Marker
        coordinate={destination}
        title={routeData.destination.name}
        pinColor="#EF4444"
      />

      {/* Traçado da rota */}
      {polylineCoords.length > 0 && (
        <Polyline
          coordinates={polylineCoords}
          strokeColor="#3B82F6"
          strokeWidth={4}
        />
      )}
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
});
