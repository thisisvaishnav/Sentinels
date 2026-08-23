import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ENUMERATOR_THEME } from '../../theme';

interface Props {
  target: number;
  completed: number;
}

export function DailyTargetCard({ target, completed }: Props) {
  const remaining = Math.max(0, target - completed);
  const progressPercentage = target > 0 ? Math.round((completed / target) * 100) : 0;

  // Calculate Status: On track (>= 60%), Target Completed (>= 100%), Behind target (< 60%)
  const isCompleted = completed >= target;
  const isOnTrack = progressPercentage >= 60;
  const statusLabel = isCompleted ? 'Target Completed' : isOnTrack ? 'On Track' : 'Behind Target';

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.titleWrap}>
          <MaterialCommunityIcons name="target" size={20} color={ENUMERATOR_THEME.colors.accent} />
          <Text style={styles.cardTitle}>{"Today's Target"}</Text>
        </View>

        <View
          style={[
            styles.statusPill,
            isCompleted
              ? styles.pillCompleted
              : isOnTrack
              ? styles.pillOnTrack
              : styles.pillBehind,
          ]}
        >
          <View
            style={[
              styles.dot,
              isCompleted
                ? styles.dotCompleted
                : isOnTrack
                ? styles.dotOnTrack
                : styles.dotBehind,
            ]}
          />
          <Text
            style={[
              styles.statusText,
              isCompleted
                ? styles.textCompleted
                : isOnTrack
                ? styles.textOnTrack
                : styles.textBehind,
            ]}
          >
            {statusLabel}
          </Text>
        </View>
      </View>

      {/* Target Progress Bar */}
      <View style={styles.progressWrap}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressLabel}>Target Completion</Text>
          <Text style={styles.progressVal}>{completed} / {target} ({progressPercentage}%)</Text>
        </View>

        <View style={styles.track}>
          <View style={[styles.fill, { width: `${Math.min(100, progressPercentage)}%` }]} />
        </View>
      </View>

      {/* Metric Breakdown */}
      <View style={styles.metricsRow}>
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>Daily Goal</Text>
          <Text style={styles.metricValue}>{target} HH</Text>
        </View>

        <View style={styles.metricDivider} />

        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>Completed</Text>
          <Text style={[styles.metricValue, styles.textCompleted]}>{completed} HH</Text>
        </View>

        <View style={styles.metricDivider} />

        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>Remaining</Text>
          <Text style={[styles.metricValue, remaining > 0 ? styles.textWarning : styles.textCompleted]}>
            {remaining} HH
          </Text>
        </View>
      </View>
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
    gap: 12,
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
    fontSize: 15,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: ENUMERATOR_THEME.borderRadius.full,
    gap: 5,
  },
  pillCompleted: {
    backgroundColor: ENUMERATOR_THEME.colors.successBg,
  },
  pillOnTrack: {
    backgroundColor: ENUMERATOR_THEME.colors.accentSubtle,
  },
  pillBehind: {
    backgroundColor: '#FEF3C7',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  dotCompleted: {
    backgroundColor: ENUMERATOR_THEME.colors.success,
  },
  dotOnTrack: {
    backgroundColor: ENUMERATOR_THEME.colors.accent,
  },
  dotBehind: {
    backgroundColor: '#D97706',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  textCompleted: {
    color: ENUMERATOR_THEME.colors.successText,
  },
  textOnTrack: {
    color: ENUMERATOR_THEME.colors.accent,
  },
  textBehind: {
    color: '#92400E',
  },
  progressWrap: {
    gap: 6,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: ENUMERATOR_THEME.colors.textSecondary,
  },
  progressVal: {
    fontSize: 11,
    fontWeight: '800',
    color: ENUMERATOR_THEME.colors.accent,
  },
  track: {
    height: 7,
    backgroundColor: ENUMERATOR_THEME.colors.subtleBackground,
    borderRadius: ENUMERATOR_THEME.borderRadius.full,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: ENUMERATOR_THEME.colors.accent,
    borderRadius: ENUMERATOR_THEME.borderRadius.full,
  },
  metricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ENUMERATOR_THEME.colors.subtleBackground,
    borderRadius: ENUMERATOR_THEME.borderRadius.md,
    padding: 10,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
  },
  metricItem: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  metricDivider: {
    width: 1,
    height: 24,
    backgroundColor: ENUMERATOR_THEME.colors.border,
  },
  metricLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: ENUMERATOR_THEME.colors.textSecondary,
  },
  metricValue: {
    fontSize: 13,
    fontWeight: '800',
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  textWarning: {
    color: '#D97706',
  },
});
