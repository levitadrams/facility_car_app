/**
 * Componente ConfirmDeleteModal
 * Modal de confirmação para exclusão de veículo
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';

interface ConfirmDeleteModalProps {
  visible: boolean;
  vehicleName: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function ConfirmDeleteModal({
  visible,
  vehicleName,
  onCancel,
  onConfirm,
}: ConfirmDeleteModalProps) {
  const theme = useTheme();
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <TouchableWithoutFeedback onPress={onCancel}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={[styles.container, { backgroundColor: theme.surface }]}>
              <View style={[styles.iconContainer, { backgroundColor: theme.dangerLight }]}>
                <Ionicons name="warning" size={32} color={theme.danger} />
              </View>
              <Text style={[styles.title, { color: theme.text }]}>Excluir veículo?</Text>
              <Text style={[styles.message, { color: theme.textMuted }]}>
                Deseja realmente excluir o veículo{' '}
                <Text style={[styles.vehicleName, { color: theme.text }]}>{vehicleName}</Text>?
                Esta ação não pode ser desfeita.
              </Text>
              <View style={styles.actions}>
                <TouchableOpacity style={[styles.cancelButton, { borderColor: theme.border }]} onPress={onCancel}>
                  <Text style={[styles.cancelText, { color: theme.text }]}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.confirmButton, { backgroundColor: theme.danger }]} onPress={onConfirm}>
                  <Text style={styles.confirmText}>Excluir</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  container: {
    borderRadius: 16,
    padding: 32,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  vehicleName: {
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    width: '100%',
    gap: 16,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '600',
  },
  confirmButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  confirmText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
