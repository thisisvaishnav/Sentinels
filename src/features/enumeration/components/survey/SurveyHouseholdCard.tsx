import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { ENUMERATOR_THEME } from '../../theme';
import { AssignedHouseholdSummary } from '../../types';

interface Props {
  item: AssignedHouseholdSummary;
  onActionPress: (item: AssignedHouseholdSummary) => void;
}

export function SurveyHouseholdCard({ item, onActionPress }: Props) {
  const isPending = item.status === 'Pending';
  const isInProgress = item.status === 'In Progress';
  const isCompleted = item.status === 'Completed';
  const isHighPriority = item.priority === 'High';

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
            isPending
              ? styles.pillPending
              : isInProgress
              ? styles.pillInProgress
              : styles.pillCompleted,
          ]}
        >
          <View
            style={[
              styles.dot,
              isPending
                ? styles.dotPending
                : isInProgress
                ? styles.dotInProgress
                : styles.dotCompleted,
            ]}
          />
          <Text
            style={[
              styles.statusText,
              isPending
                ? styles.textPending
                : isInProgress
                ? styles.textInProgress
                : styles.textCompleted,
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
          <Text style={styles.detailText} numberOfLines={1}>{item.address}</Text>
        </View>

        <View style={styles.detailItem}>
          <MaterialCommunityIcons name="account-group-outline" size={14} color={ENUMERATOR_THEME.colors.textMuted} />
          <Text style={styles.detailText}>{item.memberCount} Members</Text>
        </View>
      </View>

      {/* Action Button */}
      <TouchableOpacity
        style={[
          styles.actionBtn,
          isCompleted && styles.actionBtnCompleted,
          isInProgress && styles.actionBtnInProgress,
        ]}
        onPress={() => onActionPress(item)}
        activeOpacity={0.8}
      >
        <MaterialCommunityIcons
          name={isCompleted ? 'eye-outline' : isInProgress ? 'play-circle-outline' : 'clipboard-edit-outline'}
          size={18}
          color={isCompleted ? ENUMERATOR_THEME.colors.textPrimary : ENUMERATOR_THEME.colors.textWhite}
        />
        <Text style={[styles.actionBtnText, isCompleted && styles.actionBtnTextCompleted]}>
          {isCompleted ? 'View Survey' : isInProgress ? 'Continue Survey' : 'Start Survey'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: ENUMERATOR_THEME.colors.cardBackground,
    borderRadius: ENUMERATOR_THEME.borderRadius.xl,
    padding: 16,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
    gap: 10,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  idWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
    paddingVertical: 4,
    borderRadius: ENUMERATOR_THEME.borderRadius.full,
    gap: 5,
  },
  pillPending: {
    backgroundColor: '#FEF3C7',
  },
  pillInProgress: {
    backgroundColor: ENUMERATOR_THEME.colors.accentSubtle,
  },
  pillCompleted: {
    backgroundColor: ENUMERATOR_THEME.colors.successBg,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  dotPending: {
    backgroundColor: '#D97706',
  },
  dotInProgress: {
    backgroundColor: ENUMERATOR_THEME.colors.accent,
  },
  dotCompleted: {
    backgroundColor: ENUMERATOR_THEME.colors.success,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  textPending: {
    color: '#92400E',
  },
  textInProgress: {
    color: ENUMERATOR_THEME.colors.accent,
  },
  textCompleted: {
    color: ENUMERATOR_THEME.colors.successText,
  },
  headName: {
    fontSize: 16,
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
    height: 42,
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
    fontSize: 13,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.textWhite,
  },
  actionBtnTextCompleted: {
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
});
