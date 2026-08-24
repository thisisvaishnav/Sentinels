import { ENUMERATOR_THEME } from '@/src/features/enumeration/theme';
import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity } from "react-native";

type CategoryTabsProps = {
  categories: string[];
  activeCategory: string;
  onSelect: (category: string) => void;
};

export default function CategoryTabs({
  categories,
  activeCategory,
  onSelect,
}: CategoryTabsProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {categories.map((category) => {
        const isActive = category === activeCategory;
        return (
          <TouchableOpacity
            key={category}
            style={[styles.tab, isActive && styles.activeTab]}
            onPress={() => onSelect(category)}
            activeOpacity={0.7}
          >
            <Text style={[styles.label, isActive && styles.activeLabel]}>
              {category}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 0,
    backgroundColor: ENUMERATOR_THEME.colors.subtleBackground,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
  },
  activeTab: {
    backgroundColor: ENUMERATOR_THEME.colors.primary,
    borderColor: ENUMERATOR_THEME.colors.primary,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: ENUMERATOR_THEME.colors.textMuted,
  },
  activeLabel: {
    color: ENUMERATOR_THEME.colors.textWhite,
  },
});
