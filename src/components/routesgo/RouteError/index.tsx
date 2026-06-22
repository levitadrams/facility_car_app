import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../hooks/useTheme';

interface RouteErrorProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export default function RouteError({
  title = 'Não foi possível calcular a rota',
  message = 'Verifique sua conexão com a internet e tente novamente.',
  onRetry,
}: RouteErrorProps) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <View style={[styles.card, { backgroundColor: theme.surface }]}>
        <Ionicons name="warning-outline" size={48} color={theme.danger} />
        <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
        <Text style={[styles.message, { color: theme.textMuted }]}>{message}</Text>
        {onRetry && (
          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.primary }]}
            onPress={onRetry}
            activeOpacity={0.8}
          >
            <Text style={[styles.buttonText, { color: theme.textInverse }]}>Tentar Novamente</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    padding: 32,
    borderRadius: 16,
    alignItems: 'center',
    gap: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  button: {
    marginTop: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
