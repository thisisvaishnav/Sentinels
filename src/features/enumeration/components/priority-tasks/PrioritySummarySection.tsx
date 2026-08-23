import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ENUMERATOR_THEME } from '../../theme';

interface PrioritySummarySectionProps {
  highPriorityCount: number;
  urgentNeedsCount: number;
  pendingVerificationCount: number;
  missingCount: number;
  overduePendingCount: number;
}

export const PrioritySummarySection: React.FC<PrioritySummarySectionProps> = ({
  highPriorityCount,
  urgentNeedsCount,
  pendingVerificationCount,
  missingCount,
  overduePendingCount,
}) => {
  const cards = [
    {
      id: 'high',
      label: 'High Priority',
      count: highPriorityCount,
      sub: 'Urgent field surveys',
      icon: 'home-alert-outline' as const,
      color: '#EF4444',
      bg: '#FEE2E2',
    },
    {
      id: 'urgent',
      label: 'Urgent Needs',
      count: urgentNeedsCount,
      sub: 'Ration / Health assistance',
      icon: 'medical-bag' as const,
      color: '#F59E0B',
      bg: '#FEF3C7',
    },
    {
      id: 'verification',
      label: 'Verification',
      count: pendingVerificationCount,
      sub: 'Pending GIS check',
      icon: 'map-marker-question-outline' as const,
      color: '#3B82F6',
      bg: '#DBEAFE',
    },
    {
      id: 'missing',
      label: 'Missing Reports',
      count: missingCount,
      sub: 'Locked / Relocated',
      icon: 'file-search-outline' as const,
      color: '#D97706',
      bg: '#FEF3C7',
    },
    {
      id: 'overdue',
      label: 'Pending Visits',
      count: overduePendingCount,
      sub: 'Scheduled attempts',
      icon: 'clock-outline' as const,
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
      {cards.map((c) => (
        <View key={c.id} style={styles.card}>
          <View style={styles.topRow}>
            <View style={[styles.iconWrap, { backgroundColor: c.bg }]}>
              <MaterialCommunityIcons name={c.icon} size={18} color={c.color} />
            </View>
            <Text style={[styles.countText, { color: c.color }]}>{c.count}</Text>
          </View>

          <Text style={styles.label}>{c.label}</Text>
          <Text style={styles.subText}>{c.sub}</Text>
        </View>
      ))}
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
    width: 130,
    backgroundColor: ENUMERATOR_THEME.colors.cardBackground,
    borderRadius: ENUMERATOR_THEME.borderRadius.lg,
    padding: 12,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
    gap: 4,
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
