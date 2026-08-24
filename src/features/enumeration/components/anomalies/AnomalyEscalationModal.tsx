import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  TouchableWithoutFeedback,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { ENUMERATOR_THEME } from '../../theme';
import {
  AnomalyEscalationPriority,
  AnomalyEscalationReason,
  AnomalyRequestedAction,
  HouseholdAnomaly,
} from '../../types/anomalyTypes';
import {
  createAnomalyEscalation,
  getEscalationReasonLabel,
  getRequestedActionLabel,
} from '../../data/anomalyEscalations';

interface AnomalyEscalationModalProps {
  visible: boolean;
  anomaly: HouseholdAnomaly | null;
  onClose: () => void;
  onSubmitted?: () => void;
}

const REASON_OPTIONS: AnomalyEscalationReason[] = [
  'unable_to_verify',
  'duplicate_unresolved',
  'gps_conflict',
  'info_incorrect',
  'resident_refused',
  'senior_inspection_needed',
  'supervisor_decision_needed',
  'other',
];

const ACTION_OPTIONS: { id: AnomalyRequestedAction; title: string; subtitle: string; icon: string }[] = [
  {
    id: 'supervisor-review',
    title: 'Supervisor Review',
    subtitle: 'Escalate to zone supervisor for administrative guidance or approval',
    icon: 'account-supervisor-outline',
  },
  {
    id: 'senior-reassignment',
    title: 'Reassign to Senior Inspector',
    subtitle: 'Request a senior field officer to re-survey this complex record',
    icon: 'account-arrow-right-outline',
  },
  {
    id: 'field-revisit',
    title: 'Request Field Revisit',
    subtitle: 'Schedule a joint field revisit team to inspect physical structure',
    icon: 'map-marker-path',
  },
  {
    id: 'record-correction',
    title: 'Request Record Correction',
    subtitle: 'Request backend database administrator to correct duplicate or corrupted fields',
    icon: 'file-document-edit-outline',
  },
];

