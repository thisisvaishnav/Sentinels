import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BlindSpotSortOption } from '../../data/blindSpotAdapter';
import { ENUMERATOR_THEME } from '../../theme';

interface BlindSpotSortBarProps {
  sortBy: BlindSpotSortOption;
  onChangeSort: (option: BlindSpotSortOption) => void;
}

export const BlindSpotSortBar: React.FC<BlindSpotSortBarProps> = ({ sortBy, onChangeSort }) => {
  const options: { id: BlindSpotSortOption; label: string; icon: string }[] = [
    { id: 'coverage', label: 'Lowest Coverage', icon: 'sort-numeric-ascending' },
    { id: 'risk', label: 'Highest Risk', icon: 'alert-decagram' },
    { id: 'remaining', label: 'Most Remaining', icon: 'numeric-negative-1' },
    { id: 'name', label: 'Area Name', icon: 'sort-alphabetical-ascending' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.sortLabel}>Sort By:</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {options.map((opt) => {
          const isSelected = sortBy === opt.id;
          return (
            <TouchableOpacity
              key={opt.id}
              style={[styles.sortChip, isSelected && styles.sortChipSelected]}
              onPress={() => onChangeSort(opt.id)}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons
                name={opt.icon as any}
                size={14}
                color={isSelected ? ENUMERATOR_THEME.colors.accent : ENUMERATOR_THEME.colors.textMuted}
              />
              <Text style={[styles.sortChipText, isSelected && styles.sortChipTextSelected]}>
                {opt.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 8,
  },
  sortLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.textMuted,
    textTransform: 'uppercase',
  },
  scrollContent: {
    gap: 6,
    paddingRight: 16,
  },
  sortChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ENUMERATOR_THEME.colors.background,
    borderRadius: ENUMERATOR_THEME.borderRadius.md,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 4,
  },
  sortChipSelected: {
    backgroundColor: ENUMERATOR_THEME.colors.accentSubtle,
    borderColor: ENUMERATOR_THEME.colors.accentLight,
  },
  sortChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: ENUMERATOR_THEME.colors.textSecondary,
  },
  sortChipTextSelected: {
    color: ENUMERATOR_THEME.colors.accent,
    fontWeight: '700',
  },
});
