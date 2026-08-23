import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '@/constants/adminTheme';
import { SurveyStatus } from '@/src/types/admin';

interface SurveyStatusBadgeProps {
  status: SurveyStatus;
}

const STATUS_CONFIG: Record<
  SurveyStatus,
  { label: string; bg: string; color: string; dot: string }
> = {
  completed: { label: 'Completed', bg: COLORS.successSoft, color: COLORS.success, dot: COLORS.success },
  in_progress: { label: 'In Progress', bg: COLORS.accentSoft, color: COLORS.accent, dot: COLORS.accent },
  pending: { label: 'Pending', bg: COLORS.warningSoft, color: COLORS.warning, dot: COLORS.warning },
};

export default function SurveyStatusBadge({ status }: SurveyStatusBadgeProps) {
  const cfg = STATUS_CONFIG[status];

  return (
    <View style={[styles.pill, { backgroundColor: cfg.bg }]}>
      <View style={[styles.dot, { backgroundColor: cfg.dot }]} />
      <Text style={[styles.label, { color: cfg.color }]}>{cfg.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  label: {
    fontSize: 10,
    fontWeight: '600',
  },
});
