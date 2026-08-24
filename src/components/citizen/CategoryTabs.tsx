import { AppColors } from "@/constants/colors";
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
    backgroundColor: AppColors.bgSubtle,
    borderWidth: 1,
    borderColor: AppColors.border,
  },
  activeTab: {
    backgroundColor: AppColors.primary,
    borderColor: AppColors.primary,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: AppColors.textMuted,
  },
  activeLabel: {
    color: AppColors.textWhite,
  },
});
