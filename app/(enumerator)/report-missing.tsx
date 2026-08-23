import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import * as Location from 'expo-location';
import { ENUMERATOR_THEME } from '@/src/features/enumeration/theme';
import {
  MissingHouseholdReport,
  MissingPriority,
  MissingReason,
} from '@/src/features/enumeration/types/missingReportTypes';
import {
  loadMissingReports,
  saveOrUpdateMissingReport,
} from '@/src/features/enumeration/data/missingReports';

// Components
import { MissingReportHeader } from '@/src/features/enumeration/components/report-missing/MissingReportHeader';
import { LocationCaptureCard } from '@/src/features/enumeration/components/report-missing/LocationCaptureCard';
import { HouseholdInfoCard } from '@/src/features/enumeration/components/report-missing/HouseholdInfoCard';
import { MissingReasonCard } from '@/src/features/enumeration/components/report-missing/MissingReasonCard';
import { PrioritySelectorCard } from '@/src/features/enumeration/components/report-missing/PrioritySelectorCard';
import { VisitDetailsCard } from '@/src/features/enumeration/components/report-missing/VisitDetailsCard';
import { SubmissionSummaryModal } from '@/src/features/enumeration/components/report-missing/SubmissionSummaryModal';
import { MissingReportsListCard } from '@/src/features/enumeration/components/report-missing/MissingReportsListCard';

