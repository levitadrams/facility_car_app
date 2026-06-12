/**
 * Rotas do Aplicativo
 * Stack de navegação para telas protegidas (autenticadas)
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TabNavigator from './TabNavigator';

export type AppStackParamList = {
  Tabs: undefined;
};

const Stack = createNativeStackNavigator<AppStackParamList>();

export default function AppRoutes() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Tabs" component={TabNavigator} />
    </Stack.Navigator>
  );
}
