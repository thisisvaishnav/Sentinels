import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ENUMERATOR_THEME } from '../../theme';

interface ProfileStatsCardProps {
  totalAssigned: number;
  completed: number;
  inProgress: number;
  pending: number;
  coveragePercentage: number;
}

export const ProfileStatsCard: React.FC<ProfileStatsCardProps> = ({
  totalAssigned,
  completed,
  inProgress,
  pending,
  coveragePercentage,
}) => {
  const metrics = [
    {
      label: 'Assigned',
      value: totalAssigned,
      suffix: '',
      color: ENUMERATOR_THEME.colors.textPrimary,
      bg: ENUMERATOR_THEME.colors.subtleBackground,
      icon: 'home-city-outline',
    },
    {
      label: 'Completed',
      value: completed,
      suffix: '',
      color: ENUMERATOR_THEME.colors.success,
      bg: '#ECFDF5',
      icon: 'check-circle-outline',
    },
    {
      label: 'In Progress',
      value: inProgress,
      suffix: '',
      color: ENUMERATOR_THEME.colors.warning,
      bg: '#FFFBEB',
      icon: 'progress-clock',
    },
    {
      label: 'Pending',
      value: pending,
      suffix: '',
      color: ENUMERATOR_THEME.colors.danger,
      bg: '#FEF2F2',
      icon: 'clock-outline',
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
        <Text style={styles.cardTitle}>Assignment Summary</Text>
        <Text style={styles.subtitle}>Derived from household store</Text>
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
                {item.suffix}
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
