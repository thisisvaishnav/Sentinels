import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { MissingReason } from '../../types/missingReportTypes';
import { ENUMERATOR_THEME } from '../../theme';

interface MissingReasonCardProps {
  selectedReason: MissingReason;
  otherReasonText?: string;
  onSelectReason: (reason: MissingReason) => void;
  onChangeOtherReasonText: (text: string) => void;
}

export const REASON_OPTIONS: { label: MissingReason; icon: keyof typeof MaterialCommunityIcons.glyphMap }[] = [
  { label: 'Household not found', icon: 'file-search-outline' },
  { label: 'House locked', icon: 'lock-outline' },
  { label: 'Family temporarily away', icon: 'account-clock-outline' },
  { label: 'Address mismatch', icon: 'map-marker-off-outline' },
  { label: 'GPS/location mismatch', icon: 'crosshairs-gps' },
  { label: 'Household relocated', icon: 'truck-delivery-outline' },
  { label: 'Duplicate/incorrect household record', icon: 'content-copy' },
  { label: 'Refused verification', icon: 'close-circle-outline' },
  { label: 'Other', icon: 'square-edit-outline' },
];

export const MissingReasonCard: React.FC<MissingReasonCardProps> = ({
  selectedReason,
  otherReasonText = '',
  onSelectReason,
  onChangeOtherReasonText,
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <MaterialCommunityIcons name="alert-circle-outline" size={20} color={ENUMERATOR_THEME.colors.accent} />
        <Text style={styles.cardTitle}>3. Missing / Non-Enumeration Reason *</Text>
      </View>

      <View style={styles.optionsGrid}>
        {REASON_OPTIONS.map((item) => {
          const isSelected = selectedReason === item.label;
          return (
            <TouchableOpacity
              key={item.label}
              style={[styles.chip, isSelected && styles.chipSelected]}
              onPress={() => onSelectReason(item.label)}
              activeOpacity={0.8}
            >
              <MaterialCommunityIcons
                name={item.icon}
                size={16}
                color={isSelected ? ENUMERATOR_THEME.colors.textWhite : ENUMERATOR_THEME.colors.textSecondary}
              />
              <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {selectedReason === 'Other' && (
        <View style={styles.otherGroup}>
          <Text style={styles.label}>Specify Other Reason *</Text>
          <TextInput
            style={styles.input}
            value={otherReasonText}
            onChangeText={onChangeOtherReasonText}
            placeholder="Please detail the reason..."
            placeholderTextColor={ENUMERATOR_THEME.colors.textMuted}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: ENUMERATOR_THEME.colors.cardBackground,
    borderRadius: ENUMERATOR_THEME.borderRadius.lg,
    padding: 14,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
    gap: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ENUMERATOR_THEME.colors.background,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: ENUMERATOR_THEME.borderRadius.md,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
    gap: 6,
  },
  chipSelected: {
    backgroundColor: ENUMERATOR_THEME.colors.accent,
    borderColor: ENUMERATOR_THEME.colors.accent,
  },
  chipText: {
    fontSize: 11,
    fontWeight: '600',
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  chipTextSelected: {
    color: ENUMERATOR_THEME.colors.textWhite,
    fontWeight: '700',
  },
  otherGroup: {
    gap: 4,
    marginTop: 4,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.textSecondary,
  },
  input: {
    backgroundColor: ENUMERATOR_THEME.colors.background,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
    borderRadius: ENUMERATOR_THEME.borderRadius.md,
    paddingHorizontal: 10,
    paddingVertical: 7,
    fontSize: 12,
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
});
