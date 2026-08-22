import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { registerWithRole } from "@/src/features/auth/authService";

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
      <StatusBar barStyle="dark-content" backgroundColor="#F5F8FA" />

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
              <Ionicons name="arrow-back" size={22} color="#172A3A" />
              <Text style={styles.backText}>Back</Text>
            </TouchableOpacity>

            {/* Header */}
            <View style={styles.header}>
              <View style={styles.logo}>
                <Ionicons name="person-outline" size={34} color="#9DB0C5" />
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
                <Ionicons name="person-outline" size={22} color="#777F89" />
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
                  color="#777F89"
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
                  color="#777F89"
                />
                <TextInput
                  style={styles.input}
                  placeholder="Create a secure password"
                  placeholderTextColor="#B9BEC6"
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
                    color="#777F89"
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
                  color="#69717B"
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
                <Ionicons name="location-outline" size={22} color="#777F89" />
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
              <Ionicons name="arrow-forward" size={24} color="#FFFFFF" />
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
          placeholderTextColor="#B9BEC6"
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
    backgroundColor: "#F5F8FA",
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
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#CBD1D8",
    borderRadius: 12,
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
    color: "#172A3A",
  },

  header: {
    alignItems: "center",
    marginBottom: 32,
  },

  logo: {
    width: 72,
    height: 72,
    borderRadius: 18,
    backgroundColor: "#172A3A",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
  },

  brand: {
    fontSize: 25,
    fontWeight: "700",
    color: "#172A3A",
    marginBottom: 16,
  },

  title: {
    fontSize: 36,
    fontWeight: "700",
    color: "#171B20",
    alignSelf: "flex-start",
  },

  subtitle: {
    fontSize: 18,
    lineHeight: 27,
    color: "#4C5259",
    marginTop: 5,
    alignSelf: "flex-start",
  },

  field: {
    marginBottom: 20,
  },

  label: {
    fontSize: 15,
    letterSpacing: 1.5,
    color: "#444A51",
    fontWeight: "600",
    marginBottom: 8,
  },

  inputContainer: {
    minHeight: 56,
    borderWidth: 1.5,
    borderColor: "#C4CAD2",
    backgroundColor: "#F5F7F9",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
  },

  input: {
    flex: 1,
    fontSize: 18,
    color: "#20252A",
    marginLeft: 10,
  },

  dropdownValue: {
    flex: 1,
    fontSize: 18,
    color: "#20252A",
  },

  placeholder: {
    color: "#B9BEC6",
    fontWeight: "500",
  },

  dropdown: {
    borderWidth: 1,
    borderColor: "#C4CAD2",
    backgroundColor: "#FFFFFF",
    marginTop: -12,
    marginBottom: 20,
  },

  dropdownItem: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#E3E6E9",
  },

  dropdownText: {
    fontSize: 16,
    color: "#20252A",
  },

  primaryButton: {
    height: 58,
    backgroundColor: "#172A3A",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 14,
    marginTop: 5,
  },

  primaryButtonText: {
    color: "#FFFFFF",
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
    color: "#555B62",
  },

  loginLink: {
    fontSize: 16,
    color: "#0069A6",
    fontWeight: "600",
  },
});
