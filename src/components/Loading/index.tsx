/**
 * Componente Loading reutilizável
 * Indicador de carregamento em tela cheia com tema
 */

import React from 'react';
import {
  View,
  ActivityIndicator,
  StyleSheet,
  Text,
} from 'react-native';
import theme from '../../theme';

interface LoadingProps {
  message?: string;
  color?: string;
}

export default function Loading({ message, color }: LoadingProps) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={color || theme.colors.primary[600]} />
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background.primary,
  },
  message: {
    marginTop: theme.spacing.md,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.secondary,
    fontWeight: theme.typography.fontWeight.medium,
  },
});
