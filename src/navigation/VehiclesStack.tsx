/**
 * Stack Navigator para a aba Veículos
 * Mantém o Bottom Tab visível enquanto navega entre listagem, formulário e detalhes
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import VehicleListScreen from '../screens/vehicles/VehicleListScreen';
import VehicleFormScreen from '../screens/vehicles/VehicleFormScreen';
import VehicleDetailsScreen from '../screens/vehicles/VehicleDetailsScreen';
import { Vehicle } from '../types/vehicle';

export type VehiclesStackParamList = {
  VehicleList: undefined;
  VehicleForm: { vehicle?: Vehicle } | undefined;
  VehicleDetails: { vehicle: Vehicle };
};

const Stack = createNativeStackNavigator<VehiclesStackParamList>();

export default function VehiclesStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="VehicleList" component={VehicleListScreen} />
      <Stack.Screen name="VehicleForm" component={VehicleFormScreen} />
      <Stack.Screen name="VehicleDetails" component={VehicleDetailsScreen} />
    </Stack.Navigator>
  );
}
