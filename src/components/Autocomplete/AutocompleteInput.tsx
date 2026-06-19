import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';

interface AutocompleteInputProps<T> {
  label: string;
  placeholder: string;
  value: T | null;
  displayValue: string;
  onSelect: (item: T | null) => void;
  onSearch: (query: string) => Promise<T[]>;
  getItemLabel: (item: T) => string;
  disabled?: boolean;
  error?: string;
}

export default function AutocompleteInput<T>({
  label,
  placeholder,
  value,
  displayValue,
  onSelect,
  onSearch,
  getItemLabel,
  disabled,
  error,
}: AutocompleteInputProps<T>) {
  const [query, setQuery] = useState(displayValue);
  const [results, setResults] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const theme = useTheme();

  useEffect(() => {
    setQuery(displayValue);
  }, [displayValue]);

  const handleSearch = useCallback(
    async (text: string) => {
      if (text.length < 1) {
        setResults([]);
        setShowResults(false);
        return;
      }
      setLoading(true);
      try {
        const items = await onSearch(text);
        setResults(items);
        setShowResults(true);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    },
    [onSearch]
  );

  const handleChangeText = (text: string) => {
    setQuery(text);
    if (value) {
      onSelect(null);
    }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      handleSearch(text);
    }, 500);
  };

  const handleSelect = (item: T) => {
    onSelect(item);
    setQuery(getItemLabel(item));
    setShowResults(false);
    setResults([]);
    Keyboard.dismiss();
  };

  const handleClear = () => {
    setQuery('');
    onSelect(null);
    setShowResults(false);
    setResults([]);
  };

  return (
    <View style={styles.container}>
      {label && <Text style={[styles.label, { color: theme.text }]}>{label}</Text>}
      <View style={[
        styles.inputContainer,
        { borderColor: error ? theme.danger : theme.inputBorder, backgroundColor: disabled ? theme.background : theme.inputBg },
        disabled ? styles.inputDisabled : null,
      ]}>
        <TextInput
          style={[styles.input, { color: theme.text }]}
          placeholder={placeholder}
          placeholderTextColor={theme.textMuted}
          value={query}
          onChangeText={handleChangeText}
          editable={!disabled}
          autoCapitalize="words"
        />
        {loading && <ActivityIndicator size="small" color={theme.primary} style={styles.icon} />}
        {!loading && query.length > 0 && (
          <TouchableOpacity onPress={handleClear} style={styles.icon}>
            <Ionicons name="close-circle" size={20} color={theme.textMuted} />
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={[styles.errorText, { color: theme.danger }]}>{error}</Text>}

      {showResults && !disabled && (
        <View style={[styles.resultsContainer, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          {results.length === 0 ? (
            <Text style={[styles.emptyText, { color: theme.textMuted }]}>Nenhum resultado encontrado</Text>
          ) : (
            <ScrollView keyboardShouldPersistTaps="handled">
              {results.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.resultItem, { borderBottomColor: theme.border }]}
                  onPress={() => handleSelect(item)}
                >
                  <Text style={[styles.resultText, { color: theme.text }]}>{getItemLabel(item)}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    position: 'relative',
    zIndex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    minHeight: 50,
  },
  inputDisabled: {
    opacity: 0.6,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 8,
  },
  icon: {
    marginLeft: 8,
  },
  errorText: {
    fontSize: 14,
    marginTop: 4,
  },
  resultsContainer: {
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 4,
    maxHeight: 200,
    overflow: 'hidden',
  },
  emptyText: {
    padding: 16,
    textAlign: 'center',
    fontSize: 16,
  },
  resultItem: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  resultText: {
    fontSize: 16,
  },
});
