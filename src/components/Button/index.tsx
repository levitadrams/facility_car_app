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
import { useTheme } from '../../hooks/useTheme';

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
  const theme = useTheme();

  const getVariantColors = () => {
    switch (variant) {
      case 'primary':
        return { background: theme.primary, text: theme.textInverse, border: theme.primary };
      case 'secondary':
        return { background: theme.secondary, text: theme.textInverse, border: theme.secondary };
      case 'outline':
        return { background: 'transparent', text: theme.primary, border: theme.primary };
      case 'ghost':
        return { background: 'transparent', text: theme.primary, border: 'transparent' };
      case 'danger':
        return { background: theme.danger, text: theme.textInverse, border: theme.danger };
      default:
        return { background: theme.primary, text: theme.textInverse, border: theme.primary };
    }
  };

  const variantStyle = getVariantColors();
  
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
      activeOpacity={0.8}
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
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  buttonSm: {
    height: 40,
    paddingHorizontal: 16,
  },
  buttonMd: {
    height: 50,
  },
  buttonLg: {
    height: 56,
    paddingHorizontal: 32,
  },
  buttonDisabled: {
    opacity: 0.4,
  },
  text: {
    fontWeight: '600',
  },
  textSm: {
    fontSize: 14,
  },
  textMd: {
    fontSize: 16,
  },
  textLg: {
    fontSize: 18,
  },
});
