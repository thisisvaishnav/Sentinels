import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ZoneHouseholdItem } from '../../types';
import { ENUMERATOR_THEME } from '../../theme';
import { formatMaskedIdentity, getVerificationReason } from '../../data/verificationAdapter';

interface VerificationHouseholdCardProps {
  household: ZoneHouseholdItem;
  onOpenOutcomeModal: (household: ZoneHouseholdItem) => void;
}

export const VerificationHouseholdCard: React.FC<VerificationHouseholdCardProps> = ({
  household,
  onOpenOutcomeModal,
}) => {
  const router = useRouter();

  const isVerified = household.verificationStatus === 'Verified';
  const isNeedsCheck =
    household.verificationStatus === 'Needs Verification' ||
    household.status === 'Needs Verification';
  const isHighPriority = household.priority === 'High';

  const reason = getVerificationReason(household);
  const maskedId = formatMaskedIdentity(household);
  const hasCoords = typeof household.latitude === 'number' && typeof household.longitude === 'number';

  const handleReviewHousehold = () => {
    router.push({
      pathname: '/(enumerator)/register-household',
      params: { householdId: household.householdId },
    });
  };

  const handleViewMap = () => {
    router.push('/(enumerator)/gis-map');
  };

  return (
    <View style={[styles.card, isVerified && styles.cardVerified]}>
      {/* Top Badge Row */}
      <View style={styles.headerRow}>
        <View style={styles.badgeGroup}>
          <View
            style={[
              styles.statusBadge,
              isVerified
                ? styles.verifiedBadge
                : isNeedsCheck
                ? styles.needsBadge
                : styles.pendingBadge,
            ]}
          >
            <Ionicons
              name={
                isVerified
                  ? 'checkmark-circle'
                  : isNeedsCheck
                  ? 'alert-circle'
                  : 'time-outline'
              }
              size={12}
              color={
                isVerified
                  ? ENUMERATOR_THEME.colors.successText
                  : isNeedsCheck
                  ? ENUMERATOR_THEME.colors.dangerText
                  : ENUMERATOR_THEME.colors.warningText
              }
            />
            <Text
              style={[
                styles.statusBadgeText,
                isVerified
                  ? styles.verifiedBadgeText
                  : isNeedsCheck
                  ? styles.needsBadgeText
                  : styles.pendingBadgeText,
              ]}
            >
              {household.verificationStatus || household.status}
            </Text>
          </View>

          {isHighPriority && (
            <View style={styles.priorityBadge}>
              <Text style={styles.priorityBadgeText}>HIGH PRIORITY</Text>
            </View>
          )}
        </View>

        <View style={styles.membersPill}>
          <Ionicons name="people-outline" size={12} color={ENUMERATOR_THEME.colors.textMuted} />
          <Text style={styles.membersPillText}>{household.members} Members</Text>
        </View>
      </View>

      {/* Head Name & Household ID */}
      <View style={styles.nameRow}>
        <Text style={styles.headName}>{household.headName}</Text>
        <Text style={styles.householdId}>{household.householdId}</Text>
      </View>

      {/* Area & Locality */}
      <View style={styles.metaRow}>
        <Ionicons name="location-outline" size={14} color={ENUMERATOR_THEME.colors.accent} />
        <Text style={styles.localityText}>
          {household.locality} · {household.ward || 'Ward 12'}
        </Text>
      </View>

      {/* Masked Identity Information (Privacy Preserved: Last 4 digits only) */}
      <View style={styles.identityRow}>
        <MaterialCommunityIcons name="card-account-details-outline" size={14} color={ENUMERATOR_THEME.colors.textMuted} />
        <Text style={styles.identityText}>{maskedId}</Text>
      </View>

      {/* Verification Reason Box */}
      <View style={styles.reasonBox}>
        <MaterialCommunityIcons name="shield-search" size={14} color={ENUMERATOR_THEME.colors.warning} />
        <Text style={styles.reasonText}>
          <Text style={{ fontWeight: '700' }}>Reason: </Text>
          {reason}
        </Text>
      </View>

      {/* GPS Status Row */}
      <View style={styles.gpsRow}>
        <Ionicons
          name={hasCoords ? 'navigate-circle-outline' : 'location-outline'}
          size={14}
          color={hasCoords ? ENUMERATOR_THEME.colors.success : ENUMERATOR_THEME.colors.textMuted}
        />
        <Text style={styles.gpsText}>
          {hasCoords
            ? `GPS Captured (${household.latitude?.toFixed(3)}, ${household.longitude?.toFixed(3)})`
            : 'GPS Location Not Captured'}
        </Text>
      </View>

      {/* Action Buttons Row */}
      <View style={styles.actionsRow}>
        <TouchableOpacity style={styles.reviewBtn} onPress={handleReviewHousehold} activeOpacity={0.8}>
          <Ionicons name="clipboard-outline" size={14} color={ENUMERATOR_THEME.colors.textPrimary} />
          <Text style={styles.reviewBtnText}>Review Household</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.verifyBtn}
          onPress={() => onOpenOutcomeModal(household)}
          activeOpacity={0.8}
        >
          <Ionicons name="checkbox-outline" size={14} color={ENUMERATOR_THEME.colors.textWhite} />
          <Text style={styles.verifyBtnText}>Record Outcome</Text>
        </TouchableOpacity>

        {hasCoords && (
          <TouchableOpacity style={styles.mapBtn} onPress={handleViewMap} activeOpacity={0.8}>
            <Ionicons name="map-outline" size={14} color={ENUMERATOR_THEME.colors.accent} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: ENUMERATOR_THEME.colors.cardBackground,
    borderRadius: ENUMERATOR_THEME.borderRadius.lg,
    padding: 14,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
    gap: 8,
    marginHorizontal: 16,
  },
  cardVerified: {
    backgroundColor: '#F8FAFC',
    borderColor: ENUMERATOR_THEME.colors.successBorder,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  badgeGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: ENUMERATOR_THEME.borderRadius.sm,
    borderWidth: 1,
  },
  verifiedBadge: {
    backgroundColor: ENUMERATOR_THEME.colors.successBg,
    borderColor: ENUMERATOR_THEME.colors.successBorder,
  },
  needsBadge: {
    backgroundColor: ENUMERATOR_THEME.colors.dangerBg,
    borderColor: ENUMERATOR_THEME.colors.dangerBorder,
  },
  pendingBadge: {
    backgroundColor: ENUMERATOR_THEME.colors.warningBg,
    borderColor: ENUMERATOR_THEME.colors.warningBorder,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  verifiedBadgeText: {
    color: ENUMERATOR_THEME.colors.successText,
  },
  needsBadgeText: {
    color: ENUMERATOR_THEME.colors.dangerText,
  },
  pendingBadgeText: {
    color: ENUMERATOR_THEME.colors.warningText,
  },
  priorityBadge: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
    borderWidth: 1,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: ENUMERATOR_THEME.borderRadius.sm,
  },
  priorityBadgeText: {
    color: '#EF4444',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  membersPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: ENUMERATOR_THEME.colors.subtleBackground,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: ENUMERATOR_THEME.borderRadius.full,
  },
  membersPillText: {
    fontSize: 11,
    fontWeight: '600',
    color: ENUMERATOR_THEME.colors.textSecondary,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headName: {
    fontSize: 16,
    fontWeight: '800',
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  householdId: {
    fontSize: 13,
    fontWeight: '800',
    color: ENUMERATOR_THEME.colors.accent,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  localityText: {
    fontSize: 12,
    fontWeight: '600',
    color: ENUMERATOR_THEME.colors.textSecondary,
  },
  identityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: ENUMERATOR_THEME.colors.background,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: ENUMERATOR_THEME.borderRadius.sm,
    alignSelf: 'flex-start',
  },
  identityText: {
    fontSize: 11,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.textMuted,
  },
  reasonBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    backgroundColor: ENUMERATOR_THEME.colors.warningBg,
    borderColor: ENUMERATOR_THEME.colors.warningBorder,
    borderWidth: 1,
    padding: 10,
    borderRadius: ENUMERATOR_THEME.borderRadius.md,
  },
  reasonText: {
    fontSize: 12,
    color: ENUMERATOR_THEME.colors.warningText,
    flex: 1,
    lineHeight: 16,
  },
  gpsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  gpsText: {
    fontSize: 11,
    color: ENUMERATOR_THEME.colors.textMuted,
    fontWeight: '500',
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  reviewBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: ENUMERATOR_THEME.colors.subtleBackground,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: ENUMERATOR_THEME.borderRadius.md,
  },
  reviewBtnText: {
    color: ENUMERATOR_THEME.colors.textPrimary,
    fontSize: 12,
    fontWeight: '700',
  },
  verifyBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: ENUMERATOR_THEME.colors.accent,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: ENUMERATOR_THEME.borderRadius.md,
  },
  verifyBtnText: {
    color: ENUMERATOR_THEME.colors.textWhite,
    fontSize: 12,
    fontWeight: '700',
  },
  mapBtn: {
    width: 36,
    height: 36,
    borderRadius: ENUMERATOR_THEME.borderRadius.md,
    backgroundColor: ENUMERATOR_THEME.colors.accentSubtle,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.accentLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
