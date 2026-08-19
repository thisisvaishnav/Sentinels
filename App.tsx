import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
  Modal,
  Pressable,
  Alert,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

type Screen = "onboarding" | "signup" | "login";
export type Role = "citizen" | "enumerator" | "admin";

const states = {
  "Uttar Pradesh": [
    "Lucknow",
    "Gautam Buddha Nagar",
    "Ghaziabad",
    "Kanpur Nagar",
    "Varanasi",
  ],
  Delhi: ["New Delhi", "North Delhi", "South Delhi", "East Delhi"],
  Maharashtra: ["Mumbai", "Pune", "Nagpur", "Nashik"],
  Karnataka: ["Bengaluru Urban", "Mysuru", "Mangaluru"],
};

export default function App() {
  const [screen, setScreen] = useState<Screen>("onboarding");
  const [selectedRole, setSelectedRole] = useState<Role>("citizen");

  const handleRoleSelect = (role: Role) => {
    setSelectedRole(role);
    setScreen("signup");
  };

  return (
    <>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#F7F9FB"
      />

      {screen === "onboarding" && (
        <RoleSelectionScreen
          onSelectRole={handleRoleSelect}
          onHelpPress={() => Alert.alert("Help", "Contact support for assistance.")}
        />
      )}

      {screen === "signup" && (
        <SignupScreen
          role={selectedRole}
          onLogin={() => setScreen("login")}
          onBackToOnboarding={() => setScreen("onboarding")}
        />
      )}

      {screen === "login" && (
        <LoginScreen
          role={selectedRole}
          onSignup={() => setScreen("signup")}
          onBackToOnboarding={() => setScreen("onboarding")}
        />
      )}
    </>
  );
}

/* =========================================================
   ROLE SELECTION (ONBOARDING) SCREEN
========================================================= */

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
      <View style={styles.roleIconContainer}>{getIcon()}</View>

      <View style={styles.roleCardContent}>
        <Text style={styles.roleTitle}>{title}</Text>
        <Text style={styles.roleDescription}>{description}</Text>
      </View>
    </TouchableOpacity>
  );
};

