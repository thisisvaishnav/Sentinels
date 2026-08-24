import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { TodayProgress } from '../types';
import { ENUMERATOR_THEME, Theme } from '../theme';

interface ProgressSectionProps {
  progress: TodayProgress;
  theme?: Theme;
  onPressDetails?: () => void;
}

export const ProgressSection: React.FC<ProgressSectionProps> = ({
  progress,
  theme = ENUMERATOR_THEME,
  onPressDetails,
}) => {
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
      style={[styles.container, { backgroundColor: theme.colors.cardBackground, borderColor: theme.colors.border }]}
      onPress={handlePress}
      activeOpacity={0.8}
      accessibilityLabel="View Daily Progress Details"
    >
      <View style={styles.headerRow}>
        <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>Today{"'"}s Progress</Text>
        <View style={styles.badgeRow}>
          <Text style={[styles.percentBadge, { color: theme.colors.accent }]}>{progress.coveragePercentage}% Covered</Text>
          <Ionicons name="chevron-forward" size={16} color={theme.colors.accent} />
        </View>
      </View>

      {/* Progress Bar */}
      <View style={[styles.track, { backgroundColor: theme.colors.subtleBackground }]}>
        <View style={[styles.fill, { width: `${progress.coveragePercentage}%`, backgroundColor: theme.colors.accent }]} />
      </View>

      {/* Metrics Row */}
      <View style={styles.metricsRow}>
        <View style={styles.metricItem}>
          <Text style={[styles.metricLabel, { color: theme.colors.textMuted }]}>Assigned</Text>
          <Text style={[styles.metricValue, { color: theme.colors.textPrimary }]}>{progress.totalAssigned}</Text>
        </View>

        <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />

        <View style={styles.metricItem}>
          <Text style={[styles.metricLabel, { color: theme.colors.textMuted }]}>Completed</Text>
          <Text style={[styles.metricValue, { color: theme.colors.success }]}>{progress.completed}</Text>
        </View>

        <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />

        <View style={styles.metricItem}>
          <Text style={[styles.metricLabel, { color: theme.colors.textMuted }]}>Remaining</Text>
          <Text style={[styles.metricValue, { color: theme.colors.danger }]}>{progress.remaining}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 18,
    gap: 14,
    borderWidth: 1,
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
  },
  percentBadge: {
    fontSize: 13,
    fontWeight: '700',
  },
  track: {
    height: 10,
    borderRadius: 5,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
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
    fontWeight: '500',
    textTransform: 'uppercase',
  },
  metricValue: {
    fontSize: 20,
    fontWeight: '800',
  },
  divider: {
    width: 1,
    height: 28,
  },
});
