import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ENUMERATOR_THEME } from '../../theme';

interface TodaySummaryCardProps {
  totalAssigned: number;
  completed: number;
  inProgress: number;
  pending: number;
  coveragePercentage: number;
}

export const TodaySummaryCard: React.FC<TodaySummaryCardProps> = ({
  totalAssigned,
  completed,
  inProgress,
  pending,
  coveragePercentage,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.titleWrap}>
          <MaterialCommunityIcons
            name="chart-arc"
            size={20}
            color={ENUMERATOR_THEME.colors.accent}
          />
          <Text style={styles.cardTitle}>Today{"'"}s Coverage Summary</Text>
        </View>

        <View style={styles.coverageBadge}>
          <Text style={styles.coverageValue}>{coveragePercentage}%</Text>
          <Text style={styles.coverageLabel}>Coverage</Text>
        </View>
      </View>

      <Text style={styles.coverageSubtext}>
        <Text style={styles.boldText}>{completed}</Text> / {totalAssigned} households completed in assigned zone
      </Text>

      {/* Horizontally scrollable summary cards row */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalMetrics}
      >
        <View style={[styles.metricCard, { borderColor: ENUMERATOR_THEME.colors.accentLight }]}>
          <Text style={styles.metricLabel}>Total Assigned</Text>
          <Text style={[styles.metricVal, { color: ENUMERATOR_THEME.colors.textPrimary }]}>
            {totalAssigned}
          </Text>
          <Text style={styles.metricSub}>Households</Text>
        </View>

        <View style={[styles.metricCard, { borderColor: '#A7F3D0', backgroundColor: '#ECFDF5' }]}>
          <Text style={[styles.metricLabel, { color: '#047857' }]}>Completed</Text>
          <Text style={[styles.metricVal, { color: ENUMERATOR_THEME.colors.success }]}>
            {completed}
          </Text>
          <Text style={[styles.metricSub, { color: '#059669' }]}>Surveys done</Text>
        </View>

        <View style={[styles.metricCard, { borderColor: '#FDE68A', backgroundColor: '#FFFBEB' }]}>
          <Text style={[styles.metricLabel, { color: '#B45309' }]}>In Progress</Text>
          <Text style={[styles.metricVal, { color: ENUMERATOR_THEME.colors.warning }]}>
            {inProgress}
          </Text>
          <Text style={[styles.metricSub, { color: '#D97706' }]}>Active visits</Text>
        </View>

        <View style={[styles.metricCard, { borderColor: '#E2E8F0', backgroundColor: '#F8FAFC' }]}>
          <Text style={styles.metricLabel}>Pending</Text>
          <Text style={[styles.metricVal, { color: ENUMERATOR_THEME.colors.textSecondary }]}>
            {pending}
          </Text>
          <Text style={styles.metricSub}>Awaiting visit</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
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
    fontSize: 16,
    fontWeight: '800',
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  coverageBadge: {
    alignItems: 'flex-end',
    backgroundColor: ENUMERATOR_THEME.colors.accentSubtle,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: ENUMERATOR_THEME.borderRadius.lg,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.accentLight,
  },
  coverageValue: {
    fontSize: 18,
    fontWeight: '900',
    color: ENUMERATOR_THEME.colors.accent,
  },
  coverageLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.accent,
    textTransform: 'uppercase',
  },
  coverageSubtext: {
    fontSize: 13,
    color: ENUMERATOR_THEME.colors.textSecondary,
    fontWeight: '500',
  },
  boldText: {
    fontWeight: '800',
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  horizontalMetrics: {
    flexDirection: 'row',
    gap: 10,
    paddingVertical: 4,
  },
  metricCard: {
    width: 110,
    padding: 12,
    borderRadius: ENUMERATOR_THEME.borderRadius.lg,
    borderWidth: 1,
    backgroundColor: ENUMERATOR_THEME.colors.background,
    gap: 4,
  },
  metricLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.textMuted,
    textTransform: 'uppercase',
  },
  metricVal: {
    fontSize: 22,
    fontWeight: '900',
  },
  metricSub: {
    fontSize: 10,
    fontWeight: '500',
    color: ENUMERATOR_THEME.colors.textMuted,
  },
});