export function RoleSelectionScreen({
  onSelectRole,
  onHelpPress,
}: {
  onSelectRole: (role: Role) => void;
  onHelpPress?: () => void;
}) {
  return (
    <SafeAreaView style={styles.onboardingSafeArea}>
      <ScrollView contentContainerStyle={styles.onboardingScroll} showsVerticalScrollIndicator={false}>
        <View style={styles.onboardingContainer}>
          {/* Header */}
          <View style={styles.onboardingHeader}>
            <Text style={styles.onboardingTitle}>Welcome to Sentinels</Text>

            <Text style={styles.onboardingSubtitle}>
              Select your role to continue
            </Text>
          </View>

          {/* Roles */}
          <View style={styles.rolesContainer}>
            <RoleCard
              role="citizen"
              title="Citizen"
              description="Report your household and find government schemes"
              onPress={() => onSelectRole("citizen")}
            />

            <RoleCard
              role="enumerator"
              title="Enumerator"
              description="Field data collection and zone verification"
              onPress={() => onSelectRole("enumerator")}
            />

            <RoleCard
              role="admin"
              title="Admin"
              description="System oversight, GIS analysis, and command center"
              onPress={() => onSelectRole("admin")}
            />
          </View>

          {/* Help */}
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.helpButton}
            onPress={onHelpPress}
          >
            <Text style={styles.helpText}>Need help?</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* =========================================================
   SIGNUP SCREEN
========================================================= */

export function SignupScreen({
  role = "citizen",
  onLogin,
  onBackToOnboarding,
}: {
  role?: Role;
  onLogin: () => void;
  onBackToOnboarding?: () => void;
}) {
  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [pin, setPin] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");

  const [stateModal, setStateModal] = useState(false);
  const [districtModal, setDistrictModal] = useState(false);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const districts =
    selectedState && states[selectedState as keyof typeof states]
      ? states[selectedState as keyof typeof states]
      : [];

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!mobile.trim()) {
      newErrors.mobile = "Mobile number is required";
    } else if (!/^\d{10}$/.test(mobile.trim())) {
      newErrors.mobile = "Mobile number must be exactly 10 digits";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!selectedState) {
      newErrors.state = "State is required";
    }

    if (!selectedDistrict) {
      newErrors.district = "District is required";
    }

    if (!pin.trim()) {
      newErrors.pin = "PIN code is required";
    } else if (!/^\d{6}$/.test(pin.trim())) {
      newErrors.pin = "PIN code must be exactly 6 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = () => {
    if (validate()) {
      Alert.alert(
        "Account Created",
        `Your ${role} account has been created successfully!`,
        [{ text: "OK", onPress: onLogin }]
      );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {onBackToOnboarding && (
          <TouchableOpacity
            style={styles.backButton}
            onPress={onBackToOnboarding}
          >
            <Ionicons name="arrow-back" size={24} color="#172B3E" />
            <Text style={styles.backButtonText}>Back to Roles</Text>
          </TouchableOpacity>
        )}

        <View style={styles.container}>
          {/* HEADER */}
          <View style={styles.header}>
            <View style={styles.logoBox}>
              <Ionicons
                name="search-circle-outline"
                size={42}
                color="#91A4B9"
              />
            </View>

            <Text style={styles.logoText}>LokVision</Text>

            <Text style={styles.subtitle}>
              Create your {role} account
            </Text>
          </View>

          <View style={styles.form}>
            {/* FULL NAME */}
            <InputLabel text="FULL NAME" />
            <View style={[styles.inputContainer, errors.fullName ? styles.inputError : null]}>
              <Ionicons
                name="person-outline"
                size={23}
                color="#7C8289"
              />

              <TextInput
                style={styles.input}
                placeholder="Enter your full name"
                placeholderTextColor="#BFC3C9"
                value={fullName}
                onChangeText={(text) => {
                  setFullName(text);
                  if (errors.fullName) setErrors({ ...errors, fullName: "" });
                }}
              />
            </View>
            {errors.fullName ? <Text style={styles.errorText}>{errors.fullName}</Text> : null}

            {/* MOBILE */}
            <InputLabel text="MOBILE NUMBER" />
            <View style={[styles.inputContainer, errors.mobile ? styles.inputError : null]}>
              <Ionicons
                name="phone-portrait-outline"
                size={24}
                color="#7C8289"
              />

              <TextInput
                style={styles.input}
                placeholder="10-digit mobile number"
                placeholderTextColor="#BFC3C9"
                keyboardType="phone-pad"
                maxLength={10}
                value={mobile}
                onChangeText={(text) => {
                  setMobile(text);
                  if (errors.mobile) setErrors({ ...errors, mobile: "" });
                }}
              />
            </View>
            {errors.mobile ? <Text style={styles.errorText}>{errors.mobile}</Text> : null}

            {/* PASSWORD */}
            <InputLabel text="PASSWORD" />
            <View style={[styles.inputContainer, errors.password ? styles.inputError : null]}>
              <Ionicons
                name="lock-closed-outline"
                size={23}
                color="#7C8289"
              />

              <TextInput
                style={styles.input}
                placeholder="Create a secure password"
                placeholderTextColor="#BFC3C9"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (errors.password) setErrors({ ...errors, password: "" });
                }}
              />

              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons
                  name={
                    showPassword
                      ? "eye-outline"
                      : "eye-off-outline"
                  }
                  size={25}
                  color="#70767D"
                />
              </TouchableOpacity>
            </View>
            {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}

            {/* STATE */}
            <InputLabel text="STATE" />
            <TouchableOpacity
              style={[styles.selectContainer, errors.state ? styles.inputError : null]}
              onPress={() => setStateModal(true)}
            >
              <Text
                style={[
                  styles.selectText,
                  !selectedState && styles.placeholderText,
                ]}
              >
                {selectedState || "Select State"}
              </Text>

              <Ionicons
                name="chevron-down"
                size={21}
                color="#707982"
              />
            </TouchableOpacity>
            {errors.state ? <Text style={styles.errorText}>{errors.state}</Text> : null}

            {/* DISTRICT */}
            <InputLabel text="DISTRICT" />
            <TouchableOpacity
              style={[
                styles.selectContainer,
                !selectedState && styles.disabledSelect,
                errors.district ? styles.inputError : null,
              ]}
              disabled={!selectedState}
              onPress={() => setDistrictModal(true)}
            >
              <Text
                style={[
                  styles.selectText,
                  !selectedDistrict && styles.placeholderText,
                ]}
              >
                {selectedDistrict || "Select District"}
              </Text>

              <Ionicons
                name="chevron-down"
                size={21}
                color="#707982"
              />
            </TouchableOpacity>
            {errors.district ? <Text style={styles.errorText}>{errors.district}</Text> : null}

            {/* PIN */}
            <InputLabel text="PIN CODE" />
            <View style={[styles.inputContainer, errors.pin ? styles.inputError : null]}>
              <Ionicons
                name="location-outline"
                size={24}
                color="#7C8289"
              />

              <TextInput
                style={styles.input}
                placeholder="6-digit postal code"
                placeholderTextColor="#BFC3C9"
                keyboardType="number-pad"
                maxLength={6}
                value={pin}
                onChangeText={(text) => {
                  setPin(text);
                  if (errors.pin) setErrors({ ...errors, pin: "" });
                }}
              />
            </View>
            {errors.pin ? <Text style={styles.errorText}>{errors.pin}</Text> : null}

            {/* CREATE ACCOUNT */}
            <TouchableOpacity
              style={styles.primaryButton}
              activeOpacity={0.8}
              onPress={handleSignup}
            >
              <Text style={styles.buttonText}>
                CREATE ACCOUNT
              </Text>

              <Ionicons
                name="arrow-forward"
                size={27}
                color="#FFFFFF"
              />
            </TouchableOpacity>

            {/* LOGIN */}
            <View style={styles.bottomTextContainer}>
              <Text style={styles.bottomText}>
                Already have an account?{" "}
              </Text>

              <TouchableOpacity onPress={onLogin}>
                <Text style={styles.linkText}>Log in</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* STATE MODAL */}
      <SelectionModal
        visible={stateModal}
        title="Select State"
        options={Object.keys(states)}
        onClose={() => setStateModal(false)}
        onSelect={(value) => {
          setSelectedState(value);
          setSelectedDistrict("");
          setStateModal(false);
          if (errors.state) setErrors({ ...errors, state: "" });
        }}
      />

      {/* DISTRICT MODAL */}
      <SelectionModal
        visible={districtModal}
        title="Select District"
        options={districts}
        onClose={() => setDistrictModal(false)}
        onSelect={(value) => {
          setSelectedDistrict(value);
          setDistrictModal(false);
          if (errors.district) setErrors({ ...errors, district: "" });
        }}
      />
    </SafeAreaView>
  );
}

