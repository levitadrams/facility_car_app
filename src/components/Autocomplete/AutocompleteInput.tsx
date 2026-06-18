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
import theme from '../../theme';

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
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[styles.inputContainer, error ? styles.inputError : null, disabled ? styles.inputDisabled : null]}>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          value={query}
          onChangeText={handleChangeText}
          editable={!disabled}
          autoCapitalize="words"
        />
        {loading && <ActivityIndicator size="small" color={theme.colors.primary[600]} style={styles.icon} />}
        {!loading && query.length > 0 && (
          <TouchableOpacity onPress={handleClear} style={styles.icon}>
            <Ionicons name="close-circle" size={20} color={theme.colors.text.tertiary} />
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}

      {showResults && !disabled && (
        <View style={styles.resultsContainer}>
          {results.length === 0 ? (
            <Text style={styles.emptyText}>Nenhum resultado encontrado</Text>
          ) : (
            <ScrollView keyboardShouldPersistTaps="handled">
              {results.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.resultItem}
                  onPress={() => handleSelect(item)}
                >
                  <Text style={styles.resultText}>{getItemLabel(item)}</Text>
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
    marginBottom: theme.spacing.md,
    position: 'relative',
    zIndex: 1,
  },
  label: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border.light,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.white,
    paddingHorizontal: theme.spacing.md,
    minHeight: theme.layout.inputHeight,
  },
  inputError: {
    borderColor: theme.colors.danger[500],
  },
  inputDisabled: {
    backgroundColor: theme.colors.background.tertiary,
    borderColor: theme.colors.border.light,
  },
  input: {
    flex: 1,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.primary,
    paddingVertical: theme.spacing.sm,
  },
  icon: {
    marginLeft: theme.spacing.sm,
  },
  errorText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.danger[600],
    marginTop: theme.spacing.xs,
  },
  resultsContainer: {
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
    borderRadius: theme.borderRadius.md,
    marginTop: theme.spacing.xs,
    maxHeight: 200,
    overflow: 'hidden',
  },
  emptyText: {
    padding: theme.spacing.md,
    textAlign: 'center',
    color: theme.colors.text.secondary,
    fontSize: theme.typography.fontSize.md,
  },
  resultItem: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  resultText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.primary,
  },
});
