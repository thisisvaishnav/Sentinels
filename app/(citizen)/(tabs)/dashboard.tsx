import { getCitizenHouseholdStatus, signOut } from "@/src/features/auth/authService";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCitizenDrawer } from "@/src/contexts/CitizenDrawerContext";

import { EnumeratorHeader } from "@/src/features/enumeration/components/EnumeratorHeader";
import { WelcomeSection } from "@/src/features/enumeration/components/WelcomeSection";
import { ProgressSection } from "@/src/features/enumeration/components/ProgressSection";
import { PriorityTasksSection } from "@/src/features/enumeration/components/PriorityTasksSection";
import { AssignedZoneSection } from "@/src/features/enumeration/components/AssignedZoneSection";
import { QuickActionsSection } from "@/src/features/enumeration/components/QuickActionsSection";
import { CITIZEN_THEME } from "@/src/features/enumeration/theme";
import {
  EnumeratorProfile,
  TodayProgress,
  PriorityTaskMetric,
  AssignedZoneInfo,
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

const citizenProgress: TodayProgress = {
  totalAssigned: 14,
  completed: 5,
  remaining: 7,
  coveragePercentage: 36,
};

const citizenPriorityTasks: PriorityTaskMetric[] = [
  { id: "c1", title: "High-Priority House...", count: 8, unit: "urgent surveys", iconName: "home", color: "#DC2626", badgeBg: "#FEE2E2" },
  { id: "c2", title: "Blind-Spot Areas", count: 3, unit: "unmapped clusters", iconName: "wifi", color: "#D97706", badgeBg: "#FEF3C7" },
  { id: "c3", title: "Unverified Entries", count: 5, unit: "pending review", iconName: "alert-circle", color: "#2563EB", badgeBg: "#DBEAFE" },
];

const citizenQuickActions: QuickActionItem[] = [
  { id: "household", label: "View Household", iconName: "account-outline", color: "#0EA5E9", route: "/(citizen)/household" },
  { id: "counted", label: "Was I Counted?", iconName: "check-circle-outline", color: "#059669" },
  { id: "missing", label: "Report Missing", iconName: "alert-circle-outline", color: "#DC2626" },
  { id: "support", label: "Report a Need", iconName: "headset-outline", color: "#D97706", route: "/(citizen)/support" },
  { id: "schemes", label: "Find Schemes", iconName: "brightness-percent", color: "#7C3AED", route: "/(citizen)/schemes" },
  { id: "track", label: "Track Requests", iconName: "chart-line", color: "#0284C7", route: "/(citizen)/household" },
];

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
    unreadNotificationsCount: 3,
  };

  const citizenZone: AssignedZoneInfo = {
    zoneName: `Zone ${householdProfile?.locality ?? "A-12"} · Ward ${householdProfile?.ward ?? "12"}`,
    subArea: householdProfile?.locality ?? "Shiv Nagar",
    totalHouseholds: householdProfile?.total_members ?? 14,
    completedHouseholds: 5,
    coveragePercentage: 36,
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

        <ProgressSection progress={citizenProgress} theme={CITIZEN_THEME} />

        <PriorityTasksSection
          tasks={citizenPriorityTasks}
          theme={CITIZEN_THEME}
          onTaskPress={(task) => {
            if (task.id === "c1") router.push("/(citizen)/household" as any);
          }}
          onViewAll={() => {}}
        />

        <AssignedZoneSection
          zone={citizenZone}
          theme={CITIZEN_THEME}
          onCardPress={() => {}}
          onViewRoute={() => {}}
        />

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
});
