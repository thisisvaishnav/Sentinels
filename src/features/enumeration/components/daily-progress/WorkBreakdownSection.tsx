import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { WorkBreakdownMetrics } from '../../types';
import { ENUMERATOR_THEME } from '../../theme';

interface WorkBreakdownSectionProps {
  metrics: WorkBreakdownMetrics;
}

export const WorkBreakdownSection: React.FC<WorkBreakdownSectionProps> = ({ metrics }) => {
  const router = useRouter();

  const items = [
    {
      id: 'registered',
      label: 'Households Registered',
      count: metrics.householdsRegistered,
      icon: 'home-plus-outline' as const,
      color: '#10B981',
      bg: '#ECFDF5',
      route: '/(enumerator)/register-household',
    },
    {
      id: 'started',
      label: 'Surveys Started',
      count: metrics.surveysStarted,
      icon: 'clipboard-edit-outline' as const,
      color: '#3B82F6',
      bg: '#EFF6FF',
      route: '/(enumerator)/start-survey',
    },
    {
      id: 'completed',
      label: 'Surveys Completed',
      count: metrics.surveysCompleted,
      icon: 'clipboard-check-outline' as const,
      color: '#059669',
      bg: '#D1FAE5',
      route: '/(enumerator)/start-survey',
    },
    {
      id: 'verification',
      label: 'Verifications Completed',
      count: metrics.verificationsCompleted,
      icon: 'shield-check-outline' as const,
      color: '#6366F1',
      bg: '#EEF2FF',
      route: '/(enumerator)/verification',
    },
    {
      id: 'missing',
      label: 'Missing Reports',
      count: metrics.missingReports,
      icon: 'alert-decagram-outline' as const,
      color: '#F59E0B',
      bg: '#FFFBEB',
      route: '/(enumerator)/report-missing',
    },
    {
      id: 'anomalies',
      label: 'Anomalies Reviewed',
      count: metrics.anomaliesReviewed,
      icon: 'alert-octagon-outline' as const,
      color: '#EC4899',
      bg: '#FDF2F8',
      route: '/(enumerator)/anomalies',
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.titleWrap}>
          <MaterialCommunityIcons
            name="format-list-checks"
            size={20}
            color={ENUMERATOR_THEME.colors.accent}
          />
          <Text style={styles.cardTitle}>Daily Work Breakdown</Text>
        </View>
        <Text style={styles.subHint}>Today{"'"}s Action Metrics</Text>
      </View>

      <View style={styles.grid}>
        {items.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[styles.tile, { backgroundColor: item.bg }]}
            onPress={() => router.push(item.route as any)}
            activeOpacity={0.75}
            accessibilityLabel={`${item.label}: ${item.count}. Tap to view`}
          >
            <View style={styles.tileHeader}>
              <View style={[styles.iconCircle, { backgroundColor: item.color }]}>
                <MaterialCommunityIcons name={item.icon} size={18} color="#FFFFFF" />
              </View>
              <Text style={[styles.tileCount, { color: item.color }]}>{item.count}</Text>
            </View>

            <View style={styles.tileFooter}>
              <Text style={styles.tileLabel} numberOfLines={2}>
                {item.label}
              </Text>
              <Ionicons name="chevron-forward" size={14} color={ENUMERATOR_THEME.colors.textMuted} />
            </View>
          </TouchableOpacity>
        ))}
      </View>
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
  subHint: {
    fontSize: 11,
    fontWeight: '600',
    color: ENUMERATOR_THEME.colors.textMuted,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  tile: {
    width: '48%',
    padding: 12,
    borderRadius: ENUMERATOR_THEME.borderRadius.lg,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
    justifyContent: 'space-between',
    minHeight: 90,
    gap: 8,
  },
  tileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tileCount: {
    fontSize: 22,
    fontWeight: '900',
  },
  tileFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tileLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.textPrimary,
    flex: 1,
  },
});
