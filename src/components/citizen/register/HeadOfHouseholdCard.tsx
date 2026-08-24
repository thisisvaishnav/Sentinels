import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { CITIZEN_THEME } from '@/src/features/enumeration/theme';

const T = CITIZEN_THEME;

type Gender = 'Male' | 'Female' | 'Other';
const GENDER_OPTIONS: Gender[] = ['Male', 'Female', 'Other'];

interface HeadOfHouseholdData {
  name: string;
  age: string;
  gender: Gender | undefined;
  mobile: string;
}

interface Props {
  data: HeadOfHouseholdData;
  onChange: (updated: Partial<HeadOfHouseholdData>) => void;
  errors?: Record<string, string | undefined>;
  mobileEditable?: boolean;
}

export function HeadOfHouseholdCard({ data, onChange, errors, mobileEditable = false }: Props) {
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
        <View style={styles.iconWrap}>
          <MaterialCommunityIcons name="account-tie" size={20} color={T.colors.accent} />
        </View>
        <Text style={styles.cardTitle}>Head of Household</Text>
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Full Name *</Text>
        <TextInput
          style={[styles.input, errors?.name && styles.inputError]}
          placeholder="e.g. Rajesh Kumar Sharma"
          placeholderTextColor={T.colors.textMuted}
          value={data.name}
          onChangeText={(val) => onChange({ name: val })}
        />
        {errors?.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}
      </View>

      <View style={styles.rowGrid}>
        <View style={[styles.fieldGroup, { flex: 1 }]}>
          <Text style={styles.label}>Age (Years) *</Text>
          <TextInput
            style={[styles.input, errors?.age && styles.inputError]}
            placeholder="e.g. 45"
            placeholderTextColor={T.colors.textMuted}
            keyboardType="numeric"
            maxLength={3}
            value={data.age}
            onChangeText={handleAgeChange}
          />
          {errors?.age ? <Text style={styles.errorText}>{errors.age}</Text> : null}
        </View>

        <View style={[styles.fieldGroup, { flex: 1.4 }]}>
          <Text style={styles.label}>Mobile Number *</Text>
          <TextInput
            style={[styles.input, errors?.mobile && styles.inputError, !mobileEditable && styles.inputDisabled]}
            placeholder="10-digit mobile"
            placeholderTextColor={T.colors.textMuted}
            keyboardType="phone-pad"
            maxLength={10}
            value={data.mobile}
            onChangeText={handleMobileChange}
            editable={mobileEditable}
          />
          {errors?.mobile ? <Text style={styles.errorText}>{errors.mobile}</Text> : null}
        </View>
      </View>

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
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: T.colors.cardBackground,
    borderRadius: T.borderRadius.xl,
    padding: 16,
    borderWidth: 1,
    borderColor: T.colors.border,
    gap: 14,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: T.borderRadius.sm,
    backgroundColor: T.colors.accentSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: T.colors.textPrimary,
  },
  fieldGroup: {
    gap: 6,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: T.colors.textSecondary,
  },
  input: {
    backgroundColor: T.colors.inputBackground,
    borderRadius: T.borderRadius.md,
    borderWidth: 1,
    borderColor: T.colors.borderSubtle,
    color: T.colors.textPrimary,
    paddingHorizontal: 12,
    height: 44,
    fontSize: 14,
  },
  inputDisabled: {
    backgroundColor: T.colors.subtleBackground,
    color: T.colors.textMuted,
  },
  inputError: {
    borderColor: T.colors.danger,
    backgroundColor: '#FEF2F2',
  },
  errorText: {
    fontSize: 11,
    color: T.colors.danger,
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
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: T.borderRadius.md,
    backgroundColor: T.colors.inputBackground,
    borderWidth: 1,
    borderColor: T.colors.borderSubtle,
  },
  chipActive: {
    backgroundColor: T.colors.accentSubtle,
    borderColor: T.colors.accent,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: T.colors.textMuted,
  },
  chipTextActive: {
    color: T.colors.accent,
    fontWeight: '700',
  },
});
