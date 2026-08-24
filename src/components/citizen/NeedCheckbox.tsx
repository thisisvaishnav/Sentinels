import { AppColors } from "@/constants/colors";
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
          <Ionicons name="checkmark" size={14} color={AppColors.textWhite} />
        )}
      </View>
      <View style={[styles.iconWrap, checked && styles.iconWrapChecked]}>
        <Ionicons
          name={icon}
          size={18}
          color={checked ? AppColors.textWhite : AppColors.textPrimary}
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
    backgroundColor: AppColors.bgCard,
    borderWidth: 1,
    borderColor: AppColors.border,
    borderRadius: 0,
    padding: 12,
  },
  checkedContainer: {
    backgroundColor: AppColors.bgHighlight,
    borderColor: AppColors.blue,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 0,
    borderWidth: 2,
    borderColor: AppColors.borderInput,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: {
    backgroundColor: AppColors.blue,
    borderColor: AppColors.blue,
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 0,
    backgroundColor: AppColors.bgSubtle,
    alignItems: "center",
    justifyContent: "center",
  },
  iconWrapChecked: {
    backgroundColor: AppColors.blue,
  },
  label: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    color: AppColors.textPrimary,
  },
  labelChecked: {
    color: AppColors.blue,
  },
});
