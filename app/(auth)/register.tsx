import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
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
import { ENUMERATOR_THEME } from '@/src/features/enumeration/theme';

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

  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [state, setState] = useState("");
  const [pinCode, setPinCode] = useState("");

  const [showPassword, setShowPassword] = useState(false);
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
              <Ionicons name="arrow-back" size={22} color={ENUMERATOR_THEME.colors.primary} />
              <Text style={styles.backText}>Back</Text>
            </TouchableOpacity>

            {/* Header */}
            <View style={styles.header}>
              <View style={styles.logo}>
                <Ionicons name="person-outline" size={34} color={ENUMERATOR_THEME.colors.textMuted} />
              </View>

              <Text style={styles.brand}>Lokvision</Text>

              <Text style={styles.title}>Create Account</Text>

              <Text style={styles.subtitle}>
                Create your citizen account
              </Text>
            </View>

            {/* Full Name */}
            <InputField
              label="FULL NAME"
              placeholder="Enter your full name"
              value={fullName}
              onChangeText={setFullName}
              icon={
                <Ionicons name="person-outline" size={22} color={ENUMERATOR_THEME.colors.textMuted} />
              }
            />

            {/* Mobile Number */}
            <InputField
              label="MOBILE NUMBER"
              placeholder="10-digit mobile number"
              value={mobile}
              onChangeText={setMobile}
              keyboardType="phone-pad"
              icon={
                <Ionicons
                  name="phone-portrait-outline"
                  size={22}
                  color={ENUMERATOR_THEME.colors.textMuted}
                />
              }
            />

            {/* Password */}
            <View style={styles.field}>
              <Text style={styles.label}>PASSWORD</Text>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="lock-closed-outline"
                  size={22}
                  color={ENUMERATOR_THEME.colors.textMuted}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Create a secure password"
                  placeholderTextColor={ENUMERATOR_THEME.colors.textMuted}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons
                    name={showPassword ? "eye-outline" : "eye-off-outline"}
                    size={23}
                    color={ENUMERATOR_THEME.colors.textMuted}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* State */}
            <View style={styles.field}>
              <Text style={styles.label}>STATE</Text>
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.inputContainer}
                onPress={() => setShowStates(!showStates)}
              >
                <Text
                  style={[
                    styles.dropdownValue,
                    !state ? styles.placeholder : null,
                  ]}
                >
                  {state || "Select State"}
                </Text>
                <Ionicons
                  name={showStates ? "chevron-up" : "chevron-down"}
                  size={21}
                  color={ENUMERATOR_THEME.colors.textMuted}
                />
              </TouchableOpacity>
              {showStates && (
                <View style={styles.dropdown}>
                  {STATES.map((item) => (
                    <TouchableOpacity
                      key={item}
                      style={styles.dropdownItem}
                      onPress={() => {
                        setState(item);
                        setShowStates(false);
                      }}
                    >
                      <Text style={styles.dropdownText}>{item}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* PIN Code */}
            <InputField
              label="PIN CODE"
              placeholder="6-digit postal code"
              value={pinCode}
              onChangeText={setPinCode}
              keyboardType="number-pad"
              icon={
                <Ionicons name="location-outline" size={22} color={ENUMERATOR_THEME.colors.textMuted} />
              }
            />

            {/* Create Account */}
            <TouchableOpacity
              activeOpacity={0.8}
              style={[
                styles.primaryButton,
                isSubmitting && { opacity: 0.65 },
              ]}
              onPress={handleRegister}
              disabled={isSubmitting}
            >
              <Text style={styles.primaryButtonText}>
                {isSubmitting ? "Please wait..." : "CREATE ACCOUNT"}
              </Text>
              <Ionicons name="arrow-forward" size={24} color={ENUMERATOR_THEME.colors.textWhite} />
            </TouchableOpacity>

            {/* Login */}
            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>
                Already have an account?{" "}
              </Text>
              <TouchableOpacity
                onPress={() =>
                  router.push({ pathname: "/(auth)/login", params: { role: "citizen" } })
                }
              >
                <Text style={styles.loginLink}>Log in</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/* ---------------- Components ---------------- */

function InputField({
  label,
  placeholder,
  value,
  onChangeText,
  keyboardType,
  icon,
}: any) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputContainer}>
        {icon}
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={ENUMERATOR_THEME.colors.textMuted}
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          autoCapitalize="none"
        />
      </View>
    </View>
  );
}

/* ---------------- Styles ---------------- */

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: ENUMERATOR_THEME.colors.background,
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
    backgroundColor: ENUMERATOR_THEME.colors.cardBackground,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.borderSubtle,
    borderRadius: ENUMERATOR_THEME.borderRadius.lg,
    paddingHorizontal: 28,
    paddingVertical: 28,
  },

  backButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    marginBottom: 10,
  },

  backText: {
    fontSize: 16,
    color: ENUMERATOR_THEME.colors.primary,
  },

  header: {
    alignItems: "center",
    marginBottom: 32,
  },

  logo: {
    width: 72,
    height: 72,
    borderRadius: ENUMERATOR_THEME.borderRadius.xl,
    backgroundColor: ENUMERATOR_THEME.colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
  },

  brand: {
    fontSize: 25,
    fontWeight: "700",
    color: ENUMERATOR_THEME.colors.primary,
    marginBottom: 16,
  },

  title: {
    fontSize: 36,
    fontWeight: "700",
    color: ENUMERATOR_THEME.colors.textPrimary,
    alignSelf: "flex-start",
  },

  subtitle: {
    fontSize: 18,
    lineHeight: 27,
    color: ENUMERATOR_THEME.colors.textSecondary,
    marginTop: 5,
    alignSelf: "flex-start",
  },

  field: {
    marginBottom: 20,
  },

  label: {
    fontSize: 15,
    letterSpacing: 1.5,
    color: ENUMERATOR_THEME.colors.textSecondary,
    fontWeight: "600",
    marginBottom: 8,
  },

  inputContainer: {
    minHeight: 56,
    borderWidth: 1.5,
    borderColor: ENUMERATOR_THEME.colors.borderSubtle,
    backgroundColor: ENUMERATOR_THEME.colors.inputBackground,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
  },

  input: {
    flex: 1,
    fontSize: 18,
    color: ENUMERATOR_THEME.colors.textPrimary,
    marginLeft: 10,
  },

  dropdownValue: {
    flex: 1,
    fontSize: 18,
    color: ENUMERATOR_THEME.colors.textPrimary,
  },

  placeholder: {
    color: ENUMERATOR_THEME.colors.textMuted,
    fontWeight: "500",
  },

  dropdown: {
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.borderSubtle,
    backgroundColor: ENUMERATOR_THEME.colors.cardBackground,
    marginTop: -12,
    marginBottom: 20,
  },

  dropdownItem: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: ENUMERATOR_THEME.colors.border,
  },

  dropdownText: {
    fontSize: 16,
    color: ENUMERATOR_THEME.colors.textPrimary,
  },

  primaryButton: {
    height: 58,
    backgroundColor: ENUMERATOR_THEME.colors.primary,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 14,
    marginTop: 5,
  },

  primaryButtonText: {
    color: ENUMERATOR_THEME.colors.textWhite,
    fontSize: 18,
    fontWeight: "600",
  },

  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },

  loginText: {
    fontSize: 16,
    color: ENUMERATOR_THEME.colors.textSecondary,
  },

  loginLink: {
    fontSize: 16,
    color: ENUMERATOR_THEME.colors.accent,
    fontWeight: "600",
  },
});
