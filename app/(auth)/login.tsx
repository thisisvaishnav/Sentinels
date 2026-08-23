import React, { useState } from "react";
import { loginEnumerator, loginWithRole } from "@/src/features/auth/authService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { AppColors, AppRadius } from "../../constants/colors";

export type Role = "citizen" | "enumerator";

export default function Login() {
  const { role: roleParam } = useLocalSearchParams<{ role: Role }>();
  const role: Role = roleParam ?? "citizen";
  const router = useRouter();
  const [firstValue, setFirstValue] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isCitizen = role === "citizen";
  const isEnumerator = role === "enumerator";

  const handleLogin = async () => {
    const identifier = firstValue.trim();
    const secret = password.trim();

    if (!identifier || !secret) {
      alert(
        isEnumerator
          ? "Please enter enumerator ID and security key."
          : "Please enter mobile number and password.",
      );
      return;
    }

    setIsSubmitting(true);

    if (isCitizen) {
      try {
        await loginWithRole('citizen', { mobile: identifier, password: secret });
        await AsyncStorage.setItem('hasOnboarded', 'true');
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

        console.log("Enumerator JWT login success:", profile.enumerator_id);
        await AsyncStorage.setItem('hasOnboarded', 'true');
        router.replace("/(enumerator)/dashboard");
      } catch (error: any) {
        console.error("Enumerator login error:", error);
        const isCredentialError =
          error?.status === 400 || error?.code === "invalid_credentials";
        alert(
          isCredentialError
            ? "Invalid enumerator ID or security key."
            : "Unable to authenticate. Please try again.",
        );
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    setIsSubmitting(false);
  };

  const getSubtitle = () => {
    if (isCitizen) return "Sign in to your citizen account";
    return "Secure Enumerator Access";
  };

  return (
    <SafeAreaView style={styles.safeArea}>
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
                style={styles.backButton}
                onPress={() => router.back()}
              >
                <Ionicons
                  name="arrow-back"
                  size={22}
                  color={AppColors.primary}
                />
                <Text style={styles.backText}>Back</Text>
              </TouchableOpacity>

            {/* Header */}
            <View style={styles.header}>

              <View style={styles.logo}>
                {isCitizen && (
                  <Ionicons
                    name="person"
                    size={32}
                    color={AppColors.textMuted}
                  />
                )}

                {isEnumerator && (
                  <MaterialCommunityIcons
                    name="satellite-variant"
                    size={34}
                    color={AppColors.textWhite}
                  />
                )}
              </View>

              <Text style={styles.brand}>
                {isEnumerator ? "FieldLink GIS" : "Sentinels"}
              </Text>

              <Text style={styles.subtitle}>
                {getSubtitle()}
              </Text>
            </View>

            {/* Citizen */}
            {isCitizen && (
              <>
                <Field
                  label="MOBILE NUMBER"
                  placeholder="10-digit mobile number"
                  value={firstValue}
                  onChangeText={setFirstValue}
                  keyboardType="phone-pad"
                  icon={
                    <Ionicons
                      name="phone-portrait-outline"
                      size={23}
                      color={AppColors.textMuted}
                    />
                  }
                />

                <PasswordField
                  label="PASSWORD"
                  placeholder="Enter your password"
                  value={password}
                  onChangeText={setPassword}
                  visible={showPassword}
                  setVisible={setShowPassword}
                />
              </>
            )}

            {/* Enumerator */}
            {isEnumerator && (
              <>
                <Field
                  label="ENUMERATOR ID"
                  placeholder="Enter ID"
                  value={firstValue}
                  onChangeText={setFirstValue}
                  icon={
                    <MaterialCommunityIcons
                      name="card-account-details-outline"
                      size={23}
                      color={AppColors.textMuted}
                    />
                  }
                />

                <PasswordField
                  label="SECURITY KEY"
                  placeholder="Enter Key"
                  value={password}
                  onChangeText={setPassword}
                  visible={showPassword}
                  setVisible={setShowPassword}
                  secureField
                />
              </>
            )}

            {/* Login Button */}
            <TouchableOpacity
              activeOpacity={0.8}
              style={[styles.primaryButton, isSubmitting && styles.primaryButtonDisabled]}
              onPress={handleLogin}
              disabled={isSubmitting}
            >
              <Text style={styles.primaryButtonText}>
                {isSubmitting ? "Checking..." : isEnumerator ? "Authenticate" : "Sign In"}
              </Text>

              <Ionicons
                name="arrow-forward"
                size={24}
                color={AppColors.textWhite}
              />
            </TouchableOpacity>

            {/* Register - only for citizens */}
            {isCitizen && (
              <View style={styles.registerContainer}>
                <Text style={styles.registerText}>
                  {"Don't have an account? "}
                </Text>

                <TouchableOpacity onPress={() => router.push({ pathname: '/(auth)/register', params: { role } })}>
                  <Text style={styles.registerLink}>
                    Create account
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Enumerator Security */}
            {isEnumerator && (
              <TouchableOpacity style={styles.requestAccess}>
                <Text style={styles.requestAccessText}>
                  Request Temporary Access
                </Text>
              </TouchableOpacity>
            )}

            {/* Security footer */}
            <View style={styles.securityContainer}>
              <View style={styles.securityTitleRow}>
                <Ionicons
                  name="shield-checkmark-outline"
                  size={20}
                  color={AppColors.textSecondary}
                />

                <Text style={styles.securityTitle}>
                  End-to-End Encrypted
                </Text>
              </View>

              <Text style={styles.securityText}>
                Unauthorized access is strictly{"\n"}
                prohibited and logged.
              </Text>
            </View>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/* ---------------- Components ---------------- */

function Field({
  label,
  placeholder,
  value,
  onChangeText,
  keyboardType,
  icon,
}: any) {
  return (
    <View style={styles.fieldContainer}>
      <Text style={styles.label}>{label}</Text>

      <View style={styles.inputContainer}>
        {icon}

        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={AppColors.textMuted}
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          autoCapitalize="none"
        />
      </View>
    </View>
  );
}

function PasswordField({
  label,
  placeholder,
  value,
  onChangeText,
  visible,
  setVisible,
  secureField = false,
}: any) {
  return (
    <View style={styles.fieldContainer}>
      <Text style={styles.label}>{label}</Text>

      <View style={styles.inputContainer}>
        <Ionicons
          name="lock-closed-outline"
          size={23}
          color={AppColors.textMuted}
        />

        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={AppColors.textMuted}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={!visible}
          autoCapitalize="none"
        />

        <TouchableOpacity onPress={() => setVisible(!visible)}>
          <Ionicons
            name={visible ? "eye-outline" : "eye-off-outline"}
            size={24}
            color={AppColors.textMuted}
          />
        </TouchableOpacity>
      </View>

      {secureField && (
        <Text style={styles.securityHint}>
          Keep your security key confidential
        </Text>
      )}
    </View>
  );
}

/* ---------------- Styles ---------------- */

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: AppColors.bgMain,
    marginTop: -30,
  },

  keyboard: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
    paddingVertical: 20,
  },

  container: {
    width: "92%",
    maxWidth: 540,
    alignSelf: "center",
    backgroundColor: AppColors.bgCard,
    borderWidth: 1,
    borderColor: AppColors.borderInput,
    borderRadius: AppRadius.lg,
    paddingHorizontal: 28,
    paddingVertical: 28,
  },

  backButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    marginBottom: 15,
  },

  backText: {
    fontSize: 16,
    color: AppColors.primary,
    fontWeight: "500",
  },

  header: {
    alignItems: "center",
    marginBottom: 42,
  },

  logo: {
    width: 72,
    height: 72,
    borderRadius: AppRadius.xl,
    backgroundColor: AppColors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 18,
  },

  brand: {
    fontSize: 34,
    fontWeight: "700",
    color: AppColors.primary,
    letterSpacing: -0.8,
  },

  subtitle: {
    fontSize: 19,
    color: AppColors.textSecondary,
    marginTop: 8,
    textAlign: "center",
  },

  fieldContainer: {
    marginBottom: 24,
  },

  label: {
    fontSize: 16,
    letterSpacing: 1.5,
    color: AppColors.textSecondary,
    fontWeight: "600",
    marginBottom: 9,
  },

  inputContainer: {
    height: 56,
    borderWidth: 1.5,
    borderColor: AppColors.borderInput,
    backgroundColor: AppColors.bgInput,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
  },

  input: {
    flex: 1,
    fontSize: 18,
    color: AppColors.textPrimary,
    marginLeft: 10,
  },

  primaryButton: {
    height: 58,
    backgroundColor: AppColors.primary,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 15,
    marginTop: 8,
  },

  primaryButtonDisabled: {
    opacity: 0.65,
  },

  primaryButtonText: {
    color: AppColors.textWhite,
    fontSize: 19,
    fontWeight: "600",
  },

  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
    marginBottom: 12,
  },

  registerText: {
    fontSize: 16,
    color: AppColors.textSecondary,
  },

  registerLink: {
    fontSize: 16,
    color: AppColors.blue,
    fontWeight: "600",
  },

  requestAccess: {
    alignItems: "center",
    marginTop: 20,
  },

  requestAccessText: {
    color: AppColors.blue,
    fontSize: 17,
    fontWeight: "600",
    letterSpacing: 1,
  },

  securityContainer: {
    borderTopWidth: 1,
    borderTopColor: AppColors.border,
    marginTop: 30,
    paddingTop: 22,
    alignItems: "center",
  },

  securityTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },

  securityTitle: {
    fontSize: 16,
    color: AppColors.textSecondary,
    fontWeight: "600",
    letterSpacing: 1,
  },

  securityText: {
    textAlign: "center",
    marginTop: 8,
    color: AppColors.textMuted,
    fontSize: 14,
    lineHeight: 21,
  },

  securityHint: {
    color: AppColors.textMuted,
    fontSize: 13,
    marginTop: 7,
  },
});
