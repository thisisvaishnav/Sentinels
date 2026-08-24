import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ENUMERATOR_THEME } from '@/src/features/enumeration/theme';

interface HouseholdSummaryCardProps {
  name: string;
  members: number;
  address: string;
  isVerified: boolean;
  onViewDetails?: () => void;
}

export default function HouseholdSummaryCard({
  name,
  members,
  address,
  isVerified,
  onViewDetails,
}: HouseholdSummaryCardProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onViewDetails} activeOpacity={0.85}>
      <View style={styles.headerRow}>
        <View style={styles.iconWrap}>
          <Ionicons name="home" size={20} color={ENUMERATOR_THEME.colors.accent} />
        </View>
        <View style={styles.headerText}>
          <Text style={styles.sectionTitle}>My Household</Text>
          <Text style={styles.householdName}>{name}</Text>
        </View>
        <View style={[styles.badge, isVerified && styles.badgeVerified]}>
          <Ionicons
            name={isVerified ? 'checkmark-circle' : 'time-outline'}
            size={12}
            color={ENUMERATOR_THEME.colors.textWhite}
          />
          <Text style={styles.badgeText}>{isVerified ? 'Verified' : 'Pending'}</Text>
        </View>
      </View>

      <View style={styles.infoRow}>
        <Ionicons name="people-outline" size={14} color={ENUMERATOR_THEME.colors.textMuted} />
        <Text style={styles.infoText}>{members} members</Text>
      </View>

      <View style={styles.infoRow}>
        <Ionicons name="location-outline" size={14} color={ENUMERATOR_THEME.colors.textMuted} />
        <Text style={styles.infoText}>{address}</Text>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.viewButton} onPress={onViewDetails} activeOpacity={0.8}>
          <Text style={styles.viewButtonText}>View Details</Text>
          <Ionicons name="chevron-forward" size={16} color={ENUMERATOR_THEME.colors.textWhite} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: ENUMERATOR_THEME.colors.cardBackground,
    borderRadius: ENUMERATOR_THEME.borderRadius.xl,
    padding: 18,
    gap: 12,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: ENUMERATOR_THEME.borderRadius.md,
    backgroundColor: ENUMERATOR_THEME.colors.accentSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 12,
    color: ENUMERATOR_THEME.colors.textMuted,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  householdName: {
    fontSize: 17,
    fontWeight: '800',
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ENUMERATOR_THEME.colors.warning,
    borderRadius: ENUMERATOR_THEME.borderRadius.full,
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 4,
  },
  badgeVerified: {
    backgroundColor: ENUMERATOR_THEME.colors.success,
  },
  badgeText: {
    color: ENUMERATOR_THEME.colors.textWhite,
    fontSize: 11,
    fontWeight: '700',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoText: {
    fontSize: 13,
    color: ENUMERATOR_THEME.colors.textSecondary,
    flex: 1,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ENUMERATOR_THEME.colors.accent,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: ENUMERATOR_THEME.borderRadius.md,
    gap: 6,
  },
  viewButtonText: {
    color: ENUMERATOR_THEME.colors.textWhite,
    fontSize: 13,
    fontWeight: '700',
  },
});
