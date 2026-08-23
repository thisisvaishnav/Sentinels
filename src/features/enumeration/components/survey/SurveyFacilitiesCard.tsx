import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ENUMERATOR_THEME } from '../../theme';
import { BasicFacilitiesData } from '../../types';

interface Props {
  data: BasicFacilitiesData;
  onChange: (updated: Partial<BasicFacilitiesData>) => void;
  errors?: Record<string, string>;
  readOnly?: boolean;
}

const ELECTRICITY_OPTIONS: ('Yes' | 'No')[] = ['Yes', 'No'];
const WATER_OPTIONS: ('Tap Water' | 'Hand Pump' | 'Well' | 'Other')[] = [
  'Tap Water',
  'Hand Pump',
  'Well',
  'Other',
];
const TOILET_OPTIONS: ('Household Toilet' | 'Shared Toilet' | 'No Toilet')[] = [
  'Household Toilet',
  'Shared Toilet',
  'No Toilet',
];
const FUEL_OPTIONS: ('LPG' | 'Electricity' | 'Firewood' | 'Other')[] = [
  'LPG',
  'Electricity',
  'Firewood',
  'Other',
];
const INTERNET_OPTIONS: ('Yes' | 'No')[] = ['Yes', 'No'];

export function SurveyFacilitiesCard({ data, onChange, errors, readOnly = false }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeaderRow}>
        <MaterialCommunityIcons name="lightning-bolt-outline" size={22} color={ENUMERATOR_THEME.colors.accent} />
        <Text style={styles.cardTitle}>Section C: Basic Facilities</Text>
      </View>

      {/* Electricity */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Electricity Connection *</Text>
        <View style={styles.chipsWrap}>
          {ELECTRICITY_OPTIONS.map((opt) => {
            const isActive = data.electricity === opt;
            return (
              <TouchableOpacity
                key={opt}
                disabled={readOnly}
                style={[styles.chip, isActive && styles.chipActive]}
                onPress={() => onChange({ electricity: opt })}
                activeOpacity={0.7}
              >
                <Text style={[styles.chipText, isActive && styles.chipTextActive]}>{opt}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
        {errors?.electricity ? <Text style={styles.errorText}>{errors.electricity}</Text> : null}
      </View>

      {/* Drinking Water Source */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Primary Drinking Water Source *</Text>
        <View style={styles.chipsWrap}>
          {WATER_OPTIONS.map((opt) => {
            const isActive = data.drinkingWater === opt;
            return (
              <TouchableOpacity
                key={opt}
                disabled={readOnly}
                style={[styles.chip, isActive && styles.chipActive]}
                onPress={() => onChange({ drinkingWater: opt })}
                activeOpacity={0.7}
              >
                <Text style={[styles.chipText, isActive && styles.chipTextActive]}>{opt}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
        {errors?.drinkingWater ? <Text style={styles.errorText}>{errors.drinkingWater}</Text> : null}
      </View>

      {/* Toilet Facility */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Sanitation / Toilet Facility *</Text>
        <View style={styles.chipsWrap}>
          {TOILET_OPTIONS.map((opt) => {
            const isActive = data.toilet === opt;
            return (
              <TouchableOpacity
                key={opt}
                disabled={readOnly}
                style={[styles.chip, isActive && styles.chipActive]}
                onPress={() => onChange({ toilet: opt })}
                activeOpacity={0.7}
              >
                <Text style={[styles.chipText, isActive && styles.chipTextActive]}>{opt}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
        {errors?.toilet ? <Text style={styles.errorText}>{errors.toilet}</Text> : null}
      </View>

      {/* Cooking Fuel */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Primary Cooking Fuel *</Text>
        <View style={styles.chipsWrap}>
          {FUEL_OPTIONS.map((opt) => {
            const isActive = data.cookingFuel === opt;
            return (
              <TouchableOpacity
                key={opt}
                disabled={readOnly}
                style={[styles.chip, isActive && styles.chipActive]}
                onPress={() => onChange({ cookingFuel: opt })}
                activeOpacity={0.7}
              >
                <Text style={[styles.chipText, isActive && styles.chipTextActive]}>{opt}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
        {errors?.cookingFuel ? <Text style={styles.errorText}>{errors.cookingFuel}</Text> : null}
      </View>

      {/* Internet Access */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Internet Access *</Text>
        <View style={styles.chipsWrap}>
          {INTERNET_OPTIONS.map((opt) => {
            const isActive = data.internetAccess === opt;
            return (
              <TouchableOpacity
                key={opt}
                disabled={readOnly}
                style={[styles.chip, isActive && styles.chipActive]}
                onPress={() => onChange({ internetAccess: opt })}
                activeOpacity={0.7}
              >
                <Text style={[styles.chipText, isActive && styles.chipTextActive]}>{opt}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
        {errors?.internetAccess ? <Text style={styles.errorText}>{errors.internetAccess}</Text> : null}
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
