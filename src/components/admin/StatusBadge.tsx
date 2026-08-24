import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { ENUMERATOR_THEME } from '@/src/features/enumeration/theme';
import { EnumeratorStatus } from '@/src/types/admin';

interface StatusBadgeProps {
  status: EnumeratorStatus;
}

const STATUS_CONFIG: Record<
  EnumeratorStatus,
  { label: string; bg: string; color: string }
> = {
  active: { label: 'Active', bg: ENUMERATOR_THEME.colors.activeBg, color: ENUMERATOR_THEME.colors.primary },
  offDuty: { label: 'Off Duty', bg: ENUMERATOR_THEME.colors.offDutyBg, color: ENUMERATOR_THEME.colors.offDuty },
  issueReported: {
    label: 'Issue\nReported',
    bg: ENUMERATOR_THEME.colors.issueReportedBg,
    color: ENUMERATOR_THEME.colors.issueReported,
  },
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const cfg = STATUS_CONFIG[status];

  return (
    <Text
      style={[
        styles.pill,
        { backgroundColor: cfg.bg, color: cfg.color },
        status === 'issueReported' && styles.issueWidth,
      ]}
      numberOfLines={2}
    >
      {cfg.label}
    </Text>
  );
}

const styles = StyleSheet.create({
  pill: {
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 10,
    lineHeight: 13,
  },
  issueWidth: {
    minWidth: 78,
  },
});
