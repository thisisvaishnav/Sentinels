import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { TodayProgress } from '../types';
import { ENUMERATOR_THEME } from '../theme';

interface ProgressSectionProps {
  progress: TodayProgress;
  onPressDetails?: () => void;
}

export const ProgressSection: React.FC<ProgressSectionProps> = ({ progress, onPressDetails }) => {
  const router = useRouter();

  const handlePress = () => {
    if (onPressDetails) {
      onPressDetails();
    } else {
      router.push('/(enumerator)/daily-progress');
    }
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handlePress}
      activeOpacity={0.8}
      accessibilityLabel="View Daily Progress Details"
    >
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>Today{"'"}s Progress</Text>
        <View style={styles.badgeRow}>
          <Text style={styles.percentBadge}>{progress.coveragePercentage}% Covered</Text>
          <Ionicons name="chevron-forward" size={16} color={ENUMERATOR_THEME.colors.accent} />
        </View>
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
    </TouchableOpacity>
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
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
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
