/**
 * Tela de Detalhes do Veículo
 * Exibe todas as informações de um veículo específico
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { VehiclesStackParamList } from '../../navigation/VehiclesStack';
import { useTheme } from '../../hooks/useTheme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type NavigationProp = NativeStackNavigationProp<VehiclesStackParamList>;
type RouteProps = RouteProp<VehiclesStackParamList, 'VehicleDetails'>;

export default function VehicleDetailsScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const { vehicle } = route.params;
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const brandName = vehicle.brand?.name || '';
  const modelName = vehicle.model?.name || '';
  const displayName = vehicle.nickname || `${brandName} ${modelName}`.trim();
  const mileageFormatted = vehicle.current_mileage.toLocaleString('pt-BR');
  const createdAt = vehicle.created_at
    ? new Date(vehicle.created_at).toLocaleDateString('pt-BR')
    : '-';

  const infoItems = [
    { label: 'Marca', value: brandName, icon: 'business' },
    { label: 'Modelo', value: modelName, icon: 'car' },
    { label: 'Ano', value: vehicle.year.toString(), icon: 'calendar' },
    { label: 'Placa', value: vehicle.plate, icon: 'document-text' },
    { label: 'Cor', value: vehicle.color || 'Não informada', icon: 'color-palette' },
    { label: 'Combustível', value: vehicle.fuel_type || 'Não informado', icon: 'flame' },
    { label: 'Quilometragem', value: `${mileageFormatted} km`, icon: 'speedometer' },
    { label: 'Data de Cadastro', value: createdAt, icon: 'time' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.background, paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Detalhes</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('VehicleForm', { vehicle })}
        >
          <Ionicons name="create-outline" size={24} color={theme.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Vehicle Name */}
        <View style={[styles.nameSection, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <View style={[styles.iconContainer, { backgroundColor: theme.primaryLight }]}>
            <Ionicons name="car-sport" size={40} color={theme.primary} />
          </View>
          <Text style={[styles.vehicleName, { color: theme.text }]}>{displayName}</Text>
          <Text style={[styles.vehicleSubtitle, { color: theme.textMuted }]}>
            {brandName} {modelName} • {vehicle.year}
          </Text>
        </View>

        {/* Info Cards */}
        <View style={[styles.infoSection, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Informações</Text>
          {infoItems.map((item, index) => (
            <View key={index} style={[styles.infoRow, { borderBottomColor: theme.border }]}>
              <View style={[styles.infoIcon, { backgroundColor: theme.primaryLight }]}>
                <Ionicons name={item.icon as keyof typeof Ionicons.glyphMap} size={18} color={theme.primary} />
              </View>
              <View style={styles.infoContent}>
                <Text style={[styles.infoLabel, { color: theme.textMuted }]}>{item.label}</Text>
                <Text style={[styles.infoValue, { color: theme.text }]}>{item.value}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  content: {
    padding: 24,
  },
  nameSection: {
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  vehicleName: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  vehicleSubtitle: {
    fontSize: 16,
  },
  infoSection: {
    borderRadius: 12,
    padding: 24,
    borderWidth: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  infoIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
  },
});
