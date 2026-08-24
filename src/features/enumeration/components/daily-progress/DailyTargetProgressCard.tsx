import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { ENUMERATOR_THEME } from '../../theme';

interface DailyTargetProgressCardProps {
  target: number;
  completed: number;
}

export const DailyTargetProgressCard: React.FC<DailyTargetProgressCardProps> = ({
  target,
  completed,
}) => {
  // Safe math calculations
  const remaining = Math.max(0, target - completed);
  const rawPercentage = target > 0 ? Math.round((completed / target) * 100) : 0;
  
  // Progress bar visual fill percentage bounded between 0% and 100%
  const barWidthPercent = Math.min(100, Math.max(0, rawPercentage));

  const isTargetMet = target > 0 && completed >= target;
  const isTargetExceeded = target > 0 && completed > target;

  return (
    <View style={styles.cardContainer}>
      <View style={styles.headerRow}>
        <View style={styles.titleWrap}>
          <MaterialCommunityIcons
            name="target"
            size={22}
            color={ENUMERATOR_THEME.colors.accent}
          />
          <Text style={styles.cardTitle}>Daily Target Progress</Text>
        </View>

        {isTargetExceeded ? (
          <View style={[styles.statusBadge, styles.badgeExceeded]}>
            <MaterialCommunityIcons name="star" size={14} color="#047857" />
            <Text style={[styles.statusBadgeText, { color: '#047857' }]}>Target Exceeded</Text>
          </View>
        ) : isTargetMet ? (
          <View style={[styles.statusBadge, styles.badgeCompleted]}>
            <Ionicons name="checkmark-circle" size={14} color="#047857" />
            <Text style={[styles.statusBadgeText, { color: '#047857' }]}>Target Completed</Text>
          </View>
        ) : (
          <View style={[styles.statusBadge, styles.badgeOnTrack]}>
            <Ionicons name="time-outline" size={14} color={ENUMERATOR_THEME.colors.accent} />
            <Text style={styles.statusBadgeText}>On Track</Text>
          </View>
        )}
      </View>

      {/* Primary Target Progress Metric */}
      <View style={styles.mainProgressRow}>
        <View style={styles.mainProgressTextWrap}>
          <Text style={styles.progressValText}>
            {completed} <Text style={styles.targetSubText}>/ {target} Households</Text>
          </Text>
          <Text style={styles.progressPercentSub}>{rawPercentage}% of daily target achieved</Text>
        </View>
      </View>

      {/* Accessible Bounded Progress Bar */}
      <View style={styles.barTrack}>
        <View
          style={[
            styles.barFill,
            {
              width: `${barWidthPercent}%`,
              backgroundColor: isTargetMet ? ENUMERATOR_THEME.colors.success : ENUMERATOR_THEME.colors.accent,
            },
          ]}
        />
      </View>

      {/* Target Metrics Breakdown */}
      <View style={styles.metricsGrid}>
        <View style={styles.metricTile}>
          <Text style={styles.tileLabel}>Daily Target</Text>
          <Text style={styles.tileValue}>{target}</Text>
          <Text style={styles.tileSub}>Households/day</Text>
        </View>

        <View style={styles.tileDivider} />

        <View style={styles.metricTile}>
          <Text style={styles.tileLabel}>Completed Today</Text>
          <Text style={[styles.tileValue, { color: ENUMERATOR_THEME.colors.success }]}>
            {completed}
          </Text>
          <Text style={styles.tileSub}>Validated</Text>
        </View>

        <View style={styles.tileDivider} />

        <View style={styles.metricTile}>
          <Text style={styles.tileLabel}>Remaining</Text>
          <Text style={[styles.tileValue, { color: remaining > 0 ? ENUMERATOR_THEME.colors.danger : ENUMERATOR_THEME.colors.success }]}>
            {remaining}
          </Text>
          <Text style={styles.tileSub}>{remaining === 0 ? 'Goal met!' : 'To reach target'}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: ENUMERATOR_THEME.colors.cardBackground,
    borderRadius: ENUMERATOR_THEME.borderRadius.xl,
    padding: 16,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
    gap: 14,

  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: ENUMERATOR_THEME.borderRadius.full,
  },
  badgeOnTrack: {
    backgroundColor: ENUMERATOR_THEME.colors.accentSubtle,
  },
  badgeCompleted: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  badgeExceeded: {
    backgroundColor: '#D1FAE5',
    borderWidth: 1,
    borderColor: '#34D399',
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.accent,
  },
  mainProgressRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
  },
  mainProgressTextWrap: {
    gap: 2,
  },
  progressValText: {
    fontSize: 26,
    fontWeight: '900',
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  targetSubText: {
    fontSize: 16,
    fontWeight: '600',
    color: ENUMERATOR_THEME.colors.textSecondary,
  },
  progressPercentSub: {
    fontSize: 12,
    color: ENUMERATOR_THEME.colors.textMuted,
    fontWeight: '500',
  },
  barTrack: {
    height: 12,
    backgroundColor: ENUMERATOR_THEME.colors.subtleBackground,
    borderRadius: 6,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 6,
  },
  metricsGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: ENUMERATOR_THEME.colors.background,
    padding: 12,
    borderRadius: ENUMERATOR_THEME.borderRadius.lg,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
  },
  metricTile: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  tileLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.textMuted,
    textTransform: 'uppercase',
  },
  tileValue: {
    fontSize: 18,
    fontWeight: '800',
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  tileSub: {
    fontSize: 10,
    color: ENUMERATOR_THEME.colors.textMuted,
  },
  tileDivider: {
    width: 1,
    height: 30,
    backgroundColor: ENUMERATOR_THEME.colors.border,
  },
});
