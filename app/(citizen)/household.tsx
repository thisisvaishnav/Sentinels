import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { z } from "zod";

import { EnumeratorHeader } from "@/src/features/enumeration/components/EnumeratorHeader";
import { useCitizenDrawer } from "@/src/contexts/CitizenDrawerContext";
import { CITIZEN_THEME } from "@/src/features/enumeration/theme";
import { EnumeratorProfile } from "@/src/features/enumeration/types";

import { HeadOfHouseholdCard } from "@/src/components/citizen/register/HeadOfHouseholdCard";
import { FamilyDetailsCard } from "@/src/components/citizen/register/FamilyDetailsCard";
import { AddressCard } from "@/src/components/citizen/register/AddressCard";
import { FacilitiesCard } from "@/src/components/citizen/register/FacilitiesCard";
import { LocationCard } from "@/src/components/citizen/register/LocationCard";

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
/*                              Profile View Card                              */
/* -------------------------------------------------------------------------- */

function ProfileCard({ title, icon, children }: { title: string; icon: keyof typeof MaterialCommunityIcons.glyphMap; children: React.ReactNode }) {
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

function ProfileRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={s.profileRow}>
      <Text style={s.profileLabel}>{label}</Text>
      <Text style={s.profileValue}>{value}</Text>
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
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [existingProfile, setExistingProfile] = useState<HouseholdProfile | null>(null);
  const [location, setLocation] = useState<{ latitude: number; longitude: number; accuracy: number | null } | null>(null);

  const { control, handleSubmit, setValue, watch, formState: { errors } } = useForm<HouseholdForm>({
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

  const onSubmit = async (data: HouseholdForm) => {
    try {
      if (!location) {
        Alert.alert("Location Required", "Please capture your GPS location before submitting.");
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

  /* ---- Profile View (existing household) ---- */
  if (existingProfile) {
    return (
      <SafeAreaView style={s.container}>
        <EnumeratorHeader profile={profile} onOpenDrawer={openDrawer} />
        <ScrollView contentContainerStyle={s.body} showsVerticalScrollIndicator={false}>
          <ProfileCard title="Head of Family" icon="account">
            <ProfileRow label="Full Name" value={existingProfile.head_full_name} />
            <ProfileRow label="Age" value={String(existingProfile.head_age)} />
            <ProfileRow label="Gender" value={existingProfile.head_gender} />
            <ProfileRow label="Mobile" value={existingProfile.head_mobile_number} />
          </ProfileCard>

          <ProfileCard title="Family Details" icon="account-group">
            <ProfileRow label="Total Members" value={String(existingProfile.total_members)} />
            <ProfileRow label="Male Members" value={String(existingProfile.male_members)} />
            <ProfileRow label="Female Members" value={String(existingProfile.female_members)} />
            <ProfileRow label="Children (<18)" value={String(existingProfile.children_count)} />
            <ProfileRow label="Seniors (65+)" value={String(existingProfile.senior_count)} />
          </ProfileCard>

          <ProfileCard title="Address" icon="map-marker">
            <ProfileRow label="House / Flat" value={existingProfile.house_no} />
            <ProfileRow label="Locality" value={existingProfile.locality} />
            <ProfileRow label="Ward" value={existingProfile.ward} />
            <ProfileRow label="District" value={existingProfile.district} />
            <ProfileRow label="Pincode" value={existingProfile.pincode} />
          </ProfileCard>

          <ProfileCard title="Facilities" icon="home-variant">
            <ProfileRow label="Electricity" value={existingProfile.has_electricity ? "Yes" : "No"} />
            <ProfileRow label="Running Water" value={existingProfile.has_running_water ? "Yes" : "No"} />
            <ProfileRow label="Indoor Toilet" value={existingProfile.has_indoor_toilet ? "Yes" : "No"} />
            <ProfileRow label="LPG / Gas" value={existingProfile.has_lpg ? "Yes" : "No"} />
            <ProfileRow label="Internet" value={existingProfile.has_internet ? "Yes" : "No"} />
          </ProfileCard>

          <ProfileCard title="Coordinates" icon="crosshairs-gps">
            <ProfileRow label="Latitude" value={existingProfile.latitude.toFixed(6)} />
            <ProfileRow label="Longitude" value={existingProfile.longitude.toFixed(6)} />
          </ProfileCard>

          <View style={{ height: 32 }} />
        </ScrollView>
      </SafeAreaView>
    );
  }

  /* ---- Registration Form ---- */
  const formValues = watch();

  return (
    <SafeAreaView style={s.container}>
      <EnumeratorHeader profile={profile} onOpenDrawer={openDrawer} />

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView contentContainerStyle={s.body} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <Controller control={control} name="head_full_name" render={({ field: { value, onChange } }) => (
            <HeadOfHouseholdCard
              data={{ name: value, age: formValues.head_age, gender: formValues.head_gender, mobile: formValues.head_mobile_number }}
              onChange={(u) => {
                if (u.name !== undefined) onChange(u.name);
                if (u.age !== undefined) setValue("head_age", u.age);
                if (u.gender !== undefined) setValue("head_gender", u.gender);
                if (u.mobile !== undefined) setValue("head_mobile_number", u.mobile);
              }}
              errors={{ name: errors.head_full_name?.message, age: errors.head_age?.message, gender: errors.head_gender?.message, mobile: errors.head_mobile_number?.message }}
              mobileEditable={false}
            />
          )} />

          <Controller control={control} name="total_members" render={() => (
            <FamilyDetailsCard
              data={{
                total_members: formValues.total_members,
                male_members: formValues.male_members,
                female_members: formValues.female_members,
                children_count: formValues.children_count,
                senior_count: formValues.senior_count,
              }}
              onChange={(u) => {
                Object.entries(u).forEach(([k, v]) => setValue(k as keyof HouseholdForm, v as any));
              }}
              errors={{
                total_members: errors.total_members?.message,
                male_members: errors.male_members?.message,
                female_members: errors.female_members?.message,
                children_count: errors.children_count?.message,
                senior_count: errors.senior_count?.message,
              }}
            />
          )} />

          <Controller control={control} name="house_no" render={() => (
            <AddressCard
              data={{
                house_no: formValues.house_no,
                locality: formValues.locality,
                ward: formValues.ward,
                district: formValues.district,
                pincode: formValues.pincode,
              }}
              onChange={(u) => {
                Object.entries(u).forEach(([k, v]) => setValue(k as keyof HouseholdForm, v as any));
              }}
              errors={{
                house_no: errors.house_no?.message,
                locality: errors.locality?.message,
                ward: errors.ward?.message,
                district: errors.district?.message,
                pincode: errors.pincode?.message,
              }}
            />
          )} />

          <Controller control={control} name="has_electricity" render={() => (
            <FacilitiesCard
              data={{
                has_electricity: formValues.has_electricity,
                has_running_water: formValues.has_running_water,
                has_indoor_toilet: formValues.has_indoor_toilet,
                has_lpg: formValues.has_lpg,
                has_internet: formValues.has_internet,
              }}
              onChange={(u) => {
                Object.entries(u).forEach(([k, v]) => setValue(k as keyof HouseholdForm, v as any));
              }}
            />
          )} />

          <LocationCard
            data={location}
            onLocationCaptured={setLocation}
          />

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

  /* Profile View Cards */
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
});
