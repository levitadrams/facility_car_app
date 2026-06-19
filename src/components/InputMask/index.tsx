/**
 * Componente InputMask
 * Input com máscara e controle de cursor para campos formatados
 */

import React, { useState, useRef } from 'react';
import { TextInput, TextInputProps, View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

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
  const theme = useTheme();

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
      {label && <Text style={[styles.label, { color: theme.text }]}>{label}</Text>}
      <View style={styles.inputWrapper}>
        {!hasValue && displayPlaceholder && (
          <Text style={[styles.placeholderText, { color: theme.textMuted }]}>{displayPlaceholder}</Text>
        )}
        <TextInput
          ref={inputRef}
          value={maskedValue}
          onChangeText={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          style={[
            styles.input,
            { borderColor: error ? theme.danger : isFocused ? theme.primary : theme.inputBorder, color: theme.text, backgroundColor: theme.inputBg },
            rest.style,
          ]}
          {...rest}
        />
      </View>
      {error && <Text style={[styles.errorText, { color: theme.danger }]}>{error}</Text>}
    </View>
  );
}

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
  },
  placeholderText: {
    position: 'absolute',
    left: 16,
    top: 0,
    height: 50,
    lineHeight: 50,
    fontSize: 16,
    pointerEvents: 'none',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
  },
});
