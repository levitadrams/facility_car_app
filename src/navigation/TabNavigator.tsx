/**
 * Bottom Tab Navigator
 * Navegação principal do app com 4 tabs
 */

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';

// Screens & Stacks
import MenuScreen from '../screens/menu/MenuScreen';
import VehiclesStack from './VehiclesStack';
import MaintenanceScreen from '../screens/maintenance/MaintenanceScreen';
import SettingsScreen from '../screens/settings/SettingsScreen';
import DestinationsStack from './DestinationsStack';

export type TabParamList = {
  Menu: undefined;
  Vehicles: undefined;
  Maintenance: undefined;
  Destinations: undefined;
  Settings: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

export default function TabNavigator() {
  const theme = useTheme();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.textMuted,
        tabBarStyle: {
          height: 64,
          paddingBottom: 8,
          paddingTop: 8,
          borderTopWidth: 1,
          borderTopColor: theme.border,
          backgroundColor: theme.surface,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      }}
    >
      <Tab.Screen 
        name="Menu" 
        component={MenuScreen}
        options={{
          tabBarLabel: 'Menu',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      
      <Tab.Screen 
        name="Vehicles" 
        component={VehiclesStack}
        options={{
          tabBarLabel: 'Veículos',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="car-sport" size={size} color={color} />
          ),
        }}
      />
      
      <Tab.Screen 
        name="Maintenance" 
        component={MaintenanceScreen}
        options={{
          tabBarLabel: 'Manutenção',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="construct" size={size} color={color} />
          ),
        }}
      />
      
      <Tab.Screen
        name="Destinations"
        component={DestinationsStack}
        options={{
          tabBarLabel: 'Destinos',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="map" size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarLabel: 'Configurações',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
