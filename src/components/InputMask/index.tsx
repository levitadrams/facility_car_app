/**
 * Componente InputMask
 * Input com máscara e controle de cursor para campos formatados
 */

import React, { useState, useRef } from 'react';
import { TextInput, TextInputProps, View, Text, StyleSheet } from 'react-native';
import theme from '../../theme';

interface InputMaskProps extends Omit<TextInputProps, 'value' | 'onChangeText'> {
  mask: (value: string) => string;
  unmask: (value: string) => string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  error?: string;
  label?: string;
  maskPlaceholder?: string;
}

export default function InputMask({
  mask,
  unmask,
  value,
  onChangeText,
  placeholder,
  error,
  label,
  maskPlaceholder,
  ...rest
}: InputMaskProps) {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);

  // Posição do cursor após o primeiro dígito numérico da máscara
  const getCursorPosition = (maskedValue: string): number => {
    // Encontra o primeiro dígito numérico na máscara
    for (let i = 0; i < maskedValue.length; i++) {
      if (/\d/.test(maskedValue[i])) {
        return i;
      }
    }
    return 0;
  };

  const handleChange = (text: string) => {
    const unmasked = unmask(text);
    onChangeText(unmasked);
  };

  const handleFocus = () => {
    setIsFocused(true);
    // Move o cursor para o primeiro dígito numérico
    const maskedValue = mask(value);
    const cursorPosition = getCursorPosition(maskedValue);
    setTimeout(() => {
      inputRef.current?.setNativeProps({
        selection: { start: cursorPosition, end: cursorPosition },
      });
    }, 0);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const maskedValue = mask(value);
  const hasValue = value && value.length > 0;
  const displayPlaceholder = maskPlaceholder || placeholder || '';

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.inputWrapper}>
        {!hasValue && displayPlaceholder && (
          <Text style={styles.placeholderText}>{displayPlaceholder}</Text>
        )}
        <TextInput
          ref={inputRef}
          value={maskedValue}
          onChangeText={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          style={[
            styles.input,
            error && styles.inputError,
            isFocused && styles.inputFocused,
            rest.style,
          ]}
          {...rest}
        />
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

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
  },
  placeholderText: {
    position: 'absolute',
    left: theme.spacing.md,
    top: 0,
    height: theme.layout.inputHeight,
    lineHeight: theme.layout.inputHeight,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.tertiary,
    pointerEvents: 'none',
  },
  input: {
    height: theme.layout.inputHeight,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.primary,
    backgroundColor: theme.colors.white,
  },
  inputFocused: {
    borderColor: theme.colors.primary[500],
  },
  inputError: {
    borderColor: theme.colors.danger[600],
  },
  errorText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.danger[600],
    marginTop: theme.spacing.xs,
  },
});
