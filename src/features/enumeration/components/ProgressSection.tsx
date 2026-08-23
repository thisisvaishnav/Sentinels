import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TodayProgress } from '../types';
import { ENUMERATOR_THEME } from '../theme';

interface ProgressSectionProps {
  progress: TodayProgress;
}

export const ProgressSection: React.FC<ProgressSectionProps> = ({ progress }) => {
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>Today{"'"}s Progress</Text>
        <Text style={styles.percentBadge}>{progress.coveragePercentage}% Covered</Text>
      </View>

      {/* Progress Bar */}
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${progress.coveragePercentage}%` }]} />
      </View>

      {/* Metrics Row */}
      <View style={styles.metricsRow}>
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>Assigned</Text>
          <Text style={styles.metricValue}>{progress.totalAssigned}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>Completed</Text>
          <Text style={[styles.metricValue, { color: ENUMERATOR_THEME.colors.success }]}>{progress.completed}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>Remaining</Text>
          <Text style={[styles.metricValue, { color: ENUMERATOR_THEME.colors.danger }]}>{progress.remaining}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: ENUMERATOR_THEME.colors.cardBackground,
    borderRadius: ENUMERATOR_THEME.borderRadius.xl,
    padding: 18,
    gap: 14,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  percentBadge: {
    fontSize: 13,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.accent,
  },
  track: {
    height: 10,
    backgroundColor: ENUMERATOR_THEME.colors.subtleBackground,
    borderRadius: 5,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: ENUMERATOR_THEME.colors.accent,
    borderRadius: 5,
  },
  metricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: 6,
  },
  metricItem: {
    alignItems: 'center',
    gap: 4,
  },
  metricLabel: {
    fontSize: 11,
    color: ENUMERATOR_THEME.colors.textMuted,
    fontWeight: '500',
    textTransform: 'uppercase',
  },
  metricValue: {
    fontSize: 20,
    fontWeight: '800',
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  divider: {
    width: 1,
    height: 28,
    backgroundColor: ENUMERATOR_THEME.colors.border,
  },
});
