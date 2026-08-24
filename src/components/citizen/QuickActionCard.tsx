import { ENUMERATOR_THEME } from '@/src/features/enumeration/theme';
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
        <Ionicons name={icon} size={22} color={ENUMERATOR_THEME.colors.accent} />
      </View>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "48%",
    minHeight: 120,
    backgroundColor: ENUMERATOR_THEME.colors.cardBackground,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
    borderRadius: ENUMERATOR_THEME.borderRadius.lg,
    padding: 14,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: ENUMERATOR_THEME.borderRadius.md,
    backgroundColor: ENUMERATOR_THEME.colors.accentSubtle,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    color: ENUMERATOR_THEME.colors.textPrimary,
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
  },
});