/* =========================================================
   LOGIN SCREEN
========================================================= */

export function LoginScreen({
  role = "citizen",
  onSignup,
  onBackToOnboarding,
}: {
  role?: Role;
  onSignup: () => void;
  onBackToOnboarding?: () => void;
}) {
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!mobile.trim()) {
      newErrors.mobile = "Mobile number is required";
    } else if (!/^\d{10}$/.test(mobile.trim())) {
      newErrors.mobile = "Mobile number must be 10 digits";
    }

    if (!password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = () => {
    if (validate()) {
      Alert.alert("Login Successful", `Welcome to LokVision (${role})!`);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.loginScroll}
      >
        {onBackToOnboarding && (
          <TouchableOpacity
            style={styles.backButton}
            onPress={onBackToOnboarding}
          >
            <Ionicons name="arrow-back" size={24} color="#172B3E" />
            <Text style={styles.backButtonText}>Back to Roles</Text>
          </TouchableOpacity>
        )}

        <View style={styles.container}>
          {/* HEADER */}
          <View style={styles.header}>
            <View style={styles.logoBox}>
              <Ionicons
                name="search-circle-outline"
                size={42}
                color="#91A4B9"
              />
            </View>

            <Text style={styles.logoText}>LokVision</Text>

            <Text style={styles.subtitle}>
              Login to your {role} account
            </Text>
          </View>

          <View style={styles.form}>
            {/* MOBILE */}
            <InputLabel text="MOBILE NUMBER" />

            <View style={[styles.inputContainer, errors.mobile ? styles.inputError : null]}>
              <Ionicons
                name="phone-portrait-outline"
                size={24}
                color="#7C8289"
              />

              <TextInput
                style={styles.input}
                placeholder="10-digit mobile number"
                placeholderTextColor="#BFC3C9"
                keyboardType="phone-pad"
                maxLength={10}
                value={mobile}
                onChangeText={(text) => {
                  setMobile(text);
                  if (errors.mobile) setErrors({ ...errors, mobile: "" });
                }}
              />
            </View>
            {errors.mobile ? <Text style={styles.errorText}>{errors.mobile}</Text> : null}

            {/* PASSWORD */}
            <InputLabel text="PASSWORD" />

            <View style={[styles.inputContainer, errors.password ? styles.inputError : null]}>
              <Ionicons
                name="lock-closed-outline"
                size={23}
                color="#7C8289"
              />

              <TextInput
                style={styles.input}
                placeholder="Enter your password"
                placeholderTextColor="#BFC3C9"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (errors.password) setErrors({ ...errors, password: "" });
                }}
              />

              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons
                  name={
                    showPassword
                      ? "eye-outline"
                      : "eye-off-outline"
                  }
                  size={25}
                  color="#70767D"
                />
              </TouchableOpacity>
            </View>
            {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}

            {/* FORGOT PASSWORD */}
            <TouchableOpacity
              style={styles.forgotContainer}
              onPress={() => Alert.alert("Forgot Password", "Password reset instructions sent.")}
            >
              <Text style={styles.forgotText}>
                Forgot password?
              </Text>
            </TouchableOpacity>

            {/* LOGIN BUTTON */}
            <TouchableOpacity
              style={styles.primaryButton}
              activeOpacity={0.8}
              onPress={handleLogin}
            >
              <Text style={styles.buttonText}>
                LOG IN
              </Text>

              <Ionicons
                name="arrow-forward"
                size={27}
                color="#FFFFFF"
              />
            </TouchableOpacity>

            {/* SIGNUP */}
            <View style={styles.bottomTextContainer}>
              <Text style={styles.bottomText}>
                Don't have an account?{" "}
              </Text>

              <TouchableOpacity onPress={onSignup}>
                <Text style={styles.linkText}>
                  Create account
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* =========================================================
   INPUT LABEL
