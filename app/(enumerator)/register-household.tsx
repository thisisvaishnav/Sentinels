import React, { useState, useEffect, useRef } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { ENUMERATOR_THEME } from '@/src/features/enumeration/theme';
import { loadEnumeratorHouseholds } from '@/src/features/enumeration/data/households';
import {
  FamilyMember,
  GpsLocationData,
  HeadOfHousehold,
  HouseholdFormData,
  HouseholdNeed,
  HouseholdProfile,
  IdentityVerification,
  SchemeItem,
} from '@/src/features/enumeration/types';

import { HouseholdHeaderCard } from '@/src/features/enumeration/components/register/HouseholdHeaderCard';
import { HeadOfHouseholdCard } from '@/src/features/enumeration/components/register/HeadOfHouseholdCard';
import { IdentityVerificationCard } from '@/src/features/enumeration/components/register/IdentityVerificationCard';
import { HouseholdProfileCard } from '@/src/features/enumeration/components/register/HouseholdProfileCard';
import { FamilyMemberModal } from '@/src/features/enumeration/components/register/FamilyMemberModal';
import { FamilyMembersCardList } from '@/src/features/enumeration/components/register/FamilyMembersCardList';
import { LocationGpsCard } from '@/src/features/enumeration/components/register/LocationGpsCard';
import { HouseholdNeedsSection } from '@/src/features/enumeration/components/register/HouseholdNeedsSection';
import { GovernmentSchemesSection } from '@/src/features/enumeration/components/register/GovernmentSchemesSection';
import { EnumeratorRemarksCard } from '@/src/features/enumeration/components/register/EnumeratorRemarksCard';
import { CoverageChecklistCard } from '@/src/features/enumeration/components/register/CoverageChecklistCard';
import { ValidationErrorItem, ValidationSummaryCard } from '@/src/features/enumeration/components/register/ValidationSummaryCard';
import { DuplicateHouseholdInfo, DuplicateWarningCard } from '@/src/features/enumeration/components/register/DuplicateWarningCard';
import { ReviewSummaryModal } from '@/src/features/enumeration/components/register/ReviewSummaryModal';

const DRAFT_STORAGE_KEY = '@lokvision_household_draft';

