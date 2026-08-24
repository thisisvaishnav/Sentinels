import { ENUMERATOR_THEME } from '@/src/features/enumeration/theme';
import CitizenLayout from "@/src/components/citizen/CitizenLayout";
import NeedCheckbox from "@/src/components/citizen/NeedCheckbox";
import UrgencySelector from "@/src/components/citizen/UrgencySelector";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

type UrgencyLevel = "low" | "medium" | "high";

const NEED_OPTIONS = [
  { label: "Water", icon: "water-outline" as const },
  { label: "Electricity", icon: "flash-outline" as const },
  { label: "Sanitation", icon: "trash-outline" as const },
  { label: "Healthcare", icon: "medkit-outline" as const },
  { label: "Education", icon: "school-outline" as const },
  { label: "Food", icon: "restaurant-outline" as const },
  { label: "Housing", icon: "home-outline" as const },
  { label: "Internet", icon: "wifi-outline" as const },
];

export default function ReportNeedScreen() {
  const [selectedNeeds, setSelectedNeeds] = useState<string[]>([]);
  const [urgency, setUrgency] = useState<UrgencyLevel | null>(null);
  const [description, setDescription] = useState("");

  const toggleNeed = (label: string) => {
    setSelectedNeeds((prev) =>
      prev.includes(label) ? prev.filter((n) => n !== label) : [...prev, label]
    );
  };

  const handleSubmit = () => {
    // UI-only — no backend call
  };

  return (
    <CitizenLayout title="Report a Need" showBack>
      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What do you need help with?</Text>
          <Text style={styles.sectionSubtitle}>Select all that apply</Text>
          <View style={styles.needsGrid}>
            {NEED_OPTIONS.map((need) => (
              <View key={need.label} style={styles.needItem}>
                <NeedCheckbox
                  label={need.label}
                  icon={need.icon}
                  checked={selectedNeeds.includes(need.label)}
                  onToggle={() => toggleNeed(need.label)}
                />
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How urgent is this?</Text>
          <UrgencySelector selected={urgency} onSelect={setUrgency} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Describe your situation</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Tell us more about what you need..."
            placeholderTextColor={ENUMERATOR_THEME.colors.textMuted}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Location</Text>
          <View style={styles.locationCard}>
            <View style={styles.locationIcon}>
              <Ionicons name="location-outline" size={18} color={ENUMERATOR_THEME.colors.accent} />
            </View>
            <View style={styles.locationCopy}>
              <Text style={styles.locationLabel}>Current Location</Text>
              <Text style={styles.locationText}>Ward 5, Locality Area</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.submitBtn,
            (selectedNeeds.length === 0 || !urgency) && styles.submitBtnDisabled,
          ]}
          onPress={handleSubmit}
          activeOpacity={0.8}
          disabled={selectedNeeds.length === 0 || !urgency}
        >
          <Text style={styles.submitText}>Submit Report</Text>
        </TouchableOpacity>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </CitizenLayout>
  );
}

const styles = StyleSheet.create({
  body: {
    padding: 20,
    gap: 24,
  },
  section: {
    gap: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: ENUMERATOR_THEME.colors.textMuted,
    marginTop: -4,
  },
  needsGrid: {
    gap: 8,
  },
  needItem: {
    width: "100%",
  },
  textArea: {
    backgroundColor: ENUMERATOR_THEME.colors.inputBackground,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.borderSubtle,
    borderRadius: 0,
    padding: 14,
    fontSize: 14,
    color: ENUMERATOR_THEME.colors.textPrimary,
    minHeight: 100,
  },
  locationCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: ENUMERATOR_THEME.colors.cardBackground,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
    borderRadius: 0,
    padding: 14,
  },
  locationIcon: {
    width: 36,
    height: 36,
    borderRadius: 0,
    backgroundColor: ENUMERATOR_THEME.colors.accentSubtle,
    alignItems: "center",
    justifyContent: "center",
  },
  locationCopy: {
    flex: 1,
  },
  locationLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  locationText: {
    fontSize: 12,
    color: ENUMERATOR_THEME.colors.textMuted,
    marginTop: 2,
  },
  submitBtn: {
    backgroundColor: ENUMERATOR_THEME.colors.primary,
    borderRadius: 0,
    paddingVertical: 14,
    alignItems: "center",
  },
  submitBtnDisabled: {
    backgroundColor: ENUMERATOR_THEME.colors.borderSubtle,
  },
  submitText: {
    color: ENUMERATOR_THEME.colors.textWhite,
    fontSize: 16,
    fontWeight: "700",
  },
  bottomSpacer: {
    height: 24,
  },
});
