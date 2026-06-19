/**
 * Componente PasswordRequirements
 * Exibe requisitos de complexidade de senha com validação em tempo real
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';

interface PasswordRequirementsProps {
  password: string;
}

interface Requirement {
  id: string;
  label: string;
  test: (password: string) => boolean;
}

const requirements: Requirement[] = [
  {
    id: 'minLength',
    label: 'Mínimo de 8 caracteres',
    test: (password) => password.length >= 8,
  },
  {
    id: 'uppercase',
    label: 'Pelo menos uma letra maiúscula',
    test: (password) => /[A-Z]/.test(password),
  },
  {
    id: 'lowercase',
    label: 'Pelo menos uma letra minúscula',
    test: (password) => /[a-z]/.test(password),
  },
  {
    id: 'number',
    label: 'Pelo menos um número',
    test: (password) => /[0-9]/.test(password),
  },
  {
    id: 'special',
    label: 'Pelo menos um caractere especial (!@#$%^&*)',
    test: (password) => /[!@#$%^&*]/.test(password),
  },
];

export default function PasswordRequirements({ password }: PasswordRequirementsProps) {
  const theme = useTheme();
  const validatedCount = requirements.filter((req) => req.test(password)).length;
  const totalRequirements = requirements.length;
  const progress = validatedCount / totalRequirements;

  return (
    <View style={[styles.container, { backgroundColor: theme.surfaceHighlight, borderColor: theme.border }]}>
      <Text style={[styles.title, { color: theme.textMuted }]}>Requisitos da senha:</Text>

      {requirements.map((requirement) => {
        const isValid = requirement.test(password);

        return (
          <View key={requirement.id} style={styles.requirement}>
            <Ionicons
              name={isValid ? 'checkmark-circle' : 'ellipse-outline'}
              size={20}
              color={isValid ? theme.success : theme.textMuted}
            />
            <Text
              style={[
                styles.requirementText,
                { color: isValid ? theme.success : theme.textMuted },
              ]}
            >
              {requirement.label}
            </Text>
          </View>
        );
      })}

      <View style={[styles.progressBar, { backgroundColor: theme.border }]}>
        <View style={[styles.progressFill, { width: `${progress * 100}%`, backgroundColor: theme.success }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  requirement: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  requirementText: {
    fontSize: 12,
    marginLeft: 8,
    flex: 1,
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
    marginTop: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
});
