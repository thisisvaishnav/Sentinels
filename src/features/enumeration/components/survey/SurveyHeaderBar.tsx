import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ENUMERATOR_THEME } from '../../theme';
import { SurveyStatus } from '../../types';

interface Props {
  householdId: string;
  headName: string;
  progressPercentage: number;
  status: SurveyStatus;
  onBackPress: () => void;
}

export function SurveyHeaderBar({
  householdId,
  headName,
  progressPercentage,
  status,
  onBackPress,
}: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <TouchableOpacity style={styles.backBtn} onPress={onBackPress} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={20} color={ENUMERATOR_THEME.colors.textPrimary} />
        </TouchableOpacity>

        <View style={styles.titleWrap}>
          <Text style={styles.idText}>{householdId}</Text>
          <Text style={styles.headText} numberOfLines={1}>{headName}</Text>
        </View>

        <View style={styles.statusPill}>
          <Text style={styles.statusText}>{status}</Text>
        </View>
      </View>

      {/* Progress Track */}
      <View style={styles.progressRow}>
        <Text style={styles.progressLabel}>Survey Progress</Text>
        <Text style={styles.progressVal}>{progressPercentage}%</Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${progressPercentage}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: ENUMERATOR_THEME.colors.cardBackground,
    borderBottomWidth: 1,
    borderBottomColor: ENUMERATOR_THEME.colors.border,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: ENUMERATOR_THEME.borderRadius.md,
    backgroundColor: ENUMERATOR_THEME.colors.subtleBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleWrap: {
    flex: 1,
    marginHorizontal: 12,
  },
  idText: {
    fontSize: 11,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.accent,
  },
  headText: {
    fontSize: 15,
    fontWeight: '800',
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  statusPill: {
    backgroundColor: ENUMERATOR_THEME.colors.accentSubtle,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: ENUMERATOR_THEME.borderRadius.full,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.accent,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: ENUMERATOR_THEME.colors.textSecondary,
  },
  progressVal: {
    fontSize: 11,
    fontWeight: '800',
    color: ENUMERATOR_THEME.colors.accent,
  },
  track: {
    height: 6,
    backgroundColor: ENUMERATOR_THEME.colors.subtleBackground,
    borderRadius: ENUMERATOR_THEME.borderRadius.full,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: ENUMERATOR_THEME.colors.accent,
    borderRadius: ENUMERATOR_THEME.borderRadius.full,
  },
});
