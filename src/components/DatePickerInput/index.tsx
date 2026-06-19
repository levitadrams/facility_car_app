import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';

function formatDateToISO(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function parseISODate(value: string): Date {
  const [y, m, d] = value.split('-').map(Number);
  return new Date(y, m - 1, d);
}

interface DatePickerInputProps {
  label: string;
  value?: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
}

export default function DatePickerInput({
  label,
  value,
  onChange,
  error,
  disabled = false,
}: DatePickerInputProps) {
  const theme = useTheme();
  const [show, setShow] = useState(false);

  const date = value ? parseISODate(value) : new Date();
  const displayValue = value
    ? new Date(value + 'T00:00:00').toLocaleDateString('pt-BR')
    : '';

  const handleChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShow(false);
    if (selectedDate) {
      onChange(formatDateToISO(selectedDate));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: theme.text }]}>{label}</Text>
      <TouchableOpacity
        style={[
          styles.input,
          { backgroundColor: theme.surface, borderColor: error ? theme.danger : theme.border },
          disabled && { opacity: 0.5 },
        ]}
        onPress={() => {
          if (!disabled) setShow(true);
        }}
        activeOpacity={0.7}
        disabled={disabled}
      >
        <Text style={[styles.text, { color: value ? theme.text : theme.textMuted }]}>
          {displayValue || 'Selecionar data'}
        </Text>
        <Ionicons name="calendar-outline" size={20} color={theme.textMuted} />
      </TouchableOpacity>
      {error ? <Text style={[styles.error, { color: theme.danger }]}>{error}</Text> : null}

      {show && Platform.OS === 'ios' && (
        <DateTimePicker
          value={date}
          mode="date"
          display="spinner"
          onChange={handleChange}
          locale="pt-BR"
        />
      )}

      {show && Platform.OS === 'android' && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={handleChange}
          locale="pt-BR"
        />
      )}
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
  input: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    minHeight: 48,
  },
  text: {
    fontSize: 15,
  },
  error: {
    fontSize: 12,
    marginTop: 4,
  },
});
