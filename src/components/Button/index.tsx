/**
 * Componente Button reutilizável
 * Botão customizado com suporte a loading e tema
 */

import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacityProps,
} from 'react-native';
import theme from '../../theme';
import { buttonVariants } from '../../theme/tokens';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export default function Button({
  title,
  loading = false,
  variant = 'primary',
  size = 'md',
  disabled,
  style,
  ...rest
}: ButtonProps) {
  const variantStyle = buttonVariants[variant];
  
  const getSizeStyle = () => {
    switch (size) {
      case 'sm':
        return styles.buttonSm;
      case 'lg':
        return styles.buttonLg;
      default:
        return styles.buttonMd;
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

  return (
    <TouchableOpacity
      style={[
        styles.button,
        getSizeStyle(),
        {
          backgroundColor: variantStyle.background,
          borderColor: variantStyle.border,
          borderWidth: variant === 'outline' ? 1 : 0,
        },
        (disabled || loading) && styles.buttonDisabled,
        style,
      ]}
      disabled={disabled || loading}
      activeOpacity={theme.opacity.hover}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={variantStyle.text} />
      ) : (
        <Text style={[styles.text, getTextSizeStyle(), { color: variantStyle.text }]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: theme.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
  },
  buttonSm: {
    height: 40,
    paddingHorizontal: theme.spacing.md,
  },
  buttonMd: {
    height: theme.layout.buttonHeight,
  },
  buttonLg: {
    height: 56,
    paddingHorizontal: theme.spacing.xl,
  },
  buttonDisabled: {
    opacity: theme.opacity.disabled,
  },
  text: {
    fontWeight: theme.typography.fontWeight.semibold,
  },
  textSm: {
    fontSize: theme.typography.fontSize.sm,
  },
  textMd: {
    fontSize: theme.typography.fontSize.md,
  },
  textLg: {
    fontSize: theme.typography.fontSize.lg,
  },
});