export default function RegisterHouseholdScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ householdId?: string }>();
  const scrollViewRef = useRef<ScrollView>(null);

  // Stable or Parameter Household ID
  const householdId = params.householdId || 'LV-UP-000124';

  // Overall Form Status
  const [formStatus, setFormStatus] = useState<'Draft' | 'Submitted'>('Draft');

  // Head of Household State
  const [headOfHousehold, setHeadOfHousehold] = useState<HeadOfHousehold>({
    name: '',
    age: '',
    gender: 'Male',
    mobile: '',
    role: 'Head of Household',
  });

  // Identity Verification State
  const [identityVerification, setIdentityVerification] = useState<IdentityVerification>({
    idType: 'Aadhaar',
    last4Digits: '',
    status: 'Not Verified',
  });

  // Household Profile State
  const [householdProfile, setHouseholdProfile] = useState<HouseholdProfile>({
    familyMemberCount: 1,
    houseType: 'Permanent',
    ownership: 'Owned',
    locality: 'Shastri Nagar',
    ward: 'Ward 12',
    pinCode: '201002',
    state: 'Uttar Pradesh',
    district: 'Ghaziabad',
    fullAddress: '',
  });

  // Check navigation params for existing household
  useEffect(() => {
    async function loadTarget() {
      if (params.householdId) {
        const store = await loadEnumeratorHouseholds();
        const target = store.find((h) => h.householdId.toLowerCase() === params.householdId?.toLowerCase());
        if (target) {
          setHeadOfHousehold({
            name: target.headName,
            age: '45',
            gender: 'Male',
            mobile: target.mobile || '9876543210',
            role: 'Head of Household',
          });
          setHouseholdProfile((prev) => ({
            ...prev,
            locality: target.locality,
            fullAddress: target.address || `${target.locality}, ${target.ward || 'Ward 12'}`,
            familyMemberCount: target.members,
            houseType: target.houseType || 'Permanent',
            ownership: target.ownership || 'Owned',
          }));
          if (target.needs) setNeeds(target.needs);
        }
      }
    }
    loadTarget();
  }, [params.householdId]);

  // Family Members State
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);

  // GPS Location State
  const [location, setLocation] = useState<GpsLocationData | null>(null);

  // Needs State
  const [needs, setNeeds] = useState<HouseholdNeed[]>([]);

  // Government Scheme Status State
  const [schemeStatus, setSchemeStatus] = useState<SchemeItem[]>([]);

  // Remarks State
  const [remarks, setRemarks] = useState('');

  // Modals & Banners State
  const [memberModalVisible, setMemberModalVisible] = useState(false);
  const [editingMember, setEditingMember] = useState<FamilyMember | null>(null);
  const [reviewModalVisible, setReviewModalVisible] = useState(false);

  // Validation State
  const [validationErrors, setValidationErrors] = useState<ValidationErrorItem[]>([]);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Duplicate Warning State (Frontend-only preview)
  const [duplicateInfo, setDuplicateInfo] = useState<DuplicateHouseholdInfo | null>(null);

  // Auto-calculate member count whenever head or members change
  useEffect(() => {
    const totalCount = 1 + familyMembers.length;
    setHouseholdProfile((prev) => ({ ...prev, familyMemberCount: totalCount }));
  }, [familyMembers]);

  // Load draft from AsyncStorage on mount
  useEffect(() => {
    const loadDraft = async () => {
      try {
        const saved = await AsyncStorage.getItem(DRAFT_STORAGE_KEY);
        if (saved) {
          const parsed: HouseholdFormData = JSON.parse(saved);
          if (parsed.headOfHousehold) setHeadOfHousehold(parsed.headOfHousehold);
          if (parsed.identityVerification) setIdentityVerification(parsed.identityVerification);
          if (parsed.householdProfile) setHouseholdProfile(parsed.householdProfile);
          if (parsed.familyMembers) setFamilyMembers(parsed.familyMembers);
          if (parsed.location) setLocation(parsed.location);
          if (parsed.needs) setNeeds(parsed.needs);
          if (parsed.schemeStatus) setSchemeStatus(parsed.schemeStatus);
          if (parsed.remarks) setRemarks(parsed.remarks);
          if (parsed.status) setFormStatus(parsed.status);
        }
      } catch {
        // Silently handle read errors
      }
    };
    loadDraft();
  }, []);

  // Calculate Registration Progress Percentage
  const isHeadComplete = !!(headOfHousehold.name.trim() && headOfHousehold.age.trim() && headOfHousehold.mobile.trim().length === 10);
  const isProfileComplete = !!(householdProfile.fullAddress.trim() && householdProfile.state && householdProfile.district);
  const isMembersComplete = familyMembers.length > 0;
  const isLocationComplete = !!location;
  const isNeedsComplete = needs.length > 0;

  const totalSections = 5;
  const completedSections = [isHeadComplete, isProfileComplete, isMembersComplete, isLocationComplete, isNeedsComplete].filter(Boolean).length;
  const progressPercentage = Math.round((completedSections / totalSections) * 100);

  // Save Draft Handler (non-blocking)
  const handleSaveDraft = async () => {
    try {
      const draftPayload: HouseholdFormData = {
        householdId,
        status: 'Draft',
        headOfHousehold,
        identityVerification,
        householdProfile,
        familyMembers,
        location,
        needs,
        schemeStatus,
        remarks,
      };

      await AsyncStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draftPayload));
      setFormStatus('Draft');
      Alert.alert('Draft Saved', '✓ Household saved as draft locally in device storage.');
    } catch {
      Alert.alert('Save Error', 'Unable to save draft locally.');
    }
  };

  // Family Member Handlers
  const handleOpenAddMember = () => {
    setEditingMember(null);
    setMemberModalVisible(true);
  };

  const handleOpenEditMember = (member: FamilyMember) => {
    setEditingMember(member);
    setMemberModalVisible(true);
  };

  const handleSaveMember = (member: FamilyMember) => {
    if (editingMember) {
      setFamilyMembers((prev) => prev.map((m) => (m.id === member.id ? member : m)));
    } else {
      setFamilyMembers((prev) => [...prev, member]);
    }
    setMemberModalVisible(false);
    setEditingMember(null);
  };

  const handleRemoveMember = (id: string) => {
    setFamilyMembers((prev) => prev.filter((m) => m.id !== id));
  };

  // Smart Validation Handler before submission
  const validateForm = (): boolean => {
    const errorsList: ValidationErrorItem[] = [];
    const fieldErr: Record<string, string> = {};

    if (!headOfHousehold.name.trim()) {
      errorsList.push({ id: '1', field: 'Head of Household Name', sectionKey: 'head' });
      fieldErr.name = 'Full name is required';
    }

    if (!headOfHousehold.age.trim()) {
      errorsList.push({ id: '2', field: 'Head of Household Age', sectionKey: 'head' });
      fieldErr.age = 'Age is required';
    }

    if (!headOfHousehold.mobile.trim() || headOfHousehold.mobile.length < 10) {
      errorsList.push({ id: '3', field: 'Mobile Number (10 digits)', sectionKey: 'head' });
      fieldErr.mobile = 'Valid 10-digit mobile number required';
    }

    if (!headOfHousehold.gender) {
      errorsList.push({ id: '4', field: 'Head of Household Gender', sectionKey: 'head' });
      fieldErr.gender = 'Gender selection required';
    }

    if (!householdProfile.fullAddress.trim()) {
      errorsList.push({ id: '5', field: 'Full Address', sectionKey: 'profile' });
      fieldErr.fullAddress = 'Address is required';
    }

    if (!location) {
      errorsList.push({ id: '6', field: 'GPS Location Capture', sectionKey: 'location' });
      fieldErr.location = 'GPS coordinates must be captured';
    }

    setValidationErrors(errorsList);
    setFieldErrors(fieldErr);

    return errorsList.length === 0;
  };

  // Submit Handler
  const handleSubmitPress = () => {
    const isValid = validateForm();
    if (!isValid) {
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
      return;
    }

    // Check for duplicate warning state simulation (if mobile is 9999999999)
    if (headOfHousehold.mobile === '9999999999') {
      setDuplicateInfo({
        existingId: 'LV-UP-000098',
        address: 'Ward 12, Shastri Nagar',
        similarity: 'High',
      });
      return;
    }

    // Open Review Summary Modal
    setReviewModalVisible(true);
  };

  // Final Confirmation Submit
  const handleConfirmSubmit = async () => {
    setReviewModalVisible(false);
    setFormStatus('Submitted');

    try {
      await AsyncStorage.removeItem(DRAFT_STORAGE_KEY);
    } catch {
      // Ignore cleanup error
    }

    Alert.alert(
      'Household Submitted',
      `Household submitted successfully.\n\nHousehold ID: ${householdId}\nHead: ${headOfHousehold.name}`,
      [
        {
          text: 'Return to Dashboard',
          onPress: () => router.push('/(enumerator)/dashboard'),
        },
      ]
    );
  };

  // Tappable Section Jump
  const handleJumpToSection = (sectionKey: string) => {
    // Scroll to top or section
    scrollViewRef.current?.scrollTo({ y: 120, animated: true });
  };

  const currentFormData: HouseholdFormData = {
    householdId,
    status: formStatus,
    headOfHousehold,
    identityVerification,
    householdProfile,
    familyMembers,
    location,
    needs,
    schemeStatus,
    remarks,
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={ENUMERATOR_THEME.colors.cardBackground} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={22} color={ENUMERATOR_THEME.colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerTitleWrap}>
          <Text style={styles.headerBrand}>Lokvision</Text>
          <Text style={styles.headerTitle}>Register Household</Text>
        </View>
        <TouchableOpacity style={styles.draftHeaderBtn} onPress={handleSaveDraft} activeOpacity={0.7}>
          <MaterialCommunityIcons name="content-save-outline" size={20} color={ENUMERATOR_THEME.colors.accent} />
        </TouchableOpacity>
      </View>

      <ScrollView ref={scrollViewRef} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        {/* Validation Summary Banner (if errors exist) */}
        <ValidationSummaryCard errors={validationErrors} onItemPress={handleJumpToSection} />

        {/* Duplicate Warning Card (if triggered) */}
        <DuplicateWarningCard
          duplicateInfo={duplicateInfo}
          onReviewExisting={() => Alert.alert('Existing Household', 'Opening existing record #LV-UP-000098...')}
          onContinueAnyway={() => {
            setDuplicateInfo(null);
            setReviewModalVisible(true);
          }}
        />

        {/* Section 1: Header Card */}
        <HouseholdHeaderCard
          householdId={householdId}
          status={formStatus}
          progressPercentage={progressPercentage}
        />

        {/* Section 2: Head of Household */}
        <HeadOfHouseholdCard
          data={headOfHousehold}
          onChange={(updated) => setHeadOfHousehold((prev) => ({ ...prev, ...updated }))}
          errors={fieldErrors}
        />

        {/* Section 3: Optional Identity Verification */}
        <IdentityVerificationCard
          data={identityVerification}
          onChange={(updated) => setIdentityVerification((prev) => ({ ...prev, ...updated }))}
        />

        {/* Section 4: Household Profile & Address */}
        <HouseholdProfileCard
          data={householdProfile}
          onChange={(updated) => setHouseholdProfile((prev) => ({ ...prev, ...updated }))}
          errors={fieldErrors}
        />

        {/* Section 5: Family Members */}
        <FamilyMembersCardList
          members={familyMembers}
          onAddPress={handleOpenAddMember}
          onEditPress={handleOpenEditMember}
          onRemovePress={handleRemoveMember}
          errors={fieldErrors}
        />

        {/* Section 6: Location & GPS */}
        <LocationGpsCard
          data={location}
          onLocationCaptured={setLocation}
          errors={fieldErrors}
        />

        {/* Section 7: Household Needs */}
        <HouseholdNeedsSection
          selectedNeeds={needs}
          onChange={setNeeds}
        />

        {/* Section 8: Government Scheme Status */}
        <GovernmentSchemesSection
          schemeItems={schemeStatus}
          onChange={setSchemeStatus}
        />

        {/* Section 9: Enumerator Remarks */}
        <EnumeratorRemarksCard
          remarks={remarks}
          onChange={setRemarks}
        />

        {/* Section 10: Coverage Verification Checklist */}
        <CoverageChecklistCard
          isHeadComplete={isHeadComplete}
          isMembersComplete={isMembersComplete}
          isLocationComplete={isLocationComplete}
          isNeedsComplete={isNeedsComplete}
          isIdentityVerified={identityVerification.status === 'Verified'}
        />

        {/* Bottom Action Bar */}
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.draftBtn} onPress={handleSaveDraft} activeOpacity={0.8}>
            <MaterialCommunityIcons name="file-document-outline" size={18} color={ENUMERATOR_THEME.colors.textPrimary} />
            <Text style={styles.draftBtnText}>Save Draft</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.submitBtn} onPress={handleSubmitPress} activeOpacity={0.8}>
            <MaterialCommunityIcons name="check-circle-outline" size={18} color={ENUMERATOR_THEME.colors.textWhite} />
            <Text style={styles.submitBtnText}>Submit Household</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Add / Edit Family Member Modal */}
      <FamilyMemberModal
        visible={memberModalVisible}
        editingMember={editingMember}
        onClose={() => setMemberModalVisible(false)}
        onSave={handleSaveMember}
      />

      {/* Review Summary Modal before final Submit */}
      <ReviewSummaryModal
        visible={reviewModalVisible}
        data={currentFormData}
        onClose={() => setReviewModalVisible(false)}
        onConfirmSubmit={handleConfirmSubmit}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ENUMERATOR_THEME.colors.background,
  },
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: ENUMERATOR_THEME.colors.border,
    backgroundColor: ENUMERATOR_THEME.colors.cardBackground,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: ENUMERATOR_THEME.borderRadius.md,
    backgroundColor: ENUMERATOR_THEME.colors.subtleBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleWrap: {
    alignItems: 'center',
  },
  headerBrand: {
    fontSize: 10,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.accent,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  draftHeaderBtn: {
    width: 38,
    height: 38,
    borderRadius: ENUMERATOR_THEME.borderRadius.md,
    backgroundColor: ENUMERATOR_THEME.colors.subtleBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    padding: 16,
    gap: 16,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  draftBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: ENUMERATOR_THEME.colors.subtleBackground,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
    height: 48,
    borderRadius: ENUMERATOR_THEME.borderRadius.lg,
    gap: 8,
  },
  draftBtnText: {
    color: ENUMERATOR_THEME.colors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
  },
  submitBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: ENUMERATOR_THEME.colors.accent,
    height: 48,
    borderRadius: ENUMERATOR_THEME.borderRadius.lg,
    gap: 8,
  },
  submitBtnText: {
    color: ENUMERATOR_THEME.colors.textWhite,
    fontSize: 14,
    fontWeight: '700',
  },
  bottomSpacer: {
    height: 32,
  },
});
