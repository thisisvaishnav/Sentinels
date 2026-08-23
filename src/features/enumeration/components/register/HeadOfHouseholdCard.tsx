import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ENUMERATOR_THEME } from '../../theme';
import { Gender, HeadOfHousehold } from '../../types';

interface Props {
  data: HeadOfHousehold;
  onChange: (updated: Partial<HeadOfHousehold>) => void;
  errors?: Record<string, string>;
}

const GENDER_OPTIONS: Gender[] = ['Male', 'Female', 'Other', 'Prefer not to say'];

export function HeadOfHouseholdCard({ data, onChange, errors }: Props) {
  const handleAgeChange = (val: string) => {
    const cleaned = val.replace(/[^0-9]/g, '');
    if (cleaned === '' || (parseInt(cleaned, 10) >= 0 && parseInt(cleaned, 10) <= 120)) {
      onChange({ age: cleaned });
    }
  };

  const handleMobileChange = (val: string) => {
    const cleaned = val.replace(/[^0-9]/g, '');
    if (cleaned.length <= 10) {
      onChange({ mobile: cleaned });
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardHeaderRow}>
        <MaterialCommunityIcons name="account-tie" size={22} color={ENUMERATOR_THEME.colors.accent} />
        <Text style={styles.cardTitle}>Head of Household</Text>
      </View>

      {/* Full Name */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Full Name *</Text>
        <TextInput
          style={[styles.input, errors?.name && styles.inputError]}
          placeholder="e.g. Rajesh Kumar Sharma"
          placeholderTextColor={ENUMERATOR_THEME.colors.textMuted}
          value={data.name}
          onChangeText={(val) => onChange({ name: val })}
        />
        {errors?.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}
      </View>

      {/* Age & Mobile Row */}
      <View style={styles.rowGrid}>
        {/* Age */}
        <View style={[styles.fieldGroup, { flex: 1 }]}>
          <Text style={styles.label}>Age (Years) *</Text>
          <TextInput
            style={[styles.input, errors?.age && styles.inputError]}
            placeholder="e.g. 45"
            placeholderTextColor={ENUMERATOR_THEME.colors.textMuted}
            keyboardType="numeric"
            maxLength={3}
            value={data.age}
            onChangeText={handleAgeChange}
          />
          {errors?.age ? <Text style={styles.errorText}>{errors.age}</Text> : null}
        </View>

        {/* Mobile Number */}
        <View style={[styles.fieldGroup, { flex: 1.4 }]}>
          <Text style={styles.label}>Mobile Number *</Text>
          <TextInput
            style={[styles.input, errors?.mobile && styles.inputError]}
            placeholder="10-digit mobile"
            placeholderTextColor={ENUMERATOR_THEME.colors.textMuted}
            keyboardType="phone-pad"
            maxLength={10}
            value={data.mobile}
            onChangeText={handleMobileChange}
          />
          {errors?.mobile ? <Text style={styles.errorText}>{errors.mobile}</Text> : null}
        </View>
      </View>

      {/* Gender Selection */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Gender *</Text>
        <View style={styles.genderWrap}>
          {GENDER_OPTIONS.map((g) => {
            const isActive = data.gender === g;
            return (
              <TouchableOpacity
                key={g}
                style={[styles.chip, isActive && styles.chipActive]}
                onPress={() => onChange({ gender: g })}
                activeOpacity={0.7}
              >
                <Text style={[styles.chipText, isActive && styles.chipTextActive]}>{g}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
        {errors?.gender ? <Text style={styles.errorText}>{errors.gender}</Text> : null}
      </View>

      {/* Role / Relationship */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Household Role</Text>
        <TextInput
          style={styles.input}
          placeholder="Head of Household"
          placeholderTextColor={ENUMERATOR_THEME.colors.textMuted}
          value={data.role}
          onChangeText={(val) => onChange({ role: val })}
        />
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
  inputError: {
    borderColor: ENUMERATOR_THEME.colors.danger,
    backgroundColor: '#FEF2F2',
  },
  errorText: {
    fontSize: 11,
    color: ENUMERATOR_THEME.colors.danger,
    fontWeight: '500',
  },
  rowGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  genderWrap: {
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
