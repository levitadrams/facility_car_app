/**
 * Tela de Cadastro/Edição de Destino
 * Pesquisa por nome, exibe mapa interativo com marcador ajustável
 */

import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Card from '../../components/Card';
import theme from '../../theme';
import { searchPlaces, createDestination, updateDestination } from '../../services/destinationService';
import { NominatimResult, RouteDestination } from '../../types/destination';
import { AppStackParamList } from '../../navigation/AppRoutes';

type NavigationProp = NativeStackNavigationProp<AppStackParamList, 'RouteDestinationForm'>;
type RoutePropType = RouteProp<AppStackParamList, 'RouteDestinationForm'>;

const DEFAULT_REGION: Region = {
  latitude: -22.9068,
  longitude: -43.1729,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

export default function RouteDestinationFormScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RoutePropType>();
  const editing = route.params?.destination;
  const mapRef = useRef<MapView>(null);

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<NominatimResult[]>([]);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [selected, setSelected] = useState<NominatimResult | null>(null);
  const [markerCoord, setMarkerCoord] = useState<{ latitude: number; longitude: number } | null>(
    editing
      ? { latitude: Number(editing.latitude), longitude: Number(editing.longitude) }
      : null
  );
  const [notes, setNotes] = useState(editing?.notes || '');
  const [customName, setCustomName] = useState(editing?.name || '');
  const [saving, setSaving] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(async () => {
      setLoadingSearch(true);
      try {
        const data = await searchPlaces(query.trim());
        setResults(data);
      } catch (err: any) {
        // Erros silenciosos no live search; o usuário pode tentar novamente
      } finally {
        setLoadingSearch(false);
      }
    }, 800);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [query]);

  const handleSelectResult = useCallback((item: NominatimResult) => {
    setSelected(item);
    setResults([]);
    setQuery(item.display_name.split(',')[0]);
    setCustomName(item.display_name.split(',')[0]);
    const lat = parseFloat(item.lat);
    const lon = parseFloat(item.lon);
    setMarkerCoord({ latitude: lat, longitude: lon });
    mapRef.current?.animateToRegion({
      latitude: lat,
      longitude: lon,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    }, 500);
  }, []);

  const handleMapPress = useCallback((e: any) => {
    const { coordinate } = e.nativeEvent;
    setMarkerCoord(coordinate);
    if (selected) {
      setSelected({
        ...selected,
        lat: String(coordinate.latitude),
        lon: String(coordinate.longitude),
      });
    }
  }, [selected]);

  const handleMarkerDragEnd = useCallback((e: any) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setMarkerCoord({ latitude, longitude });
    if (selected) {
      setSelected({
        ...selected,
        lat: String(latitude),
        lon: String(longitude),
      });
    }
  }, [selected]);

  const handleSave = useCallback(async () => {
    if (!markerCoord) {
      Alert.alert('Atenção', 'Posicione o marcador no local desejado.');
      return;
    }
    if (!customName.trim()) {
      Alert.alert('Atenção', 'Informe um nome para o destino.');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name: customName.trim(),
        address: selected?.display_name || editing?.address || '',
        latitude: markerCoord.latitude,
        longitude: markerCoord.longitude,
        notes: notes || undefined,
      };

      if (editing) {
        await updateDestination(editing.id, payload);
      } else {
        await createDestination(payload);
      }

      Alert.alert('Sucesso', 'Destino salvo com sucesso!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (err) {
      Alert.alert('Erro', 'Não foi possível salvar o destino.');
    } finally {
      setSaving(false);
    }
  }, [selected, editing, markerCoord, notes, customName, navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>{editing ? 'Editar Destino' : 'Novo Destino'}</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Search */}
        <Input
          label="Pesquisar destino"
          placeholder="Ex: Igreja Batista Central, Aeroporto..."
          value={query}
          onChangeText={setQuery}
          leftIcon={<Ionicons name="search" size={20} color={theme.colors.text.tertiary} />}
          rightIcon={
            loadingSearch ? (
              <ActivityIndicator size="small" color={theme.colors.primary[600]} />
            ) : (
              query.length > 0 ? (
                <TouchableOpacity onPress={() => { setQuery(''); setResults([]); }}>
                  <Ionicons name="close-circle" size={22} color={theme.colors.text.tertiary} />
                </TouchableOpacity>
              ) : null
            )
          }
        />

        {/* Results */}
        {results.length > 0 && (
          <Card variant="outlined" style={styles.resultsCard}>
            <FlatList
              data={results}
              keyExtractor={(item) => String(item.place_id)}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.resultItem}
                  onPress={() => handleSelectResult(item)}
                >
                  <Ionicons name="location-outline" size={18} color={theme.colors.primary[600]} />
                  <Text style={styles.resultText} numberOfLines={2}>
                    {item.display_name}
                  </Text>
                </TouchableOpacity>
              )}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
          </Card>
        )}

        {/* Map */}
        <View style={styles.mapContainer}>
          <MapView
            ref={mapRef}
            style={styles.map}
            initialRegion={DEFAULT_REGION}
            onPress={handleMapPress}
          >
            {markerCoord && (
              <Marker
                coordinate={markerCoord}
                draggable
                onDragEnd={handleMarkerDragEnd}
                pinColor={theme.colors.primary[600]}
              />
            )}
          </MapView>
          {!markerCoord && (
            <View style={styles.mapOverlay} pointerEvents="none">
              <Text style={styles.mapOverlayText}>
                Pesquise um local ou toque no mapa para posicionar o marcador
              </Text>
            </View>
          )}
        </View>

        {/* Destination name — editable */}
        <Input
          label="Nome do Destino"
          placeholder="Ex: Cliente João, Igreja Central..."
          value={customName}
          onChangeText={setCustomName}
        />

        {/* Selected info */}
        {(selected || editing) && (
          <Card variant="default" style={styles.infoCard}>
            <Text style={styles.infoLabel}>Endereço Completo</Text>
            <Text style={styles.infoValue}>
              {selected?.display_name || editing?.address || ''}
            </Text>
            <View style={styles.coordsRow}>
              <View style={styles.coordBox}>
                <Text style={styles.coordLabel}>Latitude</Text>
                <Text style={styles.coordValue}>{markerCoord?.latitude.toFixed(6)}</Text>
              </View>
              <View style={styles.coordBox}>
                <Text style={styles.coordLabel}>Longitude</Text>
                <Text style={styles.coordValue}>{markerCoord?.longitude.toFixed(6)}</Text>
              </View>
            </View>
          </Card>
        )}

        {/* Notes */}
        <Input
          label="Observações"
          placeholder="Observações opcionais..."
          value={notes}
          onChangeText={setNotes}
          multiline
          numberOfLines={3}
          style={styles.notesInput}
        />

        {/* Save */}
        <Button
          title={editing ? 'Atualizar Destino' : 'Salvar Destino'}
          loading={saving}
          onPress={handleSave}
          style={styles.saveButton}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.secondary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.white,
    paddingHorizontal: theme.layout.containerPadding,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: theme.layout.containerPadding,
    paddingBottom: theme.spacing.xxl,
  },
  resultsCard: {
    marginBottom: theme.spacing.md,
    maxHeight: 220,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    gap: theme.spacing.sm,
  },
  resultText: {
    flex: 1,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.primary,
  },
  separator: {
    height: 1,
    backgroundColor: theme.colors.border.light,
  },
  mapContainer: {
    height: 280,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    marginBottom: theme.spacing.md,
    backgroundColor: theme.colors.gray[200],
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  mapOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  mapOverlayText: {
    color: theme.colors.white,
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.medium,
    textAlign: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
  infoCard: {
    marginBottom: theme.spacing.md,
  },
  infoLabel: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text.tertiary,
    textTransform: 'uppercase',
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.xs,
  },
  infoValue: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.primary,
  },
  coordsRow: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginTop: theme.spacing.md,
  },
  coordBox: {
    flex: 1,
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
  },
  coordLabel: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.tertiary,
    marginBottom: theme.spacing.xs,
  },
  coordValue: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.primary[700],
  },
  notesInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  saveButton: {
    marginTop: theme.spacing.md,
  },
});
