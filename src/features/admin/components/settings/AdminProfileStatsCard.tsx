import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ENUMERATOR_THEME } from '@/src/features/enumeration/theme';

interface AdminProfileStatsCardProps {
  totalEnumerators: number;
  activeSurveys: number;
  pendingReports: number;
  completedTasks: number;
  coveragePercentage: number;
}

export const AdminProfileStatsCard: React.FC<AdminProfileStatsCardProps> = ({
  totalEnumerators,
  activeSurveys,
  pendingReports,
  completedTasks,
  coveragePercentage,
}) => {
  const metrics = [
    {
      label: 'Enumerators',
      value: totalEnumerators,
      color: ENUMERATOR_THEME.colors.textPrimary,
      bg: ENUMERATOR_THEME.colors.subtleBackground,
      icon: 'account-group-outline',
    },
    {
      label: 'Active Surveys',
      value: activeSurveys,
      color: ENUMERATOR_THEME.colors.accent,
      bg: ENUMERATOR_THEME.colors.accentSubtle,
      icon: 'clipboard-text-outline',
    },
    {
      label: 'Pending Reports',
      value: pendingReports,
      color: ENUMERATOR_THEME.colors.warning,
      bg: '#FFFBEB',
      icon: 'bullhorn-outline',
    },
    {
      label: 'Completed',
      value: completedTasks,
      color: ENUMERATOR_THEME.colors.success,
      bg: '#ECFDF5',
      icon: 'check-circle-outline',
    },
    {
      label: 'Coverage',
      value: coveragePercentage,
      suffix: '%',
      color: ENUMERATOR_THEME.colors.accent,
      bg: ENUMERATOR_THEME.colors.accentSubtle,
      icon: 'chart-pie',
    },
  ];

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <MaterialCommunityIcons name="chart-box-outline" size={20} color={ENUMERATOR_THEME.colors.accent} />
        <Text style={styles.cardTitle}>Operations Summary</Text>
        <Text style={styles.subtitle}>All Zones</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {metrics.map((item, index) => (
          <View key={index} style={[styles.statBox, { backgroundColor: item.bg }]}>
            <View style={styles.statTop}>
              <MaterialCommunityIcons name={item.icon as any} size={18} color={item.color} />
              <Text style={[styles.statValue, { color: item.color }]}>
                {item.value}
                {'suffix' in item ? item.suffix : ''}
              </Text>
            </View>
            <Text style={styles.statLabel}>{item.label}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: ENUMERATOR_THEME.colors.cardBackground,
    borderRadius: ENUMERATOR_THEME.borderRadius.xl,
    padding: 16,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
    gap: 14,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.textPrimary,
    flex: 1,
  },
  subtitle: {
    fontSize: 11,
    color: ENUMERATOR_THEME.colors.textMuted,
  },
  scrollContent: {
    flexDirection: 'row',
    gap: 10,
    paddingRight: 8,
  },
  statBox: {
    width: 115,
    borderRadius: ENUMERATOR_THEME.borderRadius.lg,
    padding: 12,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
    gap: 6,
  },
  statTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '800',
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: ENUMERATOR_THEME.colors.textSecondary,
  },
});
