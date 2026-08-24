import { AppColors } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type QuickActionCardProps = {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  label: string;
  onPress?: () => void;
};

export default function QuickActionCard({
  icon,
  label,
  onPress,
}: QuickActionCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.iconBox}>
        <Ionicons name={icon} size={22} color={AppColors.textPrimary} />
      </View>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "48%",
    minHeight: 146,
    backgroundColor: AppColors.bgCard,
    borderWidth: 1,
    borderColor: AppColors.border,
    borderRadius: 0,
    padding: 14,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  iconBox: {
    width: 46,
    height: 46,
    borderRadius: 0,
    backgroundColor: AppColors.bgSubtle,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    color: AppColors.textPrimary,
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
});
