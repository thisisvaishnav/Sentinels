import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ENUMERATOR_THEME } from '@/src/features/enumeration/theme';

interface ReportStatCardProps {
  label: string;
  value: number;
  accentColor: string;
}

export default function ReportStatCard({ label, value, accentColor }: ReportStatCardProps) {
  return (
    <View style={styles.card}>
      <View style={[styles.accentBar, { backgroundColor: accentColor }]} />
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: ENUMERATOR_THEME.colors.cardBackground,
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
    overflow: 'hidden',
  },
  accentBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
  },
  value: {
    fontSize: 22,
    fontWeight: '800',
    color: ENUMERATOR_THEME.colors.textPrimary,
    marginTop: 4,
  },
  label: {
    fontSize: 11,
    fontWeight: '500',
    color: ENUMERATOR_THEME.colors.textSecondary,
    marginTop: 2,
  },
});
