import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ZoneHouseholdItem } from '../../types';
import { ENUMERATOR_THEME } from '../../theme';

interface PriorityTaskCardProps {
  household: ZoneHouseholdItem;
}

export const PriorityTaskCard: React.FC<PriorityTaskCardProps> = ({ household }) => {
  const router = useRouter();

  const handleAction = () => {
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
      // Needs Verification or Missing
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
          icon: 'eye-outline' as const,
          bgColor: ENUMERATOR_THEME.colors.accent,
        };
      case 'In Progress':
        return {
          label: 'Continue Survey',
          icon: 'play-outline' as const,
          bgColor: ENUMERATOR_THEME.colors.warning,
        };
      case 'Pending':
        return {
          label: 'Start Survey',
          icon: 'clipboard-edit-outline' as const,
          bgColor: ENUMERATOR_THEME.colors.accent,
        };
      default:
        return {
          label: 'View Household',
          icon: 'home-search-outline' as const,
          bgColor: ENUMERATOR_THEME.colors.primary,
        };
    }
  };

  const getStatusColor = () => {
    switch (household.status) {
      case 'Completed':
        return { text: '#059669', bg: '#D1FAE5' };
      case 'In Progress':
        return { text: '#D97706', bg: '#FEF3C7' };
      case 'Pending':
        return { text: '#0284C7', bg: '#E0F2FE' };
      default:
        return { text: '#DC2626', bg: '#FEE2E2' };
    }
  };

  const actionConfig = getActionBtnConfig();
  const statusColor = getStatusColor();
  const isHighPriority = household.priority === 'High';
  const hasNeeds = household.needs && household.needs.length > 0;

  return (
    <View style={styles.card}>
      {/* Card Header: ID, Head Name, Status */}
      <View style={styles.cardHeader}>
        <View style={styles.leftInfo}>
          <View style={styles.idRow}>
            <Text style={styles.householdId}>{household.householdId}</Text>
            {isHighPriority && <Text style={styles.highBadge}>HIGH PRIORITY</Text>}
          </View>
          <Text style={styles.headName}>{household.headName}</Text>
        </View>

        <View style={[styles.statusBadge, { backgroundColor: statusColor.bg }]}>
          <Text style={[styles.statusBadgeText, { color: statusColor.text }]}>
            {household.status}
          </Text>
        </View>
      </View>

      {/* Locality & Member Count */}
      <View style={styles.localityRow}>
        <Ionicons name="location-outline" size={14} color={ENUMERATOR_THEME.colors.textMuted} />
        <Text style={styles.localityText}>
          {household.locality} · {household.members} members
        </Text>
      </View>

      {/* Address Landmark if available */}
      {household.address && (
        <Text style={styles.addressText} numberOfLines={1}>
          {household.address}
        </Text>
      )}

      {/* Needs & Urgent Requirement Tags */}
      {hasNeeds && (
        <View style={styles.needsContainer}>
          {household.needs?.map((need, idx) => (
            <View key={idx} style={styles.needChip}>
              <MaterialCommunityIcons name="medical-bag" size={12} color="#D97706" />
              <Text style={styles.needChipText}>{need}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Verification Warning if required */}
      {household.verificationStatus === 'Needs Verification' && (
        <View style={styles.verificationAlert}>
          <Ionicons name="alert-circle-outline" size={14} color="#D97706" />
          <Text style={styles.verificationAlertText}>
            Pending field verification check
          </Text>
        </View>
      )}

      {/* Bottom Action Footer */}
      <View style={styles.cardFooter}>
        <Text style={styles.lastVisitText}>
          {household.lastVisit ? `Last Visit: ${household.lastVisit}` : 'Not visited yet'}
        </Text>

        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: actionConfig.bgColor }]}
          onPress={handleAction}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons name={actionConfig.icon} size={14} color="#FFFFFF" />
          <Text style={styles.actionBtnText}>{actionConfig.label}</Text>
        </TouchableOpacity>
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
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  leftInfo: {
    flex: 1,
    gap: 2,
  },
  idRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  householdId: {
    fontSize: 12,
    fontWeight: '800',
    color: ENUMERATOR_THEME.colors.accent,
  },
  highBadge: {
    fontSize: 8,
    fontWeight: '900',
    color: '#EF4444',
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
  },
  headName: {
    fontSize: 15,
    fontWeight: '800',
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '800',
  },
  localityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  localityText: {
    fontSize: 11,
    color: ENUMERATOR_THEME.colors.textSecondary,
    fontWeight: '600',
  },
  addressText: {
    fontSize: 11,
    color: ENUMERATOR_THEME.colors.textMuted,
  },
  needsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 2,
  },
  needChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#FDE047',
    gap: 4,
  },
  needChipText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#B45309',
  },
  verificationAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#FDE047',
    gap: 6,
  },
  verificationAlertText: {
    fontSize: 10,
    color: '#B45309',
    fontWeight: '700',
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: ENUMERATOR_THEME.colors.border,
    paddingTop: 8,
    marginTop: 2,
  },
  lastVisitText: {
    fontSize: 10,
    color: ENUMERATOR_THEME.colors.textMuted,
    fontWeight: '500',
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: ENUMERATOR_THEME.borderRadius.md,
    gap: 4,
  },
  actionBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
