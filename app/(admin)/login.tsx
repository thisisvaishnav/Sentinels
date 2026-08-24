import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { AuthCard } from "@/src/features/auth/components/AuthCard";
import { AuthHeader } from "@/src/features/auth/components/AuthHeader";
import { AuthFooter } from "@/src/features/auth/components/AuthFooter";
import { RoleBadge } from "@/src/features/auth/components/RoleBadge";
import { ADMIN_AUTH_THEME } from "@/src/features/auth/theme";

export default function AdminLoginScreen() {
  const router = useRouter();
  const t = ADMIN_AUTH_THEME;

  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async () => {
    const id = employeeId.trim();
    const secret = password.trim();

    if (!id || !secret) {
      alert("Please enter your Employee ID and password.");
      return;
    }

    setIsSubmitting(true);

    // Hardcoded admin credentials
    const ADMIN_ID = "ADMIN-001";
    const ADMIN_PASSWORD = "admin@drishti";

    if (id === ADMIN_ID && secret === ADMIN_PASSWORD) {
      await AsyncStorage.setItem("hasOnboarded", "true");
      await AsyncStorage.setItem("admin_logged_in", "true");
      router.replace("/(admin)/dashboard");
    } else {
      alert("Invalid Employee ID or password.");
    }

    setIsSubmitting(false);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: t.colors.background }]}>
      <KeyboardAvoidingView
        style={styles.keyboard}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.container}>
            <AuthCard theme={t}>
              {/* Role Badge */}
              <RoleBadge theme={t} role="admin" />

              {/* Header */}
              <AuthHeader
                theme={t}
                role="admin"
                subtitle="Official Administrator Access"
              />

              {/* Security Notice */}
              <View
                style={[
                  styles.noticeBox,
                  {
                    backgroundColor: t.colors.subtleBackground,
                    borderColor: t.colors.border,
                    borderRadius: t.borderRadius.md,
                  },
                ]}
              >
                <Ionicons
                  name="information-circle"
                  size={16}
                  color={t.colors.textSecondary}
                  style={styles.noticeIcon}
                />
                <Text style={[styles.noticeText, { color: t.colors.textSecondary }]}>
                  Access is restricted to authorized district personnel. All activities are
                  logged and monitored.
                </Text>
              </View>

              {/* Employee ID */}
              <View style={styles.field}>
                <Text style={[styles.label, { color: t.colors.textSecondary }]}>
                  EMPLOYEE ID
                </Text>
                <View
                  style={[
                    styles.inputContainer,
                    {
                      backgroundColor: t.colors.inputBackground,
                      borderColor: t.colors.borderInput,
                      borderRadius: t.borderRadius.md,
                    },
                  ]}
                >
                  <View style={styles.iconWrap}>
                    <Ionicons
                      name="briefcase-outline"
                      size={20}
                      color={t.colors.textMuted}
                    />
                  </View>
                  <TextInput
                    style={[styles.input, { color: t.colors.textPrimary }]}
                    value={employeeId}
                    onChangeText={setEmployeeId}
                    placeholder="e.g. EMP-2023-458"
                    placeholderTextColor={t.colors.textMuted}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
              </View>

              {/* Password */}
              <View style={styles.field}>
                <Text style={[styles.label, { color: t.colors.textSecondary }]}>
                  PASSWORD
                </Text>
                <View
                  style={[
                    styles.inputContainer,
                    {
                      backgroundColor: t.colors.inputBackground,
                      borderColor: t.colors.borderInput,
                      borderRadius: t.borderRadius.md,
                    },
                  ]}
                >
                  <View style={styles.iconWrap}>
                    <Ionicons
                      name="lock-closed-outline"
                      size={20}
                      color={t.colors.textMuted}
                    />
                  </View>
                  <TextInput
                    style={[styles.input, { color: t.colors.textPrimary }]}
                    value={password}
                    onChangeText={setPassword}
                    placeholder="••••••••"
                    placeholderTextColor={t.colors.textMuted}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeBtn}
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name={showPassword ? "eye-outline" : "eye-off-outline"}
                      size={20}
                      color={t.colors.textMuted}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Login Button */}
              <TouchableOpacity
                style={[
                  styles.loginButton,
                  {
                    backgroundColor: t.colors.accent,
                    borderRadius: t.borderRadius.md,
                  },
                  isSubmitting && styles.loginButtonDisabled,
                ]}
                onPress={handleLogin}
                activeOpacity={0.8}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <ActivityIndicator size="small" color={t.colors.textWhite} />
                ) : (
                  <Ionicons name="log-in-outline" size={20} color={t.colors.textWhite} />
                )}
                <Text style={[styles.loginButtonText, { color: t.colors.textWhite }]}>
                  {isSubmitting ? "Signing In..." : "Secure Login"}
                </Text>
              </TouchableOpacity>

              {/* Footer */}
              <AuthFooter
                theme={t}
                title="Government Secured"
                text="Department of Statistics & Programme Implementation"
              />
            </AuthCard>

            {/* Bottom branding */}
            <View style={styles.bottomBranding}>
              <Ionicons name="business-outline" size={18} color={t.colors.textMuted} />
              <Text style={[styles.bottomText, { color: t.colors.textMuted }]}>
                Government of India · DRISHTI Platform
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

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

  /* Notice */

  noticeBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 14,
    borderWidth: 1,
    marginBottom: 24,
  },

  noticeIcon: {
    marginTop: 1,
    marginRight: 10,
  },

  noticeText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 18,
  },

  /* Fields */

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

  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 0,
  },

  eyeBtn: {
    padding: 4,
  },

  /* Button */

  loginButton: {
    height: 52,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    marginTop: 8,
  },

  loginButtonDisabled: {
    opacity: 0.6,
  },

  loginButtonText: {
    fontSize: 16,
    fontWeight: "700",
  },

  /* Bottom branding */

  bottomBranding: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginTop: 28,
    marginBottom: 12,
  },

  bottomText: {
    fontSize: 12,
    fontWeight: "500",
  },
});
