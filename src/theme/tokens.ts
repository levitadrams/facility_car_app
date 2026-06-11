/**
 * Design Tokens
 * Tokens semânticos para facilitar o uso do tema
 */

import theme from './index';

export const buttonVariants = {
  primary: {
    background: theme.colors.primary[600],
    backgroundPressed: theme.colors.primary[700],
    text: theme.colors.white,
    border: theme.colors.primary[600],
  },
  secondary: {
    background: theme.colors.secondary[600],
    backgroundPressed: theme.colors.secondary[700],
    text: theme.colors.white,
    border: theme.colors.secondary[600],
  },
  outline: {
    background: theme.colors.transparent,
    backgroundPressed: theme.colors.primary[50],
    text: theme.colors.primary[600],
    border: theme.colors.primary[600],
  },
  ghost: {
    background: theme.colors.transparent,
    backgroundPressed: theme.colors.gray[100],
    text: theme.colors.primary[600],
    border: theme.colors.transparent,
  },
  danger: {
    background: theme.colors.danger[600],
    backgroundPressed: theme.colors.danger[700],
    text: theme.colors.white,
    border: theme.colors.danger[600],
  },
};

export const inputStates = {
  default: {
    border: theme.colors.border.light,
    background: theme.colors.white,
    text: theme.colors.text.primary,
  },
  focused: {
    border: theme.colors.primary[600],
    background: theme.colors.white,
    text: theme.colors.text.primary,
  },
  error: {
    border: theme.colors.danger[500],
    background: theme.colors.white,
    text: theme.colors.text.primary,
  },
  disabled: {
    border: theme.colors.border.light,
    background: theme.colors.gray[100],
    text: theme.colors.text.disabled,
  },
};

export const cardStyles = {
  default: {
    background: theme.colors.white,
    border: theme.colors.border.light,
    shadow: theme.shadows.md,
  },
  elevated: {
    background: theme.colors.white,
    border: theme.colors.transparent,
    shadow: theme.shadows.lg,
  },
  outlined: {
    background: theme.colors.white,
    border: theme.colors.border.light,
    shadow: theme.shadows.none,
  },
};

export const statusColors = {
  success: theme.colors.success[600],
  warning: theme.colors.warning[600],
  error: theme.colors.danger[600],
  info: theme.colors.info[600],
};

export const iconSizes = {
  xs: 16,
  sm: 20,
  md: 24,
  lg: 32,
  xl: 40,
};
