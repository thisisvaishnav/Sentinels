import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TouchableWithoutFeedback } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ZoneHouseholdItem } from '../../types';
import { ENUMERATOR_THEME } from '../../theme';

interface GISSelectedHouseholdCardProps {
  household: ZoneHouseholdItem | null;
  visible: boolean;
  onClose: () => void;
}

export const GISSelectedHouseholdCard: React.FC<GISSelectedHouseholdCardProps> = ({
  household,
  visible,
  onClose,
}) => {
  const router = useRouter();

  if (!household) return null;

  const handleAction = () => {
    onClose();
    if (household.status === 'Completed') {
      router.push({
        pathname: '/(enumerator)/start-survey',
        params: { householdId: household.householdId, readOnly: 'true' },
      });
    } else if (household.status === 'In Progress' || household.status === 'Pending') {
      router.push({
        pathname: '/(enumerator)/start-survey',
        params: { householdId: household.householdId },
      });
    } else {
      // Needs Verification / Missing
      router.push({
        pathname: '/(enumerator)/register-household',
        params: { householdId: household.householdId },
      });
    }
  };

  const getActionBtnConfig = () => {
    switch (household.status) {
      case 'Completed':
        return {
          label: 'View Survey',
          iconName: 'eye-outline' as const,
          bgColor: ENUMERATOR_THEME.colors.accent,
        };
      case 'In Progress':
        return {
          label: 'Continue Survey',
          iconName: 'play-outline' as const,
          bgColor: ENUMERATOR_THEME.colors.warning,
        };
      case 'Pending':
        return {
          label: 'Start Survey',
          iconName: 'clipboard-outline' as const,
          bgColor: ENUMERATOR_THEME.colors.accent,
        };
      case 'Needs Verification':
      case 'Missing':
      default:
        return {
          label: 'View Household',
          iconName: 'home-outline' as const,
          bgColor: ENUMERATOR_THEME.colors.primary,
        };
    }
  };

  const btnConfig = getActionBtnConfig();

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.cardContainer}>
              {/* Header */}
              <View style={styles.cardHeader}>
                <View style={styles.idGroup}>
                  <Text style={styles.householdId}>{household.householdId}</Text>
                  <View
                    style={[
                      styles.statusBadge,
                      household.status === 'Completed'
                        ? styles.bgSuccess
                        : household.status === 'In Progress'
                        ? styles.bgWarning
                        : household.status === 'Pending'
                        ? styles.bgAccent
                        : styles.bgDanger,
                    ]}
                  >
                    <Text style={styles.statusBadgeText}>{household.status}</Text>
                  </View>
                  {household.priority === 'High' && (
                    <View style={styles.priorityTag}>
                      <Text style={styles.priorityTagText}>HIGH PRIORITY</Text>
                    </View>
                  )}
                </View>

                <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
                  <Ionicons name="close" size={22} color={ENUMERATOR_THEME.colors.textMuted} />
                </TouchableOpacity>
              </View>

              {/* Head Name & Address */}
              <Text style={styles.headName}>{household.headName}</Text>

              <View style={styles.detailRow}>
                <Ionicons name="location-outline" size={16} color={ENUMERATOR_THEME.colors.accent} />
                <Text style={styles.detailText}>
                  {household.address || household.locality} (Ward 12, Shiv Nagar)
                </Text>
              </View>

              {/* Info Grid */}
              <View style={styles.infoGrid}>
                <View style={styles.infoCol}>
                  <Text style={styles.infoLabel}>Members</Text>
                  <Text style={styles.infoVal}>{household.members} People</Text>
                </View>

                <View style={styles.infoCol}>
                  <Text style={styles.infoLabel}>Locality / Area</Text>
                  <Text style={styles.infoVal}>{household.locality}</Text>
                </View>

                <View style={styles.infoCol}>
                  <Text style={styles.infoLabel}>Verification</Text>
                  <Text style={styles.infoVal}>{household.verificationStatus || 'Pending'}</Text>
                </View>
              </View>

              {/* Action Button */}
              <TouchableOpacity
                style={[styles.mainActionBtn, { backgroundColor: btnConfig.bgColor }]}
                onPress={handleAction}
                activeOpacity={0.8}
              >
                <Ionicons name={btnConfig.iconName} size={18} color={ENUMERATOR_THEME.colors.textWhite} />
                <Text style={styles.mainActionBtnText}>{btnConfig.label}</Text>
              </TouchableOpacity>
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
    backgroundColor: 'rgba(23, 42, 58, 0.5)',
    justifyContent: 'flex-end',
  },
  cardContainer: {
    backgroundColor: ENUMERATOR_THEME.colors.cardBackground,
    borderTopLeftRadius: ENUMERATOR_THEME.borderRadius.xl,
    borderTopRightRadius: ENUMERATOR_THEME.borderRadius.xl,
    padding: 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: ENUMERATOR_THEME.colors.border,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  idGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  householdId: {
    fontSize: 16,
    fontWeight: '800',
    color: ENUMERATOR_THEME.colors.accent,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: ENUMERATOR_THEME.borderRadius.full,
  },
  bgSuccess: { backgroundColor: ENUMERATOR_THEME.colors.successBg },
  bgWarning: { backgroundColor: ENUMERATOR_THEME.colors.warningBg },
  bgAccent: { backgroundColor: ENUMERATOR_THEME.colors.accentSubtle },
  bgDanger: { backgroundColor: ENUMERATOR_THEME.colors.dangerBg },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  priorityTag: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  priorityTagText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#DC2626',
  },
  closeBtn: {
    padding: 4,
  },
  headName: {
    fontSize: 20,
    fontWeight: '800',
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: 13,
    color: ENUMERATOR_THEME.colors.textSecondary,
    fontWeight: '500',
  },
  infoGrid: {
    flexDirection: 'row',
    backgroundColor: ENUMERATOR_THEME.colors.subtleBackground,
    borderRadius: ENUMERATOR_THEME.borderRadius.lg,
    padding: 12,
    justifyContent: 'space-between',
  },
  infoCol: {
    gap: 2,
  },
  infoLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: ENUMERATOR_THEME.colors.textMuted,
    textTransform: 'uppercase',
  },
  infoVal: {
    fontSize: 13,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  mainActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: ENUMERATOR_THEME.borderRadius.lg,
    gap: 8,
    marginTop: 4,
  },
  mainActionBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.textWhite,
  },
});
