import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import * as Location from "expo-location";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { z } from "zod";

const API_URL =
  process.env.EXPO_PUBLIC_API_URL || "http://localhost:5001";

/* -------------------------------------------------------------------------- */
/*                                   Schema                                   */
/* -------------------------------------------------------------------------- */

const householdSchema = z
  .object({
    head_full_name: z
      .string()
      .trim()
      .min(2, "Full name is required"),

    head_age: z
      .string()
      .min(1, "Age is required")
      .refine(
        (value) => {
          const age = Number(value);
          return Number.isInteger(age) && age >= 1 && age <= 120;
        },
        "Enter a valid age"
      ),

    head_gender: z.enum(["Male", "Female", "Other"], {
      message: "Please select gender",
    }),

    head_mobile_number: z
      .string()
      .regex(/^[0-9]{10}$/, "Enter a valid 10-digit mobile number"),

    total_members: z
      .string()
      .refine(
        (value) => Number.isInteger(Number(value)) && Number(value) >= 1,
        "Enter valid total members"
      ),

    male_members: z
      .string()
      .refine(
        (value) => Number.isInteger(Number(value)) && Number(value) >= 0,
        "Enter valid number"
      ),

    female_members: z
      .string()
      .refine(
        (value) => Number.isInteger(Number(value)) && Number(value) >= 0,
        "Enter valid number"
      ),

    children_count: z
      .string()
      .refine(
        (value) => Number.isInteger(Number(value)) && Number(value) >= 0,
        "Enter valid number"
      ),

    senior_count: z
      .string()
      .refine(
        (value) => Number.isInteger(Number(value)) && Number(value) >= 0,
        "Enter valid number"
      ),

    house_no: z
      .string()
      .trim()
      .min(1, "House / Flat number is required"),

    locality: z
      .string()
      .trim()
      .min(1, "Locality / Street is required"),

    ward: z.string().trim().min(1, "Ward is required"),

    district: z.string().trim().min(1, "District is required"),

    pincode: z
      .string()
      .regex(/^[0-9]{6}$/, "Enter a valid 6-digit PIN code"),

    has_electricity: z.boolean(),
    has_running_water: z.boolean(),
    has_indoor_toilet: z.boolean(),
    has_lpg: z.boolean(),
    has_internet: z.boolean(),
  })
  .superRefine((data, ctx) => {
    const total = Number(data.total_members);
    const male = Number(data.male_members);
    const female = Number(data.female_members);
    const children = Number(data.children_count);
    const seniors = Number(data.senior_count);

    if (male + female > total) {
      ctx.addIssue({
        code: "custom",
        message: "Male + Female cannot exceed total members",
        path: ["total_members"],
      });
    }

    if (children > total) {
      ctx.addIssue({
        code: "custom",
        message: "Children cannot exceed total members",
        path: ["children_count"],
      });
    }

    if (seniors > total) {
      ctx.addIssue({
        code: "custom",
        message: "Seniors cannot exceed total members",
        path: ["senior_count"],
      });
    }
  });

type HouseholdForm = z.infer<typeof householdSchema>;

type HouseholdProfile = {
  id: string;
  head_full_name: string;
  head_age: number;
  head_gender: "Male" | "Female" | "Other";
  head_mobile_number: string;
  total_members: number;
  male_members: number;
  female_members: number;
  children_count: number;
  senior_count: number;
  house_no: string;
  locality: string;
  ward: string;
  district: string;
  pincode: string;
  has_electricity: boolean;
  has_running_water: boolean;
  has_indoor_toilet: boolean;
  has_lpg: boolean;
  has_internet: boolean;
  latitude: number;
  longitude: number;
};

/* -------------------------------------------------------------------------- */
/*                               Reusable Input                               */
/* -------------------------------------------------------------------------- */

type InputFieldProps = {
  label: string;
  placeholder?: string;
  value: string;
  onChangeText: (value: string) => void;
  error?: string;
  keyboardType?: "default" | "numeric" | "phone-pad";
  editable?: boolean;
};