export const AnomalyEscalationModal: React.FC<AnomalyEscalationModalProps> = ({
  visible,
  anomaly,
  onClose,
  onSubmitted,
}) => {
  const [selectedReason, setSelectedReason] = useState<AnomalyEscalationReason>('unable_to_verify');
  const [customReasonText, setCustomReasonText] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [requestedAction, setRequestedAction] = useState<AnomalyRequestedAction>('supervisor-review');
  const [priority, setPriority] = useState<AnomalyEscalationPriority>('normal');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (anomaly) {
      // Auto default priority based on severity
      if (anomaly.severity === 'critical') {
        setPriority('urgent');
      } else if (anomaly.severity === 'high') {
        setPriority('high');
      } else {
        setPriority('normal');
      }

      // Auto default requested action based on type
      if (anomaly.type === 'duplicate') {
        setRequestedAction('senior-reassignment');
        setSelectedReason('duplicate_unresolved');
      } else if (anomaly.type === 'gps-mismatch') {
        setRequestedAction('field-revisit');
        setSelectedReason('gps_conflict');
      } else {
        setRequestedAction('supervisor-review');
        setSelectedReason('unable_to_verify');
      }

      setCustomReasonText('');
      setNotes('');
      setErrors({});
    }
  }, [anomaly]);

  if (!anomaly) return null;

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (selectedReason === 'other' && (!customReasonText || customReasonText.trim().length < 5)) {
      newErrors.customReasonText = 'Please describe the custom escalation reason (min 5 chars).';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const result = await createAnomalyEscalation({
        anomaly,
        reason: selectedReason,
        customReasonText,
        notes,
        requestedAction,
        priority,
      });

      if (!result.success && result.isDuplicate) {
        Alert.alert(
          'Escalation Already Active',
          result.message || 'An active escalation is already pending for this record.'
        );
        onClose();
        return;
      }

      Alert.alert(
        'Escalation Submitted',
        `Escalation ${result.escalation?.id} created successfully.\n\nChanges saved locally and enqueued for sync.`
      );
      onClose();
      if (onSubmitted) onSubmitted();
    } catch (err) {
      console.error('Failed to submit escalation:', err);
      Alert.alert('Error', 'Failed to submit escalation request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.overlay}
      >
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.backdrop} />
        </TouchableWithoutFeedback>

        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <View style={styles.headerTitleWrap}>
              <MaterialCommunityIcons name="shield-alert-outline" size={22} color={ENUMERATOR_THEME.colors.warningText} />
              <View>
                <Text style={styles.modalTitle}>Escalate Anomaly</Text>
                <Text style={styles.modalSubTitle}>Supervisor & Senior Inspector Request</Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
              <Ionicons name="close" size={22} color={ENUMERATOR_THEME.colors.textMuted} />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.scrollBody} showsVerticalScrollIndicator={false}>
            {/* Read-Only Anomaly Banner */}
            <View style={styles.readOnlyBanner}>
              <View style={styles.bannerRow}>
                <Text style={styles.bannerId}>{anomaly.householdId}</Text>
                <View style={styles.sevBadge}>
                  <Text style={styles.sevBadgeText}>{anomaly.severity.toUpperCase()}</Text>
                </View>
              </View>
              <Text style={styles.bannerTitle}>{anomaly.title}</Text>
              <Text style={styles.bannerReason} numberOfLines={2}>
                Flagged: {anomaly.reason}
              </Text>
            </View>

            {/* 1. Escalation Reason */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Escalation Reason *</Text>
              <View style={styles.reasonList}>
                {REASON_OPTIONS.map((rKey) => {
                  const isSelected = selectedReason === rKey;
                  return (
                    <TouchableOpacity
                      key={rKey}
                      style={[styles.reasonChip, isSelected && styles.reasonChipSelected]}
                      onPress={() => setSelectedReason(rKey)}
                      activeOpacity={0.8}
                    >
                      <Ionicons
                        name={isSelected ? 'checkmark-circle' : 'ellipse-outline'}
                        size={16}
                        color={isSelected ? ENUMERATOR_THEME.colors.accent : ENUMERATOR_THEME.colors.textMuted}
                      />
                      <Text style={[styles.reasonText, isSelected && styles.reasonTextSelected]}>
                        {getEscalationReasonLabel(rKey)}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Custom reason input if "other" */}
              {selectedReason === 'other' && (
                <View style={styles.otherWrap}>
                  <TextInput
                    style={[styles.input, errors.customReasonText && styles.inputError]}
                    placeholder="Describe custom escalation reason..."
                    placeholderTextColor={ENUMERATOR_THEME.colors.textMuted}
                    value={customReasonText}
                    onChangeText={setCustomReasonText}
                  />
                  {errors.customReasonText && (
                    <Text style={styles.errorText}>{errors.customReasonText}</Text>
                  )}
                </View>
              )}
            </View>

            {/* 2. Requested Action */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Requested Action *</Text>
              <View style={styles.actionGrid}>
                {ACTION_OPTIONS.map((act) => {
                  const isSelected = requestedAction === act.id;
                  return (
                    <TouchableOpacity
                      key={act.id}
                      style={[styles.actionCard, isSelected && styles.actionCardSelected]}
                      onPress={() => setRequestedAction(act.id)}
                      activeOpacity={0.8}
                    >
                      <MaterialCommunityIcons
                        name={act.icon as any}
                        size={20}
                        color={isSelected ? ENUMERATOR_THEME.colors.accent : ENUMERATOR_THEME.colors.textMuted}
                      />
                      <View style={styles.actionTextWrap}>
                        <Text style={[styles.actionTitle, isSelected && styles.actionTitleSelected]}>
                          {act.title}
                        </Text>
                        <Text style={styles.actionSub}>{act.subtitle}</Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* 3. Priority Level */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Priority Level *</Text>
              <View style={styles.priorityRow}>
                {(['normal', 'high', 'urgent'] as AnomalyEscalationPriority[]).map((pLevel) => {
                  const isSelected = priority === pLevel;
                  return (
                    <TouchableOpacity
                      key={pLevel}
                      style={[
                        styles.priorityChip,
                        isSelected &&
                          (pLevel === 'urgent'
                            ? styles.priorityUrgent
                            : pLevel === 'high'
                            ? styles.priorityHigh
                            : styles.priorityNormal),
                      ]}
                      onPress={() => setPriority(pLevel)}
                      activeOpacity={0.8}
                    >
                      <Text
                        style={[
                          styles.priorityText,
                          isSelected && styles.priorityTextActive,
                        ]}
                      >
                        {pLevel.toUpperCase()}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* 4. Enumerator Notes */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Field Observation Notes (Optional)</Text>
              <TextInput
                style={styles.multilineInput}
                placeholder="Provide additional field context or observations for the supervisor..."
                placeholderTextColor={ENUMERATOR_THEME.colors.textMuted}
                multiline
                numberOfLines={3}
                value={notes}
                onChangeText={setNotes}
              />
            </View>
          </ScrollView>

          {/* Modal Footer */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={onClose}
              disabled={isSubmitting}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.submitBtn, isSubmitting && styles.submitBtnDisabled]}
              onPress={handleSubmit}
              disabled={isSubmitting}
              activeOpacity={0.8}
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color={ENUMERATOR_THEME.colors.textWhite} />
              ) : (
                <MaterialCommunityIcons name="send-outline" size={16} color={ENUMERATOR_THEME.colors.textWhite} />
              )}
              <Text style={styles.submitBtnText}>
                {isSubmitting ? 'Submitting...' : 'Submit Escalation'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  modalContent: {
    backgroundColor: ENUMERATOR_THEME.colors.cardBackground,
    borderRadius: ENUMERATOR_THEME.borderRadius.xl,
    maxHeight: '88%',
    overflow: 'hidden',
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: ENUMERATOR_THEME.colors.border,
  },
  headerTitleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  modalSubTitle: {
    fontSize: 11,
    color: ENUMERATOR_THEME.colors.textMuted,
  },
  closeBtn: {
    padding: 4,
  },
  scrollBody: {
    padding: 16,
    gap: 16,
  },
  readOnlyBanner: {
    backgroundColor: ENUMERATOR_THEME.colors.accentSubtle,
    borderRadius: ENUMERATOR_THEME.borderRadius.lg,
    padding: 12,
    gap: 4,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
  },
  bannerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bannerId: {
    fontSize: 13,
    fontWeight: '800',
    color: ENUMERATOR_THEME.colors.accent,
  },
  sevBadge: {
    backgroundColor: ENUMERATOR_THEME.colors.dangerBg,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: ENUMERATOR_THEME.borderRadius.full,
  },
  sevBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: ENUMERATOR_THEME.colors.dangerText,
  },
  bannerTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  bannerReason: {
    fontSize: 11,
    color: ENUMERATOR_THEME.colors.textSecondary,
  },
  fieldGroup: {
    gap: 8,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.textSecondary,
  },
  reasonList: {
    gap: 6,
  },
  reasonChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: ENUMERATOR_THEME.colors.subtleBackground,
    borderRadius: ENUMERATOR_THEME.borderRadius.md,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
  },
  reasonChipSelected: {
    backgroundColor: ENUMERATOR_THEME.colors.accentSubtle,
    borderColor: ENUMERATOR_THEME.colors.accent,
  },
  reasonText: {
    fontSize: 12,
    color: ENUMERATOR_THEME.colors.textSecondary,
    fontWeight: '500',
    flex: 1,
  },
  reasonTextSelected: {
    color: ENUMERATOR_THEME.colors.textPrimary,
    fontWeight: '700',
  },
  otherWrap: {
    marginTop: 4,
  },
  input: {
    backgroundColor: ENUMERATOR_THEME.colors.inputBackground,
    borderRadius: ENUMERATOR_THEME.borderRadius.md,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.borderSubtle,
    color: ENUMERATOR_THEME.colors.textPrimary,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
  },
  inputError: {
    borderColor: ENUMERATOR_THEME.colors.dangerText,
  },
  errorText: {
    fontSize: 11,
    color: ENUMERATOR_THEME.colors.dangerText,
    marginTop: 4,
  },
  actionGrid: {
    gap: 8,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: ENUMERATOR_THEME.colors.subtleBackground,
    borderRadius: ENUMERATOR_THEME.borderRadius.lg,
    padding: 12,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
  },
  actionCardSelected: {
    backgroundColor: ENUMERATOR_THEME.colors.accentSubtle,
    borderColor: ENUMERATOR_THEME.colors.accent,
  },
  actionTextWrap: {
    flex: 1,
    gap: 2,
  },
  actionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  actionTitleSelected: {
    color: ENUMERATOR_THEME.colors.accent,
  },
  actionSub: {
    fontSize: 11,
    color: ENUMERATOR_THEME.colors.textMuted,
  },
  priorityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  priorityChip: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: ENUMERATOR_THEME.borderRadius.md,
    backgroundColor: ENUMERATOR_THEME.colors.subtleBackground,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
  },
  priorityNormal: {
    backgroundColor: ENUMERATOR_THEME.colors.accentSubtle,
    borderColor: ENUMERATOR_THEME.colors.accent,
  },
  priorityHigh: {
    backgroundColor: ENUMERATOR_THEME.colors.warningBg,
    borderColor: ENUMERATOR_THEME.colors.warning,
  },
  priorityUrgent: {
    backgroundColor: ENUMERATOR_THEME.colors.dangerBg,
    borderColor: ENUMERATOR_THEME.colors.dangerText,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.textMuted,
  },
  priorityTextActive: {
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  multilineInput: {
    backgroundColor: ENUMERATOR_THEME.colors.inputBackground,
    borderRadius: ENUMERATOR_THEME.borderRadius.md,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.borderSubtle,
    color: ENUMERATOR_THEME.colors.textPrimary,
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
    borderTopColor: ENUMERATOR_THEME.colors.border,
    backgroundColor: ENUMERATOR_THEME.colors.cardBackground,
  },
  cancelBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: ENUMERATOR_THEME.borderRadius.md,
    backgroundColor: ENUMERATOR_THEME.colors.subtleBackground,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
  },
  cancelBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: ENUMERATOR_THEME.colors.textSecondary,
  },
  submitBtn: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: ENUMERATOR_THEME.borderRadius.md,
    backgroundColor: ENUMERATOR_THEME.colors.accent,
    gap: 8,
  },
  submitBtnDisabled: {
    opacity: 0.6,
  },
  submitBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.textWhite,
  },
});
