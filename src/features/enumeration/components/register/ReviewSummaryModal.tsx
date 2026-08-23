import React from 'react';
import { View, Text, StyleSheet, Modal, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { ENUMERATOR_THEME } from '../../theme';
import { HouseholdFormData } from '../../types';

interface Props {
  visible: boolean;
  data: HouseholdFormData;
  onClose: () => void;
  onConfirmSubmit: () => void;
}

export function ReviewSummaryModal({ visible, data, onClose, onConfirmSubmit }: Props) {
  const isLocationCaptured = !!data.location;
  const receivingSchemesCount = data.schemeStatus.filter((s) => s.choice === 'Receiving').length;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <View style={styles.headerTitleWrap}>
              <MaterialCommunityIcons name="file-check-outline" size={22} color={ENUMERATOR_THEME.colors.accent} />
              <Text style={styles.modalTitle}>Review Household Summary</Text>
            </View>
            <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
              <Ionicons name="close" size={22} color={ENUMERATOR_THEME.colors.textMuted} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollBody} showsVerticalScrollIndicator={false}>
            {/* Key Metric Grid */}
            <View style={styles.summaryGrid}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Household ID</Text>
                <Text style={styles.summaryValueHighlight}>{data.householdId}</Text>
              </View>

              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Head of Household</Text>
                <Text style={styles.summaryValue}>{data.headOfHousehold.name || 'Not specified'}</Text>
              </View>

              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Total Members</Text>
                <Text style={styles.summaryValue}>{data.householdProfile.familyMemberCount}</Text>
              </View>

              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Location</Text>
                <Text style={[styles.summaryValue, isLocationCaptured ? styles.textSuccess : styles.textDanger]}>
                  {isLocationCaptured ? 'Captured' : 'Not Captured'}
                </Text>
              </View>

              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Identity Verification</Text>
                <Text style={styles.summaryValue}>
                  {data.identityVerification.idType !== 'Not Available'
                    ? `${data.identityVerification.idType} (${data.identityVerification.status})`
                    : 'Not Provided'}
                </Text>
              </View>

              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Scheme Benefits</Text>
                <Text style={styles.summaryValue}>
                  {receivingSchemesCount > 0 ? `${receivingSchemesCount} categories receiving` : 'None reported'}
                </Text>
              </View>
            </View>

            {/* Household Needs */}
            <View style={styles.sectionWrap}>
              <Text style={styles.sectionTitle}>Recorded Household Needs:</Text>
              <Text style={styles.sectionText}>
                {data.needs.length > 0 ? data.needs.join(', ') : 'No requirements selected'}
              </Text>
            </View>

            {/* Address */}
            <View style={styles.sectionWrap}>
              <Text style={styles.sectionTitle}>Address:</Text>
              <Text style={styles.sectionText}>
                {data.householdProfile.fullAddress
                  ? `${data.householdProfile.fullAddress}, ${data.householdProfile.ward}, ${data.householdProfile.district}, ${data.householdProfile.state} ${data.householdProfile.pinCode}`
                  : 'Address not recorded'}
              </Text>
            </View>
          </ScrollView>

          {/* Action Buttons */}
          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.editBtn} onPress={onClose} activeOpacity={0.8}>
              <Ionicons name="create-outline" size={18} color={ENUMERATOR_THEME.colors.textPrimary} />
              <Text style={styles.editBtnText}>Edit Details</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.confirmBtn} onPress={onConfirmSubmit} activeOpacity={0.8}>
              <MaterialCommunityIcons name="check-circle" size={18} color={ENUMERATOR_THEME.colors.textWhite} />
              <Text style={styles.confirmBtnText}>Submit Household</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(23, 42, 58, 0.4)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: ENUMERATOR_THEME.colors.cardBackground,
    borderTopLeftRadius: ENUMERATOR_THEME.borderRadius.xl,
    borderTopRightRadius: ENUMERATOR_THEME.borderRadius.xl,
    padding: 20,
    maxHeight: '80%',
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
    gap: 14,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 4,
  },
  headerTitleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  scrollBody: {
    maxHeight: 380,
  },
  summaryGrid: {
    backgroundColor: ENUMERATOR_THEME.colors.subtleBackground,
    borderRadius: ENUMERATOR_THEME.borderRadius.md,
    padding: 12,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
    gap: 10,
    marginBottom: 12,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 12,
    color: ENUMERATOR_THEME.colors.textSecondary,
    fontWeight: '600',
  },
  summaryValue: {
    fontSize: 13,
    color: ENUMERATOR_THEME.colors.textPrimary,
    fontWeight: '700',
  },
  summaryValueHighlight: {
    fontSize: 13,
    color: ENUMERATOR_THEME.colors.accent,
    fontWeight: '800',
  },
  textSuccess: {
    color: ENUMERATOR_THEME.colors.success,
  },
  textDanger: {
    color: ENUMERATOR_THEME.colors.danger,
  },
  sectionWrap: {
    gap: 4,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  sectionText: {
    fontSize: 12,
    color: ENUMERATOR_THEME.colors.textSecondary,
    lineHeight: 16,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  editBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: ENUMERATOR_THEME.colors.subtleBackground,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
    height: 48,
    borderRadius: ENUMERATOR_THEME.borderRadius.lg,
    gap: 8,
  },
  editBtnText: {
    color: ENUMERATOR_THEME.colors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
  },
  confirmBtn: {
    flex: 1.2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: ENUMERATOR_THEME.colors.accent,
    height: 48,
    borderRadius: ENUMERATOR_THEME.borderRadius.lg,
    gap: 8,
  },
  confirmBtnText: {
    color: ENUMERATOR_THEME.colors.textWhite,
    fontSize: 14,
    fontWeight: '700',
  },
});
