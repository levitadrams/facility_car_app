import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

function formatCurrency(value: string): string {
  const digits = value.replace(/\D/g, '');
  const numeric = parseInt(digits || '0', 10);
  const amount = numeric / 100;

  return amount.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function parseCurrency(value: string): number {
  const clean = value.replace(/\./g, '').replace(',', '.');
  const num = parseFloat(clean || '0');
  return isNaN(num) ? 0 : num;
}

interface CurrencyInputProps {
  label: string;
  value?: string;
  onChangeText: (text: string) => void;
  error?: string;
  editable?: boolean;
  placeholder?: string;
}

export default function CurrencyInput({
  label,
  value,
  onChangeText,
  error,
  editable = true,
  placeholder = '0,00',
}: CurrencyInputProps) {
  const theme = useTheme();

  const handleChange = (text: string) => {
    const digits = text.replace(/\D/g, '');
    onChangeText(digits);
  };

  const displayValue = value ? formatCurrency(value) : '';

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: theme.text }]}>{label}</Text>
      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: theme.surface,
            borderColor: error ? theme.danger : theme.border,
          },
          !editable && { opacity: 0.5 },
        ]}
      >
        <Text style={[styles.prefix, { color: theme.textMuted }]}>R$</Text>
        <TextInput
          style={[styles.input, { color: theme.text }]}
          keyboardType="number-pad"
          value={displayValue}
          onChangeText={handleChange}
          placeholder={placeholder}
          placeholderTextColor={theme.textMuted}
          editable={editable}
          selectTextOnFocus={false}
        />
      </View>
      {error ? <Text style={[styles.error, { color: theme.danger }]}>{error}</Text> : null}
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
    marginBottom: 6,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    minHeight: 48,
  },
  prefix: {
    fontSize: 15,
    fontWeight: '600',
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 15,
    padding: 0,
  },
  error: {
    fontSize: 12,
    marginTop: 4,
  },
});
