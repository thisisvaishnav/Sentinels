import { ENUMERATOR_THEME } from '@/src/features/enumeration/theme';
import EligibilityBadge from "./EligibilityBadge";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type SchemeCardProps = {
  title: string;
  description: string;
  category: string;
  benefitAmount?: string;
  status: "Active" | "Closing Soon" | "Closed";
  eligible?: boolean;
  onPress?: () => void;
};

export default function SchemeCard({
  title,
  description,
  category,
  benefitAmount,
  status,
  eligible,
  onPress,
}: SchemeCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.header}>
        <View style={styles.categoryChip}>
          <Text style={styles.categoryText}>{category}</Text>
        </View>
        <View style={[styles.statusDot, status === "Active" && styles.statusActive, status === "Closing Soon" && styles.statusClosing]} />
      </View>

      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description} numberOfLines={2}>
        {description}
      </Text>

      {benefitAmount && (
        <View style={styles.benefitRow}>
          <Ionicons name="cash-outline" size={14} color={ENUMERATOR_THEME.colors.success} />
          <Text style={styles.benefitText}>{benefitAmount}</Text>
        </View>
      )}

      <View style={styles.footer}>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>{status}</Text>
        </View>
        {eligible !== undefined && <EligibilityBadge eligible={eligible} />}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: ENUMERATOR_THEME.colors.cardBackground,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
    borderRadius: ENUMERATOR_THEME.borderRadius.lg,
    padding: 14,
    gap: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  categoryChip: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    backgroundColor: ENUMERATOR_THEME.colors.accentSubtle,
    borderRadius: ENUMERATOR_THEME.borderRadius.sm,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: "600",
    color: ENUMERATOR_THEME.colors.accent,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: ENUMERATOR_THEME.colors.textMuted,
  },
  statusActive: {
    backgroundColor: ENUMERATOR_THEME.colors.success,
  },
  statusClosing: {
    backgroundColor: ENUMERATOR_THEME.colors.warning,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  description: {
    fontSize: 13,
    color: ENUMERATOR_THEME.colors.textSecondary,
    lineHeight: 18,
  },
  benefitRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  benefitText: {
    fontSize: 13,
    fontWeight: "600",
    color: ENUMERATOR_THEME.colors.success,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    backgroundColor: ENUMERATOR_THEME.colors.subtleBackground,
    borderRadius: ENUMERATOR_THEME.borderRadius.full,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "600",
    color: ENUMERATOR_THEME.colors.textMuted,
  },
});
