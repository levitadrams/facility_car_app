/**
 * Componente PasswordRequirements
 * Exibe requisitos de complexidade de senha com validação em tempo real
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import theme from '../../theme';

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
  const validatedCount = requirements.filter((req) => req.test(password)).length;
  const totalRequirements = requirements.length;
  const progress = validatedCount / totalRequirements;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Requisitos da senha:</Text>

      {requirements.map((requirement) => {
        const isValid = requirement.test(password);

        return (
          <View key={requirement.id} style={styles.requirement}>
            <Ionicons
              name={isValid ? 'checkmark-circle' : 'ellipse-outline'}
              size={20}
              color={isValid ? theme.colors.success[500] : theme.colors.text.tertiary}
            />
            <Text
              style={[
                styles.requirementText,
                isValid ? styles.requirementTextValid : styles.requirementTextInvalid,
              ]}
            >
              {requirement.label}
            </Text>
          </View>
        );
      })}

      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: theme.spacing.sm,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background.tertiary,
    borderRadius: theme.borderRadius.md,
  },
  title: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.sm,
  },
  requirement: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  requirementText: {
    fontSize: theme.typography.fontSize.xs,
    marginLeft: theme.spacing.sm,
    flex: 1,
  },
  requirementTextValid: {
    color: theme.colors.success[500],
  },
  requirementTextInvalid: {
    color: theme.colors.text.tertiary,
  },
  progressBar: {
    height: 4,
    backgroundColor: theme.colors.border.light,
    borderRadius: 2,
    marginTop: theme.spacing.sm,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.success[500],
    borderRadius: 2,
  },
});
