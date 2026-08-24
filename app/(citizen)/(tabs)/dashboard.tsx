import { getCitizenHouseholdStatus, signOut } from "@/src/features/auth/authService";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCitizenDrawer } from "@/src/contexts/CitizenDrawerContext";
import { Ionicons } from "@expo/vector-icons";

import { EnumeratorHeader } from "@/src/features/enumeration/components/EnumeratorHeader";
import { WelcomeSection } from "@/src/features/enumeration/components/WelcomeSection";
import { QuickActionsSection } from "@/src/features/enumeration/components/QuickActionsSection";
import { CITIZEN_THEME } from "@/src/features/enumeration/theme";
import {
  EnumeratorProfile,
  QuickActionItem,
} from "@/src/features/enumeration/types";

const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:5001";

type HouseholdProfile = {
  id: string;
  head_full_name: string;
  head_age: number;
  head_gender: string;
  head_mobile_number: string;
  total_members: number;
  male_members: number;
  female_members: number;
  children_count: number;
  senior_count: number;
  house_no: string;
  locality: string;
  ward: string;
  district: string;
  pincode: string;
  has_electricity: boolean;
  has_running_water: boolean;
  has_indoor_toilet: boolean;
  has_lpg: boolean;
  has_internet: boolean;
  latitude: number;
  longitude: number;
};

const citizenQuickActions: QuickActionItem[] = [
  { id: "household", label: "View Household", iconName: "account-outline", color: "#0EA5E9", route: "/(citizen)/household" },
  { id: "schemes", label: "Find Schemes", iconName: "brightness-percent", color: "#7C3AED", route: "/(citizen)/schemes" },
  { id: "track", label: "Track Requests", iconName: "chart-line", color: "#0284C7", route: "/(citizen)/household" },
  { id: "support", label: "Get Help", iconName: "headset-outline", color: "#D97706", route: "/(citizen)/support" },
];

/* -------------------------------------------------------------------------- */
/*                          Household Summary Card                             */
/* -------------------------------------------------------------------------- */

function HouseholdSummaryCard({ profile }: { profile: HouseholdProfile }) {
  const facilitiesCount = [
    profile.has_electricity,
    profile.has_running_water,
    profile.has_indoor_toilet,
    profile.has_lpg,
    profile.has_internet,
  ].filter(Boolean).length;

  return (
    <View style={styles.summaryCard}>
      <View style={styles.summaryHeader}>
        <View style={styles.summaryIconWrap}>
          <Ionicons name="home" size={20} color={CITIZEN_THEME.colors.accent} />
        </View>
        <Text style={styles.summaryTitle}>Your Household</Text>
      </View>

      <View style={styles.summaryGrid}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>{profile.total_members}</Text>
          <Text style={styles.summaryLabel}>Members</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>{facilitiesCount}/5</Text>
          <Text style={styles.summaryLabel}>Facilities</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>{profile.ward}</Text>
          <Text style={styles.summaryLabel}>Ward</Text>
        </View>
      </View>

      <View style={styles.summaryAddress}>
        <Ionicons name="location-outline" size={14} color={CITIZEN_THEME.colors.textMuted} />
        <Text style={styles.summaryAddressText} numberOfLines={1}>
          {profile.house_no}, {profile.locality}, {profile.district} - {profile.pincode}
        </Text>
      </View>
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/*                              Main Screen                                    */
/* -------------------------------------------------------------------------- */

export default function CitizenDashboard() {
  const router = useRouter();
  const { open: openDrawer } = useCitizenDrawer();
  const [checkingStatus, setCheckingStatus] = useState(true);
  const [householdProfile, setHouseholdProfile] = useState<HouseholdProfile | null>(null);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace("/onboarding");
    } catch {
      router.replace("/onboarding");
    }
  };

  useEffect(() => {
    const performAccessChecks = async () => {
      try {
        const token = await SecureStore.getItemAsync("citizen_token");

        if (!token) {
          router.replace({ pathname: "/(auth)/login", params: { role: "citizen" } });
          return;
        }

        const status = await getCitizenHouseholdStatus();
        if (!status.completed) {
          router.replace("/(citizen)/household" as any);
          return;
        }

        if (status.completed) {
          try {
            const profileResponse = await fetch(`${API_URL}/api/household/me`, {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            });
            if (profileResponse.ok) {
              const profileResult = await profileResponse.json();
              setHouseholdProfile(profileResult.household ?? null);
            }
          } catch (err) {
            console.error("Failed to fetch household profile:", err);
          }
        }

        setCheckingStatus(false);
      } catch (error) {
        console.error("Access check failed:", error);
        router.replace({ pathname: "/(auth)/login", params: { role: "citizen" } });
      }
    };

    performAccessChecks();
  }, [router]);

  if (checkingStatus) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color={CITIZEN_THEME.colors.accent} />
      </SafeAreaView>
    );
  }

  const citizenProfile: EnumeratorProfile = {
    id: householdProfile?.head_mobile_number ?? "CIT-001",
    name: householdProfile?.head_full_name?.split(" ")[0] ?? "Citizen",
    role: "Citizen",
    assignedZone: householdProfile
      ? `${householdProfile.locality} · Ward ${householdProfile.ward}`
      : "No location set",
    isOnline: true,
    unreadNotificationsCount: 0,
  };

  return (
    <SafeAreaView style={styles.container}>
      <EnumeratorHeader
        profile={citizenProfile}
        onOpenDrawer={openDrawer}
      />

      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <WelcomeSection
          profile={citizenProfile}
          theme={CITIZEN_THEME}
          onProfilePress={() => {}}
          onZonePress={() => {}}
        />

        {householdProfile && (
          <HouseholdSummaryCard profile={householdProfile} />
        )}

        <QuickActionsSection
          actions={citizenQuickActions}
          theme={CITIZEN_THEME}
          onActionPress={(action) => {
            if (action.route) router.push(action.route as any);
          }}
        />

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CITIZEN_THEME.colors.background,
  },
  body: {
    padding: 16,
    gap: 20,
  },
  bottomSpacer: {
    height: 32,
  },

  /* Household Summary Card */
  summaryCard: {
    backgroundColor: CITIZEN_THEME.colors.cardBackground,
    borderRadius: CITIZEN_THEME.borderRadius.xl,
    padding: 16,
    borderWidth: 1,
    borderColor: CITIZEN_THEME.colors.border,
    gap: 14,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  summaryIconWrap: {
    width: 36,
    height: 36,
    borderRadius: CITIZEN_THEME.borderRadius.sm,
    backgroundColor: CITIZEN_THEME.colors.accentSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: CITIZEN_THEME.colors.textPrimary,
  },
  summaryGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: CITIZEN_THEME.colors.subtleBackground,
    borderRadius: CITIZEN_THEME.borderRadius.md,
    padding: 14,
  },
  summaryItem: {
    alignItems: 'center',
    gap: 4,
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: '800',
    color: CITIZEN_THEME.colors.accent,
  },
  summaryLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: CITIZEN_THEME.colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  summaryDivider: {
    width: 1,
    height: 30,
    backgroundColor: CITIZEN_THEME.colors.border,
  },
  summaryAddress: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  summaryAddressText: {
    flex: 1,
    fontSize: 12,
    color: CITIZEN_THEME.colors.textSecondary,
  },
});
