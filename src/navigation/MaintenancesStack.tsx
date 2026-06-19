/**
 * Stack Navigator para a aba Manutenções
 * Mantém o Bottom Tab visível enquanto navega entre listagem, formulário e histórico
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MaintenanceListScreen from '../screens/maintenances/MaintenanceListScreen';
import MaintenanceFormScreen from '../screens/maintenances/MaintenanceFormScreen';
import MaintenanceHistoryScreen from '../screens/maintenances/MaintenanceHistoryScreen';
import { Maintenance } from '../types/maintenance';

export type MaintenancesStackParamList = {
  MaintenanceList: undefined;
  MaintenanceForm: { maintenance?: Maintenance } | undefined;
  MaintenanceHistory: { vehicleId: number; vehicleName: string } | undefined;
};

const Stack = createNativeStackNavigator<MaintenancesStackParamList>();

export default function MaintenancesStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MaintenanceList" component={MaintenanceListScreen} />
      <Stack.Screen name="MaintenanceForm" component={MaintenanceFormScreen} />
      <Stack.Screen name="MaintenanceHistory" component={MaintenanceHistoryScreen} />
    </Stack.Navigator>
  );
}
