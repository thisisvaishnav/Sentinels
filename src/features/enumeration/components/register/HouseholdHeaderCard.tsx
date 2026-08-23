import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ENUMERATOR_THEME } from '../../theme';

interface Props {
  householdId: string;
  status: 'Draft' | 'Submitted';
  progressPercentage: number;
}

export function HouseholdHeaderCard({ householdId, status, progressPercentage }: Props) {
  const isSubmitted = status === 'Submitted';

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.idWrap}>
          <Text style={styles.label}>HOUSEHOLD ID</Text>
          <View style={styles.idBadge}>
            <MaterialCommunityIcons name="subtitles-outline" size={16} color={ENUMERATOR_THEME.colors.accent} />
            <Text style={styles.idText}>{householdId}</Text>
          </View>
        </View>

        <View style={[styles.statusBadge, isSubmitted ? styles.submittedBadge : styles.draftBadge]}>
          <View style={[styles.dot, isSubmitted ? styles.submittedDot : styles.draftDot]} />
          <Text style={[styles.statusText, isSubmitted ? styles.submittedText : styles.draftText]}>
            {status}
          </Text>
        </View>
      </View>

      <View style={styles.progressWrap}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressLabel}>Registration Progress</Text>
          <Text style={styles.progressPercent}>{progressPercentage}%</Text>
        </View>

        <View style={styles.progressBarTrack}>
          <View style={[styles.progressBarFill, { width: `${progressPercentage}%` }]} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: ENUMERATOR_THEME.colors.cardBackground,
    borderRadius: ENUMERATOR_THEME.borderRadius.xl,
    padding: 16,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
    gap: 14,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  idWrap: {
    gap: 4,
  },
  label: {
    fontSize: 10,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.textMuted,
    letterSpacing: 0.8,
  },
  idBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ENUMERATOR_THEME.colors.accentSubtle,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: ENUMERATOR_THEME.borderRadius.md,
    gap: 6,
  },
  idText: {
    fontSize: 14,
    fontWeight: '800',
    color: ENUMERATOR_THEME.colors.accent,
    letterSpacing: 0.5,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: ENUMERATOR_THEME.borderRadius.full,
    gap: 6,
  },
  draftBadge: {
    backgroundColor: '#FEF3C7',
  },
  submittedBadge: {
    backgroundColor: ENUMERATOR_THEME.colors.successBg,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  draftDot: {
    backgroundColor: '#D97706',
  },
  submittedDot: {
    backgroundColor: ENUMERATOR_THEME.colors.success,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
  },
  draftText: {
    color: '#92400E',
  },
  submittedText: {
    color: ENUMERATOR_THEME.colors.successText,
  },
  progressWrap: {
    gap: 6,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: ENUMERATOR_THEME.colors.textSecondary,
  },
  progressPercent: {
    fontSize: 12,
    fontWeight: '800',
    color: ENUMERATOR_THEME.colors.accent,
  },
  progressBarTrack: {
    height: 7,
    backgroundColor: ENUMERATOR_THEME.colors.subtleBackground,
    borderRadius: ENUMERATOR_THEME.borderRadius.full,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: ENUMERATOR_THEME.colors.accent,
    borderRadius: ENUMERATOR_THEME.borderRadius.full,
  },
});
