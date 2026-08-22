import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { signOut, getCitizenHouseholdStatus } from "@/src/features/auth/authService";
import * as SecureStore from "expo-secure-store";

export default function CitizenDashboard() {
  const router = useRouter();
  const [checkingStatus, setCheckingStatus] = useState(true);

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
        <ActivityIndicator size="large" color="#38BDF8" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.brand}>Sentinels Citizen</Text>
          <Text style={styles.headerSub}>Welcome back</Text>
        </View>
        <TouchableOpacity onPress={handleSignOut} style={styles.signOutBtn}>
          <Ionicons name="log-out-outline" size={20} color="#94A3B8" />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.body}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroCard}>
          <Text style={styles.heroTitle}>Citizen Dashboard</Text>
          <Text style={styles.heroSub}>Track household updates, schemes, and support in one place.</Text>
        </View>

        <View style={styles.statsRow}>
          <StatCard icon="home-outline" title="Household" value="Active" />
          <StatCard icon="time-outline" title="Requests" value="In Progress" />
        </View>

        <View style={styles.householdPanel}>
          <View style={styles.householdPanelHeader}>
            <Ionicons name="location-outline" size={18} color="#38BDF8" />
            <Text style={styles.householdPanelTitle}>Household Profile</Text>
          </View>
          <Text style={styles.householdPanelText}>
            Keep your household details updated for better access to services and benefits.
          </Text>
          <TouchableOpacity
            style={styles.householdButton}
            activeOpacity={0.8}
            onPress={() => router.push("/(citizen)/household")}
          >
            <Text style={styles.householdButtonText}>Manage Household</Text>
            <Ionicons name="arrow-forward" size={16} color="#0F172A" />
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.grid}>
          <ActionCard
            icon="stats-chart-outline"
            label="Progress"
            color="#10B981"
            onPress={() => router.push("/(citizen)/progress")}
          />
          <ActionCard
            icon="newspaper-outline"
            label="Schemes"
            color="#F59E0B"
            onPress={() => router.push("/(citizen)/schemes")}
          />
          <ActionCard
            icon="help-circle-outline"
            label="Support"
            color="#EC4899"
            onPress={() => router.push("/(citizen)/support")}
          />
          <ActionCard
            icon="home-outline"
            label="Household"
            color="#6366F1"
            onPress={() => router.push("/(citizen)/household")}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function StatCard({
  icon,
  title,
  value,
}: {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  title: string;
  value: string;
}) {
  return (
    <View style={styles.statCard}>
      <Ionicons name={icon} size={18} color="#38BDF8" />
      <Text style={styles.statTitle}>{title}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

function ActionCard({
  icon,
  label,
  color,
  onPress,
}: {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  label: string;
  color: string;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.cardIcon, { backgroundColor: color + "20" }]}>
        <Ionicons name={icon} size={28} color={color} />
      </View>
      <Text style={styles.cardLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F172A",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#1E293B",
  },
  headerLeft: {
    gap: 2,
  },
  brand: {
    color: "#F1F5F9",
    fontSize: 20,
    fontWeight: "700",
  },
  headerSub: {
    color: "#94A3B8",
    fontSize: 13,
  },
  signOutBtn: {
    padding: 6,
  },
  body: {
    padding: 20,
    gap: 24,
  },
  heroCard: {
    backgroundColor: "#1E293B",
    borderRadius: 16,
    padding: 20,
    gap: 8,
  },
  heroTitle: {
    color: "#F1F5F9",
    fontSize: 24,
    fontWeight: "700",
  },
  heroSub: {
    color: "#94A3B8",
    fontSize: 14,
    lineHeight: 20,
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#1E293B",
    borderRadius: 14,
    padding: 14,
    gap: 6,
  },
  statTitle: {
    color: "#94A3B8",
    fontSize: 12,
    fontWeight: "600",
  },
  statValue: {
    color: "#E2E8F0",
    fontSize: 15,
    fontWeight: "700",
  },
  householdPanel: {
    backgroundColor: "#111827",
    borderWidth: 1,
    borderColor: "#1E293B",
    borderRadius: 14,
    padding: 16,
    gap: 10,
  },
  householdPanelHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  householdPanelTitle: {
    color: "#E2E8F0",
    fontSize: 15,
    fontWeight: "700",
  },
  householdPanelText: {
    color: "#94A3B8",
    fontSize: 13,
    lineHeight: 19,
  },
  householdButton: {
    marginTop: 4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "#38BDF8",
    borderRadius: 10,
    paddingVertical: 10,
  },
  householdButtonText: {
    color: "#0F172A",
    fontSize: 14,
    fontWeight: "700",
  },
  sectionTitle: {
    color: "#E2E8F0",
    fontSize: 16,
    fontWeight: "700",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 14,
  },
  card: {
    width: "47%",
    backgroundColor: "#1E293B",
    borderRadius: 14,
    padding: 18,
    alignItems: "center",
    gap: 10,
  },
  cardIcon: {
    width: 54,
    height: 54,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  cardLabel: {
    color: "#CBD5E1",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
});
