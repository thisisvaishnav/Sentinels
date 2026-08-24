import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  TouchableWithoutFeedback,
  Alert,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { ZoneHouseholdItem } from '../../types';
import { ENUMERATOR_THEME } from '../../theme';
import { VerificationOutcome } from '../../types/verificationTypes';

interface VerificationOutcomeModalProps {
  visible: boolean;
  household: ZoneHouseholdItem | null;
  onClose: () => void;
  onSubmitOutcome: (
    householdId: string,
    outcome: VerificationOutcome,
    notes: string
  ) => Promise<void>;
}

export const VerificationOutcomeModal: React.FC<VerificationOutcomeModalProps> = ({
  visible,
  household,
  onClose,
  onSubmitOutcome,
}) => {
  const [selectedOutcome, setSelectedOutcome] = useState<VerificationOutcome>('Verified');
  const [notes, setNotes] = useState<string>('');
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!household) return null;

  const handleInitialSubmit = () => {
    setShowConfirmation(true);
  };

  const handleConfirmSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onSubmitOutcome(household.householdId, selectedOutcome, notes);

      Alert.alert(
        'Outcome Saved',
        `Household ${household.householdId} marked as ${selectedOutcome}. Changes saved locally (Pending Sync).`
      );
      setShowConfirmation(false);
      setNotes('');
      onClose();
    } catch {
      Alert.alert('Error', 'Failed to save verification outcome.');
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
          <View style={styles.modalHeader}>
            <View style={styles.titleWrap}>
              <MaterialCommunityIcons name="clipboard-check" size={20} color={ENUMERATOR_THEME.colors.accent} />
              <Text style={styles.modalTitle}>Record Verification Outcome</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
              <Ionicons name="close" size={22} color={ENUMERATOR_THEME.colors.textMuted} />
            </TouchableOpacity>
          </View>

          {/* Household Context Banner */}
          <View style={styles.contextBanner}>
            <Text style={styles.contextId}>{household.householdId}</Text>
            <Text style={styles.contextName}>
              {household.headName} · {household.locality}
            </Text>
          </View>

          {!showConfirmation ? (
            <View style={styles.body}>
              <Text style={styles.label}>Select Verification Outcome</Text>

              {/* Outcome Selection Pills */}
              <TouchableOpacity
                style={[
                  styles.optionCard,
                  selectedOutcome === 'Verified' && styles.optionCardVerified,
                ]}
                onPress={() => setSelectedOutcome('Verified')}
                activeOpacity={0.8}
              >
                <Ionicons
                  name={selectedOutcome === 'Verified' ? 'checkmark-circle' : 'ellipse-outline'}
                  size={18}
                  color={ENUMERATOR_THEME.colors.success}
                />
                <View style={styles.optionTextWrap}>
                  <Text style={styles.optionTitle}>Verified</Text>
                  <Text style={styles.optionSub}>Identity & location details confirmed in field.</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.optionCard,
                  selectedOutcome === 'Needs Recheck' && styles.optionCardRecheck,
                ]}
                onPress={() => setSelectedOutcome('Needs Recheck')}
                activeOpacity={0.8}
              >
                <Ionicons
                  name={selectedOutcome === 'Needs Recheck' ? 'checkmark-circle' : 'ellipse-outline'}
                  size={18}
                  color={ENUMERATOR_THEME.colors.dangerText}
                />
                <View style={styles.optionTextWrap}>
                  <Text style={styles.optionTitle}>Needs Recheck</Text>
                  <Text style={styles.optionSub}>Flag for supervisor audit or second visit.</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.optionCard,
                  selectedOutcome === 'Unable to Verify' && styles.optionCardUnable,
                ]}
                onPress={() => setSelectedOutcome('Unable to Verify')}
                activeOpacity={0.8}
              >
                <Ionicons
                  name={selectedOutcome === 'Unable to Verify' ? 'checkmark-circle' : 'ellipse-outline'}
                  size={18}
                  color={ENUMERATOR_THEME.colors.warningText}
                />
                <View style={styles.optionTextWrap}>
                  <Text style={styles.optionTitle}>Unable to Verify</Text>
                  <Text style={styles.optionSub}>Occupant unavailable or refused check.</Text>
                </View>
              </TouchableOpacity>

              {/* Notes Input */}
              <Text style={styles.label}>Field Remarks / Notes (Optional)</Text>
              <TextInput
                style={styles.notesInput}
                value={notes}
                onChangeText={setNotes}
                placeholder="Enter field observations, verification notes..."
                placeholderTextColor={ENUMERATOR_THEME.colors.textMuted}
                multiline
                numberOfLines={3}
              />

              <TouchableOpacity
                style={styles.proceedBtn}
                onPress={handleInitialSubmit}
                activeOpacity={0.8}
              >
                <Text style={styles.proceedBtnText}>Continue to Confirmation</Text>
                <Ionicons name="arrow-forward" size={16} color={ENUMERATOR_THEME.colors.textWhite} />
              </TouchableOpacity>
            </View>
          ) : (
            /* Confirmation Step */
            <View style={styles.body}>
              <View style={styles.confirmBox}>
                <Ionicons name="help-circle-outline" size={36} color={ENUMERATOR_THEME.colors.accent} />
                <Text style={styles.confirmTitle}>Confirm Verification Outcome</Text>
                <Text style={styles.confirmText}>
                  You are marking <Text style={{ fontWeight: '800' }}>{household.householdId}</Text> as{' '}
                  <Text style={{ fontWeight: '800', color: ENUMERATOR_THEME.colors.accent }}>
                    {selectedOutcome}
                  </Text>
                  . Only continue if the available household information has been checked.
                </Text>
                <View style={styles.syncTag}>
                  <MaterialCommunityIcons name="cellphone-link-off" size={14} color={ENUMERATOR_THEME.colors.textMuted} />
                  <Text style={styles.syncTagText}>Saved locally · Pending batch sync</Text>
                </View>
              </View>

              <View style={styles.confirmActions}>
                <TouchableOpacity
                  style={styles.cancelBtn}
                  onPress={() => setShowConfirmation(false)}
                  disabled={isSubmitting}
                  activeOpacity={0.8}
                >
                  <Text style={styles.cancelBtnText}>Back</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.confirmSubmitBtn}
                  onPress={handleConfirmSubmit}
                  disabled={isSubmitting}
                  activeOpacity={0.8}
                >
                  <Ionicons name="checkmark-done" size={16} color={ENUMERATOR_THEME.colors.textWhite} />
                  <Text style={styles.confirmSubmitText}>
                    {isSubmitting ? 'Saving...' : 'Confirm Outcome'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(23, 42, 58, 0.5)',
    justifyContent: 'center',
    padding: 16,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  modalContent: {
    backgroundColor: ENUMERATOR_THEME.colors.cardBackground,
    borderRadius: ENUMERATOR_THEME.borderRadius.xl,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: ENUMERATOR_THEME.colors.border,
  },
  titleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  closeBtn: {
    padding: 2,
  },
  contextBanner: {
    backgroundColor: ENUMERATOR_THEME.colors.background,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: ENUMERATOR_THEME.colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  contextId: {
    fontSize: 14,
    fontWeight: '800',
    color: ENUMERATOR_THEME.colors.accent,
  },
  contextName: {
    fontSize: 12,
    fontWeight: '600',
    color: ENUMERATOR_THEME.colors.textSecondary,
  },
  body: {
    padding: 16,
    gap: 10,
  },
  label: {
    fontSize: 12,
    fontWeight: '800',
    color: ENUMERATOR_THEME.colors.textPrimary,
    marginTop: 4,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: ENUMERATOR_THEME.colors.cardBackground,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
    borderRadius: ENUMERATOR_THEME.borderRadius.lg,
    padding: 12,
  },
  optionCardVerified: {
    backgroundColor: ENUMERATOR_THEME.colors.successBg,
    borderColor: ENUMERATOR_THEME.colors.successBorder,
  },
  optionCardRecheck: {
    backgroundColor: ENUMERATOR_THEME.colors.dangerBg,
    borderColor: ENUMERATOR_THEME.colors.dangerBorder,
  },
  optionCardUnable: {
    backgroundColor: ENUMERATOR_THEME.colors.warningBg,
    borderColor: ENUMERATOR_THEME.colors.warningBorder,
  },
  optionTextWrap: {
    flex: 1,
    gap: 2,
  },
  optionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  optionSub: {
    fontSize: 11,
    color: ENUMERATOR_THEME.colors.textMuted,
  },
  notesInput: {
    backgroundColor: ENUMERATOR_THEME.colors.inputBackground,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.borderSubtle,
    borderRadius: ENUMERATOR_THEME.borderRadius.md,
    padding: 10,
    fontSize: 12,
    color: ENUMERATOR_THEME.colors.textPrimary,
    textAlignVertical: 'top',
    height: 70,
  },
  proceedBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: ENUMERATOR_THEME.colors.accent,
    paddingVertical: 12,
    borderRadius: ENUMERATOR_THEME.borderRadius.md,
    marginTop: 6,
  },
  proceedBtnText: {
    color: ENUMERATOR_THEME.colors.textWhite,
    fontSize: 14,
    fontWeight: '700',
  },
  confirmBox: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
  },
  confirmTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  confirmText: {
    fontSize: 13,
    color: ENUMERATOR_THEME.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
  syncTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: ENUMERATOR_THEME.colors.subtleBackground,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: ENUMERATOR_THEME.borderRadius.full,
    marginTop: 4,
  },
  syncTagText: {
    fontSize: 11,
    color: ENUMERATOR_THEME.colors.textMuted,
    fontWeight: '600',
  },
  confirmActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 8,
  },
  cancelBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: ENUMERATOR_THEME.colors.subtleBackground,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
    paddingVertical: 12,
    borderRadius: ENUMERATOR_THEME.borderRadius.md,
  },
  cancelBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  confirmSubmitBtn: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: ENUMERATOR_THEME.colors.accent,
    paddingVertical: 12,
    borderRadius: ENUMERATOR_THEME.borderRadius.md,
  },
  confirmSubmitText: {
    fontSize: 14,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.textWhite,
  },
});
