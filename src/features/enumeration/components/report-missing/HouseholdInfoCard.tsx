import React from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ENUMERATOR_THEME } from '../../theme';

interface HouseholdInfoCardProps {
  householdId?: string;
  headName?: string;
  mobile?: string;
  estimatedMembers?: string;
  address?: string;
  onChangeHouseholdId: (text: string) => void;
  onChangeHeadName: (text: string) => void;
  onChangeMobile: (text: string) => void;
  onChangeEstimatedMembers: (text: string) => void;
  onChangeAddress: (text: string) => void;
}

export const HouseholdInfoCard: React.FC<HouseholdInfoCardProps> = ({
  householdId = '',
  headName = '',
  mobile = '',
  estimatedMembers = '',
  address = '',
  onChangeHouseholdId,
  onChangeHeadName,
  onChangeMobile,
  onChangeEstimatedMembers,
  onChangeAddress,
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <MaterialCommunityIcons name="home-search-outline" size={20} color={ENUMERATOR_THEME.colors.accent} />
        <Text style={styles.cardTitle}>2. Household Information (Optional / If Known)</Text>
      </View>

      <View style={styles.gridRow}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Household ID (if known)</Text>
          <TextInput
            style={styles.input}
            value={householdId}
            onChangeText={onChangeHouseholdId}
            placeholder="e.g. LV-UP-000135"
            placeholderTextColor={ENUMERATOR_THEME.colors.textMuted}
            autoCapitalize="characters"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Head of Household (if known)</Text>
          <TextInput
            style={styles.input}
            value={headName}
            onChangeText={onChangeHeadName}
            placeholder="e.g. Rajesh Kumar"
            placeholderTextColor={ENUMERATOR_THEME.colors.textMuted}
          />
        </View>
      </View>

      <View style={styles.gridRow}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Mobile Number (if known)</Text>
          <TextInput
            style={styles.input}
            value={mobile}
            onChangeText={onChangeMobile}
            keyboardType="phone-pad"
            maxLength={10}
            placeholder="10-digit mobile number"
            placeholderTextColor={ENUMERATOR_THEME.colors.textMuted}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Estimated Family Members</Text>
          <TextInput
            style={styles.input}
            value={estimatedMembers}
            onChangeText={onChangeEstimatedMembers}
            keyboardType="number-pad"
            maxLength={2}
            placeholder="e.g. 4"
            placeholderTextColor={ENUMERATOR_THEME.colors.textMuted}
          />
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Address / Field Landmark Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={address}
          onChangeText={onChangeAddress}
          multiline
          numberOfLines={2}
          placeholder="e.g. House 45, Opp. Primary School, Shiv Nagar West"
          placeholderTextColor={ENUMERATOR_THEME.colors.textMuted}
        />
      </View>
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
  gridRow: {
    flexDirection: 'row',
    gap: 10,
  },
  inputGroup: {
    flex: 1,
    gap: 4,
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
  textArea: {
    height: 52,
    textAlignVertical: 'top',
  },
});
