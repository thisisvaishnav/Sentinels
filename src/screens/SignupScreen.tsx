import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  InputLabel,
  SelectionModal,
  authStyles,
  states,
} from '@/src/features/auth/shared';

export default function SignupScreen() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [pin, setPin] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");

  const [stateModal, setStateModal] = useState(false);
  const [districtModal, setDistrictModal] = useState(false);

  const districts =
    selectedState && states[selectedState as keyof typeof states]
      ? states[selectedState as keyof typeof states]
      : [];

  const handleCreateAccount = () => {
    router.replace("/(citizen)/dashboard");
  };

  return (
    <SafeAreaView style={authStyles.safeArea}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={authStyles.scrollContent}
      >
        <View style={authStyles.container}>

          {/* HEADER */}
          <View style={authStyles.header}>

            <View style={authStyles.logoBox}>
              <Ionicons
                name="search-circle-outline"
                size={42}
                color="#91A4B9"
              />
            </View>

            <Text style={authStyles.logoText}>LokVision</Text>

            <Text style={authStyles.subtitle}>
              Create your citizen account
            </Text>

          </View>

          <View style={authStyles.form}>

            {/* FULL NAME */}
            <InputLabel text="FULL NAME" />

            <View style={authStyles.inputContainer}>
              <Ionicons
                name="person-outline"
                size={23}
                color="#7C8289"
              />

              <TextInput
                style={authStyles.input}
                placeholder="Enter your full name"
                placeholderTextColor="#BFC3C9"
                value={fullName}
                onChangeText={setFullName}
              />
            </View>

            {/* MOBILE */}
            <InputLabel text="MOBILE NUMBER" />

            <View style={authStyles.inputContainer}>
              <Ionicons
                name="phone-portrait-outline"
                size={24}
                color="#7C8289"
              />

              <TextInput
                style={authStyles.input}
                placeholder="10-digit mobile number"
                placeholderTextColor="#BFC3C9"
                keyboardType="phone-pad"
                maxLength={10}
                value={mobile}
                onChangeText={setMobile}
              />
            </View>

            {/* PASSWORD */}
            <InputLabel text="PASSWORD" />

            <View style={authStyles.inputContainer}>
              <Ionicons
                name="lock-closed-outline"
                size={23}
                color="#7C8289"
              />

              <TextInput
                style={authStyles.input}
                placeholder="Create a secure password"
                placeholderTextColor="#BFC3C9"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
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

            {/* STATE */}
            <InputLabel text="STATE" />

            <TouchableOpacity
              style={authStyles.selectContainer}
              onPress={() => setStateModal(true)}
            >
              <Text
                style={[
                  authStyles.selectText,
                  !selectedState && authStyles.placeholderText,
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

            {/* DISTRICT */}
            <InputLabel text="DISTRICT" />

            <TouchableOpacity
              style={[
                authStyles.selectContainer,
                !selectedState && authStyles.disabledSelect,
              ]}
              disabled={!selectedState}
              onPress={() => setDistrictModal(true)}
            >
              <Text
                style={[
                  authStyles.selectText,
                  !selectedDistrict && authStyles.placeholderText,
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

            {/* PIN */}
            <InputLabel text="PIN CODE" />

            <View style={authStyles.inputContainer}>
              <Ionicons
                name="location-outline"
                size={24}
                color="#7C8289"
              />

              <TextInput
                style={authStyles.input}
                placeholder="6-digit postal code"
                placeholderTextColor="#BFC3C9"
                keyboardType="number-pad"
                maxLength={6}
                value={pin}
                onChangeText={setPin}
              />
            </View>

            {/* CREATE ACCOUNT */}
            <TouchableOpacity
              style={authStyles.primaryButton}
              activeOpacity={0.8}
              onPress={handleCreateAccount}
            >
              <Text style={authStyles.buttonText}>
                CREATE ACCOUNT
              </Text>

              <Ionicons
                name="arrow-forward"
                size={27}
                color="#FFFFFF"
              />
            </TouchableOpacity>

            {/* LOGIN */}
            <View style={authStyles.bottomTextContainer}>
              <Text style={authStyles.bottomText}>
                Already have an account?{" "}
              </Text>

              <TouchableOpacity
                onPress={() => router.push("/(auth)/login")}
              >
                <Text style={authStyles.linkText}>Log in</Text>
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
        }}
      />
    </SafeAreaView>
  );
}
