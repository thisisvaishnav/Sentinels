import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ENUMERATOR_THEME } from '../../theme';
import { HouseholdProfile, HouseType, Ownership } from '../../types';

import { VoiceInputButton } from '../voice/VoiceInputButton';

interface Props {
  data: HouseholdProfile;
  onChange: (updated: Partial<HouseholdProfile>) => void;
  errors?: Record<string, string>;
}

const HOUSE_TYPES: HouseType[] = ['Permanent', 'Semi-Permanent', 'Temporary'];
const OWNERSHIP_OPTIONS: Ownership[] = ['Owned', 'Rented', 'Other'];

export function HouseholdProfileCard({ data, onChange, errors }: Props) {
  const handlePinChange = (val: string) => {
    const cleaned = val.replace(/[^0-9]/g, '').slice(0, 6);
    onChange({ pinCode: cleaned });
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardHeaderRow}>
        <MaterialCommunityIcons name="home-city-outline" size={22} color={ENUMERATOR_THEME.colors.accent} />
        <Text style={styles.cardTitle}>Household Profile & Address</Text>
      </View>

      {/* Auto-Calculated Member Count Display */}
      <View style={styles.countBanner}>
        <MaterialCommunityIcons name="account-group-outline" size={18} color={ENUMERATOR_THEME.colors.accent} />
        <Text style={styles.countText}>
          Total Family Members: <Text style={styles.countHighlight}>{data.familyMemberCount}</Text> (Head + {Math.max(0, data.familyMemberCount - 1)} members)
        </Text>
      </View>

      {/* Full Address */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>House No & Street Address *</Text>
        <View style={styles.inputWithVoiceRow}>
          <TextInput
            style={[styles.input, styles.multilineInput, styles.flexInput, errors?.fullAddress && styles.inputError]}
            placeholder="House/Plot No, Street, Landmark"
            placeholderTextColor={ENUMERATOR_THEME.colors.textMuted}
            multiline
            numberOfLines={2}
            value={data.fullAddress}
            onChangeText={(val) => onChange({ fullAddress: val })}
          />
          <VoiceInputButton
            currentValue={data.fullAddress}
            onResult={(val) => onChange({ fullAddress: val })}
            fieldLabel="Street Address"
          />
        </View>
        {errors?.fullAddress ? <Text style={styles.errorText}>{errors.fullAddress}</Text> : null}
      </View>

      {/* State & District Row */}
      <View style={styles.rowGrid}>
        <View style={[styles.fieldGroup, { flex: 1 }]}>
          <Text style={styles.label}>State *</Text>
          <View style={[styles.selectBox, errors?.state && styles.inputError]}>
            <Text style={styles.selectText}>{data.state || 'Uttar Pradesh'}</Text>
          </View>
          {errors?.state ? <Text style={styles.errorText}>{errors.state}</Text> : null}
        </View>

        <View style={[styles.fieldGroup, { flex: 1 }]}>
          <Text style={styles.label}>District *</Text>
          <View style={[styles.selectBox, errors?.district && styles.inputError]}>
            <Text style={styles.selectText}>{data.district || 'Ghaziabad'}</Text>
          </View>
          {errors?.district ? <Text style={styles.errorText}>{errors.district}</Text> : null}
        </View>
      </View>

      {/* Locality & Ward */}
      <View style={styles.rowGrid}>
        <View style={[styles.fieldGroup, { flex: 1 }]}>
          <Text style={styles.label}>Locality</Text>
          <View style={styles.inputWithVoiceRow}>
            <TextInput
              style={[styles.input, styles.flexInput]}
              placeholder="Shastri Nagar"
              placeholderTextColor={ENUMERATOR_THEME.colors.textMuted}
              value={data.locality}
              onChangeText={(val) => onChange({ locality: val })}
            />
            <VoiceInputButton
              currentValue={data.locality}
              onResult={(val) => onChange({ locality: val })}
              fieldLabel="Locality"
              size="sm"
            />
          </View>
        </View>

        <View style={[styles.fieldGroup, { flex: 1 }]}>
          <Text style={styles.label}>Ward / Sub-Area</Text>
          <View style={styles.inputWithVoiceRow}>
            <TextInput
              style={[styles.input, styles.flexInput]}
              placeholder="Ward 12"
              placeholderTextColor={ENUMERATOR_THEME.colors.textMuted}
              value={data.ward}
              onChangeText={(val) => onChange({ ward: val })}
            />
            <VoiceInputButton
              currentValue={data.ward}
              onResult={(val) => onChange({ ward: val })}
              fieldLabel="Ward"
              size="sm"
            />
          </View>
        </View>
      </View>

      {/* PIN Code */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>PIN Code (6 Digits)</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. 201002"
          placeholderTextColor={ENUMERATOR_THEME.colors.textMuted}
          keyboardType="numeric"
          maxLength={6}
          value={data.pinCode}
          onChangeText={handlePinChange}
        />
      </View>

      {/* House Type */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>House Type</Text>
        <View style={styles.chipsWrap}>
          {HOUSE_TYPES.map((type) => {
            const isActive = data.houseType === type;
            return (
              <TouchableOpacity
                key={type}
                style={[styles.chip, isActive && styles.chipActive]}
                onPress={() => onChange({ houseType: type })}
                activeOpacity={0.7}
              >
                <Text style={[styles.chipText, isActive && styles.chipTextActive]}>{type}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Ownership */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Ownership</Text>
        <View style={styles.chipsWrap}>
          {OWNERSHIP_OPTIONS.map((own) => {
            const isActive = data.ownership === own;
            return (
              <TouchableOpacity
                key={own}
                style={[styles.chip, isActive && styles.chipActive]}
                onPress={() => onChange({ ownership: own })}
                activeOpacity={0.7}
              >
                <Text style={[styles.chipText, isActive && styles.chipTextActive]}>{own}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
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
  inputWithVoiceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  flexInput: {
    flex: 1,
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
  countBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ENUMERATOR_THEME.colors.accentSubtle,
    borderRadius: ENUMERATOR_THEME.borderRadius.md,
    padding: 10,
    gap: 8,
  },
  countText: {
    fontSize: 12,
    fontWeight: '600',
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  countHighlight: {
    fontWeight: '800',
    color: ENUMERATOR_THEME.colors.accent,
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
    height: 60,
    paddingVertical: 10,
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