export default function ReportMissingPage() {
  const params = useLocalSearchParams();

  const [existingReports, setExistingReports] = useState<MissingHouseholdReport[]>([]);

  // Form Fields
  const [editingReportId, setEditingReportId] = useState<string | undefined>(
    params.reportId ? String(params.reportId) : undefined
  );
  const [householdId, setHouseholdId] = useState<string>(params.householdId ? String(params.householdId) : '');
  const [headName, setHeadName] = useState<string>('');
  const [mobile, setMobile] = useState<string>('');
  const [estimatedMembers, setEstimatedMembers] = useState<string>('');
  const [address, setAddress] = useState<string>('');

  const [locality, setLocality] = useState<string>('Shiv Nagar West');
  const [ward, setWard] = useState<string>('Ward 12');
  const [pinCode, setPinCode] = useState<string>('221005');

  const [latitude, setLatitude] = useState<number | undefined>(26.8467);
  const [longitude, setLongitude] = useState<number | undefined>(80.9462);
  const [accuracy, setAccuracy] = useState<number | undefined>(10.0);
  const [isCapturingLocation, setIsCapturingLocation] = useState<boolean>(false);

  const [reason, setReason] = useState<MissingReason>('House locked');
  const [otherReason, setOtherReason] = useState<string>('');
  const [priority, setPriority] = useState<MissingPriority>('Normal');
  const [remarks, setRemarks] = useState<string>('');

  const now = new Date();
  const [visitDate, setVisitDate] = useState<string>(now.toISOString().split('T')[0]);
  const [visitTime, setVisitTime] = useState<string>(
    now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  );
  const [attemptNumber, setAttemptNumber] = useState<number>(1);

  const [summaryModalVisible, setSummaryModalVisible] = useState<boolean>(false);

  // Load Reports from AsyncStorage
  useEffect(() => {
    async function fetchReports() {
      const list = await loadMissingReports();
      setExistingReports(list);

      // If reportId param passed, populate draft data
      if (params.reportId) {
        const found = list.find((r) => r.reportId === String(params.reportId));
        if (found) {
          populateForm(found);
        }
      }
    }
    fetchReports();
  }, [params.reportId]);

  const populateForm = (r: MissingHouseholdReport) => {
    setEditingReportId(r.reportId);
    setHouseholdId(r.householdId || '');
    setHeadName(r.headName || '');
    setMobile(r.mobile || '');
    setEstimatedMembers(r.estimatedMembers ? String(r.estimatedMembers) : '');
    setAddress(r.address || '');
    setLocality(r.locality);
    setWard(r.ward || 'Ward 12');
    setPinCode(r.pinCode || '221005');
    setLatitude(r.latitude);
    setLongitude(r.longitude);
    setAccuracy(r.accuracy);
    setReason(r.reason);
    setOtherReason(r.otherReason || '');
    setPriority(r.priority);
    setRemarks(r.remarks);
    setVisitDate(r.visitDate);
    setVisitTime(r.visitTime);
    setAttemptNumber(r.attemptNumber);
  };

  const handleCaptureGps = async () => {
    setIsCapturingLocation(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
        setLatitude(loc.coords.latitude);
        setLongitude(loc.coords.longitude);
        setAccuracy(loc.coords.accuracy || 8.0);
      } else {
        // Fallback coordinates for Shiv Nagar West
        setLatitude(26.8485);
        setLongitude(80.9490);
        setAccuracy(15.0);
        Alert.alert('GPS Permission', 'Location permission not granted. Using default field coordinates.');
      }
    } catch {
      setLatitude(26.8485);
      setLongitude(80.9490);
      setAccuracy(15.0);
    } finally {
      setIsCapturingLocation(false);
    }
  };

  const handleSaveDraft = async () => {
    const draftPayload: Partial<MissingHouseholdReport> = {
      reportId: editingReportId,
      householdId: householdId.trim() || undefined,
      headName: headName.trim() || undefined,
      mobile: mobile.trim() || undefined,
      estimatedMembers: estimatedMembers ? parseInt(estimatedMembers, 10) : undefined,
      address: address.trim() || undefined,
      locality: locality.trim() || 'Shiv Nagar West',
      ward: ward.trim() || 'Ward 12',
      pinCode: pinCode.trim() || '221005',
      latitude,
      longitude,
      accuracy,
      reason,
      otherReason: reason === 'Other' ? otherReason.trim() : undefined,
      priority,
      remarks: remarks.trim(),
      visitDate,
      visitTime,
      attemptNumber,
      status: 'Draft',
    };

    const saved = await saveOrUpdateMissingReport(draftPayload, false);
    Alert.alert('Draft Saved', `Missing report draft ${saved.reportId} saved locally.`);
    resetForm();
    const updated = await loadMissingReports();
    setExistingReports(updated);
  };

  const handleOpenSubmitSummary = () => {
    // Required Validation for Submit
    if (!reason) {
      Alert.alert('Validation Error', 'Please select a missing reason.');
      return;
    }
    if (reason === 'Other' && !otherReason.trim()) {
      Alert.alert('Validation Error', 'Please specify the custom reason.');
      return;
    }
    if (!locality.trim()) {
      Alert.alert('Validation Error', 'Please enter locality/area.');
      return;
    }
    if (!remarks.trim()) {
      Alert.alert('Validation Error', 'Please enter field remarks or observations.');
      return;
    }

    setSummaryModalVisible(true);
  };

  const handleConfirmSubmit = async () => {
    setSummaryModalVisible(false);

    const submitPayload: Partial<MissingHouseholdReport> = {
      reportId: editingReportId,
      householdId: householdId.trim() || undefined,
      headName: headName.trim() || undefined,
      mobile: mobile.trim() || undefined,
      estimatedMembers: estimatedMembers ? parseInt(estimatedMembers, 10) : undefined,
      address: address.trim() || undefined,
      locality: locality.trim() || 'Shiv Nagar West',
      ward: ward.trim() || 'Ward 12',
      pinCode: pinCode.trim() || '221005',
      latitude,
      longitude,
      accuracy,
      reason,
      otherReason: reason === 'Other' ? otherReason.trim() : undefined,
      priority,
      remarks: remarks.trim(),
      visitDate,
      visitTime,
      attemptNumber,
      status: 'Submitted',
    };

    const submitted = await saveOrUpdateMissingReport(submitPayload, true);
    Alert.alert('Report Submitted', `Report ${submitted.reportId} submitted successfully (Pending Sync).`);
    resetForm();
    const updated = await loadMissingReports();
    setExistingReports(updated);
  };

  const resetForm = () => {
    setEditingReportId(undefined);
    setHouseholdId('');
    setHeadName('');
    setMobile('');
    setEstimatedMembers('');
    setAddress('');
    setLocality('Shiv Nagar West');
    setWard('Ward 12');
    setPinCode('221005');
    setReason('House locked');
    setOtherReason('');
    setPriority('Normal');
    setRemarks('');
    setAttemptNumber(1);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={ENUMERATOR_THEME.colors.cardBackground} />

      <MissingReportHeader />

      <ScrollView contentContainerStyle={styles.scrollBody} showsVerticalScrollIndicator={false}>
        {/* 1. Location Section */}
        <LocationCaptureCard
          latitude={latitude}
          longitude={longitude}
          accuracy={accuracy}
          locality={locality}
          ward={ward}
          pinCode={pinCode}
          isCapturing={isCapturingLocation}
          onCaptureLocation={handleCaptureGps}
          onChangeLocality={setLocality}
          onChangeWard={setWard}
          onChangePinCode={setPinCode}
        />

        {/* 2. Household Information */}
        <HouseholdInfoCard
          householdId={householdId}
          headName={headName}
          mobile={mobile}
          estimatedMembers={estimatedMembers}
          address={address}
          onChangeHouseholdId={setHouseholdId}
          onChangeHeadName={setHeadName}
          onChangeMobile={setMobile}
          onChangeEstimatedMembers={setEstimatedMembers}
          onChangeAddress={setAddress}
        />

        {/* 3. Missing Reason */}
        <MissingReasonCard
          selectedReason={reason}
          otherReasonText={otherReason}
          onSelectReason={setReason}
          onChangeOtherReasonText={setOtherReason}
        />

        {/* 4. Priority & Remarks */}
        <PrioritySelectorCard
          priority={priority}
          remarks={remarks}
          onSelectPriority={setPriority}
          onChangeRemarks={setRemarks}
        />

        {/* 5. Visit Information */}
        <VisitDetailsCard
          visitDate={visitDate}
          visitTime={visitTime}
          attemptNumber={attemptNumber}
          onChangeVisitDate={setVisitDate}
          onChangeVisitTime={setVisitTime}
          onChangeAttemptNumber={setAttemptNumber}
        />

        {/* Action Buttons */}
        <View style={styles.actionsBar}>
          <TouchableOpacity style={styles.draftBtn} onPress={handleSaveDraft} activeOpacity={0.8}>
            <Text style={styles.draftBtnText}>Save Draft</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.submitBtn} onPress={handleOpenSubmitSummary} activeOpacity={0.8}>
            <Text style={styles.submitBtnText}>Submit Report</Text>
          </TouchableOpacity>
        </View>

        {/* Previously Filed Reports List */}
        <MissingReportsListCard
          reports={existingReports}
          onEditDraft={(report) => populateForm(report)}
          onViewReport={(report) =>
            Alert.alert(
              `Report ${report.reportId}`,
              `Locality: ${report.locality}\nReason: ${report.reason}\nPriority: ${report.priority}\nStatus: ${report.status}\nRemarks: ${report.remarks}`
            )
          }
        />

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Submission Confirmation Summary Drawer */}
      <SubmissionSummaryModal
        visible={summaryModalVisible}
        reportData={{
          householdId,
          headName,
          mobile,
          locality,
          latitude,
          longitude,
          reason,
          otherReason,
          priority,
          remarks,
        }}
        onClose={() => setSummaryModalVisible(false)}
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
  scrollBody: {
    padding: 14,
    gap: 14,
  },
  actionsBar: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  draftBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: ENUMERATOR_THEME.colors.cardBackground,
    borderRadius: ENUMERATOR_THEME.borderRadius.lg,
    borderWidth: 1.5,
    borderColor: ENUMERATOR_THEME.colors.border,
  },
  draftBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: ENUMERATOR_THEME.colors.textSecondary,
  },
  submitBtn: {
    flex: 1.5,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: ENUMERATOR_THEME.colors.accent,
    borderRadius: ENUMERATOR_THEME.borderRadius.lg,
  },
  submitBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: ENUMERATOR_THEME.colors.textWhite,
  },
  bottomSpacer: {
    height: 32,
  },
});
