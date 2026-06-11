/**
 * Componente Badge reutilizável
 * Etiquetas de status e categorias
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import theme from '../../theme';

interface BadgeProps {
  label: string;
  variant?: 'success' | 'warning' | 'error' | 'info' | 'neutral';
  size?: 'sm' | 'md' | 'lg';
  style?: ViewStyle;
}

export default function Badge({
  label,
  variant = 'neutral',
  size = 'md',
  style,
}: BadgeProps) {
  const getVariantStyle = () => {
    switch (variant) {
      case 'success':
        return {
          backgroundColor: theme.colors.success[100],
          color: theme.colors.success[800],
        };
      case 'warning':
        return {
          backgroundColor: theme.colors.warning[100],
          color: theme.colors.warning[800],
        };
      case 'error':
        return {
          backgroundColor: theme.colors.danger[100],
          color: theme.colors.danger[800],
        };
      case 'info':
        return {
          backgroundColor: theme.colors.info[100],
          color: theme.colors.info[800],
        };
      default:
        return {
          backgroundColor: theme.colors.gray[200],
          color: theme.colors.gray[800],
        };
    }
  };

  const getSizeStyle = () => {
    switch (size) {
      case 'sm':
        return styles.badgeSm;
      case 'lg':
        return styles.badgeLg;
      default:
        return styles.badgeMd;
    }
  };

  const getTextSizeStyle = () => {
    switch (size) {
      case 'sm':
        return styles.textSm;
      case 'lg':
        return styles.textLg;
      default:
        return styles.textMd;
    }
  };

  const variantStyle = getVariantStyle();

  return (
    <View
      style={[
        styles.badge,
        getSizeStyle(),
        { backgroundColor: variantStyle.backgroundColor },
        style,
      ]}
    >
      <Text
        style={[
          styles.text,
          getTextSizeStyle(),
          { color: variantStyle.color },
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: theme.borderRadius.full,
    alignSelf: 'flex-start',
  },
  badgeSm: {
    paddingHorizontal: theme.spacing.xs,
    paddingVertical: 2,
  },
  badgeMd: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
  },
  badgeLg: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  text: {
    fontWeight: theme.typography.fontWeight.semibold,
  },
  textSm: {
    fontSize: theme.typography.fontSize.xs,
  },
  textMd: {
    fontSize: theme.typography.fontSize.sm,
  },
  textLg: {
    fontSize: theme.typography.fontSize.md,
  },
});
