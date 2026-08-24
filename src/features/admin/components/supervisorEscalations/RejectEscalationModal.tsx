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
  Alert,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '@/constants/adminTheme';

interface RejectEscalationModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (reason: string, notes: string) => Promise<void>;
}

const REJECT_REASONS = [
  'Insufficient field evidence provided',
  'Issue can be resolved directly by field enumerator',
  'Duplicate escalation request',
  'Boundary data verified as correct',
  'Incorrect escalation classification',
];

export const RejectEscalationModal: React.FC<RejectEscalationModalProps> = ({
  visible,
  onClose,
  onConfirm,
}) => {
  const [selectedReason, setSelectedReason] = useState<string>(REJECT_REASONS[0]);
  const [notes, setNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async () => {
    if (!notes.trim()) {
      Alert.alert('Explanation Required', 'Please enter supervisor notes explaining why the request was rejected.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onConfirm(selectedReason, notes);
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
          <View style={styles.header}>
            <MaterialCommunityIcons name="close-circle-outline" size={22} color={COLORS.danger} />
            <Text style={styles.title}>Reject Supervisor Request</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color={COLORS.textMuted} />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.body}>
            <Text style={styles.label}>Rejection Reason *</Text>
            <View style={styles.reasonList}>
              {REJECT_REASONS.map((r) => {
                const isSelected = selectedReason === r;
                return (
                  <TouchableOpacity
                    key={r}
                    style={[styles.reasonChip, isSelected && styles.reasonChipSelected]}
                    onPress={() => setSelectedReason(r)}
                    activeOpacity={0.8}
                  >
                    <Ionicons
                      name={isSelected ? 'radio-button-on' : 'radio-button-off'}
                      size={16}
                      color={isSelected ? COLORS.danger : COLORS.textMuted}
                    />
                    <Text style={[styles.reasonText, isSelected && styles.reasonTextSelected]}>
                      {r}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text style={styles.label}>Supervisor Rejection Notes *</Text>
            <TextInput
              style={styles.multilineInput}
              placeholder="Provide feedback and instructions for the field enumerator..."
              placeholderTextColor={COLORS.textMuted}
              multiline
              numberOfLines={3}
              value={notes}
              onChangeText={setNotes}
            />
          </ScrollView>

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
                <Text style={styles.confirmText}>Reject Request</Text>
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
  reasonList: {
    gap: 6,
  },
  reasonChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.background,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  reasonChipSelected: {
    backgroundColor: COLORS.dangerSoft,
    borderColor: COLORS.danger,
  },
  reasonText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '500',
    flex: 1,
  },
  reasonTextSelected: {
    color: COLORS.textPrimary,
    fontWeight: '700',
  },
  multilineInput: {
    backgroundColor: COLORS.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    color: COLORS.textPrimary,
    paddingHorizontal: 12,
    paddingVertical: 10,
    height: 76,
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
    backgroundColor: COLORS.danger,
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
