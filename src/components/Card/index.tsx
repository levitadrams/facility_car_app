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
import theme from '../../theme';
import { cardStyles } from '../../theme/tokens';

interface CardProps extends TouchableOpacityProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: number;
  style?: ViewStyle;
  onPress?: () => void;
}

export default function Card({
  children,
  variant = 'default',
  padding,
  style,
  onPress,
  ...rest
}: CardProps) {
  const variantStyle = cardStyles[variant];
  
  const cardStyle = [
    styles.card,
    {
      backgroundColor: variantStyle.background,
      borderColor: variantStyle.border,
      borderWidth: variant === 'outlined' ? 1 : 0,
      padding: padding !== undefined ? padding : theme.layout.cardPadding,
    },
    variantStyle.shadow,
    style,
  ];

  if (onPress) {
    return (
      <TouchableOpacity
        style={cardStyle}
        onPress={onPress}
        activeOpacity={theme.opacity.hover}
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
    borderRadius: theme.borderRadius.lg,
  },
});
