import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ENUMERATOR_THEME } from '../../theme';

interface FieldPerformanceCardProps {
  dailyTarget: number;
  completedToday: number;
}

export const FieldPerformanceCard: React.FC<FieldPerformanceCardProps> = ({
  dailyTarget = 25,
  completedToday = 0,
}) => {
  const router = useRouter();
  const remaining = Math.max(0, dailyTarget - completedToday);
  const progressPercent = Math.min(100, Math.round((completedToday / dailyTarget) * 100));

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <MaterialCommunityIcons name="bullseye-arrow" size={20} color={ENUMERATOR_THEME.colors.accent} />
        <Text style={styles.cardTitle}>Field Performance</Text>
        <Text style={styles.targetBadge}>{dailyTarget} Households / Day</Text>
      </View>

      {/* Progress bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressLabel}>Daily Goal Progress</Text>
          <Text style={styles.progressValue}>{progressPercent}%</Text>
        </View>

        <View style={styles.track}>
          <View style={[styles.fill, { width: `${progressPercent}%` }]} />
        </View>
      </View>

      {/* Stats Breakdown */}
      <View style={styles.statsRow}>
        <View style={styles.statCell}>
          <Text style={styles.cellLabel}>Target</Text>
          <Text style={styles.cellValue}>{dailyTarget}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.statCell}>
          <Text style={styles.cellLabel}>Completed</Text>
          <Text style={[styles.cellValue, { color: ENUMERATOR_THEME.colors.success }]}>
            {completedToday}
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.statCell}>
          <Text style={styles.cellLabel}>Remaining</Text>
          <Text style={[styles.cellValue, { color: remaining > 0 ? ENUMERATOR_THEME.colors.warning : ENUMERATOR_THEME.colors.success }]}>
            {remaining}
          </Text>
        </View>
      </View>

      {/* View Daily Progress Link */}
      <TouchableOpacity
        style={styles.viewProgressBtn}
        onPress={() => router.push('/(enumerator)/daily-progress')}
        activeOpacity={0.75}
        accessibilityLabel="View full daily progress"
      >
        <Text style={styles.viewProgressText}>View Daily Progress & Activity</Text>
        <Ionicons name="chevron-forward" size={14} color={ENUMERATOR_THEME.colors.accent} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: ENUMERATOR_THEME.colors.cardBackground,
    borderRadius: ENUMERATOR_THEME.borderRadius.xl,
    padding: 16,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
    gap: 14,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.textPrimary,
    flex: 1,
  },
  targetBadge: {
    fontSize: 11,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.accent,
    backgroundColor: ENUMERATOR_THEME.colors.accentSubtle,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: ENUMERATOR_THEME.borderRadius.sm,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.accentLight,
  },
  progressContainer: {
    gap: 6,
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  progressLabel: {
    fontSize: 12,
    color: ENUMERATOR_THEME.colors.textSecondary,
    fontWeight: '600',
  },
  progressValue: {
    fontSize: 13,
    fontWeight: '800',
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  track: {
    height: 8,
    borderRadius: 4,
    backgroundColor: ENUMERATOR_THEME.colors.subtleBackground,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: ENUMERATOR_THEME.colors.accent,
    borderRadius: 4,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ENUMERATOR_THEME.colors.background,
    borderRadius: ENUMERATOR_THEME.borderRadius.lg,
    padding: 12,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
  },
  statCell: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: ENUMERATOR_THEME.colors.border,
  },
  cellLabel: {
    fontSize: 11,
    color: ENUMERATOR_THEME.colors.textMuted,
    fontWeight: '500',
  },
  cellValue: {
    fontSize: 16,
    fontWeight: '800',
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  viewProgressBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: ENUMERATOR_THEME.colors.accentSubtle,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: ENUMERATOR_THEME.borderRadius.lg,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.accentLight,
    marginTop: 4,
  },
  viewProgressText: {
    fontSize: 12,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.accent,
  },
});
