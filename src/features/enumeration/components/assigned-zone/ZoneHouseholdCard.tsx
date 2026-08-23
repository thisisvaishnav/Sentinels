import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ENUMERATOR_THEME } from '../../theme';
import { ZoneHouseholdItem } from '../../types';

interface Props {
  item: ZoneHouseholdItem;
}

export function ZoneHouseholdCard({ item }: Props) {
  const router = useRouter();

  const isCompleted = item.status === 'Completed';
  const isInProgress = item.status === 'In Progress';
  const isPending = item.status === 'Pending';
  const isHighPriority = item.priority === 'High';

  const handleAction = () => {
    if (isCompleted) {
      router.push({
        pathname: '/(enumerator)/start-survey',
        params: { householdId: item.householdId, readOnly: 'true' },
      });
    } else if (isInProgress || isPending) {
      router.push({
        pathname: '/(enumerator)/start-survey',
        params: { householdId: item.householdId },
      });
    } else {
      router.push({
        pathname: '/(enumerator)/register-household',
        params: { householdId: item.householdId },
      });
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.idWrap}>
          <Text style={styles.idText}>{item.householdId}</Text>
          {isHighPriority && (
            <View style={styles.priorityBadge}>
              <Ionicons name="alert-circle" size={12} color="#DC2626" />
              <Text style={styles.priorityText}>High Priority</Text>
            </View>
          )}
        </View>

        {/* Status Pill */}
        <View
          style={[
            styles.statusPill,
            isCompleted
              ? styles.pillCompleted
              : isInProgress
              ? styles.pillInProgress
              : isPending
              ? styles.pillPending
              : styles.pillVerification,
          ]}
        >
          <View
            style={[
              styles.dot,
              isCompleted
                ? styles.dotCompleted
                : isInProgress
                ? styles.dotInProgress
                : isPending
                ? styles.dotPending
                : styles.dotVerification,
            ]}
          />
          <Text
            style={[
              styles.statusText,
              isCompleted
                ? styles.textCompleted
                : isInProgress
                ? styles.textInProgress
                : isPending
                ? styles.textPending
                : styles.textVerification,
            ]}
          >
            {item.status}
          </Text>
        </View>
      </View>

      {/* Head Name */}
      <Text style={styles.headName}>{item.headName}</Text>

      {/* Details Row */}
      <View style={styles.detailsRow}>
        <View style={styles.detailItem}>
          <Ionicons name="location-outline" size={14} color={ENUMERATOR_THEME.colors.textMuted} />
          <Text style={styles.detailText} numberOfLines={1}>{item.locality}</Text>
        </View>

        <View style={styles.detailItem}>
          <MaterialCommunityIcons name="account-group-outline" size={14} color={ENUMERATOR_THEME.colors.textMuted} />
          <Text style={styles.detailText}>{item.members} Members</Text>
        </View>
      </View>

      {/* Action Button */}
      <TouchableOpacity
        style={[
          styles.actionBtn,
          isCompleted && styles.actionBtnCompleted,
          isInProgress && styles.actionBtnInProgress,
        ]}
        onPress={handleAction}
        activeOpacity={0.8}
      >
        <MaterialCommunityIcons
          name={
            isCompleted
              ? 'eye-outline'
              : isInProgress
              ? 'play-circle-outline'
              : isPending
              ? 'clipboard-edit-outline'
              : 'home-search-outline'
          }
          size={16}
          color={isCompleted ? ENUMERATOR_THEME.colors.textPrimary : ENUMERATOR_THEME.colors.textWhite}
        />
        <Text style={[styles.actionBtnText, isCompleted && styles.actionBtnTextCompleted]}>
          {isCompleted
            ? 'View Survey'
            : isInProgress
            ? 'Continue Survey'
            : isPending
            ? 'Start Survey'
            : 'View Household'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: ENUMERATOR_THEME.colors.cardBackground,
    borderRadius: ENUMERATOR_THEME.borderRadius.xl,
    padding: 14,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
    gap: 8,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  idWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  idText: {
    fontSize: 13,
    fontWeight: '800',
    color: ENUMERATOR_THEME.colors.accent,
    letterSpacing: 0.5,
  },
  priorityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: ENUMERATOR_THEME.borderRadius.sm,
    gap: 3,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#991B1B',
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: ENUMERATOR_THEME.borderRadius.full,
    gap: 5,
  },
  pillCompleted: {
    backgroundColor: ENUMERATOR_THEME.colors.successBg,
  },
  pillInProgress: {
    backgroundColor: ENUMERATOR_THEME.colors.accentSubtle,
  },
  pillPending: {
    backgroundColor: '#FEF3C7',
  },
  pillVerification: {
    backgroundColor: '#F3E8FF',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  dotCompleted: {
    backgroundColor: ENUMERATOR_THEME.colors.success,
  },
  dotInProgress: {
    backgroundColor: ENUMERATOR_THEME.colors.accent,
  },
  dotPending: {
    backgroundColor: '#D97706',
  },
  dotVerification: {
    backgroundColor: '#9333EA',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  textCompleted: {
    color: ENUMERATOR_THEME.colors.successText,
  },
  textInProgress: {
    color: ENUMERATOR_THEME.colors.accent,
  },
  textPending: {
    color: '#92400E',
  },
  textVerification: {
    color: '#6B21A8',
  },
  headName: {
    fontSize: 15,
    fontWeight: '800',
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flexShrink: 1,
  },
  detailText: {
    fontSize: 12,
    color: ENUMERATOR_THEME.colors.textSecondary,
    fontWeight: '500',
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: ENUMERATOR_THEME.colors.accent,
    height: 40,
    borderRadius: ENUMERATOR_THEME.borderRadius.lg,
    gap: 6,
    marginTop: 4,
  },
  actionBtnInProgress: {
    backgroundColor: '#0284C7',
  },
  actionBtnCompleted: {
    backgroundColor: ENUMERATOR_THEME.colors.subtleBackground,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
  },
  actionBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.textWhite,
  },
  actionBtnTextCompleted: {
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
});
