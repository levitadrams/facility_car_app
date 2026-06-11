/**
 * Componente Input reutilizável
 * Campo de entrada customizado com suporte a erros e tema
 */

import React, { forwardRef, useState } from 'react';
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  TextInputProps,
} from 'react-native';
import theme from '../../theme';
import { inputStates } from '../../theme/tokens';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  containerStyle?: any;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = forwardRef<TextInput, InputProps>(
  ({ label, error, helperText, containerStyle, leftIcon, rightIcon, style, ...rest }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    
    const getBorderColor = () => {
      if (error) return inputStates.error.border;
      if (isFocused) return inputStates.focused.border;
      return inputStates.default.border;
    };

    return (
      <View style={[styles.container, containerStyle]}>
        {label && <Text style={styles.label}>{label}</Text>}
        <View style={styles.inputWrapper}>
          {leftIcon && <View style={styles.leftIconContainer}>{leftIcon}</View>}
          <TextInput
            ref={ref}
            style={[
              styles.input,
              leftIcon && styles.inputWithLeftIcon,
              rightIcon && styles.inputWithRightIcon,
              { borderColor: getBorderColor() },
              style,
            ]}
            placeholderTextColor={theme.colors.text.tertiary}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            {...rest}
          />
          {rightIcon && <View style={styles.rightIconContainer}>{rightIcon}</View>}
        </View>
        {error && <Text style={styles.errorText}>{error}</Text>}
        {!error && helperText && <Text style={styles.helperText}>{helperText}</Text>}
      </View>
    );
  }
);

Input.displayName = 'Input';

export default Input;

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.md,
  },
  label: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  inputWrapper: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: theme.layout.inputHeight,
    borderWidth: 1,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.primary,
    backgroundColor: theme.colors.white,
  },
  inputWithLeftIcon: {
    paddingLeft: 48,
  },
  inputWithRightIcon: {
    paddingRight: 48,
  },
  leftIconContainer: {
    position: 'absolute',
    left: theme.spacing.md,
    zIndex: 1,
  },
  rightIconContainer: {
    position: 'absolute',
    right: theme.spacing.md,
    zIndex: 1,
  },
  errorText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.danger[600],
    marginTop: theme.spacing.xs,
  },
  helperText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.tertiary,
    marginTop: theme.spacing.xs,
  },
});
