/**
 * Bottom Tab Navigator
 * Navegação principal do app com 4 tabs
 */

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import theme from '../theme';

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
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary[600],
        tabBarInactiveTintColor: theme.colors.text.tertiary,
        tabBarStyle: {
          height: theme.layout.tabBarHeight,
          paddingBottom: 8,
          paddingTop: 8,
          borderTopWidth: 1,
          borderTopColor: theme.colors.border.light,
          backgroundColor: theme.colors.white,
        },
        tabBarLabelStyle: {
          fontSize: theme.typography.fontSize.xs,
          fontWeight: theme.typography.fontWeight.medium,
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
