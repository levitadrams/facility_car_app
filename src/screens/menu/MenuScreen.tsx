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
import theme from '../../theme';
import { TabParamList } from '../../navigation/TabNavigator';

interface MenuItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  color: string;
  onPress: () => void;
}

function MenuItem({ icon, title, subtitle, color, onPress }: MenuItemProps) {
  return (
    <Card variant="default" onPress={onPress} style={styles.menuCard}>
      <View style={styles.menuContent}>
        <View style={[styles.iconContainer, { backgroundColor: color + '15' }]}>
          <Ionicons name={icon} size={24} color={color} />
        </View>
        <View style={styles.menuText}>
          <Text style={styles.menuTitle}>{title}</Text>
          <Text style={styles.menuSubtitle}>{subtitle}</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={theme.colors.text.tertiary} />
      </View>
    </Card>
  );
}

export default function MenuScreen() {
  const { user } = useAuth();
  const navigation = useNavigation<NativeStackNavigationProp<TabParamList>>();

  const menuItems = [
    {
      icon: 'car-sport-outline' as const,
      title: 'Meus Veículos',
      subtitle: 'Gerenciar veículos cadastrados',
      color: theme.colors.primary[600],
      onPress: () => navigation.navigate('Vehicles'),
    },
    {
      icon: 'construct-outline' as const,
      title: 'Manutenção',
      subtitle: 'Gestão de manutenções',
      color: theme.colors.accent[600],
      onPress: () => console.log('Manutenção'),
    },
    {
      icon: 'map-outline' as const,
      title: 'RotasGo',
      subtitle: 'Destinos e rotas otimizadas',
      color: theme.colors.secondary[600],
      onPress: () => navigation.navigate('Destinations'),
    },
    {
      icon: 'document-text-outline' as const,
      title: 'Relatórios',
      subtitle: 'Ver relatórios e estatísticas',
      color: theme.colors.info[600],
      onPress: () => console.log('Relatórios'),
    },
    {
      icon: 'notifications-outline' as const,
      title: 'Notificações',
      subtitle: 'Central de notificações',
      color: theme.colors.warning[600],
      onPress: () => console.log('Notificações'),
    },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.greeting}>Olá,</Text>
            <Text style={styles.userName}>{user?.name || 'Usuário'}</Text>
          </View>
          <Avatar
            name={user?.name}
            size="md"
            backgroundColor={theme.colors.primary[600]}
          />
        </View>
      </View>

      {/* Menu Items */}
      <View style={styles.menuContainer}>
        <Text style={styles.sectionTitle}>Menu Principal</Text>
        {menuItems.map((item, index) => (
          <MenuItem
            key={index}
            icon={item.icon}
            title={item.title}
            subtitle={item.subtitle}
            color={item.color}
            onPress={item.onPress}
          />
        ))}
      </View>
    </ScrollView>
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
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
  },
  userName: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
  },
  menuContainer: {
    padding: theme.layout.containerPadding,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  menuCard: {
    marginBottom: theme.spacing.md,
  },
  menuContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuText: {
    flex: 1,
    marginLeft: theme.spacing.md,
  },
  menuTitle: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  menuSubtitle: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
  },
});
