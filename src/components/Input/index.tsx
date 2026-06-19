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
import { useTheme } from '../../hooks/useTheme';

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
    const theme = useTheme();

    const getBorderColor = () => {
      if (error) return theme.danger;
      if (isFocused) return theme.primary;
      return theme.inputBorder;
    };

    return (
      <View style={[styles.container, containerStyle]}>
        {label && <Text style={[styles.label, { color: theme.text }]}>{label}</Text>}
        <View style={styles.inputWrapper}>
          {leftIcon && <View style={styles.leftIconContainer}>{leftIcon}</View>}
          <TextInput
            ref={ref}
            style={[
              styles.input,
              leftIcon ? styles.inputWithLeftIcon : undefined,
              rightIcon ? styles.inputWithRightIcon : undefined,
              { borderColor: getBorderColor(), color: theme.text, backgroundColor: theme.inputBg },
              style,
            ]}
            placeholderTextColor={theme.textMuted}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            {...rest}
          />
          {rightIcon && <View style={styles.rightIconContainer}>{rightIcon}</View>}
        </View>
        {error && <Text style={[styles.errorText, { color: theme.danger }]}>{error}</Text>}
        {!error && helperText && <Text style={[styles.helperText, { color: theme.textMuted }]}>{helperText}</Text>}
      </View>
    );
  }
);

Input.displayName = 'Input';

export default Input;

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  inputWrapper: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  inputWithLeftIcon: {
    paddingLeft: 48,
  },
  inputWithRightIcon: {
    paddingRight: 48,
  },
  leftIconContainer: {
    position: 'absolute',
    left: 16,
    zIndex: 1,
  },
  rightIconContainer: {
    position: 'absolute',
    right: 16,
    zIndex: 1,
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
  },
  helperText: {
    fontSize: 12,
    marginTop: 4,
  },
});
