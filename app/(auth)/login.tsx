import React, { useState } from "react";
import { loginEnumerator, loginWithRole } from "@/src/features/auth/authService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";

import { AuthCard } from "@/src/features/auth/components/AuthCard";
import { AuthHeader } from "@/src/features/auth/components/AuthHeader";
import { AuthInputField } from "@/src/features/auth/components/AuthInputField";
import { AuthPasswordField } from "@/src/features/auth/components/AuthPasswordField";
import { AuthFooter } from "@/src/features/auth/components/AuthFooter";
import { RoleBadge } from "@/src/features/auth/components/RoleBadge";
import { getAuthTheme, AuthRole } from "@/src/features/auth/theme";

export type Role = "citizen" | "enumerator";

export default function Login() {
  const { role: roleParam } = useLocalSearchParams<{ role: Role }>();
  const role: Role = roleParam ?? "citizen";
  const router = useRouter();

  const [firstValue, setFirstValue] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const theme = getAuthTheme(role);
  const isCitizen = role === "citizen";
  const isEnumerator = role === "enumerator";

  const handleLogin = async () => {
    const identifier = firstValue.trim();
    const secret = password.trim();

    if (!identifier || !secret) {
      alert(
        isEnumerator
          ? "Please enter enumerator ID and security key."
          : "Please enter mobile number and password."
      );
      return;
    }

    setIsSubmitting(true);

    if (isCitizen) {
      try {
        await loginWithRole("citizen", { mobile: identifier, password: secret });
        await AsyncStorage.setItem("hasOnboarded", "true");
        router.replace("/(citizen)/dashboard");
      } catch (error: any) {
        console.error("Citizen login error:", error);
        alert(error?.message || "Unable to sign in. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    if (isEnumerator) {
      try {
        const { profile } = await loginEnumerator({
          enumeratorId: identifier,
          securityKey: secret,
        });

        if (!profile) {
          alert("Enumerator profile not found. Contact your administrator.");
          return;
        }

        console.log("Enumerator login success:", profile.employeeCode || profile.enumerator_id);
        await AsyncStorage.setItem('hasOnboarded', 'true');
        router.replace("/(enumerator)/dashboard");
      } catch (error: any) {
        console.error("Enumerator login error:", error);
        const errorMsg =
          error?.message ||
          (error?.status === 400 || error?.code === "invalid_credentials"
            ? "Invalid enumerator ID or security key."
            : "Unable to authenticate. Please check your credentials and try again.");
        alert(errorMsg);
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    setIsSubmitting(false);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]}>
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
              style={[styles.backButton, { borderRadius: theme.borderRadius.md }]}
              onPress={() => router.back()}
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back" size={20} color={theme.colors.accent} />
              <Text style={[styles.backText, { color: theme.colors.accent }]}>Back</Text>
            </TouchableOpacity>

            <AuthCard theme={theme}>
              {/* Role Badge */}
              <RoleBadge theme={theme} role={role} />

              {/* Header */}
              <AuthHeader
                theme={theme}
                role={role}
                subtitle={
                  isCitizen ? "Sign in to your citizen account" : "Secure Enumerator Access"
                }
              />

              {/* Fields */}
              {isCitizen && (
                <>
                  <AuthInputField
                    theme={theme}
                    label="Mobile Number"
                    placeholder="10-digit mobile number"
                    value={firstValue}
                    onChangeText={setFirstValue}
                    keyboardType="phone-pad"
                    icon={
                      <Ionicons
                        name="phone-portrait-outline"
                        size={20}
                        color={theme.colors.textMuted}
                      />
                    }
                  />

                  <AuthPasswordField
                    theme={theme}
                    label="Password"
                    placeholder="Enter your password"
                    value={password}
                    onChangeText={setPassword}
                  />
                </>
              )}

              {isEnumerator && (
                <>
                  <AuthInputField
                    theme={theme}
                    label="Enumerator ID"
                    placeholder="Enter ID"
                    value={firstValue}
                    onChangeText={setFirstValue}
                    icon={
                      <MaterialCommunityIcons
                        name="card-account-details-outline"
                        size={20}
                        color={theme.colors.textMuted}
                      />
                    }
                  />

                  <AuthPasswordField
                    theme={theme}
                    label="Security Key"
                    placeholder="Enter Key"
                    value={password}
                    onChangeText={setPassword}
                    secureField
                    securityHint="Keep your security key confidential"
                  />
                </>
              )}

              {/* Login Button */}
              <TouchableOpacity
                activeOpacity={0.8}
                style={[
                  styles.primaryButton,
                  {
                    backgroundColor: theme.colors.accent,
                    borderRadius: theme.borderRadius.md,
                  },
                  isSubmitting && styles.primaryButtonDisabled,
                ]}
                onPress={handleLogin}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <ActivityIndicator size="small" color={theme.colors.textWhite} />
                ) : (
                  <Ionicons
                    name="arrow-forward"
                    size={20}
                    color={theme.colors.textWhite}
                  />
                )}
                <Text style={[styles.primaryButtonText, { color: theme.colors.textWhite }]}>
                  {isSubmitting
                    ? "Checking..."
                    : isEnumerator
                    ? "Authenticate"
                    : "Sign In"}
                </Text>
              </TouchableOpacity>

              {/* Register link — citizens only */}
              {isCitizen && (
                <View style={styles.registerContainer}>
                  <Text style={[styles.registerText, { color: theme.colors.textSecondary }]}>
                    {"Don't have an account? "}
                  </Text>
                  <TouchableOpacity
                    onPress={() =>
                      router.push({ pathname: "/(auth)/register", params: { role } })
                    }
                  >
                    <Text style={[styles.registerLink, { color: theme.colors.accent }]}>
                      Create account
                    </Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* Enumerator request access */}
              {isEnumerator && (
                <TouchableOpacity style={styles.requestAccess}>
                  <Text style={[styles.requestAccessText, { color: theme.colors.accent }]}>
                    Request Temporary Access
                  </Text>
                </TouchableOpacity>
              )}

              {/* Footer */}
              <AuthFooter theme={theme} />
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

  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
    marginBottom: 4,
  },

  registerText: {
    fontSize: 14,
  },

  registerLink: {
    fontSize: 14,
    fontWeight: "700",
  },

  requestAccess: {
    alignItems: "center",
    marginTop: 18,
  },

  requestAccessText: {
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});
