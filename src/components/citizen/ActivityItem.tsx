import { AppColors } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

type ActivityItemProps = {
  title: string;
  text: string;
  time: string;
  icon?: React.ComponentProps<typeof Ionicons>["name"];
};

export default function ActivityItem({
  title,
  text,
  time,
  icon = "checkmark-circle-outline",
}: ActivityItemProps) {
  return (
    <View style={styles.item}>
      <View style={styles.iconWrap}>
        <Ionicons name={icon} size={18} color={AppColors.textPrimary} />
      </View>
      <View style={styles.copy}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.text}>{text}</Text>
        <Text style={styles.time}>{time}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: "row",
    gap: 10,
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.border,
  },
  iconWrap: {
    width: 30,
    height: 30,
    borderRadius: 0,
    backgroundColor: AppColors.bgSubtle,
    alignItems: "center",
    justifyContent: "center",
  },
  copy: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: 13,
    color: AppColors.textPrimary,
    fontWeight: "700",
  },
  text: {
    fontSize: 13,
    color: AppColors.textSecondary,
    lineHeight: 18,
  },
  time: {
    marginTop: 2,
    fontSize: 11,
    color: AppColors.textMuted,
    letterSpacing: 0.3,
  },
});
