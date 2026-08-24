import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { ENUMERATOR_THEME } from '@/src/features/enumeration/theme';

export type Role = "citizen" | "enumerator" | "admin";

/* ───────────────────── Primary Role Card ───────────────────── */

interface RoleCardProps {
  role: Role;
  title: string;
  description: string;
  onPress: () => void;
}

const RoleCard = ({ role, title, description, onPress }: RoleCardProps) => {
  const getIcon = () => {
    if (role === "citizen") {
      return <Ionicons name="person" size={36} color={ENUMERATOR_THEME.colors.textWhite} />;
    }
    return (
      <MaterialCommunityIcons
        name="file-document-edit"
        size={36}
        color={ENUMERATOR_THEME.colors.textWhite}
      />
    );
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={styles.roleCard}
      onPress={onPress}
    >
      <View style={styles.iconContainer}>{getIcon()}</View>

      <View style={styles.cardContent}>
        <Text style={styles.roleTitle}>{title}</Text>
        <Text style={styles.roleDescription}>{description}</Text>
      </View>

      <Ionicons name="chevron-forward" size={22} color={ENUMERATOR_THEME.colors.textMuted} />
    </TouchableOpacity>
  );
};

/* ───────────────────── Compact Admin Card ───────────────────── */

interface CompactRoleCardProps {
  title: string;
  description: string;
  onPress: () => void;
}

const CompactRoleCard = ({
  title,
  description,
  onPress,
}: CompactRoleCardProps) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={styles.compactCard}
      onPress={onPress}
    >
      <View style={styles.compactIconContainer}>
        <MaterialCommunityIcons
          name="shield-account"
          size={22}
          color={ENUMERATOR_THEME.colors.textMuted}
        />
      </View>

      <View style={styles.compactCardContent}>
        <Text style={styles.compactTitle}>{title}</Text>
        <Text style={styles.compactDescription}>{description}</Text>
      </View>
    </TouchableOpacity>
  );
};

/* ───────────────────── Main Screen ───────────────────── */

interface RoleSelectionScreenProps {
  onSelectRole?: (role: Role) => void;
  onHelpPress?: () => void;
}

export default function RoleSelectionScreen({
  onSelectRole,
  onHelpPress,
}: RoleSelectionScreenProps) {
  const handleRoleSelect = (role: Role) => {
    console.log("Selected role:", role);
    if (onSelectRole) {
      onSelectRole(role);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Welcome to Lokvision</Text>
            <Text style={styles.subtitle}>Select your role to continue</Text>
          </View>

          {/* Primary Roles */}
          <View style={styles.primaryRoles}>
            <RoleCard
              role="citizen"
              title="Citizen"
              description="Report your household and find government schemes"
              onPress={() => handleRoleSelect("citizen")}
            />

            <RoleCard
              role="enumerator"
              title="Enumerator"
              description="Field data collection and zone verification"
              onPress={() => handleRoleSelect("enumerator")}
            />
          </View>

          {/* Divider */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Secondary Role */}
          <CompactRoleCard
            title="Admin"
            description="System oversight and command center"
            onPress={() => handleRoleSelect("admin")}
          />

          {/* Help */}
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.helpButton}
            onPress={() => {
              if (onHelpPress) {
                onHelpPress();
              } else {
                console.log("Help pressed");
              }
            }}
          >
            <Text style={styles.helpText}>Need help?</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ───────────────────── Styles ───────────────────── */

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: ENUMERATOR_THEME.colors.background,
    marginTop: -30,
  },

  scrollContent: {
    flexGrow: 1,
  },

  container: {
    flex: 1,
    paddingHorizontal: 18,
    paddingBottom: 24,
  },

  header: {
    alignItems: "center",
    paddingTop: 38,
    paddingBottom: 44,
  },

  title: {
    fontSize: 38,
    lineHeight: 44,
    fontWeight: "800",
    color: ENUMERATOR_THEME.colors.textPrimary,
    textAlign: "center",
    letterSpacing: -1.2,
  },

  subtitle: {
    marginTop: 28,
    fontSize: 20,
    lineHeight: 28,
    fontWeight: "500",
    color: ENUMERATOR_THEME.colors.textMuted,
    textAlign: "center",
  },

  /* ── Primary cards ── */

  primaryRoles: {
    gap: 16,
  },

  roleCard: {
    minHeight: 110,
    backgroundColor: ENUMERATOR_THEME.colors.cardBackground,
    borderWidth: 2,
    borderColor: ENUMERATOR_THEME.colors.primary,
    borderRadius: ENUMERATOR_THEME.borderRadius.xl,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 18,
    shadowColor: ENUMERATOR_THEME.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },

  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: ENUMERATOR_THEME.borderRadius.xl,
    backgroundColor: ENUMERATOR_THEME.colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 18,
  },

  cardContent: {
    flex: 1,
  },

  roleTitle: {
    fontSize: 24,
    lineHeight: 30,
    fontWeight: "700",
    color: ENUMERATOR_THEME.colors.textPrimary,
    marginBottom: 6,
  },

  roleDescription: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "400",
    color: ENUMERATOR_THEME.colors.textSecondary,
  },

  /* ── Divider ── */

  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 28,
    paddingHorizontal: 24,
  },

  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: ENUMERATOR_THEME.colors.border,
  },

  dividerText: {
    marginHorizontal: 14,
    fontSize: 14,
    fontWeight: "500",
    color: ENUMERATOR_THEME.colors.textMuted,
    textTransform: "lowercase",
  },

  /* ── Compact admin card ── */

  compactCard: {
    backgroundColor: ENUMERATOR_THEME.colors.cardBackground,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
    borderRadius: ENUMERATOR_THEME.borderRadius.lg,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    alignSelf: "flex-start",
  },

  compactIconContainer: {
    width: 42,
    height: 42,
    borderRadius: ENUMERATOR_THEME.borderRadius.lg,
    backgroundColor: ENUMERATOR_THEME.colors.subtleBackground,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },

  compactCardContent: {
    flex: 1,
  },

  compactTitle: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: "600",
    color: ENUMERATOR_THEME.colors.textSecondary,
    marginBottom: 2,
  },

  compactDescription: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "400",
    color: ENUMERATOR_THEME.colors.textMuted,
  },

  /* ── Help ── */

  helpButton: {
    alignItems: "center",
    marginTop: 36,
    marginBottom: 20,
  },

  helpText: {
    fontSize: 18,
    fontWeight: "600",
    color: ENUMERATOR_THEME.colors.primary,
  },
});
