import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ENUMERATOR_THEME } from '../../theme';
import { HouseholdNeed } from '../../types';

interface Props {
  selectedNeeds: HouseholdNeed[];
  onChange: (needs: HouseholdNeed[]) => void;
}

const NEED_OPTIONS: { label: HouseholdNeed; icon: string }[] = [
  { label: 'Health Assistance', icon: 'medical-bag' },
  { label: 'Education Assistance', icon: 'school-outline' },
  { label: 'Financial Assistance', icon: 'cash-multiple' },
  { label: 'Housing', icon: 'home-heart' },
  { label: 'Employment', icon: 'briefcase-outline' },
  { label: 'Food / Ration', icon: 'food-apple-outline' },
  { label: 'Disability Support', icon: 'human-wheelchair' },
  { label: 'Other', icon: 'dots-horizontal-circle-outline' },
  { label: 'No Current Requirement', icon: 'close-circle-outline' },
];

export function HouseholdNeedsSection({ selectedNeeds, onChange }: Props) {
  const handleToggle = (need: HouseholdNeed) => {
    if (need === 'No Current Requirement') {
      // Mutually exclusive: selecting No Current Requirement clears all other options
      if (selectedNeeds.includes('No Current Requirement')) {
        onChange([]);
      } else {
        onChange(['No Current Requirement']);
      }
    } else {
      // Selecting any specific requirement removes 'No Current Requirement'
      let updated = selectedNeeds.filter((item) => item !== 'No Current Requirement');

      if (updated.includes(need)) {
        updated = updated.filter((item) => item !== need);
      } else {
        updated.push(need);
      }
      onChange(updated);
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardHeaderRow}>
        <MaterialCommunityIcons name="heart-flash" size={22} color={ENUMERATOR_THEME.colors.accent} />
        <Text style={styles.cardTitle}>Household Needs</Text>
      </View>

      <Text style={styles.subtitle}>Select all requirements applicable to this household:</Text>

      <View style={styles.chipsWrap}>
        {NEED_OPTIONS.map((item) => {
          const isSelected = selectedNeeds.includes(item.label);
          const isNoNeed = item.label === 'No Current Requirement';

          return (
            <TouchableOpacity
              key={item.label}
              style={[
                styles.chip,
                isSelected && (isNoNeed ? styles.chipNoNeedActive : styles.chipActive),
              ]}
              onPress={() => handleToggle(item.label)}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons
                name={item.icon as any}
                size={16}
                color={
                  isSelected
                    ? isNoNeed
                      ? ENUMERATOR_THEME.colors.textSecondary
                      : ENUMERATOR_THEME.colors.accent
                    : ENUMERATOR_THEME.colors.textMuted
                }
              />
              <Text
                style={[
                  styles.chipText,
                  isSelected && (isNoNeed ? styles.chipTextNoNeedActive : styles.chipTextActive),
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
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
    gap: 12,
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
  subtitle: {
    fontSize: 12,
    color: ENUMERATOR_THEME.colors.textSecondary,
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: ENUMERATOR_THEME.borderRadius.md,
    backgroundColor: ENUMERATOR_THEME.colors.inputBackground,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.borderSubtle,
    gap: 6,
  },
  chipActive: {
    backgroundColor: ENUMERATOR_THEME.colors.accentSubtle,
    borderColor: ENUMERATOR_THEME.colors.accent,
  },
  chipNoNeedActive: {
    backgroundColor: ENUMERATOR_THEME.colors.subtleBackground,
    borderColor: ENUMERATOR_THEME.colors.border,
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
  chipTextNoNeedActive: {
    color: ENUMERATOR_THEME.colors.textPrimary,
    fontWeight: '700',
  },
});
