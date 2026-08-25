import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import AdminLayout from '@/src/components/admin/AdminLayout';
import PhotoUpload from '@/src/components/admin/PhotoUpload';
import FormSection from '@/src/components/admin/FormSection';
import FormInput from '@/src/components/admin/FormInput';
import SelectField from '@/src/components/admin/SelectField';
import EnumeratorCredentialsCard from '@/src/components/admin/EnumeratorCredentialsCard';
import { COLORS } from '@/constants/adminTheme';

/* ------------------------------------------------------------------ */
/* Credential generators                                               */
/* ------------------------------------------------------------------ */

function generateEmployeeId(): string {
  const year = new Date().getFullYear();
  const num = Math.floor(1000 + Math.random() * 9000);
  return `EN-${year}-${num}`;
}

function generatePassword(): string {
  const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lower = 'abcdefghijklmnopqrstuvwxyz';
  const digits = '0123456789';
  const specials = '!@#$%^&*';
  const all = upper + lower + digits + specials;

  const pick = (s: string) => s[Math.floor(Math.random() * s.length)];

  let pw = [pick(upper), pick(lower), pick(digits), pick(specials)];
  for (let i = pw.length; i < 8; i++) {
    pw.push(pick(all));
  }
  return pw.sort(() => Math.random() - 0.5).join('');
}

/* ------------------------------------------------------------------ */
/* Screen                                                              */
/* ------------------------------------------------------------------ */

export default function AddNewEnumeratorScreen() {
  const router = useRouter();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [aadhaar, setAadhaar] = useState('');
  const [role, setRole] = useState('');
  const [zone, setZone] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [showSuccess, setShowSuccess] = useState(false);
  const [generatedCredentials, setGeneratedCredentials] = useState<{
    employeeId: string;
    password: string;
  } | null>(null);

  /* Handlers */

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  const handlePhotoUpload = useCallback(() => {
    Alert.alert('Upload Photo', 'Photo upload coming soon.');
  }, []);

  const handleRoleSelect = useCallback(() => {
    Alert.alert('Select Role', 'Role selection coming soon.');
  }, []);

  const handleZoneSelect = useCallback(() => {
    Alert.alert('Select Zone/Ward', 'Zone selection coming soon.');
  }, []);

  const validate = useCallback((): boolean => {
    const errs: Record<string, string> = {};

    if (!fullName.trim()) errs.fullName = 'Full name is required';
    if (!email.trim()) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = 'Enter a valid email';
    if (!phone.trim()) errs.phone = 'Phone number is required';
    else if (phone.length !== 10) errs.phone = 'Must be 10 digits';
    if (!role) errs.role = 'Role is required';
    if (!zone) errs.zone = 'Zone is required';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  }, [fullName, email, phone, role, zone]);

  const handleSubmit = useCallback(() => {
    if (!validate()) return;

    const employeeId = generateEmployeeId();
    const password = generatePassword();
    setGeneratedCredentials({ employeeId, password });
    setShowSuccess(true);
  }, [validate]);

  const handleDone = useCallback(() => {
    setShowSuccess(false);
    router.back();
  }, [router]);

  const handleAddAnother = useCallback(() => {
    setShowSuccess(false);
    setGeneratedCredentials(null);
    setFullName('');
    setEmail('');
    setPhone('');
    setAadhaar('');
    setRole('');
    setZone('');
    setImageUri(null);
    setErrors({});
  }, []);

  return (
    <AdminLayout>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.body}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Back navigation */}
        <Pressable style={styles.backRow} onPress={handleBack}>
          <Ionicons name="arrow-back" size={18} color={COLORS.textPrimary} />
          <Text style={styles.backTitle}>Add New Enumerator</Text>
        </Pressable>

        <PhotoUpload imageUri={imageUri} onPress={handlePhotoUpload} />

        <FormSection title="Personal Details">
          <FormInput
            label="Full Name"
            placeholder="Enter full name"
            value={fullName}
            onChangeText={setFullName}
            required
            error={errors.fullName}
          />
          <FormInput
            label="Email Address"
            placeholder="e.g. enumerator@lokevision.gov"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            required
            error={errors.email}
          />
          <FormInput
            label="Phone Number"
            placeholder="10-digit mobile number"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            required
            error={errors.phone}
          />
        </FormSection>

        <FormSection title="Professional IDs">
          <FormInput
            label="Aadhaar Number"
            placeholder="12-digit Aadhaar number"
            value={aadhaar}
            onChangeText={setAadhaar}
            keyboardType="numeric"
            optional
            error={errors.aadhaar}
          />
        </FormSection>

        <FormSection title="Assignment">
          <SelectField
            label="Role"
            placeholder="Select role"
            value={role}
            onPress={handleRoleSelect}
            required
            error={errors.role}
          />
          <SelectField
            label="Assigned Zone/Ward"
            placeholder="Select zone or ward"
            value={zone}
            onPress={handleZoneSelect}
            required
            error={errors.zone}
          />
        </FormSection>

        {/* Submit button */}
        <TouchableOpacity
          style={styles.submitBtn}
          activeOpacity={0.8}
          onPress={handleSubmit}
        >
          <Ionicons name="checkmark-circle-outline" size={18} color={COLORS.textOnPrimary} />
          <Text style={styles.submitBtnText}>Submit</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Success modal */}
      {showSuccess && generatedCredentials && (
        <EnumeratorCredentialsCard
          visible={showSuccess}
          employeeId={generatedCredentials.employeeId}
          password={generatedCredentials.password}
          enumeratorName={fullName}
          onDone={handleDone}
          onAddAnother={handleAddAnother}
        />
      )}
    </AdminLayout>
  );
}

/* ------------------------------------------------------------------ */
/* Styles                                                              */
/* ------------------------------------------------------------------ */

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  body: {
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 40,
  },
  backRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  backTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 24,
    height: 44,
    borderRadius: 4,
    backgroundColor: COLORS.accent,
  },
  submitBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textOnPrimary,
  },
});
