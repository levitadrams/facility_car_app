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
import { useTheme } from '../../hooks/useTheme';

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
  const theme = useTheme();

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
      {label && <Text style={[styles.label, { color: theme.text }]}>{label}</Text>}
      <TouchableOpacity
        style={[
          styles.inputContainer,
          { borderColor: error ? theme.danger : theme.inputBorder, backgroundColor: disabled ? theme.background : theme.inputBg },
          disabled ? styles.inputDisabled : null,
        ]}
        onPress={() => !disabled && setModalVisible(true)}
        activeOpacity={disabled ? 1 : 0.7}
      >
        <Text
          style={[
            styles.inputText,
            { color: displayValue ? theme.text : theme.textMuted },
          ]}
          numberOfLines={1}
        >
          {displayValue || placeholder}
        </Text>
        {displayValue && !disabled ? (
          <TouchableOpacity onPress={handleClear} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Ionicons name="close-circle" size={20} color={theme.textMuted} />
          </TouchableOpacity>
        ) : (
          <Ionicons name="chevron-down" size={20} color={theme.textMuted} />
        )}
      </TouchableOpacity>
      {error && <Text style={[styles.errorText, { color: theme.danger }]}>{error}</Text>}

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable style={styles.overlay} onPress={() => setModalVisible(false)}>
          <View style={[styles.modalContent, { backgroundColor: theme.surface }]}>
            <View style={[styles.modalHeader, { borderBottomColor: theme.border }]}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>{label}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color={theme.text} />
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
                  <Text style={[styles.optionText, { color: theme.text }]}>{getOptionLabel(item)}</Text>
                </TouchableOpacity>
              )}
              ItemSeparatorComponent={() => <View style={[styles.separator, { backgroundColor: theme.border }]} />}
              ListEmptyComponent={
                <Text style={[styles.emptyText, { color: theme.textMuted }]}>Nenhuma opção disponível</Text>
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
    marginBottom: 16,
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
  inputText: {
    flex: 1,
    fontSize: 16,
  },
  errorText: {
    fontSize: 14,
    marginTop: 4,
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalContent: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '70%',
    paddingBottom: 32,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 24,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  optionItem: {
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  optionText: {
    fontSize: 16,
  },
  separator: {
    height: 1,
    marginHorizontal: 24,
  },
  emptyText: {
    padding: 32,
    textAlign: 'center',
    fontSize: 16,
  },
});
