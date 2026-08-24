import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '@/constants/adminTheme';

interface TodaysProgressProps {
  assigned: number;
  completed: number;
  remaining: number;
}

export default function TodaysProgress({ assigned, completed, remaining }: TodaysProgressProps) {
  const total = assigned + remaining;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>Today&apos;s Progress</Text>
        <Text style={styles.coverage}>{percentage}% Covered</Text>
      </View>

      <View style={styles.track}>
        <View style={[styles.fill, { width: `${percentage}%` }]} />
      </View>

      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>ASSIGNED</Text>
          <Text style={styles.statValue}>{assigned}</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>COMPLETED</Text>
          <Text style={[styles.statValue, styles.statCompleted]}>{completed}</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>REMAINING</Text>
          <Text style={[styles.statValue, styles.statRemaining]}>{remaining}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  coverage: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.success,
  },
  track: {
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.surfaceAlt,
    overflow: 'hidden',
    marginBottom: 18,
  },
  fill: {
    height: '100%',
    borderRadius: 4,
    backgroundColor: COLORS.accent,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  stat: {
    alignItems: 'center',
    gap: 4,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textMuted,
    letterSpacing: 0.5,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  statCompleted: {
    color: COLORS.success,
  },
  statRemaining: {
    color: COLORS.danger,
  },
});
