import { getCitizenHouseholdStatus, signOut } from "@/src/features/auth/authService";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppRadius } from "../../constants/colors";

const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:5001";

const RIPPLE = { color: "rgba(15,23,42,0.10)" };

const selectionHaptic = () => {
  if (Platform.OS === "android") Haptics.selectionAsync();
};

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
      // signOut already cleaned up locally even if the server call failed
      router.replace("/onboarding");
    }
  };

  useEffect(() => {
    const performAccessChecks = async () => {
      try {
        const token = await SecureStore.getItemAsync("citizen_token");
        
        // Guard 1: Must be logged in
        if (!token) {
          console.log("❌ No citizen JWT found. Redirecting to login...");
          router.replace({ pathname: "/(auth)/login", params: { role: "citizen" } });
          return;
        }

        // Guard 2: Must have completed household profile
        const status = await getCitizenHouseholdStatus();
        if (!status.completed) {
          console.log("⚠️ Household form not completed. Redirecting to form...");
          router.replace("/(citizen)/household");
          return;
        }

        setHouseholdStatus(status.completed ? "Verified" : "Pending");

        // Fetch household profile data for dashboard preview
        if (status.completed) {
          try {
            const profileResponse = await fetch(
              `${API_URL}/api/household/me`,
              {
                method: "GET",
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              }
            );
            if (profileResponse.ok) {
              const profileResult = await profileResponse.json();
              setHouseholdProfile(profileResult.household ?? null);
            }
          } catch (err) {
            console.error("Failed to fetch household profile:", err);
          }
        }

        // Both checks passed
        setCheckingStatus(false);
        console.log("✅ Authenticated & household profile completed.");
      } catch (error) {
        console.error("❌ Access check failed:", error);
        // Fallback to onboarding or login on persistent network/auth failures
        router.replace({ pathname: "/(auth)/login", params: { role: "citizen" } });
      }
    };

    performAccessChecks();
  }, [router]);

  if (checkingStatus) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#0F172A" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.brand}>Hello, Citizen</Text>
          <Text style={styles.headerSub}>Welcome to your central civic hub.</Text>
        </View>
        <Pressable
          onPress={handleSignOut}
          onPressIn={() => {
            if (Platform.OS === "android") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }}
          style={styles.signOutBtn}
          android_ripple={{ ...RIPPLE, borderless: true, radius: 24 }}
          hitSlop={8}
        >
          <Ionicons name="log-out-outline" size={20} color="#111111" />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={styles.body}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.householdPanel}>
          <View style={styles.householdTopRow}>
            <View style={styles.householdIconBox}>
              <Ionicons name="home-outline" size={20} color="#FFFFFF" />
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
                color="#FFFFFF"
              />
              <Text style={styles.badgeText}>{householdStatus}</Text>
            </View>
          </View>

          {householdProfile && (
            <View style={styles.householdSummary}>
              <View style={styles.summaryRow}>
                <Ionicons name="location-outline" size={14} color="#6B7280" />
                <Text style={styles.summaryText}>
                  {householdProfile.house_no}, {householdProfile.locality}, {householdProfile.ward}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Ionicons name="people-outline" size={14} color="#6B7280" />
                <Text style={styles.summaryText}>
                  {householdProfile.male_members} Male · {householdProfile.female_members} Female · {householdProfile.children_count} Children
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Ionicons name="call-outline" size={14} color="#6B7280" />
                <Text style={styles.summaryText}>
                  {householdProfile.head_mobile_number}
                </Text>
              </View>
            </View>
          )}

          <Pressable
            style={styles.householdButton}
            android_ripple={{ color: "rgba(255,255,255,0.18)" }}
            onPressIn={selectionHaptic}
            onPress={() => router.push("/(citizen)/household")}
          >
            <Text style={styles.householdButtonText}>
              {householdProfile ? "View Details" : "Register Now"}
            </Text>
          </Pressable>
        </View>

        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.grid}>
          <ActionCard
            icon="person-add-outline"
            label={householdProfile ? "View Household" : "Register Household"}
            onPress={() => router.push("/(citizen)/household")}
          />
          <ActionCard
            icon="checkmark-done-outline"
            label="Was I Counted?"
          />
          <ActionCard
            icon="alert-circle-outline"
            label="Report Missing Household"
          />
          <ActionCard
            icon="headset-outline"
            label="Report a Need"
            onPress={() => router.push("/(citizen)/support")}
          />
          <ActionCard
            icon="business-outline"
            label="Find Government Schemes"
            onPress={() => router.push("/(citizen)/schemes")}
          />
          <ActionCard
            icon="trending-up-outline"
            label="Track My Requests"
            onPress={() => router.push("/(citizen)/household")}
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

