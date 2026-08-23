import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Alert,
  Modal,
} from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ENUMERATOR_THEME } from '@/src/features/enumeration/theme';

interface FamilyMember {
  id: string;
  name: string;
  age: string;
  gender: 'Male' | 'Female' | 'Other';
  relationship: string;
}

export default function RegisterHouseholdScreen() {
  const router = useRouter();

  // Form State
  const [headName, setHeadName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [address, setAddress] = useState('');
  const [selectedState] = useState('Uttar Pradesh');
  const [selectedDistrict] = useState('Ghaziabad');
  const [wardLocality, setWardLocality] = useState('Ward 12 - Shastri Nagar North');

  // GPS State
  const [gpsLocation, setGpsLocation] = useState<{ lat: string; lng: string; accuracy: string } | null>(null);
  const [isCapturingGps, setIsCapturingGps] = useState(false);

  // Family Members State
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [memberModalVisible, setMemberModalVisible] = useState(false);

  // Member Modal Form State
  const [memberName, setMemberName] = useState('');
  const [memberAge, setMemberAge] = useState('');
  const [memberGender, setMemberGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [memberRelationship, setMemberRelationship] = useState('Spouse');

  // GPS Capture Handler
  const handleCaptureGps = () => {
    setIsCapturingGps(true);
    setTimeout(() => {
      setGpsLocation({
        lat: '28.6692° N',
        lng: '77.4538° E',
        accuracy: '±3.2m (High Precision)',
      });
      setIsCapturingGps(false);
      Alert.alert('GPS Captured', 'Geo-coordinates locked to current field location.');
    }, 800);
  };

  // Add Member Handler
  const handleAddMember = () => {
    if (!memberName.trim()) {
      Alert.alert('Validation', 'Please enter member name.');
      return;
    }
    const newMember: FamilyMember = {
      id: Date.now().toString(),
      name: memberName.trim(),
      age: memberAge.trim() || '25',
      gender: memberGender,
      relationship: memberRelationship.trim() || 'Family Member',
    };
    const updated = [...familyMembers, newMember];
    setFamilyMembers(updated);

    // Reset Modal
    setMemberName('');
    setMemberAge('');
    setMemberGender('Male');
    setMemberRelationship('Spouse');
    setMemberModalVisible(false);
  };

  const handleRemoveMember = (id: string) => {
    const updated = familyMembers.filter((m) => m.id !== id);
    setFamilyMembers(updated);
  };

  // Save Draft
  const handleSaveDraft = () => {
    Alert.alert('Draft Saved', 'Household record saved locally to offline buffer.');
  };

  // Submit Household
  const handleSubmit = () => {
    if (!headName.trim()) {
      Alert.alert('Required Field', 'Please enter Head of Household name.');
      return;
    }
    if (!mobileNumber.trim() || mobileNumber.length < 10) {
      Alert.alert('Invalid Mobile', 'Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!address.trim()) {
      Alert.alert('Required Field', 'Please enter household address.');
      return;
    }

    Alert.alert(
      'Household Registered',
      `Successfully registered household for ${headName}. Reference ID: #HH-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      [
        {
          text: 'OK',
          onPress: () => router.push('/(enumerator)/dashboard'),
        },
      ]
    );
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

      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        {/* Section 1: Basic Household Info */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <MaterialCommunityIcons name="home-account" size={22} color={ENUMERATOR_THEME.colors.accent} />
            <Text style={styles.cardTitle}>Household Information</Text>
          </View>

          {/* Head Name */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Head of Household *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Rajesh Kumar Sharma"
              placeholderTextColor={ENUMERATOR_THEME.colors.textMuted}
              value={headName}
              onChangeText={setHeadName}
            />
          </View>

          {/* Mobile Number */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Mobile Number *</Text>
            <TextInput
              style={styles.input}
              placeholder="10-digit mobile number"
              placeholderTextColor={ENUMERATOR_THEME.colors.textMuted}
              keyboardType="phone-pad"
              maxLength={10}
              value={mobileNumber}
              onChangeText={setMobileNumber}
            />
          </View>

          {/* Address */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Full Address *</Text>
            <TextInput
              style={[styles.input, styles.multilineInput]}
              placeholder="House/Plot No, Street, Landmark"
              placeholderTextColor={ENUMERATOR_THEME.colors.textMuted}
              multiline
              numberOfLines={2}
              value={address}
              onChangeText={setAddress}
            />
          </View>

          {/* Location Grid */}
          <View style={styles.rowGrid}>
            <View style={[styles.fieldGroup, { flex: 1 }]}>
              <Text style={styles.label}>State</Text>
              <View style={styles.selectBox}>
                <Text style={styles.selectText}>{selectedState}</Text>
              </View>
            </View>

            <View style={[styles.fieldGroup, { flex: 1 }]}>
              <Text style={styles.label}>District</Text>
              <View style={styles.selectBox}>
                <Text style={styles.selectText}>{selectedDistrict}</Text>
              </View>
            </View>
          </View>

          {/* Ward / Locality */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Ward / Locality</Text>
            <TextInput
              style={styles.input}
              value={wardLocality}
              onChangeText={setWardLocality}
              placeholderTextColor={ENUMERATOR_THEME.colors.textMuted}
            />
          </View>
        </View>

        {/* Section 2: GPS Location Capture */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <MaterialCommunityIcons name="crosshairs-gps" size={22} color={ENUMERATOR_THEME.colors.success} />
            <Text style={styles.cardTitle}>GPS Location</Text>
          </View>

          {gpsLocation ? (
            <View style={styles.gpsDisplayBox}>
              <Ionicons name="location" size={24} color={ENUMERATOR_THEME.colors.successText} />
              <View style={styles.gpsTextWrap}>
                <Text style={styles.gpsCoords}>{gpsLocation.lat}, {gpsLocation.lng}</Text>
                <Text style={styles.gpsAccuracy}>{gpsLocation.accuracy}</Text>
              </View>
            </View>
          ) : (
            <Text style={styles.gpsHint}>Tap button below to record current field GPS coordinates.</Text>
          )}

          <TouchableOpacity
            style={[styles.gpsBtn, isCapturingGps && styles.gpsBtnDisabled]}
            onPress={handleCaptureGps}
            disabled={isCapturingGps}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons name="map-marker-radius" size={20} color={ENUMERATOR_THEME.colors.textWhite} />
            <Text style={styles.gpsBtnText}>
              {isCapturingGps ? 'Locking Satellite Signal...' : gpsLocation ? 'Recapture GPS Location' : 'Capture Location'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Section 3: Family Members */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRowBetween}>
            <View style={styles.cardHeaderRow}>
              <MaterialCommunityIcons name="account-group-outline" size={22} color={ENUMERATOR_THEME.colors.accent} />
              <Text style={styles.cardTitle}>Family Members ({familyMembers.length})</Text>
            </View>
            <TouchableOpacity
              style={styles.addMemberBtn}
              onPress={() => setMemberModalVisible(true)}
              activeOpacity={0.8}
            >
              <Ionicons name="add" size={16} color={ENUMERATOR_THEME.colors.textWhite} />
              <Text style={styles.addMemberBtnText}>Add Member</Text>
            </TouchableOpacity>
          </View>

          {familyMembers.length === 0 ? (
            <View style={styles.emptyMembersBox}>
              <Text style={styles.emptyMembersText}>No additional family members added yet.</Text>
            </View>
          ) : (
            <View style={styles.membersList}>
              {familyMembers.map((item, index) => (
                <View key={item.id} style={styles.memberCard}>
                  <View style={styles.memberInfo}>
                    <Text style={styles.memberName}>{index + 1}. {item.name}</Text>
                    <Text style={styles.memberDetails}>
                      {item.relationship} · {item.age} yrs · {item.gender}
                    </Text>
                  </View>
                  <TouchableOpacity onPress={() => handleRemoveMember(item.id)} activeOpacity={0.7}>
                    <Ionicons name="trash-outline" size={18} color={ENUMERATOR_THEME.colors.danger} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.draftBtn} onPress={handleSaveDraft} activeOpacity={0.8}>
            <MaterialCommunityIcons name="file-document-outline" size={18} color={ENUMERATOR_THEME.colors.textPrimary} />
            <Text style={styles.draftBtnText}>Save Draft</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} activeOpacity={0.8}>
            <MaterialCommunityIcons name="check-circle-outline" size={18} color={ENUMERATOR_THEME.colors.textWhite} />
            <Text style={styles.submitBtnText}>Submit Household</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Add Family Member Modal */}
      <Modal visible={memberModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Family Member</Text>
              <TouchableOpacity onPress={() => setMemberModalVisible(false)}>
                <Ionicons name="close" size={22} color={ENUMERATOR_THEME.colors.textMuted} />
              </TouchableOpacity>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Member Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="Full Name"
                placeholderTextColor={ENUMERATOR_THEME.colors.textMuted}
                value={memberName}
                onChangeText={setMemberName}
              />
            </View>

            <View style={styles.rowGrid}>
              <View style={[styles.fieldGroup, { flex: 1 }]}>
                <Text style={styles.label}>Age</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Age"
                  placeholderTextColor={ENUMERATOR_THEME.colors.textMuted}
                  keyboardType="numeric"
                  value={memberAge}
                  onChangeText={setMemberAge}
                />
              </View>

              <View style={[styles.fieldGroup, { flex: 1 }]}>
                <Text style={styles.label}>Relationship</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Spouse / Son / Daughter"
                  placeholderTextColor={ENUMERATOR_THEME.colors.textMuted}
                  value={memberRelationship}
                  onChangeText={setMemberRelationship}
                />
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Gender</Text>
              <View style={styles.genderRow}>
                {(['Male', 'Female', 'Other'] as const).map((g) => (
                  <TouchableOpacity
                    key={g}
                    style={[styles.genderChip, memberGender === g && styles.genderChipActive]}
                    onPress={() => setMemberGender(g)}
                  >
                    <Text style={[styles.genderChipText, memberGender === g && styles.genderChipTextActive]}>
                      {g}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <TouchableOpacity style={styles.modalSaveBtn} onPress={handleAddMember} activeOpacity={0.8}>
              <Text style={styles.modalSaveBtnText}>Add Member to List</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  card: {
    backgroundColor: ENUMERATOR_THEME.colors.cardBackground,
    borderRadius: ENUMERATOR_THEME.borderRadius.xl,
    padding: 16,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
    gap: 14,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardHeaderRowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  fieldGroup: {
    gap: 6,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: ENUMERATOR_THEME.colors.textSecondary,
  },
  input: {
    backgroundColor: ENUMERATOR_THEME.colors.inputBackground,
    borderRadius: ENUMERATOR_THEME.borderRadius.md,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.borderSubtle,
    color: ENUMERATOR_THEME.colors.textPrimary,
    paddingHorizontal: 12,
    height: 44,
    fontSize: 14,
  },
  multilineInput: {
    height: 64,
    paddingVertical: 10,
  },
  rowGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  selectBox: {
    backgroundColor: ENUMERATOR_THEME.colors.inputBackground,
    borderRadius: ENUMERATOR_THEME.borderRadius.md,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.borderSubtle,
    height: 44,
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  selectText: {
    color: ENUMERATOR_THEME.colors.textPrimary,
    fontSize: 14,
    fontWeight: '500',
  },
  gpsDisplayBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ENUMERATOR_THEME.colors.successBg,
    borderRadius: ENUMERATOR_THEME.borderRadius.md,
    padding: 12,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.successBorder,
    gap: 10,
  },
  gpsTextWrap: {
    flex: 1,
  },
  gpsCoords: {
    fontSize: 14,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.successText,
  },
  gpsAccuracy: {
    fontSize: 11,
    color: ENUMERATOR_THEME.colors.success,
  },
  gpsHint: {
    fontSize: 13,
    color: ENUMERATOR_THEME.colors.textMuted,
    lineHeight: 18,
  },
  gpsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: ENUMERATOR_THEME.colors.success,
    height: 44,
    borderRadius: ENUMERATOR_THEME.borderRadius.md,
    gap: 8,
  },
  gpsBtnDisabled: {
    opacity: 0.6,
  },
  gpsBtnText: {
    color: ENUMERATOR_THEME.colors.textWhite,
    fontSize: 14,
    fontWeight: '700',
  },
  addMemberBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ENUMERATOR_THEME.colors.accent,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: ENUMERATOR_THEME.borderRadius.sm,
    gap: 4,
  },
  addMemberBtnText: {
    color: ENUMERATOR_THEME.colors.textWhite,
    fontSize: 12,
    fontWeight: '700',
  },
  emptyMembersBox: {
    backgroundColor: ENUMERATOR_THEME.colors.subtleBackground,
    borderRadius: ENUMERATOR_THEME.borderRadius.md,
    padding: 14,
    alignItems: 'center',
  },
  emptyMembersText: {
    color: ENUMERATOR_THEME.colors.textMuted,
    fontSize: 13,
  },
  membersList: {
    gap: 8,
  },
  memberCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: ENUMERATOR_THEME.colors.subtleBackground,
    borderRadius: ENUMERATOR_THEME.borderRadius.md,
    padding: 12,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
  },
  memberInfo: {
    flex: 1,
    gap: 2,
  },
  memberName: {
    fontSize: 14,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  memberDetails: {
    fontSize: 12,
    color: ENUMERATOR_THEME.colors.textMuted,
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
    height: 24,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(23, 42, 58, 0.4)',
    justifyContent: 'center',
    padding: 18,
  },
  modalContent: {
    backgroundColor: ENUMERATOR_THEME.colors.cardBackground,
    borderRadius: ENUMERATOR_THEME.borderRadius.xl,
    padding: 20,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
    gap: 14,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  genderRow: {
    flexDirection: 'row',
    gap: 10,
  },
  genderChip: {
    flex: 1,
    backgroundColor: ENUMERATOR_THEME.colors.inputBackground,
    borderRadius: ENUMERATOR_THEME.borderRadius.sm,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.borderSubtle,
  },
  genderChipActive: {
    backgroundColor: ENUMERATOR_THEME.colors.accentSubtle,
    borderColor: ENUMERATOR_THEME.colors.accent,
  },
  genderChipText: {
    color: ENUMERATOR_THEME.colors.textMuted,
    fontSize: 13,
    fontWeight: '600',
  },
  genderChipTextActive: {
    color: ENUMERATOR_THEME.colors.accent,
    fontWeight: '700',
  },
  modalSaveBtn: {
    backgroundColor: ENUMERATOR_THEME.colors.accent,
    height: 44,
    borderRadius: ENUMERATOR_THEME.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },
  modalSaveBtnText: {
    color: ENUMERATOR_THEME.colors.textWhite,
    fontSize: 14,
    fontWeight: '700',
  },
});
