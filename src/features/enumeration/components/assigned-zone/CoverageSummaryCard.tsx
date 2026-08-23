import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ENUMERATOR_THEME } from '../../theme';

interface Props {
  totalHouseholds: number;
  completedHouseholds: number;
  inProgressHouseholds: number;
  pendingHouseholds: number;
}

export function CoverageSummaryCard({
  totalHouseholds,
  completedHouseholds,
  inProgressHouseholds,
  pendingHouseholds,
}: Props) {
  const coveragePercentage =
    totalHouseholds > 0 ? Math.round((completedHouseholds / totalHouseholds) * 100) : 0;

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.titleWrap}>
          <MaterialCommunityIcons name="chart-pie" size={22} color={ENUMERATOR_THEME.colors.accent} />
          <Text style={styles.cardTitle}>Zone Coverage Summary</Text>
        </View>

        <Text style={styles.percentageText}>{coveragePercentage}% Covered</Text>
      </View>

      {/* Progress Track */}
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${coveragePercentage}%` }]} />
      </View>

      {/* Stats Breakdown Grid */}
      <View style={styles.statsGrid}>
        <View style={styles.statBox}>
          <Text style={styles.statVal}>{totalHouseholds}</Text>
          <Text style={styles.statLabel}>Total Assigned</Text>
        </View>

        <View style={styles.statBox}>
          <Text style={[styles.statVal, styles.textSuccess]}>{completedHouseholds}</Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>

        <View style={styles.statBox}>
          <Text style={[styles.statVal, styles.textAccent]}>{inProgressHouseholds}</Text>
          <Text style={styles.statLabel}>In Progress</Text>
        </View>

        <View style={styles.statBox}>
          <Text style={[styles.statVal, styles.textWarning]}>{pendingHouseholds}</Text>
          <Text style={styles.statLabel}>Pending</Text>
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
  percentageText: {
    fontSize: 15,
    fontWeight: '800',
    color: ENUMERATOR_THEME.colors.accent,
  },
  track: {
    height: 8,
    backgroundColor: ENUMERATOR_THEME.colors.subtleBackground,
    borderRadius: ENUMERATOR_THEME.borderRadius.full,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: ENUMERATOR_THEME.colors.accent,
    borderRadius: ENUMERATOR_THEME.borderRadius.full,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 2,
  },
  statBox: {
    flex: 1,
    backgroundColor: ENUMERATOR_THEME.colors.subtleBackground,
    borderRadius: ENUMERATOR_THEME.borderRadius.md,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
    gap: 2,
  },
  statVal: {
    fontSize: 16,
    fontWeight: '800',
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: ENUMERATOR_THEME.colors.textSecondary,
  },
  textSuccess: {
    color: ENUMERATOR_THEME.colors.success,
  },
  textAccent: {
    color: ENUMERATOR_THEME.colors.accent,
  },
  textWarning: {
    color: '#D97706',
  },
});
