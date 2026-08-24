import { AppColors } from "@/constants/colors";
import { getCitizenHouseholdStatus, signOut } from "@/src/features/auth/authService";
import ActivityItem from "@/src/components/citizen/ActivityItem";
import QuickActionCard from "@/src/components/citizen/QuickActionCard";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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
          router.replace("/(citizen)/(tabs)/household");
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
        <ActivityIndicator size="large" color={AppColors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.brand}>Hello, Citizen</Text>
          <Text style={styles.headerSub}>Welcome to your central civic hub.</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity
            onPress={() => router.push('/(citizen)/notifications')}
            style={styles.headerIconBtn}
          >
            <Ionicons name="notifications-outline" size={20} color={AppColors.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSignOut} style={styles.signOutBtn}>
            <Ionicons name="log-out-outline" size={20} color={AppColors.textPrimary} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.householdPanel}>
          <View style={styles.householdTopRow}>
            <View style={styles.householdIconBox}>
              <Ionicons name="home-outline" size={20} color={AppColors.textWhite} />
            </View>
            <View style={styles.householdCopy}>
              <Text style={styles.householdPanelTitle}>My Household</Text>
              {householdProfile ? (
                <Text style={styles.householdId}>
                  {householdProfile.head_full_name} · {householdProfile.total_members} members
                </Text>
              ) : (
                <Text style={styles.householdId}>No profile registered</Text>
              )}
            </View>
            <View style={[styles.badge, householdProfile && styles.badgeVerified]}>
              <Ionicons
                name={householdProfile ? "checkmark-circle" : "time-outline"}
                size={12}
                color={AppColors.textWhite}
              />
              <Text style={styles.badgeText}>{householdStatus}</Text>
            </View>
          </View>

          {householdProfile && (
            <View style={styles.householdSummary}>
              <View style={styles.summaryRow}>
                <Ionicons name="location-outline" size={14} color={AppColors.textMuted} />
                <Text style={styles.summaryText}>
                  {householdProfile.house_no}, {householdProfile.locality}, {householdProfile.ward}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Ionicons name="people-outline" size={14} color={AppColors.textMuted} />
                <Text style={styles.summaryText}>
                  {householdProfile.male_members} Male · {householdProfile.female_members} Female · {householdProfile.children_count} Children
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Ionicons name="call-outline" size={14} color={AppColors.textMuted} />
                <Text style={styles.summaryText}>
                  {householdProfile.head_mobile_number}
                </Text>
              </View>
            </View>
          )}

          <TouchableOpacity
            style={styles.householdButton}
            activeOpacity={0.8}
            onPress={() => router.push("/(citizen)/(tabs)/household")}
          >
            <Text style={styles.householdButtonText}>
              {householdProfile ? "View Details" : "Register Now"}
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.grid}>
          <QuickActionCard
            icon="person-add-outline"
            label={householdProfile ? "View Household" : "Register Household"}
            onPress={() => router.push("/(citizen)/(tabs)/household")}
          />
          <QuickActionCard
            icon="checkmark-done-outline"
            label="Was I Counted?"
          />
          <QuickActionCard
            icon="alert-circle-outline"
            label="Report Missing Household"
          />
          <QuickActionCard
            icon="headset-outline"
            label="Report a Need"
            onPress={() => router.push("/(citizen)/report-need")}
          />
          <QuickActionCard
            icon="business-outline"
            label="Find Government Schemes"
            onPress={() => router.push("/(citizen)/(tabs)/schemes")}
          />
          <QuickActionCard
            icon="trending-up-outline"
            label="Track My Requests"
            onPress={() => router.push("/(citizen)/(tabs)/household")}
          />
        </View>

        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <View style={styles.activityList}>
          <ActivityItem
            title="Household Verification Complete"
            text="Your household details have been successfully verified by the regional team."
            time="Oct 12, 2023 · 14:30"
          />
          <ActivityItem
            title="Survey Submitted: Water Access"
            text="Thank you for participating in the community water infrastructure survey."
            time="Oct 08, 2023 · 10:12"
          />
          <ActivityItem
            title="Scheme Match Updated"
            text="You have 2 new welfare scheme recommendations based on your profile."
            time="Oct 04, 2023 · 17:42"
          />
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.bgMain,
    marginTop: -30,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.border,
  },
  headerLeft: {
    gap: 2,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerIconBtn: {
    padding: 6,
  },
  brand: {
    color: AppColors.textPrimary,
    fontSize: 40,
    fontWeight: "700",
  },
  headerSub: {
    color: AppColors.textSecondary,
    fontSize: 15,
  },
  signOutBtn: {
    padding: 6,
  },
  body: {
    padding: 20,
    gap: 18,
  },
  householdPanel: {
    backgroundColor: AppColors.bgCard,
    borderWidth: 1,
    borderColor: AppColors.border,
    borderRadius: 0,
    padding: 16,
    gap: 14,
  },
  householdTopRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  householdIconBox: {
    width: 42,
    height: 42,
    borderRadius: 0,
    backgroundColor: AppColors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  householdCopy: {
    flex: 1,
  },
  householdPanelTitle: {
    color: AppColors.textPrimary,
    fontSize: 30,
    fontWeight: "700",
  },
  householdId: {
    marginTop: 3,
    color: AppColors.textMuted,
    fontSize: 11,
    fontWeight: "600",
  },
  householdSummary: {
    gap: 6,
    paddingTop: 4,
    paddingBottom: 2,
    borderTopWidth: 1,
    borderTopColor: AppColors.border,
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  summaryText: {
    color: AppColors.textSecondary,
    fontSize: 12,
    fontWeight: "500",
    flex: 1,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: AppColors.blue,
    borderRadius: 0,
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 5,
  },
  badgeVerified: {
    backgroundColor: AppColors.success,
  },
  badgeText: {
    color: AppColors.textWhite,
    fontSize: 11,
    fontWeight: "700",
  },
  householdButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: AppColors.primary,
    borderRadius: 0,
    paddingVertical: 10,
  },
  householdButtonText: {
    color: AppColors.textWhite,
    fontSize: 14,
    fontWeight: "700",
  },
  sectionTitle: {
    color: AppColors.textPrimary,
    fontSize: 22,
    fontWeight: "700",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 12,
  },
  activityList: {
    backgroundColor: AppColors.bgCard,
    borderWidth: 1,
    borderColor: AppColors.border,
    borderRadius: 0,
    overflow: "hidden",
  },
  bottomSpacer: {
    height: 24,
  },
});
