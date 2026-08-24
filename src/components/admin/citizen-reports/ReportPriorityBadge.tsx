import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ENUMERATOR_THEME } from '@/src/features/enumeration/theme';
import { ReportPriority } from '@/src/types/admin';
import { priorityLabels } from '@/src/data/citizenReportMockData';

interface ReportPriorityBadgeProps {
  priority: ReportPriority;
}

const PRIORITY_CONFIG: Record<
  ReportPriority,
  { bg: string; color: string }
> = {
  low: { bg: ENUMERATOR_THEME.colors.inactiveLight, color: ENUMERATOR_THEME.colors.inactive },
  medium: { bg: ENUMERATOR_THEME.colors.accentSoft, color: ENUMERATOR_THEME.colors.accent },
  high: { bg: ENUMERATOR_THEME.colors.warningBg, color: ENUMERATOR_THEME.colors.warning },
  critical: { bg: ENUMERATOR_THEME.colors.dangerBg, color: ENUMERATOR_THEME.colors.danger },
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
