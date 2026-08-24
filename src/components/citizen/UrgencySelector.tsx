import { AppColors } from "@/constants/colors";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type UrgencyLevel = "low" | "medium" | "high";

type UrgencySelectorProps = {
  selected: UrgencyLevel | null;
  onSelect: (level: UrgencyLevel) => void;
};

const URGENCY_OPTIONS: Array<{
  level: UrgencyLevel;
  label: string;
  description: string;
  color: string;
  bgColor: string;
}> = [
  {
    level: "low",
    label: "Low",
    description: "Can wait a few days",
    color: AppColors.success,
    bgColor: AppColors.successBg,
  },
  {
    level: "medium",
    label: "Medium",
    description: "Needs attention soon",
    color: AppColors.warning,
    bgColor: AppColors.warningBg,
  },
  {
    level: "high",
    label: "High",
    description: "Requires immediate help",
    color: AppColors.danger,
    bgColor: AppColors.dangerBg,
  },
];

export default function UrgencySelector({
  selected,
  onSelect,
}: UrgencySelectorProps) {
  return (
    <View style={styles.container}>
      {URGENCY_OPTIONS.map((option) => {
        const isSelected = selected === option.level;
        return (
          <TouchableOpacity
            key={option.level}
            style={[
              styles.option,
              { borderColor: isSelected ? option.color : AppColors.border },
              isSelected && { backgroundColor: option.bgColor },
            ]}
            onPress={() => onSelect(option.level)}
            activeOpacity={0.7}
          >
            <View style={[styles.dot, { backgroundColor: option.color }]} />
            <View style={styles.copy}>
              <Text
                style={[
                  styles.label,
                  isSelected && { color: option.color },
                ]}
              >
                {option.label}
              </Text>
              <Text style={styles.description}>{option.description}</Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 10,
  },
  option: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 0,
    padding: 12,
    gap: 8,
    alignItems: "center",
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 0,
  },
  copy: {
    alignItems: "center",
    gap: 2,
  },
  label: {
    fontSize: 13,
    fontWeight: "700",
    color: AppColors.textPrimary,
  },
  description: {
    fontSize: 10,
    color: AppColors.textMuted,
    textAlign: "center",
  },
});
