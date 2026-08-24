import { ENUMERATOR_THEME } from '@/src/features/enumeration/theme';
import { getCitizenHouseholdStatus, signOut } from "@/src/features/auth/authService";
import CitizenLayout from "@/src/components/citizen/CitizenLayout";
import WelcomeCard from "@/src/components/shared/WelcomeCard";
import ProgressCard from "@/src/components/shared/ProgressCard";
import PriorityTaskCard from "@/src/components/shared/PriorityTaskCard";
import HouseholdSummaryCard from "@/src/components/shared/HouseholdSummaryCard";
import QuickActionsGrid from "@/src/components/shared/QuickActionsGrid";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    View,
} from "react-native";

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

export default function CitizenDashboard() {
  const router = useRouter();
  const [checkingStatus, setCheckingStatus] = useState(true);
  const [householdStatus, setHouseholdStatus] = useState<"Verified" | "Pending">("Pending");
  const [householdProfile, setHouseholdProfile] = useState<HouseholdProfile | null>(null);
  const [userName, setUserName] = useState("Citizen");

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
          router.replace("/(citizen)/household");
          return;
        }

        setHouseholdStatus(status.completed ? "Verified" : "Pending");

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
              const profile = profileResult.household ?? null;
              setHouseholdProfile(profile);
              if (profile?.head_full_name) {
                setUserName(profile.head_full_name.split(' ')[0] || 'Citizen');
              }
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
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={ENUMERATOR_THEME.colors.accent} />
      </View>
    );
  }

  const zoneInfo = householdProfile
    ? `${householdProfile.ward}, ${householdProfile.district}`
    : undefined;

  const priorityTasks = [
    {
      id: '1',
      title: 'Pending Schemes',
      count: 2,
      icon: 'newspaper-outline' as const,
      color: ENUMERATOR_THEME.colors.accent,
      subtitle: 'applications',
    },
    {
      id: '2',
      title: 'Unverified',
      count: householdStatus === 'Pending' ? 1 : 0,
      icon: 'time-outline' as const,
      color: ENUMERATOR_THEME.colors.warning,
      subtitle: 'household',
    },
    {
      id: '3',
      title: 'Notifications',
      count: 3,
      icon: 'notifications-outline' as const,
      color: ENUMERATOR_THEME.colors.success,
      subtitle: 'new',
    },
  ];

  const quickActions = [
    {
      id: 'household',
      icon: 'home-outline' as const,
      label: householdProfile ? 'View Household' : 'Register Household',
      onPress: () => router.push('/(citizen)/household'),
      color: ENUMERATOR_THEME.colors.accent,
    },
    {
      id: 'schemes',
      icon: 'newspaper-outline' as const,
      label: 'Find Schemes',
      onPress: () => router.push('/(citizen)/schemes'),
      color: ENUMERATOR_THEME.colors.success,
    },
    {
      id: 'report',
      icon: 'megaphone-outline' as const,
      label: 'Report Need',
      onPress: () => router.push('/(citizen)/report-need'),
      color: ENUMERATOR_THEME.colors.warning,
    },
    {
      id: 'progress',
      icon: 'stats-chart-outline' as const,
      label: 'Track Requests',
      onPress: () => router.push('/(citizen)/progress'),
      color: ENUMERATOR_THEME.colors.info,
    },
  ];

  return (
    <CitizenLayout userName={userName}>
      <ScrollView
        contentContainerStyle={styles.body}
        showsVerticalScrollIndicator={false}
      >
        {/* Welcome Card */}
        <WelcomeCard
          userName={userName}
          zoneInfo={zoneInfo}
        />

        {/* Today's Progress */}
        <ProgressCard
          title="Today's Progress"
          percentage={householdProfile ? 100 : 0}
          assigned={1}
          completed={householdProfile ? 1 : 0}
          remaining={householdProfile ? 0 : 1}
        />

        {/* Priority Tasks */}
        <PriorityTaskCard tasks={priorityTasks} />

        {/* Household Summary */}
        {householdProfile && (
          <HouseholdSummaryCard
            name={householdProfile.head_full_name}
            members={householdProfile.total_members}
            address={`${householdProfile.house_no}, ${householdProfile.locality}`}
            isVerified={householdStatus === 'Verified'}
            onViewDetails={() => router.push('/(citizen)/household')}
          />
        )}

        {/* Quick Actions */}
        <QuickActionsGrid actions={quickActions} />

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </CitizenLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ENUMERATOR_THEME.colors.background,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  body: {
    padding: 16,
    gap: 20,
  },
  bottomSpacer: {
    height: 32,
  },
});
