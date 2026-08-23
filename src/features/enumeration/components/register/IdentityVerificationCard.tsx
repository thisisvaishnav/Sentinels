import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ENUMERATOR_THEME } from '../../theme';
import { IdentityType, IdentityVerification, VerificationStatus } from '../../types';

interface Props {
  data: IdentityVerification;
  onChange: (updated: Partial<IdentityVerification>) => void;
}

const ID_TYPES: IdentityType[] = ['Aadhaar', 'Voter ID', 'Other', 'Not Available'];
const STATUS_OPTIONS: VerificationStatus[] = ['Not Verified', 'Verified', 'Requires Review'];

export function IdentityVerificationCard({ data, onChange }: Props) {
  const handleLast4Change = (val: string) => {
    const cleaned = val.replace(/[^0-9]/g, '').slice(0, 4);
    onChange({ last4Digits: cleaned });
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardHeaderRow}>
        <MaterialCommunityIcons name="shield-account-outline" size={22} color={ENUMERATOR_THEME.colors.accent} />
        <View style={styles.titleWrap}>
          <Text style={styles.cardTitle}>Identity Verification</Text>
          <Text style={styles.optionalBadge}>Optional</Text>
        </View>
      </View>

      {/* ID Type Selector */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>ID Document Type</Text>
        <View style={styles.chipsWrap}>
          {ID_TYPES.map((type) => {
            const isActive = data.idType === type;
            return (
              <TouchableOpacity
                key={type}
                style={[styles.chip, isActive && styles.chipActive]}
                onPress={() => onChange({ idType: type })}
                activeOpacity={0.7}
              >
                <Text style={[styles.chipText, isActive && styles.chipTextActive]}>{type}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Last 4 Digits & Verification Status Row */}
      {data.idType !== 'Not Available' && (
        <View style={styles.rowGrid}>
          <View style={[styles.fieldGroup, { flex: 1 }]}>
            <Text style={styles.label}>Last 4 Digits</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 8842"
              placeholderTextColor={ENUMERATOR_THEME.colors.textMuted}
              keyboardType="numeric"
              maxLength={4}
              value={data.last4Digits}
              onChangeText={handleLast4Change}
            />
          </View>

          <View style={[styles.fieldGroup, { flex: 1.3 }]}>
            <Text style={styles.label}>Status</Text>
            <View style={styles.statusChipsWrap}>
              {STATUS_OPTIONS.map((st) => {
                const isActive = data.status === st;
                return (
                  <TouchableOpacity
                    key={st}
                    style={[styles.statusChip, isActive && styles.statusChipActive]}
                    onPress={() => onChange({ status: st })}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.statusChipText, isActive && styles.statusChipTextActive]}>{st}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>
      )}

      {/* Privacy Notice Banner */}
      <View style={styles.privacyBox}>
        <MaterialCommunityIcons name="lock-outline" size={16} color={ENUMERATOR_THEME.colors.textSecondary} />
        <Text style={styles.privacyText}>
          Identity verification is optional. Only the last 4 digits are recorded.
        </Text>
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
  titleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  optionalBadge: {
    fontSize: 11,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.accent,
    backgroundColor: ENUMERATOR_THEME.colors.accentSubtle,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: ENUMERATOR_THEME.borderRadius.sm,
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
  rowGrid: {
    flexDirection: 'row',
    gap: 10,
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
  statusChipsWrap: {
    flexDirection: 'column',
    gap: 6,
  },
  statusChip: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: ENUMERATOR_THEME.borderRadius.sm,
    backgroundColor: ENUMERATOR_THEME.colors.inputBackground,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.borderSubtle,
    alignItems: 'center',
  },
  statusChipActive: {
    backgroundColor: ENUMERATOR_THEME.colors.accentSubtle,
    borderColor: ENUMERATOR_THEME.colors.accent,
  },
  statusChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: ENUMERATOR_THEME.colors.textMuted,
  },
  statusChipTextActive: {
    color: ENUMERATOR_THEME.colors.accent,
    fontWeight: '700',
  },
  privacyBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ENUMERATOR_THEME.colors.subtleBackground,
    padding: 10,
    borderRadius: ENUMERATOR_THEME.borderRadius.md,
    gap: 8,
  },
  privacyText: {
    flex: 1,
    fontSize: 11,
    color: ENUMERATOR_THEME.colors.textSecondary,
    lineHeight: 15,
  },
});
