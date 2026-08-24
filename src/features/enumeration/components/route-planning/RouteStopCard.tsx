import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ENUMERATOR_THEME } from '../../theme';
import { RouteStop } from '../../types/routeTypes';

interface RouteStopCardProps {
  stop: RouteStop;
  isFirst: boolean;
  isLast: boolean;
  onMoveUp: (stopId: string) => void;
  onMoveDown: (stopId: string) => void;
  onRemove: (stopId: string) => void;
  onToggleVisited: (stopId: string) => void;
}

export const RouteStopCard: React.FC<RouteStopCardProps> = ({
  stop,
  isFirst,
  isLast,
  onMoveUp,
  onMoveDown,
  onRemove,
  onToggleVisited,
}) => {
  const router = useRouter();
  const { household, sequence, distanceFromPreviousKm, isVisited } = stop;

  if (!household) return null;

  const handleHouseholdPress = () => {
    if (household.status === 'Pending') {
      router.push({
        pathname: '/(enumerator)/start-survey',
        params: { householdId: household.householdId },
      });
    } else {
      router.push({
        pathname: '/(enumerator)/register-household',
        params: { householdId: household.householdId },
      });
    }
  };

  const handleRemoveConfirm = () => {
    Alert.alert(
      'Remove Stop',
      `Are you sure you want to remove ${household.householdId} from this route?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => onRemove(stop.id),
        },
      ]
    );
  };

  return (
    <View style={[styles.card, isVisited && styles.visitedCard]}>
      <View style={styles.topBar}>
        <View style={styles.seqBadgeWrap}>
          <View style={[styles.seqBadge, isVisited && styles.seqBadgeVisited]}>
            <Text style={styles.seqText}>#{String(sequence).padStart(2, '0')}</Text>
          </View>
          {distanceFromPreviousKm !== undefined && distanceFromPreviousKm > 0 && (
            <Text style={styles.distLabel}>+{distanceFromPreviousKm} km</Text>
          )}
        </View>

        <View style={styles.reorderControls}>
          <TouchableOpacity
            style={[styles.reorderBtn, isFirst && styles.disabledBtn]}
            onPress={() => !isFirst && onMoveUp(stop.id)}
            disabled={isFirst}
            accessibilityLabel="Move stop up"
          >
            <Ionicons
              name="chevron-up"
              size={16}
              color={isFirst ? ENUMERATOR_THEME.colors.textMuted : ENUMERATOR_THEME.colors.textPrimary}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.reorderBtn, isLast && styles.disabledBtn]}
            onPress={() => !isLast && onMoveDown(stop.id)}
            disabled={isLast}
            accessibilityLabel="Move stop down"
          >
            <Ionicons
              name="chevron-down"
              size={16}
              color={isLast ? ENUMERATOR_THEME.colors.textMuted : ENUMERATOR_THEME.colors.textPrimary}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.removeBtn}
            onPress={handleRemoveConfirm}
            accessibilityLabel="Remove stop from route"
          >
            <Ionicons name="trash-outline" size={16} color={ENUMERATOR_THEME.colors.danger} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.mainInfo}>
        <View style={styles.headerTitleRow}>
          <Text style={[styles.householdId, isVisited && styles.visitedText]}>
            {household.householdId}
          </Text>
          {isVisited && (
            <View style={styles.visitedStatusBadge}>
              <Ionicons name="checkmark-done" size={12} color={ENUMERATOR_THEME.colors.successText} />
              <Text style={styles.visitedStatusText}>Visited</Text>
            </View>
          )}
        </View>

        <Text style={[styles.headName, isVisited && styles.visitedText]}>{household.headName}</Text>
        <Text style={styles.localityText}>
          {household.locality} · {household.address || 'Address on file'}
        </Text>
      </View>

      <View style={styles.pillsRow}>
        <View style={styles.pill}>
          <Text style={styles.pillText}>{household.status}</Text>
        </View>

        {household.priority === 'High' && (
          <View style={[styles.pill, styles.priorityPill]}>
            <Text style={styles.priorityPillText}>High Priority</Text>
          </View>
        )}

        <Text style={styles.memberCount}>{household.members} Members</Text>
      </View>

      <View style={styles.cardActions}>
        <TouchableOpacity
          style={styles.actionLinkBtn}
          onPress={handleHouseholdPress}
          activeOpacity={0.7}
        >
          <Ionicons name="eye-outline" size={15} color={ENUMERATOR_THEME.colors.accent} />
          <Text style={styles.actionLinkText}>
            {household.status === 'Pending' ? 'Start Survey' : 'View Household'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.toggleVisitedBtn, isVisited && styles.toggleVisitedActive]}
          onPress={() => onToggleVisited(stop.id)}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons
            name={isVisited ? 'check-circle' : 'circle-outline'}
            size={16}
            color={isVisited ? ENUMERATOR_THEME.colors.successText : ENUMERATOR_THEME.colors.textSecondary}
          />
          <Text
            style={[
              styles.toggleVisitedText,
              isVisited && styles.toggleVisitedActiveText,
            ]}
          >
            {isVisited ? 'Mark Unvisited' : 'Mark Visited'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: ENUMERATOR_THEME.colors.cardBackground,
    borderRadius: ENUMERATOR_THEME.borderRadius.xl,
    padding: 14,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
    gap: 10,
  },
  visitedCard: {
    backgroundColor: '#F9FAFB',
    borderColor: '#E5E7EB',
    opacity: 0.85,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  seqBadgeWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  seqBadge: {
    backgroundColor: ENUMERATOR_THEME.colors.accentSubtle,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: ENUMERATOR_THEME.borderRadius.md,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.accentLight,
  },
  seqBadgeVisited: {
    backgroundColor: ENUMERATOR_THEME.colors.successBg,
    borderColor: ENUMERATOR_THEME.colors.success,
  },
  seqText: {
    fontSize: 12,
    fontWeight: '900',
    color: ENUMERATOR_THEME.colors.accent,
  },
  distLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.textSecondary,
  },
  reorderControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  reorderBtn: {
    width: 28,
    height: 28,
    borderRadius: ENUMERATOR_THEME.borderRadius.md,
    backgroundColor: ENUMERATOR_THEME.colors.subtleBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledBtn: {
    opacity: 0.3,
  },
  removeBtn: {
    width: 28,
    height: 28,
    borderRadius: ENUMERATOR_THEME.borderRadius.md,
    backgroundColor: '#FEF2F2',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 4,
  },
  mainInfo: {
    gap: 3,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  householdId: {
    fontSize: 12,
    fontWeight: '800',
    color: ENUMERATOR_THEME.colors.accent,
  },
  visitedText: {
    textDecorationLine: 'line-through',
    color: ENUMERATOR_THEME.colors.textMuted,
  },
  visitedStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: ENUMERATOR_THEME.colors.successBg,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: ENUMERATOR_THEME.borderRadius.sm,
  },
  visitedStatusText: {
    fontSize: 10,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.successText,
  },
  headName: {
    fontSize: 16,
    fontWeight: '800',
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  localityText: {
    fontSize: 12,
    color: ENUMERATOR_THEME.colors.textSecondary,
    fontWeight: '500',
  },
  pillsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  pill: {
    backgroundColor: ENUMERATOR_THEME.colors.subtleBackground,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: ENUMERATOR_THEME.borderRadius.md,
  },
  pillText: {
    fontSize: 10,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.textSecondary,
  },
  priorityPill: {
    backgroundColor: '#FEF2F2',
  },
  priorityPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.danger,
  },
  memberCount: {
    fontSize: 11,
    color: ENUMERATOR_THEME.colors.textMuted,
    fontWeight: '500',
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: ENUMERATOR_THEME.colors.border,
    marginTop: 4,
  },
  actionLinkBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  actionLinkText: {
    fontSize: 12,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.accent,
  },
  toggleVisitedBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: ENUMERATOR_THEME.colors.subtleBackground,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: ENUMERATOR_THEME.borderRadius.md,
  },
  toggleVisitedActive: {
    backgroundColor: ENUMERATOR_THEME.colors.successBg,
  },
  toggleVisitedText: {
    fontSize: 11,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.textSecondary,
  },
  toggleVisitedActiveText: {
    color: ENUMERATOR_THEME.colors.successText,
  },
});
