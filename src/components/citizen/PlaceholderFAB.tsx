import { AppColors } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

type PlaceholderFABProps = {
  onPress?: () => void;
  icon?: React.ComponentProps<typeof Ionicons>["name"];
};

export default function PlaceholderFAB({
  onPress,
  icon = "add",
}: PlaceholderFABProps) {
  return (
    <TouchableOpacity
      style={styles.fab}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Ionicons name={icon} size={28} color={AppColors.textWhite} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    bottom: 24,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 0,
    backgroundColor: AppColors.primary,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});
