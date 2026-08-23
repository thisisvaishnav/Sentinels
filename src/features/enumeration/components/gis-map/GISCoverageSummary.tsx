import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ENUMERATOR_THEME } from '../../theme';

interface GISCoverageSummaryProps {
  totalHouseholds: number;
  completedCount: number;
  inProgressCount: number;
  pendingCount: number;
  coveragePercent: number;
  zoneName?: string;
}

export const GISCoverageSummary: React.FC<GISCoverageSummaryProps> = ({
  totalHouseholds,
  completedCount,
  inProgressCount,
  pendingCount,
  coveragePercent,
  zoneName = 'Zone A-12',
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <MaterialCommunityIcons name="radar" size={18} color={ENUMERATOR_THEME.colors.accent} />
        <Text style={styles.zoneName}>{zoneName}</Text>
        <View style={styles.coverageBadge}>
          <Text style={styles.coverageText}>{coveragePercent}% Coverage</Text>
        </View>
      </View>

      <View style={styles.metricsGrid}>
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>Total</Text>
          <Text style={styles.metricValue}>{totalHouseholds}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>Completed</Text>
          <Text style={[styles.metricValue, { color: ENUMERATOR_THEME.colors.success }]}>
            {completedCount}
          </Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>In Progress</Text>
          <Text style={[styles.metricValue, { color: ENUMERATOR_THEME.colors.warning }]}>
            {inProgressCount}
          </Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>Pending</Text>
          <Text style={[styles.metricValue, { color: ENUMERATOR_THEME.colors.accent }]}>
            {pendingCount}
          </Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${Math.min(100, coveragePercent)}%` }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: ENUMERATOR_THEME.colors.cardBackground,
    borderRadius: ENUMERATOR_THEME.borderRadius.xl,
    padding: 12,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    gap: 8,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  zoneName: {
    fontSize: 14,
    fontWeight: '800',
    color: ENUMERATOR_THEME.colors.textPrimary,
    flex: 1,
  },
  coverageBadge: {
    backgroundColor: ENUMERATOR_THEME.colors.accentSubtle,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: ENUMERATOR_THEME.borderRadius.full,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.accentLight,
  },
  coverageText: {
    fontSize: 11,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.accent,
  },
  metricsGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: ENUMERATOR_THEME.colors.subtleBackground,
    borderRadius: ENUMERATOR_THEME.borderRadius.md,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  metricItem: {
    alignItems: 'center',
    flex: 1,
  },
  metricLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: ENUMERATOR_THEME.colors.textMuted,
    textTransform: 'uppercase',
  },
  metricValue: {
    fontSize: 15,
    fontWeight: '800',
    color: ENUMERATOR_THEME.colors.textPrimary,
    marginTop: 2,
  },
  divider: {
    width: 1,
    height: 20,
    backgroundColor: ENUMERATOR_THEME.colors.border,
  },
  progressTrack: {
    height: 5,
    backgroundColor: ENUMERATOR_THEME.colors.subtleBackground,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: ENUMERATOR_THEME.colors.accent,
  },
});
