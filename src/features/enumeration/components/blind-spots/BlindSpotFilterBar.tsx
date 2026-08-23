import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { BlindSpotFilterCategory } from '../../data/blindSpotAdapter';
import { ENUMERATOR_THEME } from '../../theme';

interface BlindSpotFilterBarProps {
  selectedCategory: BlindSpotFilterCategory;
  onSelectCategory: (cat: BlindSpotFilterCategory) => void;
  counts: Record<BlindSpotFilterCategory, number>;
}

export const BlindSpotFilterBar: React.FC<BlindSpotFilterBarProps> = ({
  selectedCategory,
  onSelectCategory,
  counts,
}) => {
  const categories: BlindSpotFilterCategory[] = ['All', 'Critical', 'High', 'Medium', 'Low'];

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      {categories.map((cat) => {
        const isSelected = selectedCategory === cat;
        const count = counts[cat] || 0;

        return (
          <TouchableOpacity
            key={cat}
            style={[styles.chip, isSelected && styles.chipSelected]}
            onPress={() => onSelectCategory(cat)}
            activeOpacity={0.7}
          >
            <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>{cat}</Text>

            <View style={[styles.countBadge, isSelected && styles.countBadgeSelected]}>
              <Text style={[styles.countText, isSelected && styles.countTextSelected]}>
                {count}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 16,
    gap: 8,
    paddingVertical: 2,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ENUMERATOR_THEME.colors.cardBackground,
    borderRadius: ENUMERATOR_THEME.borderRadius.full,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 6,
  },
  chipSelected: {
    backgroundColor: ENUMERATOR_THEME.colors.accent,
    borderColor: ENUMERATOR_THEME.colors.accent,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
    color: ENUMERATOR_THEME.colors.textSecondary,
  },
  chipTextSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  countBadge: {
    backgroundColor: ENUMERATOR_THEME.colors.subtleBackground,
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 1,
  },
  countBadgeSelected: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  countText: {
    fontSize: 11,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.textMuted,
  },
  countTextSelected: {
    color: '#FFFFFF',
  },
});
