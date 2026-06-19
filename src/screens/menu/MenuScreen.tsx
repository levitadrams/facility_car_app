/**
 * Tela de Menu/Home
 * Primeira tab - Menu principal com opções de navegação
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../../contexts/AuthContext';
import Card from '../../components/Card';
import Avatar from '../../components/Avatar';
import { useTheme } from '../../hooks/useTheme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TabParamList } from '../../navigation/TabNavigator';

interface MenuItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  color: string;
  onPress: () => void;
}

function MenuItem({ icon, title, subtitle, color, onPress, theme }: MenuItemProps & { theme: ReturnType<typeof useTheme> }) {
  return (
    <Card variant="default" onPress={onPress} style={styles.menuCard}>
      <View style={styles.menuContent}>
        <View style={[styles.iconContainer, { backgroundColor: color + '15' }]}>
          <Ionicons name={icon} size={24} color={color} />
        </View>
        <View style={styles.menuText}>
          <Text style={[styles.menuTitle, { color: theme.text }]}>{title}</Text>
          <Text style={[styles.menuSubtitle, { color: theme.textMuted }]}>{subtitle}</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={theme.textMuted} />
      </View>
    </Card>
  );
}

export default function MenuScreen() {
  const { user } = useAuth();
  const navigation = useNavigation<NativeStackNavigationProp<TabParamList>>();
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const menuItems = [
    {
      icon: 'car-sport-outline' as const,
      title: 'Meus Veículos',
      subtitle: 'Gerenciar veículos cadastrados',
      color: theme.primary,
      onPress: () => navigation.navigate('Vehicles'),
    },
    {
      icon: 'construct-outline' as const,
      title: 'Manutenção',
      subtitle: 'Gestão de manutenções',
      color: theme.accent,
      onPress: () => console.log('Manutenção'),
    },
    {
      icon: 'map-outline' as const,
      title: 'RotasGo',
      subtitle: 'Destinos e rotas otimizadas',
      color: theme.secondary,
      onPress: () => navigation.navigate('Destinations'),
    },
    {
      icon: 'document-text-outline' as const,
      title: 'Relatórios',
      subtitle: 'Ver relatórios e estatísticas',
      color: theme.info,
      onPress: () => console.log('Relatórios'),
    },
    {
      icon: 'notifications-outline' as const,
      title: 'Notificações',
      subtitle: 'Central de notificações',
      color: theme.warning,
      onPress: () => console.log('Notificações'),
    },
  ];

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background, paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
        <View style={styles.headerContent}>
          <View>
            <Text style={[styles.greeting, { color: theme.textMuted }]}>Olá,</Text>
            <Text style={[styles.userName, { color: theme.text }]}>{user?.name || 'Usuário'}</Text>
          </View>
          <Avatar
            name={user?.name}
            size="md"
            backgroundColor={theme.primary}
          />
        </View>
      </View>

      {/* Menu Items */}
      <View style={styles.menuContainer}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Menu Principal</Text>
        {menuItems.map((item, index) => (
          <MenuItem
            key={index}
            icon={item.icon}
            title={item.title}
            subtitle={item.subtitle}
            color={item.color}
            onPress={item.onPress}
            theme={theme}
          />
        ))}
      </View>
    </ScrollView>
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
    borderBottomWidth: 1,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 16,
    marginBottom: 4,
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
  },
  menuContainer: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  menuCard: {
    marginBottom: 16,
  },
  menuContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuText: {
    flex: 1,
    marginLeft: 16,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  menuSubtitle: {
    fontSize: 14,
  },
});
