import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '@/constants/adminTheme';
import { ReportStatus } from '@/src/types/admin';
import { statusLabels } from '@/src/data/citizenReportMockData';

interface ReportStatusBadgeProps {
  status: ReportStatus;
}

const STATUS_CONFIG: Record<
  ReportStatus,
  { bg: string; color: string; dot: string }
> = {
  pending_verification: { bg: COLORS.warningSoft, color: COLORS.warning, dot: COLORS.warning },
  assigned: { bg: COLORS.lightBlue, color: COLORS.reportBlue, dot: COLORS.reportBlue },
  under_investigation: { bg: COLORS.accentSoft, color: COLORS.accent, dot: COLORS.accent },
  verified: { bg: COLORS.successSoft, color: COLORS.success, dot: COLORS.success },
  rejected: { bg: COLORS.dangerSoft, color: COLORS.danger, dot: COLORS.danger },
  resolved: { bg: COLORS.successSoft, color: COLORS.success, dot: COLORS.success },
  closed: { bg: COLORS.reportGraySoft, color: COLORS.reportGray, dot: COLORS.reportGray },
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
