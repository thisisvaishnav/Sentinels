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
import {
  ENUMERATOR_AUTH_THEME,
  CITIZEN_AUTH_THEME,
  ADMIN_AUTH_THEME,
  AuthTheme,
} from "@/src/features/auth/theme";

export type Role = "citizen" | "enumerator" | "admin";

/* ───────────────────── Role Config ───────────────────── */

interface RoleConfig {
  title: string;
  description: string;
  icon: React.ReactNode;
  theme: AuthTheme;
}

const ROLE_CONFIG: Record<Role, RoleConfig> = {
  citizen: {
    title: "Citizen",
    description: "Report your household and find government schemes",
    icon: <Ionicons name="person" size={28} color={CITIZEN_AUTH_THEME.colors.textWhite} />,
    theme: CITIZEN_AUTH_THEME,
  },
  enumerator: {
    title: "Enumerator",
    description: "Field data collection and zone verification",
    icon: (
      <MaterialCommunityIcons
        name="file-document-edit"
        size={28}
        color={ENUMERATOR_AUTH_THEME.colors.textWhite}
      />
    ),
    theme: ENUMERATOR_AUTH_THEME,
  },
  admin: {
    title: "Admin",
    description: "System oversight and command center",
    icon: (
      <MaterialCommunityIcons
        name="shield-account"
        size={28}
        color={ADMIN_AUTH_THEME.colors.textWhite}
      />
    ),
    theme: ADMIN_AUTH_THEME,
  },
};

/* ───────────────────── Primary Role Card ───────────────────── */

interface RoleCardProps {
  role: Role;
  config: RoleConfig;
  onPress: () => void;
}

const RoleCard = ({ role, config, onPress }: RoleCardProps) => {
  const t = config.theme;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[
        styles.roleCard,
        {
          backgroundColor: t.colors.cardBackground,
          borderColor: t.colors.accent,
          borderRadius: t.borderRadius.xl,
        },
      ]}
      onPress={onPress}
    >
      <View
        style={[
          styles.iconContainer,
          {
            backgroundColor: t.colors.accent,
            borderRadius: t.borderRadius.xl,
          },
        ]}
      >
        {config.icon}
      </View>

      <View style={styles.cardContent}>
        <Text style={[styles.roleTitle, { color: t.colors.textPrimary }]}>
          {config.title}
        </Text>
        <Text style={[styles.roleDescription, { color: t.colors.textSecondary }]}>
          {config.description}
        </Text>
      </View>

      <Ionicons name="chevron-forward" size={20} color={t.colors.textMuted} />
    </TouchableOpacity>
  );
};

/* ───────────────────── Compact Admin Card ───────────────────── */

interface CompactRoleCardProps {
  config: RoleConfig;
  onPress: () => void;
}

const CompactRoleCard = ({ config, onPress }: CompactRoleCardProps) => {
  const t = config.theme;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[
        styles.compactCard,
        {
          backgroundColor: t.colors.cardBackground,
          borderColor: t.colors.border,
          borderRadius: t.borderRadius.lg,
        },
      ]}
      onPress={onPress}
    >
      <View
        style={[
          styles.compactIconContainer,
          {
            backgroundColor: t.colors.subtleBackground,
            borderRadius: t.borderRadius.lg,
          },
        ]}
      >
        <MaterialCommunityIcons
          name="shield-account"
          size={22}
          color={t.colors.textMuted}
        />
      </View>

      <View style={styles.compactCardContent}>
        <Text style={[styles.compactTitle, { color: t.colors.textSecondary }]}>
          {config.title}
        </Text>
        <Text style={[styles.compactDescription, { color: t.colors.textMuted }]}>
          {config.description}
        </Text>
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
  const t = ENUMERATOR_AUTH_THEME;

  const handleRoleSelect = (role: Role) => {
    console.log("Selected role:", role);
    if (onSelectRole) {
      onSelectRole(role);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: t.colors.background }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <View style={[styles.brandIcon, { backgroundColor: t.colors.accent, borderRadius: t.borderRadius.xl }]}>
              <MaterialCommunityIcons name="satellite-variant" size={32} color={t.colors.textWhite} />
            </View>
            <Text style={[styles.title, { color: t.colors.textPrimary }]}>Welcome to Lokvision</Text>
            <Text style={[styles.subtitle, { color: t.colors.textMuted }]}>Select your role to continue</Text>
          </View>

          {/* Primary Roles */}
          <View style={styles.primaryRoles}>
            <RoleCard
              role="citizen"
              config={ROLE_CONFIG.citizen}
              onPress={() => handleRoleSelect("citizen")}
            />
            <RoleCard
              role="enumerator"
              config={ROLE_CONFIG.enumerator}
              onPress={() => handleRoleSelect("enumerator")}
            />
          </View>

          {/* Divider */}
          <View style={styles.dividerRow}>
            <View style={[styles.dividerLine, { backgroundColor: t.colors.border }]} />
            <Text style={[styles.dividerText, { color: t.colors.textMuted }]}>or</Text>
            <View style={[styles.dividerLine, { backgroundColor: t.colors.border }]} />
          </View>

          {/* Secondary Role */}
          <CompactRoleCard
            config={ROLE_CONFIG.admin}
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
            <Text style={[styles.helpText, { color: t.colors.accent }]}>Need help?</Text>
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
    paddingTop: 32,
    paddingBottom: 40,
  },

  brandIcon: {
    width: 64,
    height: 64,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },

  title: {
    fontSize: 34,
    lineHeight: 40,
    fontWeight: "800",
    textAlign: "center",
    letterSpacing: -1,
  },

  subtitle: {
    marginTop: 10,
    fontSize: 17,
    lineHeight: 24,
    fontWeight: "500",
    textAlign: "center",
  },

  /* ── Primary cards ── */

  primaryRoles: {
    gap: 14,
  },

  roleCard: {
    minHeight: 100,
    borderWidth: 2,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },

  iconContainer: {
    width: 60,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },

  cardContent: {
    flex: 1,
  },

  roleTitle: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: "700",
    marginBottom: 4,
  },

  roleDescription: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "400",
  },

  /* ── Divider ── */

  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
    paddingHorizontal: 20,
  },

  dividerLine: {
    flex: 1,
    height: 1,
  },

  dividerText: {
    marginHorizontal: 12,
    fontSize: 13,
    fontWeight: "500",
    textTransform: "lowercase",
  },

  /* ── Compact admin card ── */

  compactCard: {
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    alignSelf: "flex-start",
  },

  compactIconContainer: {
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },

  compactCardContent: {
    flex: 1,
  },

  compactTitle: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: "600",
    marginBottom: 2,
  },

  compactDescription: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "400",
  },

  /* ── Help ── */

  helpButton: {
    alignItems: "center",
    marginTop: 32,
    marginBottom: 20,
  },

  helpText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
