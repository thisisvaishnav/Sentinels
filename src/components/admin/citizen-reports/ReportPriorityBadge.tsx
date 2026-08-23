import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '@/constants/adminTheme';
import { ReportPriority } from '@/src/types/admin';
import { priorityLabels } from '@/src/data/citizenReportMockData';

interface ReportPriorityBadgeProps {
  priority: ReportPriority;
}

const PRIORITY_CONFIG: Record<
  ReportPriority,
  { bg: string; color: string }
> = {
  low: { bg: COLORS.inactiveLight, color: COLORS.inactive },
  medium: { bg: COLORS.accentSoft, color: COLORS.accent },
  high: { bg: COLORS.warningSoft, color: COLORS.warning },
  critical: { bg: COLORS.dangerSoft, color: COLORS.danger },
};

export default function ReportPriorityBadge({ priority }: ReportPriorityBadgeProps) {
  const cfg = PRIORITY_CONFIG[priority];

  return (
    <View style={[styles.pill, { backgroundColor: cfg.bg }]}>
      <Text style={[styles.label, { color: cfg.color }]}>{priorityLabels[priority]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  label: {
    fontSize: 9,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
});
