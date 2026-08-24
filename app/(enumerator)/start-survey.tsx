import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { ENUMERATOR_THEME } from '@/src/features/enumeration/theme';
import {
  loadEnumeratorHouseholds,
  updateHouseholdStatusInStore,
} from '@/src/features/enumeration/data/households';
import { enqueueSyncItem } from '@/src/features/enumeration/data/syncQueue';
import { addEnumeratorActivity } from '@/src/features/enumeration/data/activity';
import {
  AssignedHouseholdSummary,
  BasicFacilitiesData,
  EmploymentEducationData,
  FamilyMember,
  HouseholdNeed,
  SchemeItem,
  SurveyFormData,
  SurveyStatus,
} from '@/src/features/enumeration/types';

import { SurveyLandingHeader } from '@/src/features/enumeration/components/survey/SurveyLandingHeader';
import { SurveyFilterType, SurveySearchFilterBar } from '@/src/features/enumeration/components/survey/SurveySearchFilterBar';
import { SurveyHouseholdCard } from '@/src/features/enumeration/components/survey/SurveyHouseholdCard';
import { SurveyHeaderBar } from '@/src/features/enumeration/components/survey/SurveyHeaderBar';
import { SurveyStepBar } from '@/src/features/enumeration/components/survey/SurveyStepBar';
import { SurveyFacilitiesCard } from '@/src/features/enumeration/components/survey/SurveyFacilitiesCard';
import { SurveyEmploymentEduCard } from '@/src/features/enumeration/components/survey/SurveyEmploymentEduCard';
import { SurveyReviewSection } from '@/src/features/enumeration/components/survey/SurveyReviewSection';

import { HouseholdProfileCard } from '@/src/features/enumeration/components/register/HouseholdProfileCard';
import { HeadOfHouseholdCard } from '@/src/features/enumeration/components/register/HeadOfHouseholdCard';
import { FamilyMembersCardList } from '@/src/features/enumeration/components/register/FamilyMembersCardList';
import { FamilyMemberModal } from '@/src/features/enumeration/components/register/FamilyMemberModal';
import { HouseholdNeedsSection } from '@/src/features/enumeration/components/register/HouseholdNeedsSection';
import { GovernmentSchemesSection } from '@/src/features/enumeration/components/register/GovernmentSchemesSection';
import { EnumeratorRemarksCard } from '@/src/features/enumeration/components/register/EnumeratorRemarksCard';

const INITIAL_HOUSEHOLDS: AssignedHouseholdSummary[] = [
  {
    householdId: 'LV-UP-000124',
    headName: 'Rahul Kumar',
    address: 'Ward 12, Shastri Nagar',
    memberCount: 5,
    status: 'Pending',
    priority: 'High',
    mobile: '9876543210',
    state: 'Uttar Pradesh',
    district: 'Ghaziabad',
    ward: 'Ward 12',
    pinCode: '201002',
    houseType: 'Permanent',
    ownership: 'Owned',
  },
  {
    householdId: 'LV-UP-000125',
    headName: 'Sunita Sharma',
    address: 'Plot 45, Rajendra Nagar',
    memberCount: 4,
    status: 'In Progress',
    priority: 'Normal',
    mobile: '9812345678',
    state: 'Uttar Pradesh',
    district: 'Ghaziabad',
    ward: 'Ward 8',
    pinCode: '201005',
    houseType: 'Permanent',
    ownership: 'Owned',
  },
  {
    householdId: 'LV-UP-000126',
    headName: 'Amitabh Verma',
    address: 'Block B, Sector 3, Vaishali',
    memberCount: 6,
    status: 'Completed',
    priority: 'Normal',
    mobile: '9765432109',
    state: 'Uttar Pradesh',
    district: 'Ghaziabad',
    ward: 'Ward 15',
    pinCode: '201010',
    houseType: 'Permanent',
    ownership: 'Rented',
  },
  {
    householdId: 'LV-UP-000127',
    headName: 'Vikram Singh',
    address: 'Near Old Water Tank, Vijay Nagar',
    memberCount: 3,
    status: 'Pending',
    priority: 'High',
    mobile: '9988776655',
    state: 'Uttar Pradesh',
    district: 'Ghaziabad',
    ward: 'Ward 5',
    pinCode: '201009',
    houseType: 'Semi-Permanent',
    ownership: 'Owned',
  },
  {
    householdId: 'LV-UP-000128',
    headName: 'Meena Gupta',
    address: 'Street No 4, Govindpuri',
    memberCount: 4,
    status: 'Pending',
    priority: 'Normal',
    mobile: '9871122334',
    state: 'Uttar Pradesh',
    district: 'Ghaziabad',
    ward: 'Ward 3',
    pinCode: '201001',
    houseType: 'Temporary',
    ownership: 'Rented',
  },
  {
    householdId: 'LV-UP-000129',
    headName: 'Sanjay Yadav',
    address: 'House 88, Patel Nagar North',
    memberCount: 5,
    status: 'In Progress',
    priority: 'Normal',
    mobile: '9899001122',
    state: 'Uttar Pradesh',
    district: 'Ghaziabad',
    ward: 'Ward 11',
    pinCode: '201003',
    houseType: 'Permanent',
    ownership: 'Owned',
  },
];

