import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  ScrollView,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { signOut } from "@/src/features/auth/authService";

export default function EnumeratorDashboard() {
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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <MaterialCommunityIcons
            name="satellite-variant"
            size={26}
            color="#38BDF8"
          />
          <Text style={styles.brand}>FieldLink GIS</Text>
        </View>
        <TouchableOpacity onPress={handleSignOut} style={styles.signOutBtn}>
          <MaterialCommunityIcons name="logout" size={20} color="#94A3B8" />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.body}
        showsVerticalScrollIndicator={false}
      >
        {/* Welcome */}
        <View style={styles.welcomeCard}>
          <MaterialCommunityIcons
            name="shield-account-outline"
            size={40}
            color="#38BDF8"
          />
          <Text style={styles.welcomeTitle}>Enumerator Dashboard</Text>
          <Text style={styles.welcomeSub}>
            Field data collection and zone verification
          </Text>
        </View>

        {/* Quick-action grid */}
        <View style={styles.grid}>
          <ActionCard
            icon="home-search-outline"
            label="Household Survey"
            color="#6366F1"
          />
          <ActionCard
            icon="map-marker-radius-outline"
            label="Zone Verification"
            color="#10B981"
          />
          <ActionCard
            icon="clipboard-list-outline"
            label="My Assignments"
            color="#F59E0B"
          />
          <ActionCard
            icon="upload-outline"
            label="Sync Data"
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
  icon: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
  label: string;
  color: string;
}) {
  return (
    <TouchableOpacity style={styles.card}>
      <View style={[styles.cardIcon, { backgroundColor: color + "20" }]}>
        <MaterialCommunityIcons name={icon} size={28} color={color} />
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
