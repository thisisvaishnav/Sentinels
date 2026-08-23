import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ENUMERATOR_THEME } from '../../theme';

interface Props {
  isHeadComplete: boolean;
  isMembersComplete: boolean;
  isLocationComplete: boolean;
  isNeedsComplete: boolean;
  isIdentityVerified: boolean;
}

export function CoverageChecklistCard({
  isHeadComplete,
  isMembersComplete,
  isLocationComplete,
  isNeedsComplete,
  isIdentityVerified,
}: Props) {
  const checklistItems = [
    { label: 'Household details completed', isDone: isHeadComplete },
    { label: 'Family members recorded', isDone: isMembersComplete },
    { label: 'Location captured', isDone: isLocationComplete },
    { label: 'Household needs recorded', isDone: isNeedsComplete },
    { label: 'Identity verification recorded (Optional)', isDone: isIdentityVerified, optional: true },
  ];

  const requiredCount = 4;
  const completedRequired = [isHeadComplete, isMembersComplete, isLocationComplete, isNeedsComplete].filter(
    Boolean
  ).length;
  const isReady = completedRequired === requiredCount;

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.titleWrap}>
          <Ionicons name="checkbox-outline" size={20} color={ENUMERATOR_THEME.colors.accent} />
          <Text style={styles.title}>Coverage Check</Text>
        </View>
        <View style={[styles.statusBadge, isReady ? styles.readyBadge : styles.pendingBadge]}>
          <Text style={[styles.statusBadgeText, isReady ? styles.readyText : styles.pendingText]}>
            {isReady ? 'Ready for Submission' : `${completedRequired}/${requiredCount} Required Done`}
          </Text>
        </View>
      </View>

      <View style={styles.checklistGroup}>
        {checklistItems.map((item, idx) => (
          <View key={idx} style={styles.checkItem}>
            <Ionicons
              name={item.isDone ? 'checkmark-circle' : 'ellipse-outline'}
              size={18}
              color={
                item.isDone
                  ? ENUMERATOR_THEME.colors.success
                  : item.optional
                  ? ENUMERATOR_THEME.colors.textMuted
                  : ENUMERATOR_THEME.colors.warning
              }
            />
            <Text
              style={[
                styles.itemText,
                item.isDone && styles.itemTextDone,
                item.optional && !item.isDone && styles.itemTextOptional,
              ]}
            >
              {item.label}
            </Text>
          </View>
        ))}
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
    gap: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: ENUMERATOR_THEME.borderRadius.full,
  },
  readyBadge: {
    backgroundColor: ENUMERATOR_THEME.colors.successBg,
  },
  pendingBadge: {
    backgroundColor: ENUMERATOR_THEME.colors.subtleBackground,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  readyText: {
    color: ENUMERATOR_THEME.colors.successText,
  },
  pendingText: {
    color: ENUMERATOR_THEME.colors.textSecondary,
  },
  checklistGroup: {
    gap: 8,
  },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  itemText: {
    fontSize: 13,
    color: ENUMERATOR_THEME.colors.textSecondary,
    fontWeight: '500',
  },
  itemTextDone: {
    color: ENUMERATOR_THEME.colors.textPrimary,
    fontWeight: '600',
  },
  itemTextOptional: {
    color: ENUMERATOR_THEME.colors.textMuted,
    fontStyle: 'italic',
  },
});
