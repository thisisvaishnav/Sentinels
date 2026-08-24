import { ENUMERATOR_THEME } from '@/src/features/enumeration/theme';
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type SupportSectionProps = {
  title: string;
  icon: React.ComponentProps<typeof Ionicons>["name"];
  children: React.ReactNode;
  defaultOpen?: boolean;
};

export default function SupportSection({
  title,
  icon,
  children,
  defaultOpen = false,
}: SupportSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.header}
        onPress={() => setIsOpen(!isOpen)}
        activeOpacity={0.7}
      >
        <View style={styles.headerLeft}>
          <View style={styles.iconWrap}>
            <Ionicons name={icon} size={18} color={ENUMERATOR_THEME.colors.accent} />
          </View>
          <Text style={styles.title}>{title}</Text>
        </View>
        <Ionicons
          name={isOpen ? "chevron-up" : "chevron-down"}
          size={18}
          color={ENUMERATOR_THEME.colors.textMuted}
        />
      </TouchableOpacity>
      {isOpen && <View style={styles.content}>{children}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: ENUMERATOR_THEME.colors.cardBackground,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
    borderRadius: 0,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 14,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 0,
    backgroundColor: ENUMERATOR_THEME.colors.accentSubtle,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  content: {
    padding: 14,
    paddingTop: 0,
    borderTopWidth: 1,
    borderTopColor: ENUMERATOR_THEME.colors.border,
  },
});
