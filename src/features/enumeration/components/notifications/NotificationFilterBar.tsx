import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { NotificationFilterCategory } from '../../types/notificationTypes';
import { ENUMERATOR_THEME } from '../../theme';

interface NotificationFilterBarProps {
  selectedCategory: NotificationFilterCategory;
  onSelectCategory: (category: NotificationFilterCategory) => void;
  counts: Record<NotificationFilterCategory, number>;
}

export const CATEGORIES: NotificationFilterCategory[] = [
  'All',
  'Unread',
  'Priority',
  'Blind Spot',
  'Anomaly',
  'Missing',
  'Verification',
  'System',
];

export const NotificationFilterBar: React.FC<NotificationFilterBarProps> = ({
  selectedCategory,
  onSelectCategory,
  counts,
}) => {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat;
          const count = counts[cat] || 0;

          return (
            <TouchableOpacity
              key={cat}
              style={[styles.chip, isSelected && styles.chipSelected]}
              onPress={() => onSelectCategory(cat)}
              activeOpacity={0.8}
            >
              <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                {cat}
              </Text>
              <View style={[styles.badge, isSelected && styles.badgeSelected]}>
                <Text style={[styles.badgeText, isSelected && styles.badgeTextSelected]}>
                  {count}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 2,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ENUMERATOR_THEME.colors.cardBackground,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: ENUMERATOR_THEME.borderRadius.md,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
    gap: 6,
  },
  chipSelected: {
    backgroundColor: ENUMERATOR_THEME.colors.accent,
    borderColor: ENUMERATOR_THEME.colors.accent,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.textSecondary,
  },
  chipTextSelected: {
    color: ENUMERATOR_THEME.colors.textWhite,
  },
  badge: {
    backgroundColor: ENUMERATOR_THEME.colors.background,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 18,
    alignItems: 'center',
  },
  badgeSelected: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  badgeTextSelected: {
    color: ENUMERATOR_THEME.colors.textWhite,
  },
});
