import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Modal,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ENUMERATOR_THEME } from '../../theme';
import {
  DisabilityStatus,
  EducationLevel,
  FamilyMember,
  Gender,
  Occupation,
  RelationshipRole,
} from '../../types';

interface Props {
  visible: boolean;
  editingMember: FamilyMember | null;
  onClose: () => void;
  onSave: (member: FamilyMember) => void;
}

const GENDER_OPTIONS: Gender[] = ['Male', 'Female', 'Other', 'Prefer not to say'];
const RELATIONSHIP_OPTIONS: RelationshipRole[] = [
  'Spouse',
  'Son',
  'Daughter',
  'Father',
  'Mother',
  'Brother',
  'Sister',
  'Other',
];
const OCCUPATION_OPTIONS: Occupation[] = [
  'Student',
  'Employed',
  'Self-employed',
  'Unemployed',
  'Homemaker',
  'Retired',
  'Other',
];
const EDUCATION_OPTIONS: EducationLevel[] = [
  'No formal education',
  'Primary',
  'Secondary',
  'Higher Secondary',
  'Graduate',
  'Postgraduate',
  'Other',
];
const DISABILITY_OPTIONS: DisabilityStatus[] = ['No', 'Yes', 'Prefer not to say'];

export function FamilyMemberModal({ visible, editingMember, onClose, onSave }: Props) {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<Gender>('Male');
  const [relationship, setRelationship] = useState<RelationshipRole>('Spouse');
  const [occupation, setOccupation] = useState<Occupation>('Employed');
  const [education, setEducation] = useState<EducationLevel>('Secondary');
  const [disability, setDisability] = useState<DisabilityStatus>('No');

  useEffect(() => {
    if (editingMember) {
      setName(editingMember.name);
      setAge(editingMember.age);
      setGender(editingMember.gender);
      setRelationship(editingMember.relationship);
      setOccupation(editingMember.occupation);
      setEducation(editingMember.education);
      setDisability(editingMember.disability);
    } else {
      setName('');
      setAge('');
      setGender('Male');
      setRelationship('Spouse');
      setOccupation('Employed');
      setEducation('Secondary');
      setDisability('No');
    }
  }, [editingMember, visible]);

  const handleSave = () => {
    if (!name.trim()) {
      return;
    }
    const memberData: FamilyMember = {
      id: editingMember ? editingMember.id : Date.now().toString(),
      name: name.trim(),
      age: age.trim() || '25',
      gender,
      relationship,
      occupation,
      education,
      disability,
    };
    onSave(memberData);
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {editingMember ? 'Edit Family Member' : 'Add Family Member'}
            </Text>
            <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
              <Ionicons name="close" size={22} color={ENUMERATOR_THEME.colors.textMuted} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollBody} showsVerticalScrollIndicator={false}>
            {/* Full Name */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Full Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="Member full name"
                placeholderTextColor={ENUMERATOR_THEME.colors.textMuted}
                value={name}
                onChangeText={setName}
              />
            </View>

            {/* Age */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Age (Years) *</Text>
              <TextInput
                style={styles.input}
                placeholder="Age"
                placeholderTextColor={ENUMERATOR_THEME.colors.textMuted}
                keyboardType="numeric"
                maxLength={3}
                value={age}
                onChangeText={(val) => setAge(val.replace(/[^0-9]/g, ''))}
              />
            </View>

            {/* Gender */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Gender *</Text>
              <View style={styles.chipsWrap}>
                {GENDER_OPTIONS.map((g) => (
                  <TouchableOpacity
                    key={g}
                    style={[styles.chip, gender === g && styles.chipActive]}
                    onPress={() => setGender(g)}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.chipText, gender === g && styles.chipTextActive]}>{g}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Relationship */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Relationship to Head *</Text>
              <View style={styles.chipsWrap}>
                {RELATIONSHIP_OPTIONS.map((rel) => (
                  <TouchableOpacity
                    key={rel}
                    style={[styles.chip, relationship === rel && styles.chipActive]}
                    onPress={() => setRelationship(rel)}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.chipText, relationship === rel && styles.chipTextActive]}>{rel}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Occupation */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Occupation</Text>
              <View style={styles.chipsWrap}>
                {OCCUPATION_OPTIONS.map((occ) => (
                  <TouchableOpacity
                    key={occ}
                    style={[styles.chip, occupation === occ && styles.chipActive]}
                    onPress={() => setOccupation(occ)}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.chipText, occupation === occ && styles.chipTextActive]}>{occ}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Education Level */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Education Level</Text>
              <View style={styles.chipsWrap}>
                {EDUCATION_OPTIONS.map((edu) => (
                  <TouchableOpacity
                    key={edu}
                    style={[styles.chip, education === edu && styles.chipActive]}
                    onPress={() => setEducation(edu)}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.chipText, education === edu && styles.chipTextActive]}>{edu}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Disability Status */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Disability Status</Text>
              <View style={styles.chipsWrap}>
                {DISABILITY_OPTIONS.map((dis) => (
                  <TouchableOpacity
                    key={dis}
                    style={[styles.chip, disability === dis && styles.chipActive]}
                    onPress={() => setDisability(dis)}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.chipText, disability === dis && styles.chipTextActive]}>{dis}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>

          {/* Action */}
          <TouchableOpacity style={styles.saveBtn} onPress={handleSave} activeOpacity={0.8}>
            <Text style={styles.saveBtnText}>{editingMember ? 'Update Member' : 'Save Member'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(23, 42, 58, 0.4)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: ENUMERATOR_THEME.colors.cardBackground,
    borderTopLeftRadius: ENUMERATOR_THEME.borderRadius.xl,
    borderTopRightRadius: ENUMERATOR_THEME.borderRadius.xl,
    padding: 20,
    maxHeight: '88%',
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
    gap: 14,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 4,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  scrollBody: {
    maxHeight: 460,
  },
  fieldGroup: {
    gap: 6,
    marginBottom: 14,
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
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: ENUMERATOR_THEME.borderRadius.sm,
    backgroundColor: ENUMERATOR_THEME.colors.inputBackground,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.borderSubtle,
  },
  chipActive: {
    backgroundColor: ENUMERATOR_THEME.colors.accentSubtle,
    borderColor: ENUMERATOR_THEME.colors.accent,
  },
  chipText: {
    fontSize: 11,
    fontWeight: '600',
    color: ENUMERATOR_THEME.colors.textMuted,
  },
  chipTextActive: {
    color: ENUMERATOR_THEME.colors.accent,
    fontWeight: '700',
  },
  saveBtn: {
    backgroundColor: ENUMERATOR_THEME.colors.accent,
    height: 46,
    borderRadius: ENUMERATOR_THEME.borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  saveBtnText: {
    color: ENUMERATOR_THEME.colors.textWhite,
    fontSize: 14,
    fontWeight: '700',
  },
});
