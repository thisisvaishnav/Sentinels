import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ENUMERATOR_THEME } from '../../theme';
import { AnomalyFilterCategory, AnomalySummaryMetrics } from '../../types/anomalyTypes';

interface AnomalySummaryCardsProps {
  metrics: AnomalySummaryMetrics;
  selectedCategory: AnomalyFilterCategory;
  onSelectCategory: (category: AnomalyFilterCategory) => void;
}

export const AnomalySummaryCards: React.FC<AnomalySummaryCardsProps> = ({
  metrics,
  selectedCategory,
  onSelectCategory,
}) => {
  const cards = [
    {
      id: 'total',
      category: 'All' as AnomalyFilterCategory,
      label: 'Total Anomalies',
      count: metrics.totalAnomalies,
      sub: `${metrics.needsReviewCount} unreviewed`,
      icon: 'shield-alert-outline' as const,
      color: '#0284C7',
      bg: '#F0F9FF',
    },
    {
      id: 'critical',
      category: 'Critical' as AnomalyFilterCategory,
      label: 'Critical',
      count: metrics.criticalCount,
      sub: 'Immediate action',
      icon: 'alert-octagon-outline' as const,
      color: '#EF4444',
      bg: '#FEF2F2',
    },
    {
      id: 'high',
      category: 'High' as AnomalyFilterCategory,
      label: 'High Severity',
      count: metrics.highCount,
      sub: 'Priority review',
      icon: 'alert-circle-outline' as const,
      color: '#D97706',
      bg: '#FEF3C7',
    },
    {
      id: 'affected',
      category: 'All' as AnomalyFilterCategory,
      label: 'Affected Records',
      count: metrics.affectedHouseholdsCount,
      sub: 'Unique households',
      icon: 'home-alert-outline' as const,
      color: '#8B5CF6',
      bg: '#F3E8FF',
    },
  ];

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContainer}
    >
      {cards.map((c) => {
        const isSelected = selectedCategory === c.category && c.category !== 'All';
        return (
          <TouchableOpacity
            key={c.id}
            style={[styles.card, isSelected && styles.activeCard]}
            onPress={() => onSelectCategory(c.category)}
            activeOpacity={0.8}
          >
            <View style={styles.topRow}>
              <View style={[styles.iconWrap, { backgroundColor: c.bg }]}>
                <MaterialCommunityIcons name={c.icon} size={18} color={c.color} />
              </View>
              <Text style={[styles.countText, { color: c.color }]}>{c.count}</Text>
            </View>

            <Text style={styles.label}>{c.label}</Text>
            <Text style={styles.subText}>{c.sub}</Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    paddingHorizontal: 16,
    gap: 10,
    paddingVertical: 2,
  },
  card: {
    width: 135,
    backgroundColor: ENUMERATOR_THEME.colors.cardBackground,
    borderRadius: ENUMERATOR_THEME.borderRadius.lg,
    padding: 12,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
    gap: 4,
  },
  activeCard: {
    borderColor: ENUMERATOR_THEME.colors.accent,
    backgroundColor: ENUMERATOR_THEME.colors.accentSubtle,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  iconWrap: {
    width: 30,
    height: 30,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countText: {
    fontSize: 18,
    fontWeight: '900',
  },
  label: {
    fontSize: 12,
    fontWeight: '800',
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  subText: {
    fontSize: 10,
    color: ENUMERATOR_THEME.colors.textMuted,
    fontWeight: '500',
  },
});
