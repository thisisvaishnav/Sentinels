import React from 'react';
import { View, StyleSheet } from 'react-native';
import ReportStatCard from './ReportStatCard';
import { COLORS } from '@/constants/adminTheme';

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
        <ReportStatCard label="Total Reports" value={total} accentColor={COLORS.primary} />
        <ReportStatCard
          label="Pending Verification"
          value={pendingVerification}
          accentColor={COLORS.warning}
        />
      </View>
      <View style={styles.row}>
        <ReportStatCard
          label="Under Investigation"
          value={underInvestigation}
          accentColor={COLORS.info}
        />
        <ReportStatCard label="Resolved" value={resolved} accentColor={COLORS.success} />
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