function ActionCard({
  icon,
  label,
  onPress,
}: {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  label: string;
  onPress?: () => void;
}) {
  return (
    <Pressable
      style={styles.card}
      disabled={!onPress}
      android_ripple={onPress ? RIPPLE : undefined}
      onPressIn={onPress ? selectionHaptic : undefined}
      onPress={onPress}
    >
      <View style={styles.cardIcon}>
        <Ionicons name={icon} size={22} color="#1E293B" />
      </View>
      <Text style={styles.cardLabel}>{label}</Text>
    </Pressable>
  );
}

function ActivityItem({
  title,
  text,
  time,
}: {
  title: string;
  text: string;
  time: string;
}) {
  return (
    <View style={styles.activityItem}>
      <View style={styles.activityIconWrap}>
        <Ionicons name="checkmark-circle-outline" size={18} color="#1E293B" />
      </View>
      <View style={styles.activityCopy}>
        <Text style={styles.activityTitle}>{title}</Text>
        <Text style={styles.activityText}>{text}</Text>
        <Text style={styles.activityTime}>{time}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  headerLeft: {
    gap: 2,
  },
  brand: {
    color: "#1E293B",
    fontSize: 40,
    fontWeight: "700",
  },
  headerSub: {
    color: "#4B5563",
    fontSize: 15,
  },
  signOutBtn: {
    width: 48,
    height: 48,
    borderRadius: AppRadius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  body: {
    padding: 20,
    gap: 18,
  },
  householdPanel: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: AppRadius.lg,
    padding: 16,
    gap: 14,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
  },
  householdTopRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  householdIconBox: {
    width: 42,
    height: 42,
    borderRadius: AppRadius.md,
    backgroundColor: "#1E293B",
    alignItems: "center",
    justifyContent: "center",
  },
  householdCopy: {
    flex: 1,
  },
  householdPanelTitle: {
    color: "#111827",
    fontSize: 30,
    fontWeight: "700",
  },
  householdId: {
    marginTop: 3,
    color: "#6B7280",
    fontSize: 11,
    fontWeight: "600",
    fontVariant: ["tabular-nums"],
  },
  householdSummary: {
    gap: 6,
    paddingTop: 4,
    paddingBottom: 2,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  summaryText: {
    color: "#374151",
    fontSize: 12,
    fontWeight: "500",
    flex: 1,
    fontVariant: ["tabular-nums"],
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0C79B4",
    borderRadius: AppRadius.sm,
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 5,
  },
  badgeVerified: {
    backgroundColor: "#059669",
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "700",
  },
  householdButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1E293B",
    borderRadius: AppRadius.md,
    paddingVertical: 12,
    overflow: "hidden",
  },
  householdButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  sectionTitle: {
    color: "#1F2937",
    fontSize: 22,
    fontWeight: "700",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 12,
  },
  card: {
    width: "48%",
    minHeight: 146,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: AppRadius.lg,
    padding: 14,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    overflow: "hidden",
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  cardIcon: {
    width: 46,
    height: 46,
    borderRadius: AppRadius.md,
    backgroundColor: "#EFF2F5",
    alignItems: "center",
    justifyContent: "center",
  },
  cardLabel: {
    color: "#111827",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
  activityList: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: AppRadius.lg,
    overflow: "hidden",
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  activityItem: {
    flexDirection: "row",
    gap: 10,
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  activityIconWrap: {
    width: 30,
    height: 30,
    borderRadius: AppRadius.md,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  activityCopy: {
    flex: 1,
    gap: 2,
  },
  activityTitle: {
    fontSize: 13,
    color: "#111827",
    fontWeight: "700",
  },
  activityText: {
    fontSize: 13,
    color: "#374151",
    lineHeight: 18,
  },
  activityTime: {
    marginTop: 2,
    fontSize: 11,
    color: "#6B7280",
    letterSpacing: 0.3,
    fontVariant: ["tabular-nums"],
  },
  bottomSpacer: {
    height: 24,
  },
});
