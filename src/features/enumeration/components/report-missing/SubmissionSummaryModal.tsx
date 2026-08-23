import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, TouchableWithoutFeedback } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { MissingHouseholdReport } from '../../types/missingReportTypes';
import { ENUMERATOR_THEME } from '../../theme';

interface SubmissionSummaryModalProps {
  visible: boolean;
  reportData: Partial<MissingHouseholdReport>;
  onClose: () => void;
  onConfirmSubmit: () => void;
}

export const SubmissionSummaryModal: React.FC<SubmissionSummaryModalProps> = ({
  visible,
  reportData,
  onClose,
  onConfirmSubmit,
}) => {
  if (!visible) return null;

  const hasGps = reportData.latitude !== undefined && reportData.longitude !== undefined;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.content}>
              <View style={styles.header}>
                <MaterialCommunityIcons name="clipboard-check-outline" size={24} color={ENUMERATOR_THEME.colors.accent} />
                <Text style={styles.title}>Confirm Report Submission</Text>
                <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                  <Ionicons name="close" size={20} color={ENUMERATOR_THEME.colors.textMuted} />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
                {/* Location Summary */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Location Status</Text>
                  <Text style={styles.sectionValue}>
                    {hasGps
                      ? `GPS: ${reportData.latitude?.toFixed(4)}° N, ${reportData.longitude?.toFixed(4)}° E`
                      : 'Manual Field Locality'}
                  </Text>
                  <Text style={styles.sectionSub}>Locality: {reportData.locality || 'Shiv Nagar East'}</Text>
                </View>

                {/* Reason & Priority */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Reason & Priority</Text>
                  <Text style={styles.sectionValue}>
                    Reason: {reportData.reason === 'Other' ? reportData.otherReason : reportData.reason}
                  </Text>
                  <Text style={styles.sectionSub}>Priority: {reportData.priority || 'Normal'}</Text>
                </View>

                {/* Household Info */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Household Information</Text>
                  <Text style={styles.sectionValue}>
                    Household ID: {reportData.householdId || 'Not registered / Unknown'}
                  </Text>
                  <Text style={styles.sectionSub}>
                    Head: {reportData.headName || 'Not known'} · Mobile: {reportData.mobile || 'N/A'}
                  </Text>
                </View>

                {/* Remarks */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Field Remarks</Text>
                  <Text style={styles.sectionValue}>{reportData.remarks || 'No remarks entered.'}</Text>
                </View>
              </ScrollView>

              <View style={styles.footer}>
                <TouchableOpacity style={styles.cancelBtn} onPress={onClose} activeOpacity={0.8}>
                  <Text style={styles.cancelBtnText}>Edit Details</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.confirmBtn} onPress={onConfirmSubmit} activeOpacity={0.8}>
                  <Text style={styles.confirmBtnText}>Confirm & Submit</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'flex-end',
  },
  content: {
    backgroundColor: ENUMERATOR_THEME.colors.cardBackground,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    padding: 16,
    gap: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: ENUMERATOR_THEME.colors.border,
    paddingBottom: 10,
  },
  title: {
    fontSize: 15,
    fontWeight: '800',
    color: ENUMERATOR_THEME.colors.textPrimary,
    flex: 1,
  },
  closeBtn: {
    padding: 4,
  },
  body: {
    gap: 12,
  },
  section: {
    backgroundColor: ENUMERATOR_THEME.colors.background,
    padding: 10,
    borderRadius: ENUMERATOR_THEME.borderRadius.md,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
    gap: 2,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.textMuted,
    textTransform: 'uppercase',
  },
  sectionValue: {
    fontSize: 12,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  sectionSub: {
    fontSize: 11,
    color: ENUMERATOR_THEME.colors.textSecondary,
  },
  footer: {
    flexDirection: 'row',
    gap: 10,
    paddingTop: 8,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: ENUMERATOR_THEME.borderRadius.md,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
  },
  cancelBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.textSecondary,
  },
  confirmBtn: {
    flex: 1.5,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: ENUMERATOR_THEME.borderRadius.md,
    backgroundColor: ENUMERATOR_THEME.colors.accent,
  },
  confirmBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: ENUMERATOR_THEME.colors.textWhite,
  },
});
