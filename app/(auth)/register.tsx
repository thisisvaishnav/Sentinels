import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { registerWithRole } from "@/src/features/auth/authService";
import { AppColors, AppRadius } from "../../constants/colors";

const RIPPLE_LIGHT = { color: "rgba(23,42,58,0.10)" };
const RIPPLE_DARK = { color: "rgba(255,255,255,0.18)" };

const selectionHaptic = () => {
  if (Platform.OS === "android") Haptics.selectionAsync();
};

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
      Alert.alert("Missing information", "Please enter your full name.");
      return;
    }

    if (!mobile.trim() || !password.trim()) {
      Alert.alert("Missing information", "Please fill in all required fields.");
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
      Alert.alert("Registration failed", error?.message ?? "Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right", "bottom"]}>
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
            <Pressable
              style={styles.backButton}
              android_ripple={{ ...RIPPLE_LIGHT, borderless: true, radius: 22 }}
              onPressIn={selectionHaptic}
              onPress={() => router.back()}
              hitSlop={8}
            >
              <Ionicons name="arrow-back" size={22} color={AppColors.primary} />
              <Text style={styles.backText}>Back</Text>
            </Pressable>

            {/* Header */}
            <View style={styles.header}>
              <View style={styles.logo}>
                <Ionicons name="person-outline" size={34} color={AppColors.textMuted} />
              </View>

              <Text style={styles.brand}>Sentinels</Text>

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
                <Ionicons name="person-outline" size={22} color={AppColors.textMuted} />
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
                  color={AppColors.textMuted}
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
                  color={AppColors.textMuted}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Create a secure password"
                  placeholderTextColor={AppColors.textMuted}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <Pressable
                  onPress={() => setShowPassword(!showPassword)}
                  onPressIn={selectionHaptic}
                  android_ripple={{ ...RIPPLE_LIGHT, borderless: true, radius: 20 }}
                  hitSlop={8}
                >
                  <Ionicons
                    name={showPassword ? "eye-outline" : "eye-off-outline"}
                    size={23}
                    color={AppColors.textMuted}
                  />
                </Pressable>
              </View>
            </View>

            {/* State */}
            <View style={styles.field}>
              <Text style={styles.label}>STATE</Text>
              <Pressable
                style={styles.inputContainer}
                android_ripple={RIPPLE_LIGHT}
                onPressIn={selectionHaptic}
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
                  color={AppColors.textMuted}
                />
              </Pressable>
              {showStates && (
                <View style={styles.dropdown}>
                  {STATES.map((item) => (
                    <Pressable
                      key={item}
                      style={styles.dropdownItem}
                      android_ripple={RIPPLE_LIGHT}
                      onPress={() => {
                        selectionHaptic();
                        setState(item);
                        setShowStates(false);
                      }}
                    >
                      <Text style={styles.dropdownText}>{item}</Text>
                    </Pressable>
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
                <Ionicons name="location-outline" size={22} color={AppColors.textMuted} />
              }
            />

            {/* Create Account */}
            <Pressable
              style={[
                styles.primaryButton,
                isSubmitting && { opacity: 0.65 },
              ]}
              android_ripple={RIPPLE_DARK}
              onPressIn={() => {
                if (Platform.OS === "android")
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              }}
              onPress={handleRegister}
              disabled={isSubmitting}
            >
              <Text style={styles.primaryButtonText}>
                {isSubmitting ? "Please wait..." : "CREATE ACCOUNT"}
              </Text>
              <Ionicons name="arrow-forward" size={24} color={AppColors.textWhite} />
            </Pressable>

            {/* Login */}
            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>
                Already have an account?{" "}
              </Text>
              <Pressable
                onPress={() =>
                  router.push({ pathname: "/(auth)/login", params: { role: "citizen" } })
                }
                onPressIn={selectionHaptic}
                android_ripple={{ ...RIPPLE_LIGHT, borderless: true, radius: 24 }}
                hitSlop={8}
              >
                <Text style={styles.loginLink}>Log in</Text>
              </Pressable>
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

/* ---------------- Styles ---------------- */

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: AppColors.bgMain,
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
    marginBottom: 10,
  },

  backText: {
    fontSize: 16,
    color: AppColors.primary,
  },

  header: {
    alignItems: "center",
    marginBottom: 32,
  },

  logo: {
    width: 72,
    height: 72,
    borderRadius: AppRadius.xl,
    backgroundColor: AppColors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
  },

  brand: {
    fontSize: 25,
    fontWeight: "700",
    color: AppColors.primary,
    marginBottom: 16,
  },

  title: {
    fontSize: 36,
    fontWeight: "700",
    color: AppColors.textPrimary,
    alignSelf: "flex-start",
  },

  subtitle: {
    fontSize: 18,
    lineHeight: 27,
    color: AppColors.textSecondary,
    marginTop: 5,
    alignSelf: "flex-start",
  },

  field: {
    marginBottom: 20,
  },

  label: {
    fontSize: 15,
    letterSpacing: 1.5,
    color: AppColors.textSecondary,
    fontWeight: "600",
    marginBottom: 8,
  },

  inputContainer: {
    minHeight: 56,
    borderWidth: 1.5,
    borderColor: AppColors.borderInput,
    backgroundColor: AppColors.bgInput,
    borderRadius: AppRadius.sm,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    overflow: "hidden",
  },

  input: {
    flex: 1,
    fontSize: 18,
    color: AppColors.textPrimary,
    marginLeft: 10,
  },

  dropdownValue: {
    flex: 1,
    fontSize: 18,
    color: AppColors.textPrimary,
  },

  placeholder: {
    color: AppColors.textMuted,
    fontWeight: "500",
  },

  dropdown: {
    borderWidth: 1,
    borderColor: AppColors.borderInput,
    backgroundColor: AppColors.bgCard,
    borderRadius: AppRadius.sm,
    marginTop: 6,
    marginBottom: 20,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
  },

  dropdownItem: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.border,
  },

  dropdownText: {
    fontSize: 16,
    color: AppColors.textPrimary,
  },

  primaryButton: {
    height: 58,
    backgroundColor: AppColors.primary,
    borderRadius: AppRadius.md,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 14,
    marginTop: 5,
    overflow: "hidden",
  },

  primaryButtonText: {
    color: AppColors.textWhite,
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
    color: AppColors.textSecondary,
  },

  loginLink: {
    fontSize: 16,
    color: AppColors.blue,
    fontWeight: "600",
  },
});
