import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ENUMERATOR_THEME } from '../../theme';
import { ZoneAreaItem } from '../../types';

interface Props {
  areas: ZoneAreaItem[];
}

export function PriorityAreaAlertCard({ areas }: Props) {
  if (!areas || areas.length === 0) return null;

  // Find lowest coverage area
  const lowestArea = [...areas].reduce((lowest, current) => {
    const lowestCov = lowest.totalHouseholds > 0 ? (lowest.completedHouseholds / lowest.totalHouseholds) * 100 : 0;
    const currentCov = current.totalHouseholds > 0 ? (current.completedHouseholds / current.totalHouseholds) * 100 : 0;
    return currentCov < lowestCov ? current : lowest;
  }, areas[0]);

  const coveragePercent = lowestArea.totalHouseholds > 0
    ? Math.round((lowestArea.completedHouseholds / lowestArea.totalHouseholds) * 100)
    : 0;
  const unvisitedCount = Math.max(0, lowestArea.totalHouseholds - lowestArea.completedHouseholds);

  if (coveragePercent >= 70) {
    // High coverage across all areas - no urgent alert needed
    return null;
  }

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Ionicons name="warning" size={20} color="#D97706" />
        <Text style={styles.alertTitle}>Coverage Needs Attention</Text>
      </View>

      <Text style={styles.alertBody}>
        <Text style={styles.areaHighlight}>{lowestArea.name}</Text> is currently at{' '}
        <Text style={styles.areaHighlight}>{coveragePercent}%</Text> coverage.{' '}
        <Text style={styles.countHighlight}>{unvisitedCount} households</Text> remain unvisited in this section.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFBEB',
    borderRadius: ENUMERATOR_THEME.borderRadius.xl,
    padding: 14,
    borderWidth: 1,
    borderColor: '#FCD34D',
    gap: 8,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  alertTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#92400E',
  },
  alertBody: {
    fontSize: 12,
    color: '#B45309',
    lineHeight: 17,
  },
  areaHighlight: {
    fontWeight: '800',
    color: '#78350F',
  },
  countHighlight: {
    fontWeight: '800',
    color: '#DC2626',
  },
});
