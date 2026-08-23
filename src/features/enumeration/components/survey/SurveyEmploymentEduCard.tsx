import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ENUMERATOR_THEME } from '../../theme';
import { EducationLevel, EmploymentEducationData } from '../../types';

interface Props {
  data: EmploymentEducationData;
  onChange: (updated: Partial<EmploymentEducationData>) => void;
  errors?: Record<string, string>;
  readOnly?: boolean;
}

const EMPLOYMENT_STATUSES: ('Employed' | 'Self-employed' | 'Unemployed' | 'Daily wage' | 'Retired' | 'Student' | 'Other')[] = [
  'Employed',
  'Self-employed',
  'Unemployed',
  'Daily wage',
  'Retired',
  'Student',
  'Other',
];

const SCHOOL_ATTENDANCE_OPTIONS: ('Yes' | 'No' | 'Not Applicable')[] = ['Yes', 'No', 'Not Applicable'];

const HIGHEST_EDUCATION_LEVELS: EducationLevel[] = [
  'No formal education',
  'Primary',
  'Secondary',
  'Higher Secondary',
  'Graduate',
  'Postgraduate',
  'Other',
];

export function SurveyEmploymentEduCard({ data, onChange, errors, readOnly = false }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeaderRow}>
        <MaterialCommunityIcons name="briefcase-clock-outline" size={22} color={ENUMERATOR_THEME.colors.accent} />
        <Text style={styles.cardTitle}>Section D: Employment & Education</Text>
      </View>

      {/* Primary Employment Status */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Primary Household Employment Status *</Text>
        <View style={styles.chipsWrap}>
          {EMPLOYMENT_STATUSES.map((status) => {
            const isActive = data.primaryEmployment === status;
            return (
              <TouchableOpacity
                key={status}
                disabled={readOnly}
                style={[styles.chip, isActive && styles.chipActive]}
                onPress={() => onChange({ primaryEmployment: status })}
                activeOpacity={0.7}
              >
                <Text style={[styles.chipText, isActive && styles.chipTextActive]}>{status}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
        {errors?.primaryEmployment ? <Text style={styles.errorText}>{errors.primaryEmployment}</Text> : null}
      </View>

      {/* Children Attending School */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Children Currently Attending School *</Text>
        <View style={styles.chipsWrap}>
          {SCHOOL_ATTENDANCE_OPTIONS.map((opt) => {
            const isActive = data.childrenAttendingSchool === opt;
            return (
              <TouchableOpacity
                key={opt}
                disabled={readOnly}
                style={[styles.chip, isActive && styles.chipActive]}
                onPress={() => onChange({ childrenAttendingSchool: opt })}
                activeOpacity={0.7}
              >
                <Text style={[styles.chipText, isActive && styles.chipTextActive]}>{opt}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
        {errors?.childrenAttendingSchool ? <Text style={styles.errorText}>{errors.childrenAttendingSchool}</Text> : null}
      </View>

      {/* Highest Household Education Level */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Highest Household Education Level *</Text>
        <View style={styles.chipsWrap}>
          {HIGHEST_EDUCATION_LEVELS.map((edu) => {
            const isActive = data.highestEducationLevel === edu;
            return (
              <TouchableOpacity
                key={edu}
                disabled={readOnly}
                style={[styles.chip, isActive && styles.chipActive]}
                onPress={() => onChange({ highestEducationLevel: edu })}
                activeOpacity={0.7}
              >
                <Text style={[styles.chipText, isActive && styles.chipTextActive]}>{edu}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
        {errors?.highestEducationLevel ? <Text style={styles.errorText}>{errors.highestEducationLevel}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
  errorText: {
    fontSize: 11,
    color: ENUMERATOR_THEME.colors.danger,
    fontWeight: '500',
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: ENUMERATOR_THEME.borderRadius.md,
    backgroundColor: ENUMERATOR_THEME.colors.inputBackground,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.borderSubtle,
  },
  chipActive: {
    backgroundColor: ENUMERATOR_THEME.colors.accentSubtle,
    borderColor: ENUMERATOR_THEME.colors.accent,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
    color: ENUMERATOR_THEME.colors.textMuted,
  },
  chipTextActive: {
    color: ENUMERATOR_THEME.colors.accent,
    fontWeight: '700',
  },
});
