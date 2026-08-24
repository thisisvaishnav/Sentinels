import { getCitizenHouseholdStatus, signOut } from "@/src/features/auth/authService";
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
import { useCitizenDrawer } from "@/src/contexts/CitizenDrawerContext";

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
          router.replace("/(citizen)/household");
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
        <ActivityIndicator size="large" color="#0EA5E9" />
      </SafeAreaView>
    );
  }

  const firstName = householdProfile?.head_full_name?.split(" ")[0] ?? "Citizen";
  const locationLabel = householdProfile
    ? `${householdProfile.locality} · Ward ${householdProfile.ward}`
    : "No location set";

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        {/* Top Bar */}
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.iconBtn} onPress={openDrawer}>
            <Ionicons name="menu" size={22} color="#1E293B" />
          </TouchableOpacity>
          <View style={styles.topBarCenter}>
            <View style={styles.appIcon}>
              <Ionicons name="globe-outline" size={18} color="#0EA5E9" />
            </View>
            <View>
              <Text style={styles.appName}>Drishti</Text>
              <Text style={styles.appSubtitle}>
                {householdProfile?.head_full_name ?? "Citizen"} · Zone
              </Text>
            </View>
          </View>
          <View style={styles.topBarRight}>
            <View style={styles.onlineBadge}>
              <View style={styles.onlineDot} />
              <Text style={styles.onlineText}>Online</Text>
            </View>
            <TouchableOpacity style={styles.iconBtn}>
              <Ionicons name="notifications-outline" size={20} color="#1E293B" />
              <View style={styles.notifBadge}>
                <Text style={styles.notifBadgeText}>3</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSignOut} style={styles.iconBtn}>
              <Ionicons name="log-out-outline" size={20} color="#1E293B" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Greeting Card */}
        <View style={styles.greetingCard}>
          <View style={styles.greetingRow}>
            <View style={styles.avatarCircle}>
              <Ionicons name="person" size={28} color="#0EA5E9" />
            </View>
            <View style={styles.greetingCopy}>
              <Text style={styles.greetingLabel}>Good morning,</Text>
              <Text style={styles.greetingName}>{firstName}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.locationPill} activeOpacity={0.7}>
            <Ionicons name="location" size={14} color="#0EA5E9" />
            <Text style={styles.locationText}>{locationLabel}</Text>
            <Ionicons name="chevron-forward" size={14} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        {/* Today's Progress */}
        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>Today{"'"}s Progress</Text>
            <Text style={styles.progressPercent}>36% Covered</Text>
          </View>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: "36%" }]} />
          </View>
          <View style={styles.progressCols}>
            <View style={styles.progressCol}>
              <Text style={styles.progressColLabel}>ASSIGNED</Text>
              <Text style={styles.progressColValue}>14</Text>
            </View>
            <View style={styles.progressCol}>
              <Text style={[styles.progressColLabel, { color: "#059669" }]}>COMPLETED</Text>
              <Text style={[styles.progressColValue, { color: "#059669" }]}>5</Text>
            </View>
            <View style={styles.progressCol}>
              <Text style={[styles.progressColLabel, { color: "#DC2626" }]}>REMAINING</Text>
              <Text style={[styles.progressColValue, { color: "#DC2626" }]}>7</Text>
            </View>
          </View>
        </View>

        {/* Priority Tasks */}
        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>Priority Tasks</Text>
          <TouchableOpacity>
            <Text style={styles.viewAllLink}>View All →</Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.priorityRow}
        >
          <View style={styles.priorityCard}>
            <View style={styles.priorityCardHeader}>
              <View style={[styles.priorityIcon, { backgroundColor: "#FEE2E2" }]}>
                <Ionicons name="home" size={18} color="#DC2626" />
              </View>
              <Text style={[styles.priorityCount, { color: "#DC2626" }]}>8</Text>
            </View>
            <Text style={styles.priorityLabel}>High-Priority House...</Text>
            <Text style={styles.prioritySub}>urgent surveys</Text>
          </View>
          <View style={styles.priorityCard}>
            <View style={styles.priorityCardHeader}>
              <View style={[styles.priorityIcon, { backgroundColor: "#FEF3C7" }]}>
                <Ionicons name="wifi" size={18} color="#D97706" />
              </View>
              <Text style={[styles.priorityCount, { color: "#D97706" }]}>3</Text>
            </View>
            <Text style={styles.priorityLabel}>Blind-Spot Areas</Text>
            <Text style={styles.prioritySub}>unmapped clusters</Text>
          </View>
          <View style={styles.priorityCard}>
            <View style={styles.priorityCardHeader}>
              <View style={[styles.priorityIcon, { backgroundColor: "#DBEAFE" }]}>
                <Ionicons name="alert-circle" size={18} color="#2563EB" />
              </View>
              <Text style={[styles.priorityCount, { color: "#2563EB" }]}>5</Text>
            </View>
            <Text style={styles.priorityLabel}>Unverified Entries</Text>
            <Text style={styles.prioritySub}>pending review</Text>
          </View>
        </ScrollView>

        {/* Assigned Zone */}
        <View style={styles.zoneCard}>
          <View style={styles.zoneHeader}>
            <View style={styles.zoneTitleRow}>
              <Ionicons name="location-outline" size={20} color="#0EA5E9" />
              <View>
                <Text style={styles.zoneLabel}>ASSIGNED ZONE</Text>
                <Text style={styles.zoneTitle}>Zone {householdProfile?.locality ?? "A-12"} · Ward {householdProfile?.ward ?? "12"}</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </View>
          <Text style={styles.zoneSub}>{householdProfile?.locality ?? "Shiv Nagar"} (East & West)</Text>
          <View style={styles.zoneStatsRow}>
            <View style={styles.zoneStat}>
              <Text style={styles.zoneStatLabel}>Households</Text>
              <Text style={styles.zoneStatValue}>{householdProfile?.total_members ?? 14}</Text>
            </View>
            <View style={styles.zoneStat}>
              <Text style={styles.zoneStatLabel}>Completed</Text>
              <Text style={styles.zoneStatValue}>5</Text>
            </View>
            <View style={styles.zoneStat}>
              <Text style={styles.zoneStatLabel}>Coverage</Text>
              <Text style={[styles.zoneStatValue, { color: "#0EA5E9" }]}>36%</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.routeBtn} activeOpacity={0.8}>
            <Ionicons name="navigate" size={18} color="#FFFFFF" />
            <Text style={styles.routeBtnText}>View Route Map</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Actions */}
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
            label="Report Missing"
          />
          <ActionCard
            icon="headset-outline"
            label="Report a Need"
            onPress={() => router.push("/(citizen)/support")}
          />
          <ActionCard
            icon="business-outline"
            label="Find Schemes"
            onPress={() => router.push("/(citizen)/schemes")}
          />
          <ActionCard
            icon="trending-up-outline"
            label="Track Requests"
            onPress={() => router.push("/(citizen)/household")}
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
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.cardIcon}>
        <Ionicons name={icon} size={22} color="#1E293B" />
      </View>
      <Text style={styles.cardLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F1F5F9",
  },
  body: {
    padding: 16,
    gap: 16,
  },

  /* Top Bar */
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  topBarCenter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  topBarRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  appIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#E0F2FE",
    alignItems: "center",
    justifyContent: "center",
  },
  appName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
  },
  appSubtitle: {
    fontSize: 12,
    color: "#6B7280",
  },
  onlineBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ECFDF5",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    gap: 5,
  },
  onlineDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#10B981",
  },
  onlineText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#059669",
  },
  iconBtn: {
    padding: 6,
    position: "relative",
  },
  notifBadge: {
    position: "absolute",
    top: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#DC2626",
    alignItems: "center",
    justifyContent: "center",
  },
  notifBadgeText: {
    fontSize: 9,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  /* Greeting Card */
  greetingCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 18,
    gap: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  greetingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  avatarCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#E0F2FE",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#BAE6FD",
  },
  greetingCopy: {
    gap: 2,
  },
  greetingLabel: {
    fontSize: 14,
    color: "#6B7280",
  },
  greetingName: {
    fontSize: 22,
    fontWeight: "700",
    color: "#0F172A",
  },
  locationPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  locationText: {
    flex: 1,
    fontSize: 13,
    fontWeight: "500",
    color: "#374151",
  },

  /* Progress Card */
  progressCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 18,
    gap: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  progressTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#0F172A",
  },
  progressPercent: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0EA5E9",
  },
  progressBarBg: {
    height: 8,
    borderRadius: 4,
    backgroundColor: "#E2E8F0",
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 4,
    backgroundColor: "#0EA5E9",
  },
  progressCols: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  progressCol: {
    alignItems: "center",
    flex: 1,
  },
  progressColLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#6B7280",
    letterSpacing: 0.5,
  },
  progressColValue: {
    fontSize: 28,
    fontWeight: "800",
    color: "#0F172A",
    marginTop: 2,
  },

  /* Section Row */
  sectionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
  },
  viewAllLink: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0EA5E9",
  },

  /* Priority Tasks */
  priorityRow: {
    gap: 12,
  },
  priorityCard: {
    width: 170,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  priorityCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  priorityIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  priorityCount: {
    fontSize: 24,
    fontWeight: "800",
  },
  priorityLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0F172A",
  },
  prioritySub: {
    fontSize: 12,
    color: "#9CA3AF",
  },

  /* Zone Card */
  zoneCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 18,
    gap: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  zoneHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  zoneTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  zoneLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#9CA3AF",
    letterSpacing: 0.5,
  },
  zoneTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#0F172A",
    marginTop: 2,
  },
  zoneSub: {
    fontSize: 13,
    color: "#6B7280",
    marginLeft: 30,
  },
  zoneStatsRow: {
    flexDirection: "row",
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    padding: 14,
    marginTop: 6,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  zoneStat: {
    flex: 1,
    alignItems: "center",
  },
  zoneStatLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#9CA3AF",
  },
  zoneStatValue: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0F172A",
    marginTop: 2,
  },
  routeBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0EA5E9",
    borderRadius: 12,
    paddingVertical: 13,
    gap: 8,
    marginTop: 6,
  },
  routeBtnText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  /* Quick Actions Grid */
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 12,
  },
  card: {
    width: "48%",
    minHeight: 110,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 14,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  cardIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  cardLabel: {
    color: "#111827",
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
  },

  bottomSpacer: {
    height: 24,
  },
});
