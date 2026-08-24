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
import { ENUMERATOR_THEME } from '@/src/features/enumeration/theme';

export default function AdminLoginScreen() {
  const router = useRouter();
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
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Login Card */}
          <View style={styles.card}>
            {/* Logo */}
            <View style={styles.logoContainer}>
              <Ionicons name="eye" size={34} color={ENUMERATOR_THEME.colors.textWhite} />
            </View>

            {/* Title */}
            <Text style={styles.title}>DRISHTI</Text>
            <Text style={styles.subtitle}>Official Administrator Login</Text>

            {/* Divider */}
            <View style={styles.divider} />

            {/* Security Notice */}
            <View style={styles.noticeBox}>
              <Ionicons
                name="information-circle"
                size={17}
                color={ENUMERATOR_THEME.colors.textSecondary}
                style={styles.noticeIcon}
              />
              <Text style={styles.noticeText}>
                Access is restricted to authorized district personnel. All
                activities are logged and monitored.
              </Text>
            </View>

            {/* Employee ID */}
            <View style={styles.inputSection}>
              <Text style={styles.label}>Official Email / Employee ID</Text>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="briefcase"
                  size={17}
                  color={ENUMERATOR_THEME.colors.textMuted}
                  style={styles.inputIcon}
                />
                <TextInput
                  value={employeeId}
                  onChangeText={setEmployeeId}
                  placeholder="e.g. EMP-2023-458"
                  placeholderTextColor={ENUMERATOR_THEME.colors.textMuted}
                  style={styles.input}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </View>

            {/* Password */}
            <View style={styles.inputSection}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="lock-closed"
                  size={17}
                  color={ENUMERATOR_THEME.colors.textMuted}
                  style={styles.inputIcon}
                />
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="••••••••"
                  placeholderTextColor={ENUMERATOR_THEME.colors.textMuted}
                  style={styles.input}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeButton}
                >
                  <Ionicons
                    name={showPassword ? "eye-outline" : "eye-off"}
                    size={19}
                    color={ENUMERATOR_THEME.colors.textMuted}
                  />
                </TouchableOpacity>
              </View>
            </View>



            {/* Login Button */}
            <TouchableOpacity
              style={[styles.loginButton, isSubmitting && { opacity: 0.65 }]}
              onPress={handleLogin}
              activeOpacity={0.8}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color={ENUMERATOR_THEME.colors.textWhite} />
              ) : (
                <Ionicons name="log-in-outline" size={20} color={ENUMERATOR_THEME.colors.textWhite} />
              )}
              <Text style={styles.loginButtonText}>
                {isSubmitting ? "Signing In..." : "Secure Login"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Ionicons name="business" size={22} color={ENUMERATOR_THEME.colors.textMuted} />
            <Text style={styles.governmentText}>
              Government of India - Department of Statistics
            </Text>
            <Text style={styles.copyright}>
              © 2024 DRISHTI Admin Platform. All rights reserved.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: ENUMERATOR_THEME.colors.background,
    marginTop: -30,
  },

  keyboardView: {
    flex: 1,
  },

  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 9,
    paddingTop: 14,
  },

  /* =========================
     LOGIN CARD
  ========================= */

  card: {
    backgroundColor: ENUMERATOR_THEME.colors.cardBackground,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
    borderRadius: 0,
    overflow: "hidden",
    paddingBottom: 18,
  },

  logoContainer: {
    width: 59,
    height: 59,
    borderRadius: 0,
    backgroundColor: ENUMERATOR_THEME.colors.primary,
    alignSelf: "center",
    marginTop: 30,
    alignItems: "center",
    justifyContent: "center",
  },

  title: {
    textAlign: "center",
    marginTop: 15,
    fontSize: 21,
    fontWeight: "800",
    color: ENUMERATOR_THEME.colors.primary,
    letterSpacing: 0.2,
  },

  subtitle: {
    textAlign: "center",
    marginTop: 3,
    fontSize: 13,
    color: ENUMERATOR_THEME.colors.textMuted,
  },

  divider: {
    height: 1,
    backgroundColor: ENUMERATOR_THEME.colors.border,
    marginTop: 24,
    marginBottom: 18,
  },

  /* =========================
     NOTICE
  ========================= */

  noticeBox: {
    marginHorizontal: 19,
    backgroundColor: ENUMERATOR_THEME.colors.subtleBackground,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
    borderRadius: 0,
    minHeight: 74,
    paddingHorizontal: 12,
    paddingVertical: 11,
    flexDirection: "row",
    alignItems: "flex-start",
  },

  noticeIcon: {
    marginTop: 1,
    marginRight: 10,
  },

  noticeText: {
    flex: 1,
    fontSize: 11.5,
    lineHeight: 18,
    color: ENUMERATOR_THEME.colors.textSecondary,
  },

  /* =========================
     INPUTS
  ========================= */

  inputSection: {
    marginHorizontal: 19,
    marginTop: 17,
  },

  label: {
    fontSize: 12.5,
    fontWeight: "600",
    color: ENUMERATOR_THEME.colors.textPrimary,
    marginBottom: 7,
  },

  inputContainer: {
    height: 40,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.borderSubtle,
    borderRadius: 0,
    backgroundColor: ENUMERATOR_THEME.colors.inputBackground,
    flexDirection: "row",
    alignItems: "center",
  },

  inputIcon: {
    marginLeft: 12,
    marginRight: 9,
  },

  input: {
    flex: 1,
    height: "100%",
    fontSize: 13,
    color: ENUMERATOR_THEME.colors.textPrimary,
    paddingVertical: 0,
  },

  eyeButton: {
    paddingHorizontal: 11,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },

  /* =========================
     LOGIN BUTTON
  ========================= */

  loginButton: {
    height: 41,
    marginHorizontal: 19,
    marginTop: 26,
    backgroundColor: ENUMERATOR_THEME.colors.primary,
    borderRadius: 0,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },

  loginButtonText: {
    color: ENUMERATOR_THEME.colors.textWhite,
    fontSize: 12,
    fontWeight: "700",
    marginLeft: 9,
    letterSpacing: 0.2,
  },

  /* =========================
     FOOTER
  ========================= */

  footer: {
    alignItems: "center",
    paddingTop: 42,
    paddingBottom: 12,
  },

  governmentText: {
    marginTop: 11,
    fontSize: 10.5,
    color: ENUMERATOR_THEME.colors.textMuted,
    textAlign: "center",
  },

  copyright: {
    marginTop: 8,
    fontSize: 9.5,
    color: ENUMERATOR_THEME.colors.textMuted,
    textAlign: "center",
  },
});
