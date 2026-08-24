import { AppColors } from "@/constants/colors";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type SegmentedControlProps = {
  options: string[];
  selectedIndex: number;
  onSelect: (index: number) => void;
};

export default function SegmentedControl({
  options,
  selectedIndex,
  onSelect,
}: SegmentedControlProps) {
  return (
    <View style={styles.container}>
      {options.map((option, index) => {
        const isActive = index === selectedIndex;
        return (
          <TouchableOpacity
            key={option}
            style={[styles.segment, isActive && styles.activeSegment]}
            onPress={() => onSelect(index)}
            activeOpacity={0.7}
          >
            <Text style={[styles.label, isActive && styles.activeLabel]}>
              {option}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 8,
  },
  segment: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: AppColors.bgSubtle,
    borderRadius: 0,
    borderWidth: 1,
    borderColor: AppColors.border,
  },
  activeSegment: {
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
