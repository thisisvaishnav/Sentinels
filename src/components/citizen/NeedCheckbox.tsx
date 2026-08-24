import { ENUMERATOR_THEME } from '@/src/features/enumeration/theme';
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type NeedCheckboxProps = {
  label: string;
  icon: React.ComponentProps<typeof Ionicons>["name"];
  checked: boolean;
  onToggle: () => void;
};

export default function NeedCheckbox({
  label,
  icon,
  checked,
  onToggle,
}: NeedCheckboxProps) {
  return (
    <TouchableOpacity
      style={[styles.container, checked && styles.checkedContainer]}
      onPress={onToggle}
      activeOpacity={0.7}
    >
      <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
        {checked && (
          <Ionicons name="checkmark" size={14} color={ENUMERATOR_THEME.colors.textWhite} />
        )}
      </View>
      <View style={[styles.iconWrap, checked && styles.iconWrapChecked]}>
        <Ionicons
          name={icon}
          size={18}
          color={checked ? ENUMERATOR_THEME.colors.textWhite : ENUMERATOR_THEME.colors.textPrimary}
        />
      </View>
      <Text style={[styles.label, checked && styles.labelChecked]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: ENUMERATOR_THEME.colors.cardBackground,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
    borderRadius: 0,
    padding: 12,
  },
  checkedContainer: {
    backgroundColor: ENUMERATOR_THEME.colors.accentSubtle,
    borderColor: ENUMERATOR_THEME.colors.accent,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 0,
    borderWidth: 2,
    borderColor: ENUMERATOR_THEME.colors.borderSubtle,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: {
    backgroundColor: ENUMERATOR_THEME.colors.accent,
    borderColor: ENUMERATOR_THEME.colors.accent,
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 0,
    backgroundColor: ENUMERATOR_THEME.colors.subtleBackground,
    alignItems: "center",
    justifyContent: "center",
  },
  iconWrapChecked: {
    backgroundColor: ENUMERATOR_THEME.colors.accent,
  },
  label: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  labelChecked: {
    color: ENUMERATOR_THEME.colors.accent,
  },
});
