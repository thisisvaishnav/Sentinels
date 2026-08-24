import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ENUMERATOR_THEME } from '../../theme';
import { ActiveRoutePlan } from '../../types/routeTypes';

interface RouteSummaryCardProps {
  routePlan: ActiveRoutePlan;
}

export const RouteSummaryCard: React.FC<RouteSummaryCardProps> = ({ routePlan }) => {
  const {
    totalStopsCount,
    completedStopsCount,
    remainingStopsCount,
    estimatedTotalDistanceKm,
    highPriorityCount,
    pendingCount,
  } = routePlan;

  const progressPercentage =
    totalStopsCount > 0 ? Math.round((completedStopsCount / totalStopsCount) * 100) : 0;

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.titleWrap}>
          <MaterialCommunityIcons
            name="routes-clock"
            size={20}
            color={ENUMERATOR_THEME.colors.accent}
          />
          <Text style={styles.cardTitle}>Route Summary</Text>
        </View>

        <View style={styles.badgeWrap}>
          <Text style={styles.badgeVal}>{progressPercentage}%</Text>
          <Text style={styles.badgeSub}>Visited</Text>
        </View>
      </View>

      <Text style={styles.progressSubtext}>
        <Text style={styles.boldText}>{completedStopsCount}</Text> of {totalStopsCount} stops visited ·{' '}
        <Text style={styles.boldText}>{remainingStopsCount}</Text> remaining
      </Text>

      {/* Progress Track */}
      <View style={styles.track}>
        <View
          style={[
            styles.fill,
            {
              width: `${Math.min(100, Math.max(0, progressPercentage))}%`,
              backgroundColor:
                completedStopsCount === totalStopsCount && totalStopsCount > 0
                  ? ENUMERATOR_THEME.colors.success
                  : ENUMERATOR_THEME.colors.accent,
            },
          ]}
        />
      </View>

      {/* Horizontally scrollable metrics cards row */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalMetrics}
      >
        <View style={[styles.metricTile, { borderColor: ENUMERATOR_THEME.colors.accentLight }]}>
          <Text style={styles.tileLabel}>Total Stops</Text>
          <Text style={[styles.tileVal, { color: ENUMERATOR_THEME.colors.textPrimary }]}>
            {totalStopsCount}
          </Text>
          <Text style={styles.tileSub}>Household visits</Text>
        </View>

        <View style={[styles.metricTile, { borderColor: '#93C5FD', backgroundColor: '#EFF6FF' }]}>
          <Text style={[styles.tileLabel, { color: '#1E40AF' }]}>Est. Distance</Text>
          <Text style={[styles.tileVal, { color: '#2563EB' }]}>
            {estimatedTotalDistanceKm} <Text style={styles.unitText}>km</Text>
          </Text>
          <Text style={[styles.tileSub, { color: '#3B82F6' }]}>Straight-line est.</Text>
        </View>

        <View style={[styles.metricTile, { borderColor: '#FECACA', backgroundColor: '#FEF2F2' }]}>
          <Text style={[styles.tileLabel, { color: '#B91C1C' }]}>High Priority</Text>
          <Text style={[styles.tileVal, { color: ENUMERATOR_THEME.colors.danger }]}>
            {highPriorityCount}
          </Text>
          <Text style={[styles.tileSub, { color: '#EF4444' }]}>Urgent visits</Text>
        </View>

        <View style={[styles.metricTile, { borderColor: '#FDE68A', backgroundColor: '#FFFBEB' }]}>
          <Text style={[styles.tileLabel, { color: '#B45309' }]}>Pending</Text>
          <Text style={[styles.tileVal, { color: ENUMERATOR_THEME.colors.warning }]}>
            {pendingCount}
          </Text>
          <Text style={[styles.tileSub, { color: '#D97706' }]}>Not started</Text>
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
  badgeWrap: {
    alignItems: 'flex-end',
    backgroundColor: ENUMERATOR_THEME.colors.accentSubtle,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: ENUMERATOR_THEME.borderRadius.lg,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.accentLight,
  },
  badgeVal: {
    fontSize: 18,
    fontWeight: '900',
    color: ENUMERATOR_THEME.colors.accent,
  },
  badgeSub: {
    fontSize: 9,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.accent,
    textTransform: 'uppercase',
  },
  progressSubtext: {
    fontSize: 13,
    color: ENUMERATOR_THEME.colors.textSecondary,
    fontWeight: '500',
  },
  boldText: {
    fontWeight: '800',
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  track: {
    height: 8,
    backgroundColor: ENUMERATOR_THEME.colors.subtleBackground,
    borderRadius: 4,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 4,
  },
  horizontalMetrics: {
    flexDirection: 'row',
    gap: 10,
    paddingVertical: 4,
  },
  metricTile: {
    width: 115,
    padding: 12,
    borderRadius: ENUMERATOR_THEME.borderRadius.lg,
    borderWidth: 1,
    backgroundColor: ENUMERATOR_THEME.colors.background,
    gap: 4,
  },
  tileLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.textMuted,
    textTransform: 'uppercase',
  },
  tileVal: {
    fontSize: 20,
    fontWeight: '900',
  },
  unitText: {
    fontSize: 12,
    fontWeight: '600',
  },
  tileSub: {
    fontSize: 10,
    fontWeight: '500',
    color: ENUMERATOR_THEME.colors.textMuted,
  },
});
