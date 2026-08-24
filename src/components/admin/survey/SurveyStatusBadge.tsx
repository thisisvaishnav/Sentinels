import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ENUMERATOR_THEME } from '@/src/features/enumeration/theme';
import { SurveyStatus } from '@/src/types/admin';

interface SurveyStatusBadgeProps {
  status: SurveyStatus;
}

const STATUS_CONFIG: Record<
  SurveyStatus,
  { label: string; bg: string; color: string; dot: string }
> = {
  completed: { label: 'Completed', bg: ENUMERATOR_THEME.colors.successBg, color: ENUMERATOR_THEME.colors.success, dot: ENUMERATOR_THEME.colors.success },
  in_progress: { label: 'In Progress', bg: ENUMERATOR_THEME.colors.accentSoft, color: ENUMERATOR_THEME.colors.accent, dot: ENUMERATOR_THEME.colors.accent },
  pending: { label: 'Pending', bg: ENUMERATOR_THEME.colors.warningBg, color: ENUMERATOR_THEME.colors.warning, dot: ENUMERATOR_THEME.colors.warning },
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
