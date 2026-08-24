import React from 'react';
import { View, StyleSheet } from 'react-native';
import ReportStatCard from './ReportStatCard';
import { ENUMERATOR_THEME } from '@/src/features/enumeration/theme';

interface ReportStatsProps {
  total: number;
  pendingVerification: number;
  underInvestigation: number;
  resolved: number;
}

export default function ReportStats({
  total,
  pendingVerification,
  underInvestigation,
  resolved,
}: ReportStatsProps) {
  return (
    <View>
      <View style={styles.row}>
        <ReportStatCard label="Total Reports" value={total} accentColor={ENUMERATOR_THEME.colors.primary} />
        <ReportStatCard
          label="Pending Verification"
          value={pendingVerification}
          accentColor={ENUMERATOR_THEME.colors.warning}
        />
      </View>
      <View style={styles.row}>
        <ReportStatCard
          label="Under Investigation"
          value={underInvestigation}
          accentColor={ENUMERATOR_THEME.colors.info}
        />
        <ReportStatCard label="Resolved" value={resolved} accentColor={ENUMERATOR_THEME.colors.success} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
});
