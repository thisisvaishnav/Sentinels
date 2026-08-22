import { getCitizenHouseholdStatus, signOut } from "@/src/features/auth/authService";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function CitizenDashboard() {
  const router = useRouter();
  const [checkingStatus, setCheckingStatus] = useState(true);
  const [householdStatus, setHouseholdStatus] = useState<"Verified" | "Pending">("Pending");

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
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.brand}>Hello, Citizen</Text>
          <Text style={styles.headerSub}>Welcome to your central civic hub.</Text>
        </View>
        <TouchableOpacity onPress={handleSignOut} style={styles.signOutBtn}>
          <Ionicons name="log-out-outline" size={20} color="#111111" />
        </TouchableOpacity>
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
              <Text style={styles.householdId}>ID: H20451</Text>
            </View>
            <View style={styles.badge}>
              <Ionicons name="checkmark-circle" size={12} color="#FFFFFF" />
              <Text style={styles.badgeText}>{householdStatus}</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.householdButton}
            activeOpacity={0.8}
            onPress={() => router.push("/(citizen)/household")}
          >
            <Text style={styles.householdButtonText}>View Details</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.grid}>
          <ActionCard
            icon="person-add-outline"
            label="Register Household"
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
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.cardIcon}>
        <Ionicons name={icon} size={22} color="#1E293B" />
      </View>
      <Text style={styles.cardLabel}>{label}</Text>
    </TouchableOpacity>
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
    padding: 6,
  },
  body: {
    padding: 20,
    gap: 18,
  },
  householdPanel: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 14,
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
    borderRadius: 10,
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
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0C79B4",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 5,
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
    borderRadius: 10,
    paddingVertical: 10,
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
    borderRadius: 8,
    padding: 14,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  cardIcon: {
    width: 46,
    height: 46,
    borderRadius: 12,
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
    borderRadius: 10,
    overflow: "hidden",
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
    borderRadius: 10,
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
  },
  bottomSpacer: {
    height: 24,
  },
});
