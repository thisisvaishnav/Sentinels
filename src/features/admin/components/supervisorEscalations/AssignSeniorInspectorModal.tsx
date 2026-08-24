import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '@/constants/adminTheme';
import { AVAILABLE_SENIOR_INSPECTORS } from '../../data/supervisorEscalations';
import { SeniorInspector } from '../../types/supervisorEscalationTypes';

interface AssignSeniorInspectorModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (inspectorId: string, inspectorName: string, notes?: string) => Promise<void>;
}

export const AssignSeniorInspectorModal: React.FC<AssignSeniorInspectorModalProps> = ({
  visible,
  onClose,
  onConfirm,
}) => {
  const [selectedInspector, setSelectedInspector] = useState<SeniorInspector>(AVAILABLE_SENIOR_INSPECTORS[0]);
  const [notes, setNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onConfirm(selectedInspector.id, selectedInspector.name, notes);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.backdrop} />
        </TouchableWithoutFeedback>

        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <MaterialCommunityIcons name="account-arrow-right" size={22} color={COLORS.primary} />
            <Text style={styles.title}>Assign Senior Inspector</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color={COLORS.textMuted} />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.body}>
            <Text style={styles.label}>Select Available Inspector *</Text>

            <View style={styles.inspectorList}>
              {AVAILABLE_SENIOR_INSPECTORS.map((insp) => {
                const isSelected = selectedInspector.id === insp.id;
                return (
                  <TouchableOpacity
                    key={insp.id}
                    style={[styles.inspectorCard, isSelected && styles.inspectorCardSelected]}
                    onPress={() => setSelectedInspector(insp)}
                    activeOpacity={0.8}
                  >
                    <Ionicons
                      name={isSelected ? 'radio-button-on' : 'radio-button-off'}
                      size={18}
                      color={isSelected ? COLORS.accent : COLORS.textMuted}
                    />
                    <View style={styles.inspectorInfo}>
                      <Text style={[styles.inspectorName, isSelected && styles.inspectorNameSelected]}>
                        {insp.name}
                      </Text>
                      <Text style={styles.inspectorSub}>
                        {insp.employeeId} · {insp.zone} · ({insp.activeCasesCount} active cases)
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text style={styles.label}>Assignment Instructions / Notes</Text>
            <TextInput
              style={styles.multilineInput}
              placeholder="Provide context or guidelines for the senior inspector..."
              placeholderTextColor={COLORS.textMuted}
              multiline
              numberOfLines={3}
              value={notes}
              onChangeText={setNotes}
            />
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose} disabled={isSubmitting}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.confirmBtn, isSubmitting && styles.btnDisabled]}
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.confirmText}>Assign Inspector</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'center',
    padding: 16,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  modalContent: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    maxHeight: '85%',
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textPrimary,
    flex: 1,
  },
  closeBtn: {
    padding: 4,
  },
  body: {
    padding: 16,
    gap: 12,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  inspectorList: {
    gap: 8,
  },
  inspectorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: COLORS.background,
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  inspectorCardSelected: {
    backgroundColor: COLORS.accentSoft,
    borderColor: COLORS.accent,
  },
  inspectorInfo: {
    flex: 1,
    gap: 2,
  },
  inspectorName: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  inspectorNameSelected: {
    color: COLORS.accent,
  },
  inspectorSub: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
  multilineInput: {
    backgroundColor: COLORS.background,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    color: COLORS.textPrimary,
    paddingHorizontal: 12,
    paddingVertical: 10,
    height: 72,
    fontSize: 13,
    textAlignVertical: 'top',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  confirmBtn: {
    flex: 1.5,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
  },
  btnDisabled: {
    opacity: 0.6,
  },
  confirmText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textOnPrimary,
  },
});
