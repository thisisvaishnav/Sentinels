import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ENUMERATOR_THEME } from '../../theme';

interface Props {
  totalAssigned: number;
  pendingCount: number;
  inProgressCount: number;
  completedCount: number;
}

export function SurveyLandingHeader({
  totalAssigned,
  pendingCount,
  inProgressCount,
  completedCount,
}: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View style={styles.titleWrap}>
          <MaterialCommunityIcons name="clipboard-check-outline" size={22} color={ENUMERATOR_THEME.colors.accent} />
          <Text style={styles.headerTitle}>Assigned Field Surveys</Text>
        </View>
        <View style={styles.totalBadge}>
          <Text style={styles.totalBadgeText}>{totalAssigned} Total</Text>
        </View>
      </View>

      <View style={styles.statsGrid}>
        {/* Pending */}
        <View style={styles.statCard}>
          <Text style={[styles.statCount, styles.textPending]}>{pendingCount}</Text>
          <Text style={styles.statLabel}>Pending</Text>
        </View>

        {/* In Progress */}
        <View style={styles.statCard}>
          <Text style={[styles.statCount, styles.textInProgress]}>{inProgressCount}</Text>
          <Text style={styles.statLabel}>In Progress</Text>
        </View>

        {/* Completed */}
        <View style={styles.statCard}>
          <Text style={[styles.statCount, styles.textCompleted]}>{completedCount}</Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: ENUMERATOR_THEME.colors.cardBackground,
    borderRadius: ENUMERATOR_THEME.borderRadius.xl,
    padding: 16,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
    gap: 14,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  totalBadge: {
    backgroundColor: ENUMERATOR_THEME.colors.accentSubtle,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: ENUMERATOR_THEME.borderRadius.full,
  },
  totalBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: ENUMERATOR_THEME.colors.accent,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  statCard: {
    flex: 1,
    backgroundColor: ENUMERATOR_THEME.colors.subtleBackground,
    borderRadius: ENUMERATOR_THEME.borderRadius.md,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
    gap: 2,
  },
  statCount: {
    fontSize: 18,
    fontWeight: '800',
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: ENUMERATOR_THEME.colors.textSecondary,
  },
  textPending: {
    color: '#D97706',
  },
  textInProgress: {
    color: ENUMERATOR_THEME.colors.accent,
  },
  textCompleted: {
    color: ENUMERATOR_THEME.colors.success,
  },
});
