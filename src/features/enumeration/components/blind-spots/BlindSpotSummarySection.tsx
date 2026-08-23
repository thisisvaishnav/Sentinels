import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BlindSpotItem } from '../../data/blindSpotAdapter';
import { ENUMERATOR_THEME } from '../../theme';

interface BlindSpotSummarySectionProps {
  items: BlindSpotItem[];
}

export const BlindSpotSummarySection: React.FC<BlindSpotSummarySectionProps> = ({ items }) => {
  const totalAreas = items.length;
  const highRiskCount = items.filter(
    (item) => item.severity === 'critical' || item.severity === 'high'
  ).length;
  const totalRemaining = items.reduce((sum, item) => sum + item.remainingHouseholds, 0);
  const lowestCoverage = items.length > 0 ? Math.min(...items.map((i) => i.coveragePercent)) : 0;

  const cards = [
    {
      label: 'Blind Spot Areas',
      value: totalAreas,
      suffix: '',
      color: ENUMERATOR_THEME.colors.textPrimary,
      bg: ENUMERATOR_THEME.colors.subtleBackground,
      icon: 'radar',
    },
    {
      label: 'High Risk Areas',
      value: highRiskCount,
      suffix: '',
      color: ENUMERATOR_THEME.colors.danger,
      bg: '#FEF2F2',
      icon: 'alert-triangle-outline',
    },
    {
      label: 'Remaining HHs',
      value: totalRemaining,
      suffix: '',
      color: ENUMERATOR_THEME.colors.warning,
      bg: '#FFFBEB',
      icon: 'home-alert-outline',
    },
    {
      label: 'Lowest Coverage',
      value: lowestCoverage,
      suffix: '%',
      color: ENUMERATOR_THEME.colors.accent,
      bg: ENUMERATOR_THEME.colors.accentSubtle,
      icon: 'chart-arc',
    },
  ];

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      {cards.map((c, i) => (
        <View key={i} style={[styles.card, { backgroundColor: c.bg }]}>
          <View style={styles.topRow}>
            <MaterialCommunityIcons name={c.icon as any} size={18} color={c.color} />
            <Text style={[styles.value, { color: c.color }]}>
              {c.value}
              {c.suffix}
            </Text>
          </View>
          <Text style={styles.label}>{c.label}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 16,
    gap: 10,
    paddingVertical: 2,
  },
  card: {
    width: 125,
    borderRadius: ENUMERATOR_THEME.borderRadius.lg,
    padding: 12,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
    gap: 6,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  value: {
    fontSize: 18,
    fontWeight: '900',
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    color: ENUMERATOR_THEME.colors.textSecondary,
  },
});
