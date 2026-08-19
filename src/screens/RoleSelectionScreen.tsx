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
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

export type Role = "citizen" | "enumerator" | "admin";

interface RoleCardProps {
  role: Role;
  title: string;
  description: string;
  onPress: () => void;
}

const RoleCard = ({
  role,
  title,
  description,
  onPress,
}: RoleCardProps) => {
  const getIcon = () => {
    if (role === "citizen") {
      return (
        <Ionicons
          name="person"
          size={32}
          color="#9DB0C5"
        />
      );
    }

    if (role === "enumerator") {
      return (
        <MaterialCommunityIcons
          name="file-document-edit"
          size={34}
          color="#9DB0C5"
        />
      );
    }

    return (
      <MaterialCommunityIcons
        name="shield-account"
        size={34}
        color="#9DB0C5"
      />
    );
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={styles.roleCard}
      onPress={onPress}
    >
      <View style={styles.iconContainer}>{getIcon()}</View>

      <View style={styles.cardContent}>
        <Text style={styles.roleTitle}>{title}</Text>
        <Text style={styles.roleDescription}>{description}</Text>
      </View>
    </TouchableOpacity>
  );
};

interface RoleSelectionScreenProps {
  onSelectRole?: (role: Role) => void;
  onHelpPress?: () => void;
}

export default function RoleSelectionScreen({
  onSelectRole,
  onHelpPress,
}: RoleSelectionScreenProps) {
  const handleRoleSelect = (role: Role) => {
    console.log("Selected role:", role);
    if (onSelectRole) {
      onSelectRole(role);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#F5F8FA"
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Welcome to Sentinels</Text>

            <Text style={styles.subtitle}>
              Select your role to continue
            </Text>
          </View>

          {/* Roles */}
          <View style={styles.rolesContainer}>
            <RoleCard
              role="citizen"
              title="Citizen"
              description="Report your household and find government schemes"
              onPress={() => handleRoleSelect("citizen")}
            />

            <RoleCard
              role="enumerator"
              title="Enumerator"
              description="Field data collection and zone verification"
              onPress={() => handleRoleSelect("enumerator")}
            />

            <RoleCard
              role="admin"
              title="Admin"
              description="System oversight, GIS analysis, and command center"
              onPress={() => handleRoleSelect("admin")}
            />
          </View>

          {/* Help */}
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.helpButton}
            onPress={() => {
              if (onHelpPress) {
                onHelpPress();
              } else {
                console.log("Help pressed");
              }
            }}
          >
            <Text style={styles.helpText}>Need help?</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F5F8FA",
  },

  scrollContent: {
    flexGrow: 1,
  },

  container: {
    flex: 1,
    paddingHorizontal: 18,
    paddingBottom: 24,
  },

  header: {
    alignItems: "center",
    paddingTop: 38,
    paddingBottom: 48,
  },

  title: {
    fontSize: 42,
    lineHeight: 48,
    fontWeight: "800",
    color: "#17293D",
    textAlign: "center",
    letterSpacing: -1.2,
  },

  subtitle: {
    marginTop: 32,
    fontSize: 24,
    lineHeight: 32,
    fontWeight: "600",
    color: "#454B52",
    textAlign: "center",
  },

  rolesContainer: {
    gap: 20,
  },

  roleCard: {
    minHeight: 120,
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: "#C9CDD2",
    borderRadius: 15,

    flexDirection: "row",
    alignItems: "center",

    paddingHorizontal: 20,
    paddingVertical: 18,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 3,

    elevation: 2,
  },

  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: "#2B4055",

    alignItems: "center",
    justifyContent: "center",

    marginRight: 20,
  },

  cardContent: {
    flex: 1,
  },

  roleTitle: {
    fontSize: 24,
    lineHeight: 30,
    fontWeight: "700",
    color: "#17293D",
    marginBottom: 6,
  },

  roleDescription: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "400",
    color: "#4B5056",
  },

  helpButton: {
    alignItems: "center",
    marginTop: 32,
    marginBottom: 20,
  },

  helpText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#00669D",
  },
});
