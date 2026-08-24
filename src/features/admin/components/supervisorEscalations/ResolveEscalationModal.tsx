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
import { ResolutionOutcomeType } from '../../types/supervisorEscalationTypes';

interface ResolveEscalationModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (outcome: ResolutionOutcomeType, outcomeText: string, notes: string) => Promise<void>;
}

const OUTCOME_OPTIONS: { id: ResolutionOutcomeType; label: string }[] = [
  { id: 'verified_correct', label: 'Verified as Correct & Valid' },
  { id: 'duplicate_confirmed', label: 'Duplicate Household Confirmed & Merged' },
  { id: 'gps_resolved', label: 'GPS Coordinates / Boundary Conflict Resolved' },
  { id: 'record_corrected', label: 'Household Profile Record Corrected' },
  { id: 'revisit_completed', label: 'Field Revisit Inspection Completed' },
  { id: 'no_action_required', label: 'No Further Supervisory Action Required' },
];

export const ResolveEscalationModal: React.FC<ResolveEscalationModalProps> = ({
  visible,
  onClose,
  onConfirm,
}) => {
  const [selectedOutcome, setSelectedOutcome] = useState<ResolutionOutcomeType>('verified_correct');
  const [notes, setNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async () => {
    if (!notes.trim()) {
      Alert.alert('Notes Required', 'Please enter supervisor resolution notes explaining the decision.');
      return;
    }

    setIsSubmitting(true);
    try {
      const match = OUTCOME_OPTIONS.find((o) => o.id === selectedOutcome);
      await onConfirm(selectedOutcome, match?.label || selectedOutcome, notes);
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
            <MaterialCommunityIcons name="check-decagram" size={22} color={COLORS.success} />
            <Text style={styles.title}>Resolve Supervisor Escalation</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color={COLORS.textMuted} />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.body}>
            <Text style={styles.label}>Resolution Outcome *</Text>
            <View style={styles.outcomeList}>
              {OUTCOME_OPTIONS.map((opt) => {
                const isSelected = selectedOutcome === opt.id;
                return (
                  <TouchableOpacity
                    key={opt.id}
                    style={[styles.outcomeChip, isSelected && styles.outcomeChipSelected]}
                    onPress={() => setSelectedOutcome(opt.id)}
                    activeOpacity={0.8}
                  >
                    <Ionicons
                      name={isSelected ? 'checkmark-circle' : 'ellipse-outline'}
                      size={16}
                      color={isSelected ? COLORS.success : COLORS.textMuted}
                    />
                    <Text style={[styles.outcomeText, isSelected && styles.outcomeTextSelected]}>
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text style={styles.label}>Supervisor Resolution Notes *</Text>
            <TextInput
              style={styles.multilineInput}
              placeholder="Explain the resolution reasoning and action taken..."
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
                <Text style={styles.confirmText}>Resolve Request</Text>
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
  outcomeList: {
    gap: 6,
  },
  outcomeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.background,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  outcomeChipSelected: {
    backgroundColor: COLORS.successSoft,
    borderColor: COLORS.success,
  },
  outcomeText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '500',
    flex: 1,
  },
  outcomeTextSelected: {
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
    backgroundColor: COLORS.success,
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
