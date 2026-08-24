import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ENUMERATOR_THEME } from '@/src/features/enumeration/theme';

interface ZoneProgressProps {
  name: string;
  percentage: number;
  householdCount: number;
}

export default function ZoneProgress({ name, percentage, householdCount }: ZoneProgressProps) {
  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.percentage}>{percentage}%</Text>
      </View>

      <View style={styles.track}>
        <View style={[styles.fill, { width: `${percentage}%` }]} />
      </View>

      <Text style={styles.count}>{householdCount.toLocaleString()} households</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: ENUMERATOR_THEME.colors.cardBackground,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  percentage: {
    fontSize: 14,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.accent,
  },
  track: {
    height: 8,
    borderRadius: 4,
    backgroundColor: ENUMERATOR_THEME.colors.subtleBackground,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 4,
    backgroundColor: ENUMERATOR_THEME.colors.accent,
  },
  count: {
    fontSize: 12,
    color: ENUMERATOR_THEME.colors.textMuted,
    marginTop: 6,
  },
});
