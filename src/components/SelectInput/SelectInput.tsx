import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import theme from '../../theme';

interface SelectInputProps<T> {
  label: string;
  placeholder: string;
  value: T | null;
  options: T[];
  getOptionLabel: (item: T) => string;
  onSelect: (item: T | null) => void;
  disabled?: boolean;
  error?: string;
}

export default function SelectInput<T>({
  label,
  placeholder,
  value,
  options,
  getOptionLabel,
  onSelect,
  disabled,
  error,
}: SelectInputProps<T>) {
  const [modalVisible, setModalVisible] = useState(false);

  const handleSelect = (item: T) => {
    onSelect(item);
    setModalVisible(false);
  };

  const handleClear = () => {
    onSelect(null);
  };

  const displayValue = value ? getOptionLabel(value) : '';

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TouchableOpacity
        style={[
          styles.inputContainer,
          error ? styles.inputError : null,
          disabled ? styles.inputDisabled : null,
        ]}
        onPress={() => !disabled && setModalVisible(true)}
        activeOpacity={disabled ? 1 : 0.7}
      >
        <Text
          style={[
            styles.inputText,
            !displayValue && styles.placeholder,
          ]}
          numberOfLines={1}
        >
          {displayValue || placeholder}
        </Text>
        {displayValue && !disabled ? (
          <TouchableOpacity onPress={handleClear} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Ionicons name="close-circle" size={20} color={theme.colors.text.tertiary} />
          </TouchableOpacity>
        ) : (
          <Ionicons name="chevron-down" size={20} color={theme.colors.text.tertiary} />
        )}
      </TouchableOpacity>
      {error && <Text style={styles.errorText}>{error}</Text>}

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable style={styles.overlay} onPress={() => setModalVisible(false)}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{label}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color={theme.colors.text.primary} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={options}
              keyExtractor={(_, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.optionItem}
                  onPress={() => handleSelect(item)}
                >
                  <Text style={styles.optionText}>{getOptionLabel(item)}</Text>
                </TouchableOpacity>
              )}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
              ListEmptyComponent={
                <Text style={styles.emptyText}>Nenhuma opção disponível</Text>
              }
            />
          </View>
        </Pressable>
      </Modal>
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
  inputText: {
    flex: 1,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.primary,
  },
  placeholder: {
    color: theme.colors.text.tertiary,
  },
  errorText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.danger[600],
    marginTop: theme.spacing.xs,
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalContent: {
    backgroundColor: theme.colors.white,
    borderTopLeftRadius: theme.borderRadius.xl,
    borderTopRightRadius: theme.borderRadius.xl,
    maxHeight: '70%',
    paddingBottom: theme.spacing.xl,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  modalTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
  },
  optionItem: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
  },
  optionText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.primary,
  },
  separator: {
    height: 1,
    backgroundColor: theme.colors.border.light,
    marginHorizontal: theme.spacing.lg,
  },
  emptyText: {
    padding: theme.spacing.xl,
    textAlign: 'center',
    color: theme.colors.text.secondary,
    fontSize: theme.typography.fontSize.md,
  },
});