========================================================= */

function InputLabel({ text }: { text: string }) {
  return (
    <Text style={styles.label}>
      {text}
    </Text>
  );
}

/* =========================================================
   SELECTION MODAL
========================================================= */

function SelectionModal({
  visible,
  title,
  options,
  onClose,
  onSelect,
}: {
  visible: boolean;
  title: string;
  options: string[];
  onClose: () => void;
  onSelect: (value: string) => void;
}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable
        style={styles.modalOverlay}
        onPress={onClose}
      >
        <Pressable
          style={styles.modalContainer}
          onPress={(e) => e.stopPropagation()}
        >
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {title}
            </Text>

            <TouchableOpacity onPress={onClose}>
              <Ionicons
                name="close"
                size={25}
                color="#333"
              />
            </TouchableOpacity>
          </View>

          <ScrollView>
            {options.map((option) => (
              <TouchableOpacity
                key={option}
                style={styles.option}
                onPress={() => onSelect(option)}
              >
                <Text style={styles.optionText}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

/* =========================================================
   STYLES
========================================================= */

const styles = StyleSheet.create({
  /* Onboarding Screen Styles */
  onboardingSafeArea: {
    flex: 1,
    backgroundColor: "#F5F8FA",
  },
  onboardingScroll: {
    flexGrow: 1,
  },
  onboardingContainer: {
    flex: 1,
    paddingHorizontal: 18,
    paddingBottom: 24,
  },
  onboardingHeader: {
    alignItems: "center",
    paddingTop: 38,
    paddingBottom: 48,
  },
  onboardingTitle: {
    fontSize: 42,
    lineHeight: 48,
    fontWeight: "800",
    color: "#17293D",
    textAlign: "center",
    letterSpacing: -1.2,
  },
  onboardingSubtitle: {
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
  roleIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: "#2B4055",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 20,
  },
  roleCardContent: {
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

  /* Common Back Button */
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    marginTop: 15,
    marginBottom: 5,
  },
  backButtonText: {
    marginLeft: 8,
    fontSize: 16,
    color: "#172B3E",
    fontWeight: "600",
  },

  /* LokVision Signup/Login Styles */
  safeArea: {
    flex: 1,
    backgroundColor: "#F7F9FB",
  },

  scrollContent: {
    flexGrow: 1,
  },

  loginScroll: {
    flexGrow: 1,
    justifyContent: "center",
  },

  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginVertical: 15,
    borderWidth: 1,
    borderColor: "#D7DCE1",
    borderRadius: 8,
    overflow: "hidden",
  },

  header: {
    backgroundColor: "#F5F8FA",
    alignItems: "center",
    paddingTop: 35,
    paddingBottom: 28,
    borderBottomWidth: 1,
    borderBottomColor: "#D7DCE1",
  },

  logoBox: {
    width: 71,
    height: 71,
    borderRadius: 17,
    backgroundColor: "#293D52",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 17,
  },

  logoText: {
    fontSize: 52,
    fontWeight: "700",
    color: "#172B3E",
    letterSpacing: -1.5,
  },

  subtitle: {
    marginTop: 8,
    fontSize: 21,
    color: "#454B52",
    fontWeight: "400",
  },

  form: {
    paddingHorizontal: 35,
    paddingTop: 35,
    paddingBottom: 30,
  },

  label: {
    fontSize: 17,
    fontWeight: "500",
    color: "#454A50",
    letterSpacing: 2,
    marginBottom: 8,
    marginTop: 17,
    fontFamily: "monospace",
  },

  inputContainer: {
    height: 57,
    borderWidth: 1.5,
    borderColor: "#C7CCD2",
    backgroundColor: "#F8FAFC",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
  },

  inputError: {
    borderColor: "#D9534F",
  },

  errorText: {
    color: "#D9534F",
    fontSize: 13,
    marginTop: 4,
    marginLeft: 2,
  },

  input: {
    flex: 1,
    fontSize: 19,
    color: "#1E242A",
    marginLeft: 11,
  },

  selectContainer: {
    height: 57,
    borderWidth: 1.5,
    borderColor: "#C7CCD2",
    backgroundColor: "#F8FAFC",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
  },

  disabledSelect: {
    backgroundColor: "#E9EDF0",
  },

  selectText: {
    fontSize: 19,
    fontWeight: "600",
    color: "#171B1F",
  },

  placeholderText: {
    color: "#A6ABB1",
    fontWeight: "500",
  },

  primaryButton: {
    height: 72,
    backgroundColor: "#172C3E",
    marginTop: 35,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "400",
  },

  bottomTextContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 31,
  },

  bottomText: {
    color: "#4D5359",
    fontSize: 19,
  },

  linkText: {
    color: "#006CA8",
    fontSize: 19,
    fontWeight: "600",
  },

  forgotContainer: {
    alignItems: "flex-end",
    marginTop: 13,
  },

  forgotText: {
    color: "#006CA8",
    fontSize: 16,
    fontWeight: "600",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },

  modalContainer: {
    backgroundColor: "#FFFFFF",
    maxHeight: "70%",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 30,
  },

  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 22,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E1E4E7",
  },

  modalTitle: {
    fontSize: 21,
    fontWeight: "700",
    color: "#172C3E",
  },

  option: {
    paddingHorizontal: 22,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#EEF0F2",
  },

  optionText: {
    fontSize: 18,
    color: "#20262C",
  },
});
