import React from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { CITIZEN_THEME } from '@/src/features/enumeration/theme';

const T = CITIZEN_THEME;

interface FamilyDetailsData {
  total_members: string;
  male_members: string;
  female_members: string;
  children_count: string;
  senior_count: string;
}

interface Props {
  data: FamilyDetailsData;
  onChange: (updated: Partial<FamilyDetailsData>) => void;
  errors?: Record<string, string | undefined>;
}

export function FamilyDetailsCard({ data, onChange, errors }: Props) {
  const handleNumericChange = (field: keyof FamilyDetailsData, val: string) => {
    const cleaned = val.replace(/[^0-9]/g, '');
    onChange({ [field]: cleaned });
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardHeaderRow}>
        <View style={styles.iconWrap}>
          <MaterialCommunityIcons name="account-group-outline" size={20} color={T.colors.accent} />
        </View>
        <Text style={styles.cardTitle}>Family Details</Text>
      </View>

      <View style={styles.rowGrid}>
        <View style={[styles.fieldGroup, { flex: 1 }]}>
          <Text style={styles.label}>Total Members *</Text>
          <TextInput
            style={[styles.input, errors?.total_members && styles.inputError]}
            placeholder="0"
            placeholderTextColor={T.colors.textMuted}
            keyboardType="numeric"
            value={data.total_members}
            onChangeText={(val) => handleNumericChange('total_members', val)}
          />
          {errors?.total_members ? <Text style={styles.errorText}>{errors.total_members}</Text> : null}
        </View>

        <View style={[styles.fieldGroup, { flex: 1 }]}>
          <Text style={styles.label}>Male</Text>
          <TextInput
            style={[styles.input, errors?.male_members && styles.inputError]}
            placeholder="0"
            placeholderTextColor={T.colors.textMuted}
            keyboardType="numeric"
            value={data.male_members}
            onChangeText={(val) => handleNumericChange('male_members', val)}
          />
          {errors?.male_members ? <Text style={styles.errorText}>{errors.male_members}</Text> : null}
        </View>
      </View>

      <View style={styles.rowGrid}>
        <View style={[styles.fieldGroup, { flex: 1 }]}>
          <Text style={styles.label}>Female</Text>
          <TextInput
            style={[styles.input, errors?.female_members && styles.inputError]}
            placeholder="0"
            placeholderTextColor={T.colors.textMuted}
            keyboardType="numeric"
            value={data.female_members}
            onChangeText={(val) => handleNumericChange('female_members', val)}
          />
          {errors?.female_members ? <Text style={styles.errorText}>{errors.female_members}</Text> : null}
        </View>

        <View style={[styles.fieldGroup, { flex: 1 }]}>
          <Text style={styles.label}>Children (&lt;18)</Text>
          <TextInput
            style={[styles.input, errors?.children_count && styles.inputError]}
            placeholder="0"
            placeholderTextColor={T.colors.textMuted}
            keyboardType="numeric"
            value={data.children_count}
            onChangeText={(val) => handleNumericChange('children_count', val)}
          />
          {errors?.children_count ? <Text style={styles.errorText}>{errors.children_count}</Text> : null}
        </View>
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Seniors (65+)</Text>
        <TextInput
          style={[styles.input, errors?.senior_count && styles.inputError, { width: '50%' }]}
          placeholder="0"
          placeholderTextColor={T.colors.textMuted}
          keyboardType="numeric"
          value={data.senior_count}
          onChangeText={(val) => handleNumericChange('senior_count', val)}
        />
        {errors?.senior_count ? <Text style={styles.errorText}>{errors.senior_count}</Text> : null}
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
});
