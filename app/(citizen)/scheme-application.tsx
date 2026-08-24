import { ENUMERATOR_THEME } from '@/src/features/enumeration/theme';
import CitizenLayout from "@/src/components/citizen/CitizenLayout";
import DocumentUpload from "@/src/components/citizen/DocumentUpload";
import React, { useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function SchemeApplicationScreen() {
  const [formData, setFormData] = useState({
    fullName: "",
    age: "",
    gender: "",
    mobile: "",
    aadhaar: "",
    schemeName: "PM Kisan Samman Nidhi",
  });
  const [declaration, setDeclaration] = useState(false);

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    // UI-only — no backend call
  };

  return (
    <CitizenLayout title="Apply for Scheme" showBack>
      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.schemeInfo}>
          <Text style={styles.schemeLabel}>Applying for</Text>
          <Text style={styles.schemeName}>{formData.schemeName}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Applicant Details</Text>

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Full Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your full name"
              placeholderTextColor={ENUMERATOR_THEME.colors.textMuted}
              value={formData.fullName}
              onChangeText={(v) => updateField("fullName", v)}
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.field, { flex: 1 }]}>
              <Text style={styles.fieldLabel}>Age</Text>
              <TextInput
                style={styles.input}
                placeholder="Age"
                placeholderTextColor={ENUMERATOR_THEME.colors.textMuted}
                keyboardType="numeric"
                value={formData.age}
                onChangeText={(v) => updateField("age", v)}
              />
            </View>
            <View style={[styles.field, { flex: 1 }]}>
              <Text style={styles.fieldLabel}>Gender</Text>
              <TextInput
                style={styles.input}
                placeholder="Male / Female"
                placeholderTextColor={ENUMERATOR_THEME.colors.textMuted}
                value={formData.gender}
                onChangeText={(v) => updateField("gender", v)}
              />
            </View>
          </View>

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Mobile Number</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter 10-digit mobile number"
              placeholderTextColor={ENUMERATOR_THEME.colors.textMuted}
              keyboardType="phone-pad"
              maxLength={10}
              value={formData.mobile}
              onChangeText={(v) => updateField("mobile", v)}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Aadhaar Number</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter 12-digit Aadhaar number"
              placeholderTextColor={ENUMERATOR_THEME.colors.textMuted}
              keyboardType="numeric"
              maxLength={12}
              value={formData.aadhaar}
              onChangeText={(v) => updateField("aadhaar", v)}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upload Documents</Text>
          <DocumentUpload label="Aadhaar Card" />
          <DocumentUpload label="Income Certificate" />
          <DocumentUpload label="Caste Certificate (if applicable)" />
        </View>

        <TouchableOpacity
          style={styles.declarationRow}
          onPress={() => setDeclaration(!declaration)}
          activeOpacity={0.7}
        >
          <View style={[styles.checkbox, declaration && styles.checkboxChecked]}>
            {declaration && <Text style={styles.checkmark}>✓</Text>}
          </View>
          <Text style={styles.declarationText}>
            I declare that the information provided is true and correct to the best of my knowledge.
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.submitBtn, !declaration && styles.submitBtnDisabled]}
          onPress={handleSubmit}
          activeOpacity={0.8}
          disabled={!declaration}
        >
          <Text style={styles.submitText}>Submit Application</Text>
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
  schemeInfo: {
    backgroundColor: ENUMERATOR_THEME.colors.accentSubtle,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.accent,
    borderRadius: 0,
    padding: 14,
  },
  schemeLabel: {
    fontSize: 12,
    color: ENUMERATOR_THEME.colors.textMuted,
    fontWeight: "500",
  },
  schemeName: {
    fontSize: 16,
    fontWeight: "700",
    color: ENUMERATOR_THEME.colors.accent,
    marginTop: 2,
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  field: {
    gap: 6,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  input: {
    backgroundColor: ENUMERATOR_THEME.colors.inputBackground,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.borderSubtle,
    borderRadius: 0,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  declarationRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 0,
    borderWidth: 2,
    borderColor: ENUMERATOR_THEME.colors.borderSubtle,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 1,
  },
  checkboxChecked: {
    backgroundColor: ENUMERATOR_THEME.colors.primary,
    borderColor: ENUMERATOR_THEME.colors.primary,
  },
  checkmark: {
    color: ENUMERATOR_THEME.colors.textWhite,
    fontSize: 12,
    fontWeight: "700",
  },
  declarationText: {
    flex: 1,
    fontSize: 13,
    color: ENUMERATOR_THEME.colors.textSecondary,
    lineHeight: 18,
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
