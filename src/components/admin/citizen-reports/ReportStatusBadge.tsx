import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ENUMERATOR_THEME } from '@/src/features/enumeration/theme';
import { ReportStatus } from '@/src/types/admin';
import { statusLabels } from '@/src/data/citizenReportMockData';

interface ReportStatusBadgeProps {
  status: ReportStatus;
}

const STATUS_CONFIG: Record<
  ReportStatus,
  { bg: string; color: string; dot: string }
> = {
  pending_verification: { bg: ENUMERATOR_THEME.colors.warningBg, color: ENUMERATOR_THEME.colors.warning, dot: ENUMERATOR_THEME.colors.warning },
  assigned: { bg: ENUMERATOR_THEME.colors.lightBlue, color: ENUMERATOR_THEME.colors.reportBlue, dot: ENUMERATOR_THEME.colors.reportBlue },
  under_investigation: { bg: ENUMERATOR_THEME.colors.accentSoft, color: ENUMERATOR_THEME.colors.accent, dot: ENUMERATOR_THEME.colors.accent },
  verified: { bg: ENUMERATOR_THEME.colors.successBg, color: ENUMERATOR_THEME.colors.success, dot: ENUMERATOR_THEME.colors.success },
  rejected: { bg: ENUMERATOR_THEME.colors.dangerBg, color: ENUMERATOR_THEME.colors.danger, dot: ENUMERATOR_THEME.colors.danger },
  resolved: { bg: ENUMERATOR_THEME.colors.successBg, color: ENUMERATOR_THEME.colors.success, dot: ENUMERATOR_THEME.colors.success },
  closed: { bg: ENUMERATOR_THEME.colors.reportGraySoft, color: ENUMERATOR_THEME.colors.reportGray, dot: ENUMERATOR_THEME.colors.reportGray },
};

export default function ReportStatusBadge({ status }: ReportStatusBadgeProps) {
  const cfg = STATUS_CONFIG[status];

  return (
    <View style={[styles.pill, { backgroundColor: cfg.bg }]}>
      <View style={[styles.dot, { backgroundColor: cfg.dot }]} />
      <Text style={[styles.label, { color: cfg.color }]}>{statusLabels[status]}</Text>
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
