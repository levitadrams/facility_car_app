/**
 * Tela do Dashboard
 * Primeira tab - Dashboard principal com opções de navegação e indicadores
 */

import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../../contexts/AuthContext';
import Card from '../../components/Card';
import Avatar from '../../components/Avatar';
import { useTheme } from '../../hooks/useTheme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TabParamList } from '../../navigation/TabNavigator';
import { getDashboardStats } from '../../services/dashboardService';
import { DashboardStats } from '../../types/dashboard';

interface IndicatorCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  color: string;
}

function IndicatorCard({ icon, label, value, color }: IndicatorCardProps) {
  const theme = useTheme();
  return (
    <Card variant="elevated" style={styles.indicatorCard}>
      <View style={[styles.indicatorIconContainer, { backgroundColor: color + '20' }]}>
        <Ionicons name={icon} size={28} color={color} />
      </View>
      <Text style={[styles.indicatorValue, { color: theme.text }]}>{value}</Text>
      <Text style={[styles.indicatorLabel, { color: theme.textMuted }]}>{label}</Text>
    </Card>
  );
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export default function DashboardScreen() {
  const { user } = useAuth();
  const navigation = useNavigation<NativeStackNavigationProp<TabParamList>>();
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      let isMounted = true;

      async function loadStats() {
        try {
          setLoading(true);
          setError(null);
          const data = await getDashboardStats();
          if (isMounted) {
            setStats(data);
          }
        } catch (err: any) {
          if (isMounted) {
            setError(err.message || 'Erro ao carregar dados');
          }
        } finally {
          if (isMounted) {
            setLoading(false);
          }
        }
      }

      loadStats();

      return () => {
        isMounted = false;
      };
    }, [])
  );

  const indicators = [
    { icon: 'car-sport' as const, label: 'Veículos', value: String(stats?.vehicles_count ?? 0), color: theme.primary },
    { icon: 'construct' as const, label: 'Manutenções', value: String(stats?.maintenances_count ?? 0), color: theme.accent },
    { icon: 'map' as const, label: 'Destinos', value: String(stats?.destinations_count ?? 0), color: theme.secondary },
    { icon: 'cash' as const, label: 'Custo Total', value: formatCurrency(stats?.current_month_maintenance_cost ?? 0), color: theme.success },
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

      {/* Indicadores */}
      <View style={styles.indicatorsContainer}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Indicadores</Text>
        {loading && (
          <ActivityIndicator size="large" color={theme.primary} style={styles.loader} />
        )}
        {error && (
          <Text style={[styles.errorText, { color: theme.danger }]}>{error}</Text>
        )}
        {!loading && (
          <View style={styles.indicatorsGrid}>
            {indicators.map((item, index) => (
              <View key={index} style={styles.indicatorWrapper}>
                <IndicatorCard
                  icon={item.icon}
                  label={item.label}
                  value={item.value}
                  color={item.color}
                />
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Ações Rápidas */}
      <View style={styles.actionsContainer}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Ações Rápidas</Text>
        <Card variant="default" onPress={() => navigation.navigate('Vehicles')} style={styles.actionCard}>
          <View style={styles.actionContent}>
            <Ionicons name="car-sport-outline" size={24} color={theme.primary} />
            <Text style={[styles.actionTitle, { color: theme.text }]}>Meus Veículos</Text>
            <Ionicons name="chevron-forward" size={20} color={theme.textMuted} />
          </View>
        </Card>
        <Card variant="default" onPress={() => navigation.navigate('Destinations')} style={styles.actionCard}>
          <View style={styles.actionContent}>
            <Ionicons name="map-outline" size={24} color={theme.secondary} />
            <Text style={[styles.actionTitle, { color: theme.text }]}>RotasGo</Text>
            <Ionicons name="chevron-forward" size={20} color={theme.textMuted} />
          </View>
        </Card>
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
  indicatorsContainer: {
    padding: 24,
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  indicatorsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  indicatorWrapper: {
    width: '48%',
    marginBottom: 16,
  },
  indicatorCard: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 12,
  },
  indicatorIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  indicatorValue: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  indicatorLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  loader: {
    marginVertical: 32,
  },
  errorText: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '500',
    marginVertical: 24,
  },
  actionsContainer: {
    padding: 24,
    paddingTop: 8,
  },
  actionCard: {
    marginBottom: 12,
  },
  actionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  actionTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 12,
  },
});
