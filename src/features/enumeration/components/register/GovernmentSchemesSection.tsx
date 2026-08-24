import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ENUMERATOR_THEME } from '../../theme';
import { SchemeCategory, SchemeChoice, SchemeItem } from '../../types';

import { VoiceInputButton } from '../voice/VoiceInputButton';

interface Props {
  schemeItems: SchemeItem[];
  onChange: (updatedItems: SchemeItem[]) => void;
}

const SCHEME_CATEGORIES: SchemeCategory[] = [
  'Food / Ration',
  'Housing',
  'Health',
  'Education',
  'Employment',
  'Financial Assistance',
];

const CHOICE_OPTIONS: SchemeChoice[] = ['Receiving', 'Not Receiving', 'Unknown'];

export function GovernmentSchemesSection({ schemeItems, onChange }: Props) {
  const getItemForCategory = (cat: SchemeCategory): SchemeItem => {
    return (
      schemeItems.find((item) => item.category === cat) || {
        category: cat,
        choice: 'Not Receiving',
      }
    );
  };

  const handleChoiceChange = (category: SchemeCategory, choice: SchemeChoice) => {
    const existingIndex = schemeItems.findIndex((item) => item.category === category);
    const updated = [...schemeItems];

    if (existingIndex >= 0) {
      updated[existingIndex] = { ...updated[existingIndex], choice };
    } else {
      updated.push({ category, choice });
    }
    onChange(updated);
  };

  const handleSchemeNameChange = (category: SchemeCategory, schemeName: string) => {
    const existingIndex = schemeItems.findIndex((item) => item.category === category);
    const updated = [...schemeItems];

    if (existingIndex >= 0) {
      updated[existingIndex] = { ...updated[existingIndex], schemeName };
    } else {
      updated.push({ category, choice: 'Receiving', schemeName });
    }
    onChange(updated);
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardHeaderRow}>
        <MaterialCommunityIcons name="file-certificate-outline" size={22} color={ENUMERATOR_THEME.colors.accent} />
        <Text style={styles.cardTitle}>Government Scheme Status</Text>
      </View>

      <Text style={styles.subtitle}>Record social welfare & scheme benefit status:</Text>

      <View style={styles.categoriesList}>
        {SCHEME_CATEGORIES.map((category) => {
          const item = getItemForCategory(category);
          const isReceiving = item.choice === 'Receiving';

          return (
            <View key={category} style={styles.categoryCard}>
              <View style={styles.categoryHeader}>
                <Text style={styles.categoryTitle}>{category}</Text>
                <View style={styles.choicesWrap}>
                  {CHOICE_OPTIONS.map((ch) => {
                    const isActive = item.choice === ch;
                    return (
                      <TouchableOpacity
                        key={ch}
                        style={[
                          styles.choiceChip,
                          isActive &&
                            (ch === 'Receiving'
                              ? styles.choiceChipReceiving
                              : ch === 'Not Receiving'
                              ? styles.choiceChipNotReceiving
                              : styles.choiceChipActive),
                        ]}
                        onPress={() => handleChoiceChange(category, ch)}
                        activeOpacity={0.7}
                      >
                        <Text
                          style={[
                            styles.choiceChipText,
                            isActive &&
                              (ch === 'Receiving'
                                ? styles.choiceTextReceiving
                                : ch === 'Not Receiving'
                                ? styles.choiceTextNotReceiving
                                : styles.choiceChipTextActive),
                          ]}
                        >
                          {ch}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {isReceiving && (
                <View style={styles.schemeNameWrap}>
                  <Text style={styles.inputLabel}>Scheme Name (Optional)</Text>
                  <View style={styles.inputWithVoiceRow}>
                    <TextInput
                      style={[styles.input, styles.flexInput]}
                      placeholder="e.g. PM Awas Yojana / Ayushman Bharat"
                      placeholderTextColor={ENUMERATOR_THEME.colors.textMuted}
                      value={item.schemeName || ''}
                      onChangeText={(val) => handleSchemeNameChange(category, val)}
                    />
                    <VoiceInputButton
                      currentValue={item.schemeName || ''}
                      onResult={(val) => handleSchemeNameChange(category, val)}
                      fieldLabel="Scheme Name"
                      size="sm"
                    />
                  </View>
                </View>
              )}
            </View>
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
  categoriesList: {
    gap: 10,
  },
  categoryCard: {
    backgroundColor: ENUMERATOR_THEME.colors.subtleBackground,
    borderRadius: ENUMERATOR_THEME.borderRadius.md,
    padding: 12,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
    gap: 10,
  },
  categoryHeader: {
    gap: 8,
  },
  categoryTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  choicesWrap: {
    flexDirection: 'row',
    gap: 6,
  },
  choiceChip: {
    flex: 1,
    paddingVertical: 6,
    borderRadius: ENUMERATOR_THEME.borderRadius.sm,
    backgroundColor: ENUMERATOR_THEME.colors.inputBackground,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.borderSubtle,
    alignItems: 'center',
  },
  choiceChipActive: {
    backgroundColor: ENUMERATOR_THEME.colors.accentSubtle,
    borderColor: ENUMERATOR_THEME.colors.accent,
  },
  choiceChipReceiving: {
    backgroundColor: ENUMERATOR_THEME.colors.successBg,
    borderColor: ENUMERATOR_THEME.colors.successBorder,
  },
  choiceChipNotReceiving: {
    backgroundColor: ENUMERATOR_THEME.colors.subtleBackground,
    borderColor: ENUMERATOR_THEME.colors.border,
  },
  choiceChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: ENUMERATOR_THEME.colors.textMuted,
  },
  choiceChipTextActive: {
    color: ENUMERATOR_THEME.colors.accent,
    fontWeight: '700',
  },
  choiceTextReceiving: {
    color: ENUMERATOR_THEME.colors.successText,
    fontWeight: '700',
  },
  choiceTextNotReceiving: {
    color: ENUMERATOR_THEME.colors.textSecondary,
    fontWeight: '600',
  },
  schemeNameWrap: {
    gap: 4,
    marginTop: 2,
  },
  inputWithVoiceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  flexInput: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: ENUMERATOR_THEME.colors.textSecondary,
  },
  input: {
    backgroundColor: ENUMERATOR_THEME.colors.inputBackground,
    borderRadius: ENUMERATOR_THEME.borderRadius.sm,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.borderSubtle,
    color: ENUMERATOR_THEME.colors.textPrimary,
    paddingHorizontal: 10,
    height: 38,
    fontSize: 12,
  },
});
