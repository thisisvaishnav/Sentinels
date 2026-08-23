import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import DrishtiHeader from '@/src/components/admin/DrishtiHeader';
import PhotoUpload from '@/src/components/admin/PhotoUpload';
import FormSection from '@/src/components/admin/FormSection';
import FormInput from '@/src/components/admin/FormInput';
import SelectField from '@/src/components/admin/SelectField';
import BottomNavigation from '@/src/components/admin/BottomNavigation';
import { COLORS } from '@/constants/adminTheme';

export default function AddNewStaffScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Staff');

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [aadhaar, setAadhaar] = useState('');
  const [role, setRole] = useState('');
  const [zone, setZone] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  const handleTabPress = useCallback(
    (tab: string) => {
      setActiveTab(tab);
      if (tab === 'Home') {
        router.push('/(admin)/dashboard');
      } else if (tab === 'Staff') {
        router.push('/(admin)/field-enumerators');
      }
    },
    [router],
  );

  const handlePhotoUpload = useCallback(() => {
    Alert.alert('Upload Photo', 'Photo upload coming soon.');
  }, []);

  const handleRoleSelect = useCallback(() => {
    Alert.alert('Select Role', 'Role selection coming soon.');
  }, []);

  const handleZoneSelect = useCallback(() => {
    Alert.alert('Select Zone/Ward', 'Zone selection coming soon.');
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <DrishtiHeader
        onNotificationsPress={() =>
          Alert.alert('Notifications', 'No new notifications.')
        }
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.body}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Back navigation */}
        <Pressable style={styles.backRow} onPress={handleBack}>
          <Ionicons name="arrow-back" size={18} color={COLORS.textPrimary} />
          <Text style={styles.backTitle}>Add New Staff</Text>
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
            placeholder="e.g. staff@drishti.gov"
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
            label="Employee/Admin ID"
            placeholder="e.g. EMP-2024-001"
            value={employeeId}
            onChangeText={setEmployeeId}
            required
            error={errors.employeeId}
          />
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

        <View style={{ height: 100 }} />
      </ScrollView>

      <BottomNavigation activeTab={activeTab} onTabPress={handleTabPress} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.surface,
    marginTop: -30,
  },
  scrollView: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  body: {
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 100,
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
});
