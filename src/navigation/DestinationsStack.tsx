/**
 * Stack Navigator para a aba Destinos
 * Mantém o Bottom Tab visível enquanto navega entre listagem e formulário
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DestinationsListScreen from '../screens/destinations/DestinationsListScreen';
import RouteDestinationFormScreen from '../screens/destinations/RouteDestinationFormScreen';
import RouteMapScreen from '../screens/routesgo/RouteMapScreen';
import { RouteDestination } from '../types/destination';

export type DestinationsStackParamList = {
  DestinationsList: undefined;
  RouteDestinationForm: { destination?: RouteDestination } | undefined;
  RouteMap: {
    destinationId: number;
    destinationName: string;
    destinationLatitude: number;
    destinationLongitude: number;
  };
};

const Stack = createNativeStackNavigator<DestinationsStackParamList>();

export default function DestinationsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="DestinationsList" component={DestinationsListScreen} />
      <Stack.Screen name="RouteDestinationForm" component={RouteDestinationFormScreen} />
      <Stack.Screen name="RouteMap" component={RouteMapScreen} />
    </Stack.Navigator>
  );
}
