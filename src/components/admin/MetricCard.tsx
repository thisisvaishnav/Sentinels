import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '@/constants/adminTheme';

interface MetricCardProps {
  label: string;
  value: string;
  accentColor?: string;
}

export default function MetricCard({ label, value, accentColor = COLORS.accent }: MetricCardProps) {
  return (
    <View style={styles.card}>
      <View style={[styles.accentLine, { backgroundColor: accentColor }]} />
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    minWidth: '45%',
  },
  accentLine: {
    position: 'absolute',
    left: 0,
    top: 10,
    bottom: 10,
    width: 3,
    borderRadius: 2,
  },
  value: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.textSecondary,
  },
});