const STEP_TITLES = [
  'Household Info',
  'Family Info',
  'Facilities',
  'Employment & Edu',
  'Needs',
  'Schemes',
  'Remarks',
  'Review & Submit',
];

export default function StartSurveyScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ householdId?: string; readOnly?: string }>();

  // Landing List State
  const [households, setHouseholds] = useState<AssignedHouseholdSummary[]>(INITIAL_HOUSEHOLDS);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<SurveyFilterType>('All');

  // Active Survey Session State
  const [activeHousehold, setActiveHousehold] = useState<AssignedHouseholdSummary | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isReadOnly, setIsReadOnly] = useState<boolean>(false);

  // Form State for Active Survey
  const [surveyStatus, setSurveyStatus] = useState<SurveyStatus>('Pending');
  const [headName, setHeadName] = useState('');
  const [headAge, setHeadAge] = useState('42');
  const [headGender, setHeadGender] = useState<'Male' | 'Female' | 'Other' | 'Prefer not to say'>('Male');
  const [headMobile, setHeadMobile] = useState('');

  const [fullAddress, setFullAddress] = useState('');
  const [state, setState] = useState('Uttar Pradesh');
  const [district, setDistrict] = useState('Ghaziabad');
  const [locality, setLocality] = useState('Shastri Nagar');
  const [ward, setWard] = useState('Ward 12');
  const [pinCode, setPinCode] = useState('201002');
  const [houseType, setHouseType] = useState<'Permanent' | 'Semi-Permanent' | 'Temporary'>('Permanent');
  const [ownership, setOwnership] = useState<'Owned' | 'Rented' | 'Other'>('Owned');

  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [memberModalVisible, setMemberModalVisible] = useState(false);
  const [editingMember, setEditingMember] = useState<FamilyMember | null>(null);

  const [facilities, setFacilities] = useState<BasicFacilitiesData>({
    electricity: 'Yes',
    drinkingWater: 'Tap Water',
    toilet: 'Household Toilet',
    cookingFuel: 'LPG',
    internetAccess: 'Yes',
  });

  const [employmentEdu, setEmploymentEdu] = useState<EmploymentEducationData>({
    primaryEmployment: 'Employed',
    childrenAttendingSchool: 'Yes',
    highestEducationLevel: 'Secondary',
  });

  const [needs, setNeeds] = useState<HouseholdNeed[]>(['Health Assistance', 'Education Assistance']);
  const [schemeStatus, setSchemeStatus] = useState<SchemeItem[]>([
    { category: 'Food / Ration', choice: 'Receiving', schemeName: 'PM Garib Kalyan Anna Yojana' },
    { category: 'Health', choice: 'Receiving', schemeName: 'Ayushman Bharat' },
  ]);
  const [remarks, setRemarks] = useState('');

  // Launch Active Survey
  const handleLaunchSurvey = async (item: AssignedHouseholdSummary, forceReadOnly?: boolean) => {
    setActiveHousehold(item);
    setSurveyStatus(item.status);
    setIsReadOnly(forceReadOnly ?? item.status === 'Completed');
    setCurrentStep(0);

    // Initialize fields from selected household summary
    setHeadName(item.headName);
    setHeadMobile(item.mobile);
    setFullAddress(item.address);
    setState(item.state);
    setDistrict(item.district);
    setWard(item.ward);
    setPinCode(item.pinCode);
    setHouseType(item.houseType);
    setOwnership(item.ownership);

    // Load any saved local progress for this household
    try {
      const saved = await AsyncStorage.getItem(`@lokvision_survey_${item.householdId}`);
      if (saved) {
        const parsed: SurveyFormData = JSON.parse(saved);
        if (parsed.facilities) setFacilities(parsed.facilities);
        if (parsed.employmentEducation) setEmploymentEdu(parsed.employmentEducation);
        if (parsed.needs) setNeeds(parsed.needs);
        if (parsed.schemeStatus) setSchemeStatus(parsed.schemeStatus);
        if (parsed.remarks) setRemarks(parsed.remarks);
        if (parsed.familyMembers) setFamilyMembers(parsed.familyMembers);
      } else if (familyMembers.length === 0) {
        // Mock default members if new
        setFamilyMembers([
          {
            id: 'm1',
            name: 'Pooja Kumar',
            age: '38',
            gender: 'Female',
            relationship: 'Spouse',
            occupation: 'Homemaker',
            education: 'Secondary',
            disability: 'No',
          },
          {
            id: 'm2',
            name: 'Aarav Kumar',
            age: '14',
            gender: 'Male',
            relationship: 'Son',
            occupation: 'Student',
            education: 'Secondary',
            disability: 'No',
          },
        ]);
      }
    } catch {
      // Ignore read error
    }
  };

  // Load local households on mount & check navigation params
  useEffect(() => {
    async function init() {
      const storeList = await loadEnumeratorHouseholds();
      const mappedSummaries: AssignedHouseholdSummary[] = storeList.map((h) => ({
        householdId: h.householdId,
        headName: h.headName,
        address: h.address || `${h.locality}, ${h.ward || 'Ward 12'}`,
        memberCount: h.members,
        status: h.status === 'Needs Verification' || h.status === 'Missing' ? 'Pending' : (h.status as SurveyStatus),
        priority: h.priority === 'High' ? 'High' : 'Normal',
        mobile: h.mobile || '9876543210',
        state: 'Uttar Pradesh',
        district: h.district || 'Varanasi',
        ward: h.ward || 'Ward 12',
        pinCode: h.pinCode || '221005',
        houseType: h.houseType || 'Permanent',
        ownership: h.ownership || 'Owned',
      }));

      setHouseholds(mappedSummaries);

      if (params.householdId) {
        const target = mappedSummaries.find(
          (item) => item.householdId.toLowerCase() === params.householdId?.toLowerCase()
        );
        if (target) {
          handleLaunchSurvey(target, params.readOnly === 'true');
        }
      }
    }
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.householdId, params.readOnly]);

  // Counts for Header Card
  const pendingCount = households.filter((h) => h.status === 'Pending').length;
  const inProgressCount = households.filter((h) => h.status === 'In Progress').length;
  const completedCount = households.filter((h) => h.status === 'Completed').length;

  // Filtered List
  const filteredHouseholds = households.filter((item) => {
    const matchesSearch =
      item.householdId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.headName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.address.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (activeFilter === 'All') return true;
    if (activeFilter === 'Pending') return item.status === 'Pending';
    if (activeFilter === 'In Progress') return item.status === 'In Progress';
    if (activeFilter === 'Completed') return item.status === 'Completed';
    if (activeFilter === 'Priority') return item.priority === 'High';

    return true;
  });

  // Save Progress Handler
  const handleSaveProgress = async () => {
    if (!activeHousehold) return;

    const payload: SurveyFormData = {
      surveyId: `SRV-${activeHousehold.householdId}`,
      householdId: activeHousehold.householdId,
      status: 'In Progress',
      startedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      householdInformation: {
        familyMemberCount: familyMembers.length + 1,
        houseType,
        ownership,
        locality,
        ward,
        pinCode,
        state,
        district,
        fullAddress,
        name: headName,
        age: headAge,
        gender: headGender,
        mobile: headMobile,
        role: 'Head of Household',
      },
      familyMembers,
      facilities,
      employmentEducation: employmentEdu,
      needs,
      schemeStatus,
      remarks,
    };

    try {
      await AsyncStorage.setItem(`@lokvision_survey_${activeHousehold.householdId}`, JSON.stringify(payload));
      await updateHouseholdStatusInStore(activeHousehold.householdId, 'In Progress');
      await enqueueSyncItem('survey', 'update', activeHousehold.householdId, payload);
      await addEnumeratorActivity(
        'survey_started',
        'Survey Started',
        `Saved progress for ${activeHousehold.headName} household (${activeHousehold.householdId}).`,
        activeHousehold.householdId
      );

      // Update local households status to In Progress
      setHouseholds((prev) =>
        prev.map((h) => (h.householdId === activeHousehold.householdId ? { ...h, status: 'In Progress' } : h))
      );
      setSurveyStatus('In Progress');
      Alert.alert('Progress Saved', '✓ Survey progress saved locally.');
    } catch {
      Alert.alert('Error', 'Failed to save survey progress.');
    }
  };

  // Final Submit Survey Handler
  const handleSubmitSurvey = async () => {
    if (!activeHousehold) return;

    Alert.alert('Confirm Submission', 'Are you sure you want to submit this completed field survey?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Submit Survey',
        onPress: async () => {
          try {
            await AsyncStorage.removeItem(`@lokvision_survey_${activeHousehold.householdId}`);
            await updateHouseholdStatusInStore(activeHousehold.householdId, 'Completed');
            await addEnumeratorActivity(
              'survey_completed',
              'Survey Completed',
              `Completed field survey for ${headName} household (${familyMembers.length + 1} members).`,
              activeHousehold.householdId
            );
          } catch {
            // Ignore cleanup error
          }

          // Update household status to Completed
          setHouseholds((prev) =>
            prev.map((h) => (h.householdId === activeHousehold.householdId ? { ...h, status: 'Completed' } : h))
          );
          setSurveyStatus('Completed');
          setIsReadOnly(true);

          Alert.alert(
            'Survey Submitted',
            `Survey submitted successfully.\n\nHousehold ID: ${activeHousehold.householdId}\nHead: ${headName}`,
            [
              {
                text: 'Return to List',
                onPress: () => setActiveHousehold(null),
              },
            ]
          );
        },
      },
    ]);
  };

  // Family Member Handlers inside survey
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

  // Progress Calculation
  const progressPercentage = Math.round(((currentStep + 1) / STEP_TITLES.length) * 100);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={ENUMERATOR_THEME.colors.cardBackground} />

      {/* RENDER VIEW 1: LANDING LIST */}
      {!activeHousehold ? (
        <View style={{ flex: 1 }}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.backBtn} onPress={() => router.push('/(enumerator)/dashboard')} activeOpacity={0.7}>
              <Ionicons name="arrow-back" size={22} color={ENUMERATOR_THEME.colors.textPrimary} />
            </TouchableOpacity>
            <View style={styles.headerTitleWrap}>
              <Text style={styles.headerBrand}>Lokvision</Text>
              <Text style={styles.headerTitle}>Start Field Survey</Text>
            </View>
            <TouchableOpacity style={styles.backBtn} onPress={() => router.push('/(enumerator)/dashboard')} activeOpacity={0.7}>
              <Ionicons name="home-outline" size={20} color={ENUMERATOR_THEME.colors.textPrimary} />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.landingBody} showsVerticalScrollIndicator={false}>
            {/* Header Metrics */}
            <SurveyLandingHeader
              totalAssigned={households.length}
              pendingCount={pendingCount}
              inProgressCount={inProgressCount}
              completedCount={completedCount}
            />

            {/* Search & Filter Bar */}
            <SurveySearchFilterBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
            />

            {/* Household List */}
            <View style={styles.listWrap}>
              <Text style={styles.listTitle}>
                Households ({filteredHouseholds.length})
              </Text>

              {filteredHouseholds.length === 0 ? (
                <View style={styles.emptyCard}>
                  <Ionicons name="search" size={28} color={ENUMERATOR_THEME.colors.textMuted} />
                  <Text style={styles.emptyTitle}>No Households Found</Text>
                  <Text style={styles.emptySubtitle}>Try adjusting your search or filter selection.</Text>
                </View>
              ) : (
                filteredHouseholds.map((item) => (
                  <SurveyHouseholdCard
                    key={item.householdId}
                    item={item}
                    onActionPress={handleLaunchSurvey}
                  />
                ))
              )}
            </View>
          </ScrollView>
        </View>
      ) : (
        /* RENDER VIEW 2: ACTIVE SURVEY WORKFLOW */
        <View style={{ flex: 1 }}>
          {/* Active Survey Header */}
          <SurveyHeaderBar
            householdId={activeHousehold.householdId}
            headName={headName || activeHousehold.headName}
            progressPercentage={progressPercentage}
            status={surveyStatus}
            onBackPress={() => setActiveHousehold(null)}
          />

          {/* Horizontal Step Navigation Bar */}
          <SurveyStepBar
            currentStep={currentStep}
            totalSteps={STEP_TITLES.length}
            stepTitles={STEP_TITLES}
            onStepPress={(idx) => setCurrentStep(idx)}
          />

          {/* Active Step Content Scroll View */}
          <ScrollView contentContainerStyle={styles.surveyBody} showsVerticalScrollIndicator={false}>
            {/* Step A: Household Information */}
            {currentStep === 0 && (
              <>
                <HeadOfHouseholdCard
                  data={{
                    name: headName,
                    age: headAge,
                    gender: headGender,
                    mobile: headMobile,
                    role: 'Head of Household',
                  }}
                  onChange={(upd) => {
                    if (upd.name !== undefined) setHeadName(upd.name);
                    if (upd.age !== undefined) setHeadAge(upd.age);
                    if (upd.gender !== undefined) setHeadGender(upd.gender);
                    if (upd.mobile !== undefined) setHeadMobile(upd.mobile);
                  }}
                />

                <HouseholdProfileCard
                  data={{
                    familyMemberCount: familyMembers.length + 1,
                    houseType,
                    ownership,
                    locality,
                    ward,
                    pinCode,
                    state,
                    district,
                    fullAddress,
                  }}
                  onChange={(upd) => {
                    if (upd.fullAddress !== undefined) setFullAddress(upd.fullAddress);
                    if (upd.locality !== undefined) setLocality(upd.locality);
                    if (upd.ward !== undefined) setWard(upd.ward);
                    if (upd.pinCode !== undefined) setPinCode(upd.pinCode);
                    if (upd.houseType !== undefined) setHouseType(upd.houseType);
                    if (upd.ownership !== undefined) setOwnership(upd.ownership);
                  }}
                />
              </>
            )}

            {/* Step B: Family Information */}
            {currentStep === 1 && (
              <FamilyMembersCardList
                members={familyMembers}
                onAddPress={() => {
                  setEditingMember(null);
                  setMemberModalVisible(true);
                }}
                onEditPress={(m) => {
                  setEditingMember(m);
                  setMemberModalVisible(true);
                }}
                onRemovePress={handleRemoveMember}
              />
            )}

            {/* Step C: Basic Facilities */}
            {currentStep === 2 && (
              <SurveyFacilitiesCard
                data={facilities}
                onChange={(upd) => setFacilities((prev) => ({ ...prev, ...upd }))}
                readOnly={isReadOnly}
              />
            )}

            {/* Step D: Employment & Education */}
            {currentStep === 3 && (
              <SurveyEmploymentEduCard
                data={employmentEdu}
                onChange={(upd) => setEmploymentEdu((prev) => ({ ...prev, ...upd }))}
                readOnly={isReadOnly}
              />
            )}

            {/* Step E: Household Needs */}
            {currentStep === 4 && (
              <HouseholdNeedsSection
                selectedNeeds={needs}
                onChange={setNeeds}
              />
            )}

            {/* Step F: Government Scheme Status */}
            {currentStep === 5 && (
              <GovernmentSchemesSection
                schemeItems={schemeStatus}
                onChange={setSchemeStatus}
              />
            )}

            {/* Step G: Enumerator Remarks */}
            {currentStep === 6 && (
              <EnumeratorRemarksCard
                remarks={remarks}
                onChange={setRemarks}
              />
            )}

            {/* Step H: Review & Submit */}
            {currentStep === 7 && (
              <SurveyReviewSection
                data={{
                  surveyId: `SRV-${activeHousehold.householdId}`,
                  householdId: activeHousehold.householdId,
                  status: surveyStatus,
                  startedAt: '',
                  updatedAt: '',
                  householdInformation: {
                    name: headName,
                    age: headAge,
                    gender: headGender,
                    mobile: headMobile,
                    role: 'Head',
                    familyMemberCount: familyMembers.length + 1,
                    houseType,
                    ownership,
                    locality,
                    ward,
                    pinCode,
                    state,
                    district,
                    fullAddress,
                  },
                  familyMembers,
                  facilities,
                  employmentEducation: employmentEdu,
                  needs,
                  schemeStatus,
                  remarks,
                }}
                onEditSection={(idx) => setCurrentStep(idx)}
                onSubmit={handleSubmitSurvey}
                readOnly={isReadOnly}
              />
            )}

            {/* Bottom Step Control Navigation */}
            <View style={styles.navControlRow}>
              {currentStep > 0 && (
                <TouchableOpacity
                  style={styles.navBackBtn}
                  onPress={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
                  activeOpacity={0.8}
                >
                  <Ionicons name="arrow-back" size={16} color={ENUMERATOR_THEME.colors.textPrimary} />
                  <Text style={styles.navBackText}>Back</Text>
                </TouchableOpacity>
              )}

              {!isReadOnly && (
                <TouchableOpacity style={styles.saveProgBtn} onPress={handleSaveProgress} activeOpacity={0.8}>
                  <MaterialCommunityIcons name="content-save-outline" size={16} color={ENUMERATOR_THEME.colors.accent} />
                  <Text style={styles.saveProgText}>Save Progress</Text>
                </TouchableOpacity>
              )}

              {currentStep < STEP_TITLES.length - 1 ? (
                <TouchableOpacity
                  style={styles.navNextBtn}
                  onPress={() => setCurrentStep((prev) => Math.min(STEP_TITLES.length - 1, prev + 1))}
                  activeOpacity={0.8}
                >
                  <Text style={styles.navNextText}>Next</Text>
                  <Ionicons name="arrow-forward" size={16} color={ENUMERATOR_THEME.colors.textWhite} />
                </TouchableOpacity>
              ) : (
                !isReadOnly && (
                  <TouchableOpacity style={styles.navSubmitBtn} onPress={handleSubmitSurvey} activeOpacity={0.8}>
                    <Text style={styles.navNextText}>Submit Survey</Text>
                    <MaterialCommunityIcons name="check-circle" size={16} color={ENUMERATOR_THEME.colors.textWhite} />
                  </TouchableOpacity>
                )
              )}
            </View>

            <View style={styles.bottomSpacer} />
          </ScrollView>

          {/* Add/Edit Member Modal */}
          <FamilyMemberModal
            visible={memberModalVisible}
            editingMember={editingMember}
            onClose={() => setMemberModalVisible(false)}
            onSave={handleSaveMember}
          />
        </View>
      )}
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
  landingBody: {
    padding: 16,
    gap: 16,
  },
  listWrap: {
    gap: 12,
  },
  listTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  emptyCard: {
    backgroundColor: ENUMERATOR_THEME.colors.cardBackground,
    borderRadius: ENUMERATOR_THEME.borderRadius.xl,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
    gap: 6,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  emptySubtitle: {
    fontSize: 12,
    color: ENUMERATOR_THEME.colors.textMuted,
  },
  surveyBody: {
    padding: 16,
    gap: 16,
  },
  navControlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 8,
  },
  navBackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: ENUMERATOR_THEME.colors.subtleBackground,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
    height: 46,
    paddingHorizontal: 16,
    borderRadius: ENUMERATOR_THEME.borderRadius.lg,
    gap: 6,
  },
  navBackText: {
    fontSize: 13,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  saveProgBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: ENUMERATOR_THEME.colors.accentSubtle,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.accent,
    height: 46,
    borderRadius: ENUMERATOR_THEME.borderRadius.lg,
    gap: 6,
  },
  saveProgText: {
    fontSize: 13,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.accent,
  },
  navNextBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: ENUMERATOR_THEME.colors.accent,
    height: 46,
    borderRadius: ENUMERATOR_THEME.borderRadius.lg,
    gap: 6,
  },
  navNextText: {
    fontSize: 13,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.textWhite,
  },
  navSubmitBtn: {
    flex: 1.2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: ENUMERATOR_THEME.colors.success,
    height: 46,
    borderRadius: ENUMERATOR_THEME.borderRadius.lg,
    gap: 6,
  },
  bottomSpacer: {
    height: 32,
  },
});
