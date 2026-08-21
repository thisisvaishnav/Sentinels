import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { signOut } from "@/src/features/auth/authService";
import * as SecureStore from "expo-secure-store";




export default function CitizenDashboard() {
  const router = useRouter();
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
    const loadCitizenProfile = async () => {
      try {
        const token = await SecureStore.getItemAsync("citizen_token");

        if (!token) {
          console.log("❌ No citizen JWT found");
          return;
        }

        const apiUrl =
          process.env.EXPO_PUBLIC_API_URL || "http://localhost:5001";

        const response = await fetch(
          `${apiUrl}/api/auth/citizen/profile`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          console.error("❌ Profile API error:", data);
          return;
        }

        console.log("✅ JWT verified successfully");
        console.log("Citizen profile:", data.user);
      } catch (error) {
        console.error("❌ Failed to load citizen profile:", error);
      }
    };

    loadCitizenProfile();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Ionicons name="person" size={26} color="#38BDF8" />
          <Text style={styles.brand}>Sentinels</Text>
        </View>
        <TouchableOpacity onPress={handleSignOut} style={styles.signOutBtn}>
          <Ionicons name="log-out-outline" size={20} color="#94A3B8" />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.body}
        showsVerticalScrollIndicator={false}
      >
        {/* Welcome */}
        <View style={styles.welcomeCard}>
          <Ionicons name="home" size={40} color="#38BDF8" />
          <Text style={styles.welcomeTitle}>Citizen Dashboard</Text>
          <Text style={styles.welcomeSub}>
            Track your household status and local services
          </Text>
        </View>

        {/* Quick-action grid */}
        <View style={styles.grid}>
          <ActionCard
            icon="home-outline"
            label="My Household"
            color="#6366F1"
          />
          <ActionCard
            icon="clipboard-outline"
            label="Service Requests"
            color="#10B981"
          />
          <ActionCard
            icon="notifications-outline"
            label="Notifications"
            color="#F59E0B"
          />
          <ActionCard
            icon="person-circle-outline"
            label="My Profile"
            color="#EC4899"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function ActionCard({
  icon,
  label,
  color,
}: {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  label: string;
  color: string;
}) {
  return (
    <TouchableOpacity style={styles.card}>
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
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  brand: {
    color: "#F1F5F9",
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0.4,
  },
  signOutBtn: {
    padding: 6,
  },
  body: {
    padding: 20,
    gap: 24,
  },
  welcomeCard: {
    alignItems: "center",
    backgroundColor: "#1E293B",
    borderRadius: 16,
    padding: 28,
    gap: 8,
  },
  welcomeTitle: {
    color: "#F1F5F9",
    fontSize: 22,
    fontWeight: "700",
  },
  welcomeSub: {
    color: "#94A3B8",
    fontSize: 14,
    textAlign: "center",
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
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
  },
});
