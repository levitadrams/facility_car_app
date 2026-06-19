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
import { useTheme } from '../../hooks/useTheme';

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
  const theme = useTheme();

  const getVariantStyle = () => {
    switch (variant) {
      case 'success':
        return {
          backgroundColor: theme.badgeSuccessBg,
          color: theme.badgeSuccess,
        };
      case 'warning':
        return {
          backgroundColor: theme.badgeWarningBg,
          color: theme.badgeWarning,
        };
      case 'error':
        return {
          backgroundColor: theme.badgeDangerBg,
          color: theme.badgeDanger,
        };
      case 'info':
        return {
          backgroundColor: theme.primaryLight,
          color: theme.primary,
        };
      default:
        return {
          backgroundColor: theme.badgeNeutralBg,
          color: theme.badgeNeutral,
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
    borderRadius: 9999,
    alignSelf: 'flex-start',
  },
  badgeSm: {
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  badgeMd: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  badgeLg: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  text: {
    fontWeight: '600',
  },
  textSm: {
    fontSize: 12,
  },
  textMd: {
    fontSize: 14,
  },
  textLg: {
    fontSize: 16,
  },
});
