import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { ENUMERATOR_THEME } from '../../theme';
import { VerificationFilterCategory } from '../../types/verificationTypes';

interface VerificationFilterBarProps {
  selectedCategory: VerificationFilterCategory;
  onSelectCategory: (cat: VerificationFilterCategory) => void;
  counts: Record<VerificationFilterCategory, number>;
}

const CATEGORIES: VerificationFilterCategory[] = [
  'All',
  'Pending',
  'High Priority',
  'Identity',
  'Location',
  'Anomaly',
  'Verified',
];

export const VerificationFilterBar: React.FC<VerificationFilterBarProps> = ({
  selectedCategory,
  onSelectCategory,
  counts,
}) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContainer}
    >
      {CATEGORIES.map((cat) => {
        const isSelected = selectedCategory === cat;
        const count = counts[cat] || 0;

        return (
          <TouchableOpacity
            key={cat}
            style={[styles.chip, isSelected && styles.chipActive]}
            onPress={() => onSelectCategory(cat)}
            activeOpacity={0.7}
          >
            <Text style={[styles.chipText, isSelected && styles.chipTextActive]}>{cat}</Text>
            <View style={[styles.countBadge, isSelected && styles.countBadgeActive]}>
              <Text style={[styles.countText, isSelected && styles.countTextActive]}>{count}</Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    paddingHorizontal: 16,
    gap: 8,
    paddingVertical: 2,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ENUMERATOR_THEME.colors.cardBackground,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
    borderRadius: ENUMERATOR_THEME.borderRadius.full,
    paddingVertical: 6,
    paddingHorizontal: 12,
    gap: 6,
  },
  chipActive: {
    backgroundColor: ENUMERATOR_THEME.colors.primary,
    borderColor: ENUMERATOR_THEME.colors.primary,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.textSecondary,
  },
  chipTextActive: {
    color: ENUMERATOR_THEME.colors.textWhite,
  },
  countBadge: {
    backgroundColor: ENUMERATOR_THEME.colors.subtleBackground,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: ENUMERATOR_THEME.borderRadius.full,
  },
  countBadgeActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  countText: {
    fontSize: 10,
    fontWeight: '800',
    color: ENUMERATOR_THEME.colors.textMuted,
  },
  countTextActive: {
    color: ENUMERATOR_THEME.colors.textWhite,
  },
});
