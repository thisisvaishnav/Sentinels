import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ENUMERATOR_THEME } from '../../theme';
import { VerificationFilterCategory, VerificationSummaryMetrics } from '../../types/verificationTypes';

interface VerificationSummaryProps {
  metrics: VerificationSummaryMetrics;
  selectedCategory: VerificationFilterCategory;
  onSelectCategory: (cat: VerificationFilterCategory) => void;
}

export const VerificationSummary: React.FC<VerificationSummaryProps> = ({
  metrics,
  selectedCategory,
  onSelectCategory,
}) => {
  const cards = [
    {
      id: 'pending',
      category: 'Pending' as VerificationFilterCategory,
      label: 'Pending',
      count: metrics.pendingCount,
      sub: 'Awaiting field check',
      icon: 'clock-outline' as const,
      color: '#0284C7',
      bg: '#F0F9FF',
    },
    {
      id: 'high',
      category: 'High Priority' as VerificationFilterCategory,
      label: 'High Priority',
      count: metrics.highPriorityCount,
      sub: 'Urgent verification',
      icon: 'alert-circle-outline' as const,
      color: '#EF4444',
      bg: '#FEF2F2',
    },
    {
      id: 'verified',
      category: 'Verified' as VerificationFilterCategory,
      label: 'Verified Today',
      count: metrics.verifiedTodayCount,
      sub: 'Passed field check',
      icon: 'check-decagram-outline' as const,
      color: '#059669',
      bg: '#ECFDF5',
    },
    {
      id: 'review',
      category: 'Anomaly' as VerificationFilterCategory,
      label: 'Needs Review',
      count: metrics.needsReviewCount,
      sub: 'Flagged for audit',
      icon: 'shield-alert-outline' as const,
      color: '#D97706',
      bg: '#FEF3C7',
    },
  ];

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContainer}
    >
      {cards.map((c) => {
        const isSelected = selectedCategory === c.category;
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
