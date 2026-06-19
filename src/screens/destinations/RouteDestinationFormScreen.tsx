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
import { useTheme } from '../../hooks/useTheme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
  const insets = useSafeAreaInsets();
  const route = useRoute<RoutePropType>();
  const editing = route.params?.destination;
  const mapRef = useRef<MapView>(null);
  const theme = useTheme();

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
    <View style={[styles.container, { backgroundColor: theme.background, paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <View style={[styles.header, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.text }]}>{editing ? 'Editar Destino' : 'Novo Destino'}</Text>
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
          leftIcon={<Ionicons name="search" size={20} color={theme.textMuted} />}
          rightIcon={
            loadingSearch ? (
              <ActivityIndicator size="small" color={theme.primary} />
            ) : (
              query.length > 0 ? (
                <TouchableOpacity onPress={() => { setQuery(''); setResults([]); }}>
                  <Ionicons name="close-circle" size={22} color={theme.textMuted} />
                </TouchableOpacity>
              ) : null
            )
          }
        />

        {/* Results */}
        {results.length > 0 && (
          <Card variant="outlined" style={[styles.resultsCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <FlatList
              data={results}
              keyExtractor={(item) => String(item.place_id)}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.resultItem}
                  onPress={() => handleSelectResult(item)}
                >
                  <Ionicons name="location-outline" size={18} color={theme.primary} />
                  <Text style={[styles.resultText, { color: theme.text }]} numberOfLines={2}>
                    {item.display_name}
                  </Text>
                </TouchableOpacity>
              )}
              ItemSeparatorComponent={() => <View style={[styles.separator, { backgroundColor: theme.border }]} />}
            />
          </Card>
        )}

        {/* Map */}
        <View style={[styles.mapContainer, { backgroundColor: theme.borderLight }]}>
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
                pinColor={theme.primary}
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
            <Text style={[styles.infoLabel, { color: theme.textMuted }]}>Endereço Completo</Text>
            <Text style={[styles.infoValue, { color: theme.text }]}>
              {selected?.display_name || editing?.address || ''}
            </Text>
            <View style={styles.coordsRow}>
              <View style={[styles.coordBox, { backgroundColor: theme.surfaceHighlight }]}>
                <Text style={[styles.coordLabel, { color: theme.textMuted }]}>Latitude</Text>
                <Text style={[styles.coordValue, { color: theme.primary }]}>{markerCoord?.latitude.toFixed(6)}</Text>
              </View>
              <View style={[styles.coordBox, { backgroundColor: theme.surfaceHighlight }]}>
                <Text style={[styles.coordLabel, { color: theme.textMuted }]}>Longitude</Text>
                <Text style={[styles.coordValue, { color: theme.primary }]}>{markerCoord?.longitude.toFixed(6)}</Text>
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
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 64,
  },
  resultsCard: {
    marginBottom: 16,
    maxHeight: 220,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    gap: 8,
  },
  resultText: {
    flex: 1,
    fontSize: 14,
  },
  separator: {
    height: 1,
  },
  mapContainer: {
    height: 280,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
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
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  infoCard: {
    marginBottom: 16,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'uppercase',
    marginTop: 8,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
  },
  coordsRow: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 16,
  },
  coordBox: {
    flex: 1,
    borderRadius: 8,
    padding: 16,
  },
  coordLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  coordValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  notesInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  saveButton: {
    marginTop: 16,
  },
});
