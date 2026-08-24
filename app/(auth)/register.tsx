import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { registerWithRole } from "@/src/features/auth/authService";

import { AuthCard } from "@/src/features/auth/components/AuthCard";
import { AuthHeader } from "@/src/features/auth/components/AuthHeader";
import { AuthInputField } from "@/src/features/auth/components/AuthInputField";
import { AuthPasswordField } from "@/src/features/auth/components/AuthPasswordField";
import { AuthFooter } from "@/src/features/auth/components/AuthFooter";
import { RoleBadge } from "@/src/features/auth/components/RoleBadge";
import { CITIZEN_AUTH_THEME } from "@/src/features/auth/theme";

const STATES = [
  "Uttar Pradesh",
  "Delhi",
  "Maharashtra",
  "Karnataka",
  "Tamil Nadu",
  "Rajasthan",
  "Gujarat",
];

export default function Register() {
  const router = useRouter();
  const t = CITIZEN_AUTH_THEME;

  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [state, setState] = useState("");
  const [pinCode, setPinCode] = useState("");
  const [showStates, setShowStates] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegister = async () => {
    if (!fullName.trim()) {
      alert("Please enter your full name.");
      return;
    }

    if (!mobile.trim() || !password.trim()) {
      alert("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      await registerWithRole("citizen", {
        fullName,
        mobile,
        password,
        state,
        district: "",
        pinCode,
      });
      await AsyncStorage.setItem("hasOnboarded", "true");
      router.replace("/(citizen)/dashboard");
    } catch (error: any) {
      console.error("Register error:", error);
      alert(error?.message ?? "Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: t.colors.background }]}>
      <KeyboardAvoidingView
        style={styles.keyboard}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.container}>
            {/* Back */}
            <TouchableOpacity
              style={[styles.backButton, { borderRadius: t.borderRadius.md }]}
              onPress={() => router.back()}
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back" size={20} color={t.colors.accent} />
              <Text style={[styles.backText, { color: t.colors.accent }]}>Back</Text>
            </TouchableOpacity>

            <AuthCard theme={t}>
              {/* Role Badge */}
              <RoleBadge theme={t} role="citizen" />

              {/* Header */}
              <AuthHeader
                theme={t}
                role="citizen"
                subtitle="Create your citizen account"
              />

              {/* Full Name */}
              <AuthInputField
                theme={t}
                label="Full Name"
                placeholder="Enter your full name"
                value={fullName}
                onChangeText={setFullName}
                icon={
                  <Ionicons
                    name="person-outline"
                    size={20}
                    color={t.colors.textMuted}
                  />
                }
              />

              {/* Mobile */}
              <AuthInputField
                theme={t}
                label="Mobile Number"
                placeholder="10-digit mobile number"
                value={mobile}
                onChangeText={setMobile}
                keyboardType="phone-pad"
                icon={
                  <Ionicons
                    name="phone-portrait-outline"
                    size={20}
                    color={t.colors.textMuted}
                  />
                }
              />

              {/* Password */}
              <AuthPasswordField
                theme={t}
                label="Password"
                placeholder="Create a secure password"
                value={password}
                onChangeText={setPassword}
              />

              {/* State Dropdown */}
              <View style={styles.field}>
                <Text style={[styles.label, { color: t.colors.textSecondary }]}>STATE</Text>
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={[
                    styles.inputContainer,
                    {
                      backgroundColor: t.colors.inputBackground,
                      borderColor: t.colors.borderInput,
                      borderRadius: t.borderRadius.md,
                    },
                  ]}
                  onPress={() => setShowStates(!showStates)}
                >
                  <View style={styles.iconWrap}>
                    <Ionicons
                      name="map-outline"
                      size={20}
                      color={t.colors.textMuted}
                    />
                  </View>
                  <Text
                    style={[
                      styles.dropdownValue,
                      { color: state ? t.colors.textPrimary : t.colors.textMuted },
                    ]}
                  >
                    {state || "Select State"}
                  </Text>
                  <Ionicons
                    name={showStates ? "chevron-up" : "chevron-down"}
                    size={18}
                    color={t.colors.textMuted}
                  />
                </TouchableOpacity>
                {showStates && (
                  <View
                    style={[
                      styles.dropdown,
                      {
                        backgroundColor: t.colors.cardBackground,
                        borderColor: t.colors.borderInput,
                        borderRadius: t.borderRadius.md,
                      },
                    ]}
                  >
                    {STATES.map((item) => (
                      <TouchableOpacity
                        key={item}
                        style={[styles.dropdownItem, { borderBottomColor: t.colors.border }]}
                        onPress={() => {
                          setState(item);
                          setShowStates(false);
                        }}
                      >
                        <Text style={[styles.dropdownText, { color: t.colors.textPrimary }]}>
                          {item}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>

              {/* PIN Code */}
              <AuthInputField
                theme={t}
                label="Pin Code"
                placeholder="6-digit postal code"
                value={pinCode}
                onChangeText={setPinCode}
                keyboardType="number-pad"
                icon={
                  <Ionicons
                    name="location-outline"
                    size={20}
                    color={t.colors.textMuted}
                  />
                }
              />

              {/* Create Account Button */}
              <TouchableOpacity
                activeOpacity={0.8}
                style={[
                  styles.primaryButton,
                  {
                    backgroundColor: t.colors.accent,
                    borderRadius: t.borderRadius.md,
                  },
                  isSubmitting && styles.primaryButtonDisabled,
                ]}
                onPress={handleRegister}
                disabled={isSubmitting}
              >
                <Text style={[styles.primaryButtonText, { color: t.colors.textWhite }]}>
                  {isSubmitting ? "Please wait..." : "Create Account"}
                </Text>
                <Ionicons name="arrow-forward" size={20} color={t.colors.textWhite} />
              </TouchableOpacity>

              {/* Login Link */}
              <View style={styles.loginContainer}>
                <Text style={[styles.loginText, { color: t.colors.textSecondary }]}>
                  Already have an account?{" "}
                </Text>
                <TouchableOpacity
                  onPress={() =>
                    router.push({ pathname: "/(auth)/login", params: { role: "citizen" } })
                  }
                >
                  <Text style={[styles.loginLink, { color: t.colors.accent }]}>Log in</Text>
                </TouchableOpacity>
              </View>

              {/* Footer */}
              <AuthFooter theme={t} />
            </AuthCard>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/* ---------------- Styles ---------------- */

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    marginTop: -30,
  },

  keyboard: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
    paddingVertical: 16,
  },

  container: {
    width: "92%",
    maxWidth: 480,
    alignSelf: "center",
  },

  backButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 12,
    paddingVertical: 6,
    paddingHorizontal: 4,
    alignSelf: "flex-start",
  },

  backText: {
    fontSize: 15,
    fontWeight: "600",
  },

  /* Dropdown */

  field: {
    marginBottom: 20,
  },

  label: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1.2,
    marginBottom: 8,
    textTransform: "uppercase",
  },

  inputContainer: {
    height: 52,
    borderWidth: 1.5,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
  },

  iconWrap: {
    marginRight: 12,
    width: 24,
    alignItems: "center",
  },

  dropdownValue: {
    flex: 1,
    fontSize: 16,
  },

  dropdown: {
    borderWidth: 1,
    marginTop: 4,
  },

  dropdownItem: {
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderBottomWidth: 1,
  },

  dropdownText: {
    fontSize: 15,
  },

  /* Button */

  primaryButton: {
    height: 52,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    marginTop: 8,
  },

  primaryButtonDisabled: {
    opacity: 0.6,
  },

  primaryButtonText: {
    fontSize: 16,
    fontWeight: "700",
  },

  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },

  loginText: {
    fontSize: 14,
  },

  loginLink: {
    fontSize: 14,
    fontWeight: "700",
  },
});
