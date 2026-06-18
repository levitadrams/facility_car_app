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
import theme from '../../theme';

type NavigationProp = NativeStackNavigationProp<VehiclesStackParamList>;
type RouteProps = RouteProp<VehiclesStackParamList, 'VehicleDetails'>;

export default function VehicleDetailsScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const { vehicle } = route.params;

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
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalhes</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('VehicleForm', { vehicle })}
        >
          <Ionicons name="create-outline" size={24} color={theme.colors.primary[600]} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Vehicle Name */}
        <View style={styles.nameSection}>
          <View style={styles.iconContainer}>
            <Ionicons name="car-sport" size={40} color={theme.colors.primary[600]} />
          </View>
          <Text style={styles.vehicleName}>{displayName}</Text>
          <Text style={styles.vehicleSubtitle}>
            {brandName} {modelName} • {vehicle.year}
          </Text>
        </View>

        {/* Info Cards */}
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Informações</Text>
          {infoItems.map((item, index) => (
            <View key={index} style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Ionicons name={item.icon as keyof typeof Ionicons.glyphMap} size={18} color={theme.colors.primary[600]} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>{item.label}</Text>
                <Text style={styles.infoValue}>{item.value}</Text>
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
  headerTitle: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
  },
  content: {
    padding: theme.layout.containerPadding,
  },
  nameSection: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xl,
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.primary[50],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  vehicleName: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  vehicleSubtitle: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.secondary,
  },
  infoSection: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  infoIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.primary[50],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
  },
});
