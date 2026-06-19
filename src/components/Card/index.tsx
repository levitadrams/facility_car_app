/**
 * Componente Card reutilizável
 * Container com estilização consistente
 */

import React from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';
import { useTheme } from '../../hooks/useTheme';

interface CardProps extends TouchableOpacityProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: number;
  style?: ViewStyle | ViewStyle[];
  onPress?: () => void;
}

export default function Card({
  children,
  variant = 'default',
  padding,
  style,
  onPress,
  onLongPress,
  ...rest
}: CardProps) {
  const theme = useTheme();

  const getVariantStyle = () => {
    switch (variant) {
      case 'outlined':
        return { background: theme.cardBg, border: theme.border, shadow: styles.shadowNone };
      case 'elevated':
        return { background: theme.cardBg, border: 'transparent', shadow: styles.shadowLg };
      default:
        return { background: theme.cardBg, border: theme.border, shadow: styles.shadowMd };
    }
  };

  const variantStyle = getVariantStyle();

  const cardStyle = [
    styles.card,
    {
      backgroundColor: variantStyle.background,
      borderColor: variantStyle.border,
      borderWidth: variant === 'outlined' ? 1 : 0,
      padding: padding !== undefined ? padding : 16,
    },
    variantStyle.shadow,
    style,
  ];

  if (onPress || onLongPress) {
    return (
      <TouchableOpacity
        style={cardStyle}
        onPress={onPress}
        onLongPress={onLongPress}
        activeOpacity={0.8}
        {...rest}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={cardStyle}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
  },
  shadowNone: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  shadowMd: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  shadowLg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
});