function InputField({
  label,
  placeholder,
  value,
  onChangeText,
  error,
  keyboardType = "default",
  editable = true,
}: InputFieldProps) {
  return (
    <View style={styles.inputWrapper}>
      <Text style={styles.label}>{label}</Text>

      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#8A929D"
        keyboardType={keyboardType}
        editable={editable}
        style={[
          styles.input,
          !editable && styles.disabledInput,
          error && styles.inputError,
        ]}
      />

      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

function ProfileRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.profileRow}>
      <Text style={styles.profileLabel}>{label}</Text>
      <Text style={styles.profileValue}>{value}</Text>
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/*                              Checkbox                                      */
/* -------------------------------------------------------------------------- */

type CheckboxProps = {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  value: boolean;
  onChange: (value: boolean) => void;
};

function FacilityCheckbox({
  label,
  icon,
  value,
  onChange,
}: CheckboxProps) {
  return (
    <Pressable
      style={styles.facilityRow}
      onPress={() => onChange(!value)}
    >
      <View style={[styles.checkbox, value && styles.checkboxActive]}>
        {value && (
          <Ionicons
            name="checkmark"
            size={16}
            color="#FFFFFF"
          />
        )}
      </View>

      <Ionicons
        name={icon}
        size={23}
        color="#747C87"
        style={styles.facilityIcon}
      />

      <Text style={styles.facilityText}>{label}</Text>
    </Pressable>
  );
}

/* -------------------------------------------------------------------------- */
/*                              Gender Picker                                 */
/* -------------------------------------------------------------------------- */

type GenderPickerProps = {
  value: HouseholdForm["head_gender"] | undefined;
  onChange: (value: HouseholdForm["head_gender"]) => void;
  error?: string;
};

function GenderPicker({
  value,
  onChange,
  error,
}: GenderPickerProps) {
  const [visible, setVisible] = useState(false);

  const genders: HouseholdForm["head_gender"][] = [
    "Male",
    "Female",
    "Other",
  ];

  return (
    <>
      <View style={styles.inputWrapper}>
        <Text style={styles.label}>GENDER</Text>

        <Pressable
          style={[
            styles.input,
            styles.selectInput,
            error && styles.inputError,
          ]}
          onPress={() => setVisible(true)}
        >
          <Text
            style={[
              styles.selectText,
              !value && styles.placeholderText,
            ]}
          >
            {value || "Select..."}
          </Text>

          <Ionicons
            name="chevron-down"
            size={20}
            color="#66717D"
          />
        </Pressable>

        {error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : null}
      </View>

      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setVisible(false)}
        >
          <View style={styles.genderModal}>
            <Text style={styles.modalTitle}>Select Gender</Text>

            {genders.map((gender) => (
              <Pressable
                key={gender}
                style={styles.genderOption}
                onPress={() => {
                  onChange(gender);
                  setVisible(false);
                }}
              >
                <Text style={styles.genderOptionText}>
                  {gender}
                </Text>

                {value === gender && (
                  <Ionicons
                    name="checkmark"
                    size={22}
                    color="#172A3A"
                  />
                )}
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

/* -------------------------------------------------------------------------- */
/*                              Main Screen                                   */
/* -------------------------------------------------------------------------- */

export default function HouseholdScreen() {
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [existingProfile, setExistingProfile] =
    useState<HouseholdProfile | null>(null);

  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
    accuracy: number | null;
  } | null>(null);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<HouseholdForm>({
    resolver: zodResolver(householdSchema),
    defaultValues: {
      head_full_name: "",
      head_age: "",
      head_gender: undefined,
      head_mobile_number: "",

      total_members: "1",
      male_members: "0",
      female_members: "0",
      children_count: "0",
      senior_count: "0",

      house_no: "",
      locality: "",
      ward: "",
      district: "",
      pincode: "",

      has_electricity: false,
      has_running_water: false,
      has_indoor_toilet: false,
      has_lpg: false,
      has_internet: false,
    },
  });

  /* ---------------------------------------------------------------------- */
  /*                     Load logged-in citizen information                  */
  /* ---------------------------------------------------------------------- */

  useEffect(() => {
    const initializeScreenData = async () => {
      try {
        const storedUser = await SecureStore.getItemAsync(
          "citizen_user"
        );

        if (!storedUser) return;

        const user = JSON.parse(storedUser);

        if (user.full_name) {
          setValue("head_full_name", user.full_name);
        }

        if (user.mobile_number) {
          setValue(
            "head_mobile_number",
            user.mobile_number
          );
        }

        if (user.pincode) {
          setValue("pincode", user.pincode);
        }

        if (user.state) {
          // State isn't currently part of household_profiles.
          // It can be added later if required.
        }

        const token = await SecureStore.getItemAsync(
          "citizen_token"
        );

        if (!token) {
          router.replace("/(auth)/login");
          return;
        }

        const response = await fetch(
          `${API_URL}/api/household/me`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const result = await response.json();
          setExistingProfile(result.household ?? null);
        } else if (response.status !== 404) {
          const text = await response.text();
          console.error(
            "Failed to fetch household profile:",
            response.status,
            text
          );
        }
      } catch (error) {
        console.error("Failed to load citizen:", error);
      } finally {
        setLoadingProfile(false);
      }
    };

    initializeScreenData();
  }, [setValue]);

  /* ---------------------------------------------------------------------- */
  /*                              GPS                                        */
  /* ---------------------------------------------------------------------- */

  const captureLocation = async () => {
    try {
      setLocationLoading(true);

      const { status } =
        await Location.requestForegroundPermissionsAsync();

      if (status !== Location.PermissionStatus.GRANTED) {
        Alert.alert(
          "Location Permission",
          "Location permission is required to capture your household coordinates."
        );
        return;
      }

      const currentLocation =
        await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });

      const coords = currentLocation.coords;

      setLocation({
        latitude: coords.latitude,
        longitude: coords.longitude,
        accuracy: coords.accuracy,
      });

      Alert.alert(
        "Location Captured",
        "Your household GPS coordinates have been captured successfully."
      );
    } catch (error) {
      console.error("Location error:", error);

      Alert.alert(
        "Location Error",
        "Unable to capture your current location. Please try again."
      );
    } finally {
      setLocationLoading(false);
    }
  };

  /* ---------------------------------------------------------------------- */
  /*                              Submit                                     */
  /* ---------------------------------------------------------------------- */

  const onSubmit = async (data: HouseholdForm) => {
    try {
      if (!location) {
        Alert.alert(
          "Location Required",
          "Please use your current location before submitting the household."
        );
        return;
      }

      setLoading(true);

      const token = await SecureStore.getItemAsync(
        "citizen_token"
      );

      if (!token) {
        Alert.alert(
          "Session Expired",
          "Please login again."
        );

        router.replace("/(auth)/login");
        return;
      }

      const payload = {
        head_full_name: data.head_full_name,
        head_age: Number(data.head_age),
        head_gender: data.head_gender,
        head_mobile_number: data.head_mobile_number,

        total_members: Number(data.total_members),
        male_members: Number(data.male_members),
        female_members: Number(data.female_members),
        children_count: Number(data.children_count),
        senior_count: Number(data.senior_count),

        house_no: data.house_no,
        locality: data.locality,
        ward: data.ward,
        district: data.district,
        pincode: data.pincode,

        has_electricity: data.has_electricity,
        has_running_water: data.has_running_water,
        has_indoor_toilet: data.has_indoor_toilet,
        has_lpg: data.has_lpg,
        has_internet: data.has_internet,

        latitude: location.latitude,
        longitude: location.longitude,
        location_accuracy: location.accuracy,
      };

      const response = await fetch(
        `${API_URL}/api/household`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || "Failed to register household"
        );
      }

      Alert.alert(
        "Household Registered",
        "Your household details have been saved successfully.",
        [
          {
            text: "Continue",
            onPress: () => {
              router.replace("/(citizen)/dashboard");
            },
          },
        ]
      );
    } catch (error) {
      console.error("Household submission error:", error);

      Alert.alert(
        "Submission Failed",
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  /* ---------------------------------------------------------------------- */
  /*                                UI                                       */
  /* ---------------------------------------------------------------------- */

  return (
    loadingProfile ? (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centeredState}>
          <ActivityIndicator size="large" color="#172A3A" />
        </View>
      </SafeAreaView>
    ) : existingProfile ? (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Pressable
            style={styles.headerButton}
            onPress={() => router.back()}
          >
            <Ionicons
              name="arrow-back-outline"
              size={24}
              color="#172A3A"
            />
          </Pressable>

          <Text style={styles.headerTitle}>My Household Profile</Text>

          <Pressable
            style={styles.headerButton}
            onPress={() => router.replace("/(citizen)/dashboard")}
          >
            <Ionicons
              name="home-outline"
              size={22}
              color="#172A3A"
            />
          </Pressable>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Head of Family</Text>
            <ProfileRow label="Full Name" value={existingProfile.head_full_name} />
            <ProfileRow label="Age" value={String(existingProfile.head_age)} />
            <ProfileRow label="Gender" value={existingProfile.head_gender} />
            <ProfileRow
              label="Mobile"
              value={existingProfile.head_mobile_number}
            />
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Family Details</Text>
            <ProfileRow
              label="Total Members"
              value={String(existingProfile.total_members)}
            />
            <ProfileRow
              label="Male Members"
              value={String(existingProfile.male_members)}
            />
            <ProfileRow
              label="Female Members"
              value={String(existingProfile.female_members)}
            />
            <ProfileRow
              label="Children (<18)"
              value={String(existingProfile.children_count)}
            />
            <ProfileRow
              label="Seniors (65+)"
              value={String(existingProfile.senior_count)}
            />
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Address</Text>
            <ProfileRow label="House / Flat" value={existingProfile.house_no} />
            <ProfileRow label="Locality" value={existingProfile.locality} />
            <ProfileRow label="Ward" value={existingProfile.ward} />
            <ProfileRow label="District" value={existingProfile.district} />
            <ProfileRow label="Pincode" value={existingProfile.pincode} />
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Facilities</Text>
            <ProfileRow
              label="Electricity"
              value={existingProfile.has_electricity ? "Yes" : "No"}
            />
            <ProfileRow
              label="Running Water"
              value={existingProfile.has_running_water ? "Yes" : "No"}
            />
            <ProfileRow
              label="Indoor Toilet"
              value={existingProfile.has_indoor_toilet ? "Yes" : "No"}
            />
            <ProfileRow
              label="LPG / Gas"
              value={existingProfile.has_lpg ? "Yes" : "No"}
            />
            <ProfileRow
              label="Internet"
              value={existingProfile.has_internet ? "Yes" : "No"}
            />
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Coordinates</Text>
            <ProfileRow label="Latitude" value={existingProfile.latitude.toFixed(6)} />
            <ProfileRow label="Longitude" value={existingProfile.longitude.toFixed(6)} />
          </View>
        </ScrollView>
      </SafeAreaView>
    ) : (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={
          Platform.OS === "ios" ? "padding" : undefined
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable
            style={styles.headerButton}
            onPress={() => router.back()}
          >
            <Ionicons
              name="menu-outline"
              size={27}
              color="#172A3A"
            />
          </Pressable>

          <Text style={styles.headerTitle}>
            Register My Household
          </Text>

          <Pressable style={styles.headerButton}>
            <Ionicons
              name="refresh-outline"
              size={23}
              color="#172A3A"
            />
          </Pressable>
        </View>

        {/* Scrollable Form */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* -------------------------------------------------------------- */}
          {/* Head of Family                                                 */}
          {/* -------------------------------------------------------------- */}

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>
              Head of Family
            </Text>

            <Controller
              control={control}
              name="head_full_name"
              render={({ field: { value, onChange } }) => (
                <InputField
                  label="FULL NAME"
                  placeholder="Enter full name"
                  value={value}
                  onChangeText={onChange}
                  error={errors.head_full_name?.message}
                />
              )}
            />

            <View style={styles.row}>
              <View style={styles.halfInput}>
                <Controller
                  control={control}
                  name="head_age"
                  render={({
                    field: { value, onChange },
                  }) => (
                    <InputField
                      label="AGE"
                      placeholder="Years"
                      value={value}
                      onChangeText={onChange}
                      keyboardType="numeric"
                      error={errors.head_age?.message}
                    />
                  )}
                />
              </View>

              <View style={styles.halfInput}>
                <Controller
                  control={control}
                  name="head_gender"
                  render={({
                    field: { value, onChange },
                  }) => (
                    <GenderPicker
                      value={value}
                      onChange={onChange}
                      error={errors.head_gender?.message}
                    />
                  )}
                />
              </View>
            </View>

            <Controller
              control={control}
              name="head_mobile_number"
              render={({ field: { value, onChange } }) => (
                <InputField
                  label="MOBILE NUMBER"
                  placeholder="+91 00000 00000"
                  value={value}
                  onChangeText={onChange}
                  keyboardType="phone-pad"
                  editable={false}
                  error={
                    errors.head_mobile_number?.message
                  }
                />
              )}
            />
          </View>

          {/* -------------------------------------------------------------- */}
          {/* Family Details                                                 */}
          {/* -------------------------------------------------------------- */}

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>
              Family Details
            </Text>

            <View style={styles.row}>
              <View style={styles.halfInput}>
                <Controller
                  control={control}
                  name="total_members"
                  render={({
                    field: { value, onChange },
                  }) => (
                    <InputField
                      label="TOTAL"
                      value={value}
                      onChangeText={onChange}
                      keyboardType="numeric"
                      error={
                        errors.total_members?.message
                      }
                    />
                  )}
                />
              </View>

              <View style={styles.halfInput}>
                <Controller
                  control={control}
                  name="male_members"
                  render={({
                    field: { value, onChange },
                  }) => (
                    <InputField
                      label="MALE"
                      value={value}
                      onChangeText={onChange}
                      keyboardType="numeric"
                      error={
                        errors.male_members?.message
                      }
                    />
                  )}
                />
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.halfInput}>
                <Controller
                  control={control}
                  name="female_members"
                  render={({
                    field: { value, onChange },
                  }) => (
                    <InputField
                      label="FEMALE"
                      value={value}
                      onChangeText={onChange}
                      keyboardType="numeric"
                      error={
                        errors.female_members?.message
                      }
                    />
                  )}
                />
              </View>

              <View style={styles.halfInput}>
                <Controller
                  control={control}
                  name="children_count"
                  render={({
                    field: { value, onChange },
                  }) => (
                    <InputField
                      label="CHILDREN (<18)"
                      value={value}
                      onChangeText={onChange}
                      keyboardType="numeric"
                      error={
                        errors.children_count?.message
                      }
                    />
                  )}
                />
              </View>
            </View>

            <Controller
              control={control}
              name="senior_count"
              render={({ field: { value, onChange } }) => (
                <InputField
                  label="SENIORS (65+)"
                  value={value}
                  onChangeText={onChange}
                  keyboardType="numeric"
                  error={errors.senior_count?.message}
                />
              )}
            />
          </View>

          {/* -------------------------------------------------------------- */}
          {/* Address                                                        */}
          {/* -------------------------------------------------------------- */}

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>
              Address
            </Text>

            <Controller
              control={control}
              name="house_no"
              render={({ field: { value, onChange } }) => (
                <InputField
                  label="HOUSE / FLAT NO."
                  value={value}
                  onChangeText={onChange}
                  error={errors.house_no?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="locality"
              render={({ field: { value, onChange } }) => (
                <InputField
                  label="LOCALITY / STREET"
                  value={value}
                  onChangeText={onChange}
                  error={errors.locality?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="ward"
              render={({ field: { value, onChange } }) => (
                <InputField
                  label="WARD"
                  value={value}
                  onChangeText={onChange}
                  error={errors.ward?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="district"
              render={({ field: { value, onChange } }) => (
                <InputField
                  label="DISTRICT"
                  value={value}
                  onChangeText={onChange}
                  error={errors.district?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="pincode"
              render={({ field: { value, onChange } }) => (
                <InputField
                  label="PIN / POSTAL CODE"
                  value={value}
                  onChangeText={onChange}
                  keyboardType="numeric"
                  error={errors.pincode?.message}
                />
              )}
            />
          </View>

          {/* -------------------------------------------------------------- */}
          {/* Facilities                                                     */}
          {/* -------------------------------------------------------------- */}

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>
              Available Facilities
            </Text>

            <Controller
              control={control}
              name="has_electricity"
              render={({ field: { value, onChange } }) => (
                <FacilityCheckbox
                  label="Electricity"
                  icon="flash-outline"
                  value={value}
                  onChange={onChange}
                />
              )}
            />

            <Controller
              control={control}
              name="has_running_water"
              render={({ field: { value, onChange } }) => (
                <FacilityCheckbox
                  label="Running Water"
                  icon="water-outline"
                  value={value}
                  onChange={onChange}
                />
              )}
            />

            <Controller
              control={control}
              name="has_indoor_toilet"
              render={({ field: { value, onChange } }) => (
                <FacilityCheckbox
                  label="Indoor Toilet"
                  icon="people-outline"
                  value={value}
                  onChange={onChange}
                />
              )}
            />

            <Controller
              control={control}
              name="has_lpg"
              render={({ field: { value, onChange } }) => (
                <FacilityCheckbox
                  label="LPG / Gas"
                  icon="flame-outline"
                  value={value}
                  onChange={onChange}
                />
              )}
            />

            <Controller
              control={control}
              name="has_internet"
              render={({ field: { value, onChange } }) => (
                <FacilityCheckbox
                  label="Internet Connection"
                  icon="wifi-outline"
                  value={value}
                  onChange={onChange}
                />
              )}
            />
          </View>

          {/* -------------------------------------------------------------- */}
          {/* Spatial Data                                                   */}
          {/* -------------------------------------------------------------- */}

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>
              Spatial Data
            </Text>

            <View style={styles.locationBox}>
              <Ionicons
                name="location-outline"
                size={54}
                color="#B8BEC6"
              />

              <Text style={styles.locationDescription}>
                Capture precise GPS coordinates for GIS
                integration.
              </Text>

              <Pressable
                style={[
                  styles.locationButton,
                  location && styles.locationButtonSuccess,
                ]}
                onPress={captureLocation}
                disabled={locationLoading}
              >
                {locationLoading ? (
                  <ActivityIndicator color="#172A3A" />
                ) : (
                  <>
                    <Ionicons
                      name={
                        location
                          ? "checkmark-circle-outline"
                          : "locate-outline"
                      }
                      size={22}
                      color="#172A3A"
                    />

                    <Text style={styles.locationButtonText}>
                      {location
                        ? "LOCATION CAPTURED"
                        : "USE MY LOCATION"}
                    </Text>
                  </>
                )}
              </Pressable>

              {location && (
                <View style={styles.coordinates}>
                  <Text style={styles.coordinateText}>
                    Lat: {location.latitude.toFixed(6)}
                  </Text>

                  <Text style={styles.coordinateText}>
                    Long: {location.longitude.toFixed(6)}
                  </Text>

                  {location.accuracy !== null && (
                    <Text style={styles.coordinateText}>
                      Accuracy: ±
                      {location.accuracy.toFixed(1)}m
                    </Text>
                  )}
                </View>
              )}
            </View>
          </View>

          {/* Extra bottom space so button doesn't cover content */}
          <View style={{ height: 110 }} />
        </ScrollView>

        {/* -------------------------------------------------------------- */}
        {/* Fixed Submit Button                                             */}
        {/* -------------------------------------------------------------- */}

        <View style={styles.submitContainer}>
          <Pressable
            style={[
              styles.submitButton,
              loading && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit(onSubmit)}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Text style={styles.submitText}>
                  SUBMIT HOUSEHOLD
                </Text>

                <Ionicons
                  name="cloud-upload-outline"
                  size={21}
                  color="#FFFFFF"
                />
              </>
            )}
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
    )
  );
}

/* -------------------------------------------------------------------------- */
/*                                  Styles                                    */
/* -------------------------------------------------------------------------- */

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F1F4F6",
  },

  container: {
    flex: 1,
    backgroundColor: "#F1F4F6",
  },

  centeredState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  header: {
    height: 56,
    backgroundColor: "#F8FAFB",
    borderBottomWidth: 1,
    borderBottomColor: "#D8DDE2",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
  },

  headerButton: {
    width: 38,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
  },

  headerTitle: {
    color: "#172A3A",
    fontSize: 14,
    fontWeight: "700",
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    padding: 14,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D0D5DB",
    borderRadius: 0,
    padding: 14,
    marginBottom: 14,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#252A2F",
    marginBottom: 10,
  },

  row: {
    flexDirection: "row",
    gap: 14,
  },

  halfInput: {
    flex: 1,
  },

  inputWrapper: {
    marginBottom: 12,
    flex: 1,
  },

  label: {
    fontSize: 11,
    fontWeight: "500",
    color: "#17191C",
    letterSpacing: 0.3,
    marginBottom: 4,
  },

  input: {
    height: 44,
    borderWidth: 1.5,
    borderColor: "#AEB5BE",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 11,
    fontSize: 15,
    color: "#20252A",
  },

  disabledInput: {
    backgroundColor: "#F1F3F5",
    color: "#59636E",
  },

  inputError: {
    borderColor: "#C62828",
  },

  errorText: {
    color: "#C62828",
    fontSize: 10,
    marginTop: 3,
  },

  selectInput: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  selectText: {
    fontSize: 15,
    color: "#20252A",
  },

  placeholderText: {
    color: "#7D8792",
  },

  checkbox: {
    width: 17,
    height: 17,
    borderWidth: 1.5,
    borderColor: "#9BA3AD",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },

  checkboxActive: {
    backgroundColor: "#172A3A",
    borderColor: "#172A3A",
  },

  facilityRow: {
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
  },

  facilityIcon: {
    marginRight: 10,
  },

  facilityText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#272C31",
  },

  locationBox: {
    backgroundColor: "#EEF0F2",
    minHeight: 180,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },

  locationDescription: {
    textAlign: "center",
    color: "#424950",
    fontSize: 13,
    lineHeight: 19,
    marginTop: 5,
    marginBottom: 14,
  },

  locationButton: {
    width: "100%",
    height: 46,
    backgroundColor: "#57B4F4",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 0,
  },

  locationButtonSuccess: {
    backgroundColor: "#8BD6A5",
  },

  locationButtonText: {
    color: "#172A3A",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.2,
  },

  coordinates: {
    width: "100%",
    marginTop: 10,
    padding: 8,
    backgroundColor: "#FFFFFF",
    borderRadius: 0,
  },

  coordinateText: {
    textAlign: "center",
    color: "#4A535D",
    fontSize: 11,
    marginVertical: 1,
  },

  submitContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 8,
    paddingTop: 8,
    paddingBottom: Platform.OS === "ios" ? 8 : 8,
    backgroundColor: "#F1F4F6",
  },

  submitButton: {
    height: 48,
    backgroundColor: "#172A3A",
    borderRadius: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
  },

  submitButtonDisabled: {
    opacity: 0.7,
  },

  submitText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },

  genderModal: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    padding: 20,
    paddingBottom: 35,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#172A3A",
    marginBottom: 10,
  },

  genderOption: {
    height: 52,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E8EB",
  },

  genderOptionText: {
    fontSize: 15,
    color: "#252A2F",
  },

  profileRow: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E8EB",
    gap: 4,
  },

  profileLabel: {
    fontSize: 12,
    color: "#68717A",
    fontWeight: "600",
  },

  profileValue: {
    fontSize: 15,
    color: "#1D2329",
    fontWeight: "600",
  },
});
