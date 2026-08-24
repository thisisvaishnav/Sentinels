import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ENUMERATOR_THEME } from '@/src/features/enumeration/theme';
import { SurveyStatus } from '@/src/types/admin';

interface SurveyStatCardProps {
  label: string;
  value: number;
  status: SurveyStatus;
}

const STATUS_COLORS: Record<SurveyStatus, string> = {
  completed: ENUMERATOR_THEME.colors.success,
  in_progress: ENUMERATOR_THEME.colors.accent,
  pending: ENUMERATOR_THEME.colors.warning,
};

export default function SurveyStatCard({ label, value, status }: SurveyStatCardProps) {
  return (
    <View style={styles.card}>
      <View style={[styles.accentBar, { backgroundColor: STATUS_COLORS[status] }]} />
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
