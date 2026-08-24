import { ENUMERATOR_THEME } from '@/src/features/enumeration/theme';
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
    backgroundColor: ENUMERATOR_THEME.colors.subtleBackground,
    borderRadius: 0,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
  },
  activeSegment: {
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
