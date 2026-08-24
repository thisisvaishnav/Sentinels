import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
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
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { z } from "zod";

import { EnumeratorHeader } from "@/src/features/enumeration/components/EnumeratorHeader";
import { useCitizenDrawer } from "@/src/contexts/CitizenDrawerContext";
import { CITIZEN_THEME } from "@/src/features/enumeration/theme";
import { EnumeratorProfile } from "@/src/features/enumeration/types";

const T = CITIZEN_THEME;
const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:5001";

/* -------------------------------------------------------------------------- */
/*                                   Schema                                   */
/* -------------------------------------------------------------------------- */

const householdSchema = z
  .object({
    head_full_name: z.string().trim().min(2, "Full name is required"),
    head_age: z
      .string()
      .min(1, "Age is required")
      .refine((v) => {
        const age = Number(v);
        return Number.isInteger(age) && age >= 1 && age <= 120;
      }, "Enter a valid age"),
    head_gender: z.enum(["Male", "Female", "Other"], { message: "Please select gender" }),
    head_mobile_number: z.string().regex(/^[0-9]{10}$/, "Enter a valid 10-digit mobile number"),
    total_members: z.string().refine((v) => Number.isInteger(Number(v)) && Number(v) >= 1, "Enter valid total members"),
    male_members: z.string().refine((v) => Number.isInteger(Number(v)) && Number(v) >= 0, "Enter valid number"),
    female_members: z.string().refine((v) => Number.isInteger(Number(v)) && Number(v) >= 0, "Enter valid number"),
    children_count: z.string().refine((v) => Number.isInteger(Number(v)) && Number(v) >= 0, "Enter valid number"),
    senior_count: z.string().refine((v) => Number.isInteger(Number(v)) && Number(v) >= 0, "Enter valid number"),
    house_no: z.string().trim().min(1, "House / Flat number is required"),
    locality: z.string().trim().min(1, "Locality / Street is required"),
    ward: z.string().trim().min(1, "Ward is required"),
    district: z.string().trim().min(1, "District is required"),
    pincode: z.string().regex(/^[0-9]{6}$/, "Enter a valid 6-digit PIN code"),
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
      ctx.addIssue({ code: "custom", message: "Male + Female cannot exceed total members", path: ["total_members"] });
    }
    if (children > total) {
      ctx.addIssue({ code: "custom", message: "Children cannot exceed total members", path: ["children_count"] });
    }
    if (seniors > total) {
      ctx.addIssue({ code: "custom", message: "Seniors cannot exceed total members", path: ["senior_count"] });
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
/*                              Reusable Input                                 */
/* -------------------------------------------------------------------------- */

type InputFieldProps = {
  label: string;
  placeholder?: string;
  value: string;
  onChangeText: (v: string) => void;
  error?: string;
  keyboardType?: "default" | "numeric" | "phone-pad";
  editable?: boolean;
};

function InputField({ label, placeholder, value, onChangeText, error, keyboardType = "default", editable = true }: InputFieldProps) {
  return (
    <View style={s.inputWrapper}>
      <Text style={s.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={T.colors.textMuted}
        keyboardType={keyboardType}
        editable={editable}
        style={[s.input, !editable && s.inputDisabled, error && s.inputError]}
      />
      {error ? <Text style={s.errorText}>{error}</Text> : null}
    </View>
  );
}

function ProfileRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={s.profileRow}>
      <Text style={s.profileLabel}>{label}</Text>
      <Text style={s.profileValue}>{value}</Text>
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/*                              Facility Checkbox                              */
/* -------------------------------------------------------------------------- */

type CheckboxProps = {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  value: boolean;
  onChange: (v: boolean) => void;
};

function FacilityCheckbox({ label, icon, value, onChange }: CheckboxProps) {
  return (
    <Pressable style={s.facilityRow} onPress={() => onChange(!value)}>
      <View style={[s.checkbox, value && s.checkboxActive]}>
        {value && <Ionicons name="checkmark" size={14} color={T.colors.textWhite} />}
      </View>
      <Ionicons name={icon} size={20} color={value ? T.colors.accent : T.colors.textMuted} style={s.facilityIcon} />
      <Text style={[s.facilityText, value && { color: T.colors.textPrimary }]}>{label}</Text>
    </Pressable>
  );
}

/* -------------------------------------------------------------------------- */
/*                              Gender Picker                                  */
/* -------------------------------------------------------------------------- */

type GenderPickerProps = {
  value: HouseholdForm["head_gender"] | undefined;
  onChange: (v: HouseholdForm["head_gender"]) => void;
  error?: string;
};

function GenderPicker({ value, onChange, error }: GenderPickerProps) {
  const [visible, setVisible] = useState(false);
  const genders: HouseholdForm["head_gender"][] = ["Male", "Female", "Other"];

  return (
    <>
      <View style={s.inputWrapper}>
        <Text style={s.label}>GENDER</Text>
        <Pressable style={[s.input, s.selectInput, error && s.inputError]} onPress={() => setVisible(true)}>
          <Text style={[s.selectText, !value && { color: T.colors.textMuted }]}>{value || "Select..."}</Text>
          <Ionicons name="chevron-down" size={18} color={T.colors.textMuted} />
        </Pressable>
        {error ? <Text style={s.errorText}>{error}</Text> : null}
      </View>

      <Modal visible={visible} transparent animationType="fade" onRequestClose={() => setVisible(false)}>
        <Pressable style={s.modalOverlay} onPress={() => setVisible(false)}>
          <View style={s.genderModal}>
            <Text style={s.modalTitle}>Select Gender</Text>
            {genders.map((g) => (
              <Pressable
                key={g}
                style={s.genderOption}
                onPress={() => { onChange(g); setVisible(false); }}
              >
                <Text style={s.genderOptionText}>{g}</Text>
                {value === g && <Ionicons name="checkmark" size={20} color={T.colors.accent} />}
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

/* -------------------------------------------------------------------------- */
/*                              Section Card                                   */
/* -------------------------------------------------------------------------- */

function SectionCard({ title, icon, children }: { title: string; icon: keyof typeof MaterialCommunityIcons.glyphMap; children: React.ReactNode }) {
  return (
    <View style={s.card}>
      <View style={s.cardHeader}>
        <View style={s.cardIconWrap}>
          <MaterialCommunityIcons name={icon} size={20} color={T.colors.accent} />
        </View>
        <Text style={s.cardTitle}>{title}</Text>
      </View>
      {children}
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/*                              Main Screen                                    */
/* -------------------------------------------------------------------------- */

export default function HouseholdScreen() {
  const router = useRouter();
  const { open: openDrawer } = useCitizenDrawer();
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [existingProfile, setExistingProfile] = useState<HouseholdProfile | null>(null);
  const [location, setLocation] = useState<{ latitude: number; longitude: number; accuracy: number | null } | null>(null);

  const { control, handleSubmit, setValue, formState: { errors } } = useForm<HouseholdForm>({
    resolver: zodResolver(householdSchema),
    defaultValues: {
      head_full_name: "", head_age: "", head_gender: undefined, head_mobile_number: "",
      total_members: "1", male_members: "0", female_members: "0", children_count: "0", senior_count: "0",
      house_no: "", locality: "", ward: "", district: "", pincode: "",
      has_electricity: false, has_running_water: false, has_indoor_toilet: false, has_lpg: false, has_internet: false,
    },
  });

  useEffect(() => {
    const init = async () => {
      try {
        const storedUser = await SecureStore.getItemAsync("citizen_user");
        if (!storedUser) return;
        const user = JSON.parse(storedUser);
        if (user.full_name) setValue("head_full_name", user.full_name);
        if (user.mobile_number) setValue("head_mobile_number", user.mobile_number);
        if (user.pincode) setValue("pincode", user.pincode);

        const token = await SecureStore.getItemAsync("citizen_token");
        if (!token) { router.replace("/(auth)/login"); return; }

        const res = await fetch(`${API_URL}/api/household/me`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        });
        if (res.ok) {
          const result = await res.json();
          setExistingProfile(result.household ?? null);
        } else if (res.status !== 404) {
          console.error("Failed to fetch household profile:", res.status, await res.text());
        }
      } catch (e) {
        console.error("Failed to load citizen:", e);
      } finally {
        setLoadingProfile(false);
      }
    };
    init();
  }, [setValue]);

  const captureLocation = async () => {
    try {
      setLocationLoading(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== Location.PermissionStatus.GRANTED) {
        Alert.alert("Location Permission", "Location permission is required to capture your household coordinates.");
        return;
      }
      const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      setLocation({ latitude: pos.coords.latitude, longitude: pos.coords.longitude, accuracy: pos.coords.accuracy });
      Alert.alert("Location Captured", "Your household GPS coordinates have been captured successfully.");
    } catch {
      Alert.alert("Location Error", "Unable to capture your current location. Please try again.");
    } finally {
      setLocationLoading(false);
    }
  };

  const onSubmit = async (data: HouseholdForm) => {
    try {
      if (!location) {
        Alert.alert("Location Required", "Please use your current location before submitting.");
        return;
      }
      setLoading(true);
      const token = await SecureStore.getItemAsync("citizen_token");
      if (!token) { Alert.alert("Session Expired", "Please login again."); router.replace("/(auth)/login"); return; }

      const payload = {
        head_full_name: data.head_full_name, head_age: Number(data.head_age), head_gender: data.head_gender,
        head_mobile_number: data.head_mobile_number,
        total_members: Number(data.total_members), male_members: Number(data.male_members),
        female_members: Number(data.female_members), children_count: Number(data.children_count),
        senior_count: Number(data.senior_count),
        house_no: data.house_no, locality: data.locality, ward: data.ward, district: data.district, pincode: data.pincode,
        has_electricity: data.has_electricity, has_running_water: data.has_running_water,
        has_indoor_toilet: data.has_indoor_toilet, has_lpg: data.has_lpg, has_internet: data.has_internet,
        latitude: location.latitude, longitude: location.longitude, location_accuracy: location.accuracy,
      };

      const res = await fetch(`${API_URL}/api/household`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Failed to register household");

      Alert.alert("Household Registered", "Your household details have been saved successfully.", [
        { text: "Continue", onPress: () => router.replace("/(citizen)/dashboard") },
      ]);
    } catch (err) {
      console.error("Household submission error:", err);
      Alert.alert("Submission Failed", err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const profile: EnumeratorProfile = {
    id: existingProfile?.head_mobile_number ?? "CIT-001",
    name: existingProfile?.head_full_name?.split(" ")[0] ?? "Citizen",
    role: "Citizen",
    assignedZone: existingProfile ? `${existingProfile.locality} · Ward ${existingProfile.ward}` : "No location set",
    isOnline: true,
    unreadNotificationsCount: 0,
  };

  /* ---- Loading ---- */
  if (loadingProfile) {
    return (
      <SafeAreaView style={s.container}>
        <EnumeratorHeader profile={profile} onOpenDrawer={openDrawer} />
        <View style={s.centered}>
          <ActivityIndicator size="large" color={T.colors.accent} />
        </View>
      </SafeAreaView>
    );
  }

  /* ---- Profile View ---- */
  if (existingProfile) {
    return (
      <SafeAreaView style={s.container}>
        <EnumeratorHeader profile={profile} onOpenDrawer={openDrawer} />
        <ScrollView contentContainerStyle={s.body} showsVerticalScrollIndicator={false}>
          <SectionCard title="Head of Family" icon="account">
            <ProfileRow label="Full Name" value={existingProfile.head_full_name} />
            <ProfileRow label="Age" value={String(existingProfile.head_age)} />
            <ProfileRow label="Gender" value={existingProfile.head_gender} />
            <ProfileRow label="Mobile" value={existingProfile.head_mobile_number} />
          </SectionCard>

          <SectionCard title="Family Details" icon="account-group">
            <ProfileRow label="Total Members" value={String(existingProfile.total_members)} />
            <ProfileRow label="Male Members" value={String(existingProfile.male_members)} />
            <ProfileRow label="Female Members" value={String(existingProfile.female_members)} />
            <ProfileRow label="Children (<18)" value={String(existingProfile.children_count)} />
            <ProfileRow label="Seniors (65+)" value={String(existingProfile.senior_count)} />
          </SectionCard>

          <SectionCard title="Address" icon="map-marker">
            <ProfileRow label="House / Flat" value={existingProfile.house_no} />
            <ProfileRow label="Locality" value={existingProfile.locality} />
            <ProfileRow label="Ward" value={existingProfile.ward} />
            <ProfileRow label="District" value={existingProfile.district} />
            <ProfileRow label="Pincode" value={existingProfile.pincode} />
          </SectionCard>

          <SectionCard title="Facilities" icon="home-variant">
            <ProfileRow label="Electricity" value={existingProfile.has_electricity ? "Yes" : "No"} />
            <ProfileRow label="Running Water" value={existingProfile.has_running_water ? "Yes" : "No"} />
            <ProfileRow label="Indoor Toilet" value={existingProfile.has_indoor_toilet ? "Yes" : "No"} />
            <ProfileRow label="LPG / Gas" value={existingProfile.has_lpg ? "Yes" : "No"} />
            <ProfileRow label="Internet" value={existingProfile.has_internet ? "Yes" : "No"} />
          </SectionCard>

          <SectionCard title="Coordinates" icon="crosshairs-gps">
            <ProfileRow label="Latitude" value={existingProfile.latitude.toFixed(6)} />
            <ProfileRow label="Longitude" value={existingProfile.longitude.toFixed(6)} />
          </SectionCard>

          <View style={{ height: 32 }} />
        </ScrollView>
      </SafeAreaView>
    );
  }

  /* ---- Registration Form ---- */
  return (
    <SafeAreaView style={s.container}>
      <EnumeratorHeader profile={profile} onOpenDrawer={openDrawer} />

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView contentContainerStyle={s.body} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          {/* Head of Family */}
          <SectionCard title="Head of Family" icon="account">
            <Controller control={control} name="head_full_name" render={({ field: { value, onChange } }) => (
              <InputField label="FULL NAME" placeholder="Enter full name" value={value} onChangeText={onChange} error={errors.head_full_name?.message} />
            )} />
            <View style={s.row}>
              <View style={s.half}>
                <Controller control={control} name="head_age" render={({ field: { value, onChange } }) => (
                  <InputField label="AGE" placeholder="Years" value={value} onChangeText={onChange} keyboardType="numeric" error={errors.head_age?.message} />
                )} />
              </View>
              <View style={s.half}>
                <Controller control={control} name="head_gender" render={({ field: { value, onChange } }) => (
                  <GenderPicker value={value} onChange={onChange} error={errors.head_gender?.message} />
                )} />
              </View>
            </View>
            <Controller control={control} name="head_mobile_number" render={({ field: { value, onChange } }) => (
              <InputField label="MOBILE NUMBER" placeholder="00000 00000" value={value} onChangeText={onChange} keyboardType="phone-pad" editable={false} error={errors.head_mobile_number?.message} />
            )} />
          </SectionCard>

          {/* Family Details */}
          <SectionCard title="Family Details" icon="account-group">
            <View style={s.row}>
              <View style={s.half}>
                <Controller control={control} name="total_members" render={({ field: { value, onChange } }) => (
                  <InputField label="TOTAL" value={value} onChangeText={onChange} keyboardType="numeric" error={errors.total_members?.message} />
                )} />
              </View>
              <View style={s.half}>
                <Controller control={control} name="male_members" render={({ field: { value, onChange } }) => (
                  <InputField label="MALE" value={value} onChangeText={onChange} keyboardType="numeric" error={errors.male_members?.message} />
                )} />
              </View>
            </View>
            <View style={s.row}>
              <View style={s.half}>
                <Controller control={control} name="female_members" render={({ field: { value, onChange } }) => (
                  <InputField label="FEMALE" value={value} onChangeText={onChange} keyboardType="numeric" error={errors.female_members?.message} />
                )} />
              </View>
              <View style={s.half}>
                <Controller control={control} name="children_count" render={({ field: { value, onChange } }) => (
                  <InputField label="CHILDREN (<18)" value={value} onChangeText={onChange} keyboardType="numeric" error={errors.children_count?.message} />
                )} />
              </View>
            </View>
            <Controller control={control} name="senior_count" render={({ field: { value, onChange } }) => (
              <InputField label="SENIORS (65+)" value={value} onChangeText={onChange} keyboardType="numeric" error={errors.senior_count?.message} />
            )} />
          </SectionCard>

          {/* Address */}
          <SectionCard title="Address" icon="map-marker">
            <Controller control={control} name="house_no" render={({ field: { value, onChange } }) => (
              <InputField label="HOUSE / FLAT NO." value={value} onChangeText={onChange} error={errors.house_no?.message} />
            )} />
            <Controller control={control} name="locality" render={({ field: { value, onChange } }) => (
              <InputField label="LOCALITY / STREET" value={value} onChangeText={onChange} error={errors.locality?.message} />
            )} />
            <Controller control={control} name="ward" render={({ field: { value, onChange } }) => (
              <InputField label="WARD" value={value} onChangeText={onChange} error={errors.ward?.message} />
            )} />
            <Controller control={control} name="district" render={({ field: { value, onChange } }) => (
              <InputField label="DISTRICT" value={value} onChangeText={onChange} error={errors.district?.message} />
            )} />
            <Controller control={control} name="pincode" render={({ field: { value, onChange } }) => (
              <InputField label="PIN / POSTAL CODE" value={value} onChangeText={onChange} keyboardType="numeric" error={errors.pincode?.message} />
            )} />
          </SectionCard>

          {/* Facilities */}
          <SectionCard title="Available Facilities" icon="home-variant">
            <Controller control={control} name="has_electricity" render={({ field: { value, onChange } }) => (
              <FacilityCheckbox label="Electricity" icon="flash-outline" value={value} onChange={onChange} />
            )} />
            <Controller control={control} name="has_running_water" render={({ field: { value, onChange } }) => (
              <FacilityCheckbox label="Running Water" icon="water-outline" value={value} onChange={onChange} />
            )} />
            <Controller control={control} name="has_indoor_toilet" render={({ field: { value, onChange } }) => (
              <FacilityCheckbox label="Indoor Toilet" icon="body-outline" value={value} onChange={onChange} />
            )} />
            <Controller control={control} name="has_lpg" render={({ field: { value, onChange } }) => (
              <FacilityCheckbox label="LPG / Gas" icon="flame-outline" value={value} onChange={onChange} />
            )} />
            <Controller control={control} name="has_internet" render={({ field: { value, onChange } }) => (
              <FacilityCheckbox label="Internet Connection" icon="wifi-outline" value={value} onChange={onChange} />
            )} />
          </SectionCard>

          {/* Spatial Data */}
          <SectionCard title="Spatial Data" icon="crosshairs-gps">
            <View style={s.locationBox}>
              <MaterialCommunityIcons name="map-marker-radius" size={48} color={T.colors.borderSubtle} />
              <Text style={s.locationDesc}>Capture precise GPS coordinates for GIS integration.</Text>

              <Pressable
                style={[s.locationBtn, location && s.locationBtnSuccess]}
                onPress={captureLocation}
                disabled={locationLoading}
              >
                {locationLoading ? (
                  <ActivityIndicator color={T.colors.textWhite} />
                ) : (
                  <>
                    <Ionicons name={location ? "checkmark-circle-outline" : "locate-outline"} size={20} color={T.colors.textWhite} />
                    <Text style={s.locationBtnText}>{location ? "LOCATION CAPTURED" : "USE MY LOCATION"}</Text>
                  </>
                )}
              </Pressable>

              {location && (
                <View style={s.coords}>
                  <Text style={s.coordText}>Lat: {location.latitude.toFixed(6)}</Text>
                  <Text style={s.coordText}>Lng: {location.longitude.toFixed(6)}</Text>
                  {location.accuracy !== null && <Text style={s.coordText}>Accuracy: ±{location.accuracy.toFixed(1)}m</Text>}
                </View>
              )}
            </View>
          </SectionCard>

          <View style={{ height: 100 }} />
        </ScrollView>

        {/* Submit Button */}
        <View style={s.submitWrap}>
          <Pressable
            style={[s.submitBtn, loading && { opacity: 0.6 }]}
            onPress={handleSubmit(onSubmit)}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={T.colors.textWhite} />
            ) : (
              <>
                <Text style={s.submitText}>SUBMIT HOUSEHOLD</Text>
                <Ionicons name="cloud-upload-outline" size={20} color={T.colors.textWhite} />
              </>
            )}
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/* -------------------------------------------------------------------------- */
/*                                  Styles                                    */
/* -------------------------------------------------------------------------- */

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: T.colors.background,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  body: {
    padding: 16,
    gap: 16,
  },

  /* Cards */
  card: {
    backgroundColor: T.colors.cardBackground,
    borderRadius: T.borderRadius.xl,
    padding: 18,
    borderWidth: 1,
    borderColor: T.colors.border,
    gap: 4,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
  },
  cardIconWrap: {
    width: 36,
    height: 36,
    borderRadius: T.borderRadius.sm,
    backgroundColor: T.colors.accentSubtle,
    alignItems: "center",
    justifyContent: "center",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: T.colors.textPrimary,
  },

  /* Inputs */
  inputWrapper: {
    marginBottom: 12,
  },
  label: {
    fontSize: 11,
    fontWeight: "600",
    color: T.colors.textMuted,
    letterSpacing: 0.3,
    marginBottom: 5,
    textTransform: "uppercase",
  },
  input: {
    height: 44,
    borderWidth: 1,
    borderColor: T.colors.borderSubtle,
    backgroundColor: T.colors.inputBackground,
    borderRadius: T.borderRadius.sm,
    paddingHorizontal: 12,
    fontSize: 15,
    color: T.colors.textPrimary,
  },
  inputDisabled: {
    backgroundColor: T.colors.subtleBackground,
    color: T.colors.textMuted,
  },
  inputError: {
    borderColor: T.colors.danger,
  },
  errorText: {
    color: T.colors.danger,
    fontSize: 11,
    marginTop: 4,
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  half: {
    flex: 1,
  },

  /* Select */
  selectInput: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  selectText: {
    fontSize: 15,
    color: T.colors.textPrimary,
  },

  /* Checkbox */
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: T.borderRadius.sm,
    borderWidth: 1.5,
    borderColor: T.colors.borderSubtle,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  checkboxActive: {
    backgroundColor: T.colors.accent,
    borderColor: T.colors.accent,
  },
  facilityRow: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 44,
    paddingVertical: 6,
  },
  facilityIcon: {
    marginRight: 10,
  },
  facilityText: {
    fontSize: 14,
    fontWeight: "600",
    color: T.colors.textSecondary,
  },

  /* Profile Row */
  profileRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: T.colors.border,
  },
  profileLabel: {
    fontSize: 13,
    color: T.colors.textMuted,
    fontWeight: "500",
  },
  profileValue: {
    fontSize: 14,
    color: T.colors.textPrimary,
    fontWeight: "600",
  },

  /* Location */
  locationBox: {
    backgroundColor: T.colors.subtleBackground,
    borderRadius: T.borderRadius.lg,
    alignItems: "center",
    padding: 20,
    gap: 8,
  },
  locationDesc: {
    textAlign: "center",
    color: T.colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 8,
  },
  locationBtn: {
    width: "100%",
    height: 46,
    backgroundColor: T.colors.accent,
    borderRadius: T.borderRadius.sm,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  locationBtnSuccess: {
    backgroundColor: T.colors.success,
  },
  locationBtnText: {
    color: T.colors.textWhite,
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  coords: {
    width: "100%",
    marginTop: 4,
    padding: 10,
    backgroundColor: T.colors.cardBackground,
    borderRadius: T.borderRadius.sm,
    alignItems: "center",
  },
  coordText: {
    color: T.colors.textMuted,
    fontSize: 12,
    marginVertical: 1,
  },

  /* Submit */
  submitWrap: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: T.colors.background,
  },
  submitBtn: {
    height: 50,
    backgroundColor: T.colors.primary,
    borderRadius: T.borderRadius.sm,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  submitText: {
    color: T.colors.textWhite,
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 0.3,
  },

  /* Modal */
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  genderModal: {
    backgroundColor: T.colors.cardBackground,
    borderTopLeftRadius: T.borderRadius.xl,
    borderTopRightRadius: T.borderRadius.xl,
    padding: 20,
    paddingBottom: 36,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: T.colors.textPrimary,
    marginBottom: 12,
  },
  genderOption: {
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: T.colors.border,
  },
  genderOptionText: {
    fontSize: 15,
    color: T.colors.textPrimary,
    fontWeight: "500",
  },
});
