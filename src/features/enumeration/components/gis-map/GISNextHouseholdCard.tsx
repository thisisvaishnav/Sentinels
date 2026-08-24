import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ZoneHouseholdItem } from '../../types';
import { ENUMERATOR_THEME } from '../../theme';

interface GISNextHouseholdCardProps {
  household: ZoneHouseholdItem | null;
  onOpenHousehold: (item: ZoneHouseholdItem) => void;
}

export const GISNextHouseholdCard: React.FC<GISNextHouseholdCardProps> = ({
  household,
  onOpenHousehold,
}) => {
  const router = useRouter();
  if (!household) {
    return (
      <View style={styles.card}>
        <Text style={styles.emptyText}>All households in this zone are completed!</Text>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <MaterialCommunityIcons name="target" size={20} color={ENUMERATOR_THEME.colors.accent} />
        <Text style={styles.cardTitle}>Next Recommended Household</Text>
        {household.priority === 'High' && (
          <View style={styles.priorityBadge}>
            <Text style={styles.priorityBadgeText}>High Priority</Text>
          </View>
        )}
      </View>

      <View style={styles.householdInfo}>
        <View style={styles.infoRow}>
          <Text style={styles.idText}>{household.householdId}</Text>
          <Text style={styles.statusBadgeText}>{household.status}</Text>
        </View>

        <Text style={styles.headName}>{household.headName}</Text>

        <View style={styles.locationGroup}>
          <Ionicons name="location-outline" size={14} color={ENUMERATOR_THEME.colors.textMuted} />
          <Text style={styles.localityText}>
            {household.locality} · {household.members} members
          </Text>
        </View>
      </View>

      <View style={styles.actionRow}>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => onOpenHousehold(household)}
          activeOpacity={0.8}
        >
          <Ionicons name="open-outline" size={16} color={ENUMERATOR_THEME.colors.textWhite} />
          <Text style={styles.actionBtnText}>Open Household</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.planRouteBtn}
          onPress={() => router.push('/(enumerator)/route-planning')}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons name="routes" size={16} color={ENUMERATOR_THEME.colors.accent} />
          <Text style={styles.planRouteBtnText}>Plan Route</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: ENUMERATOR_THEME.colors.cardBackground,
    borderRadius: ENUMERATOR_THEME.borderRadius.xl,
    padding: 14,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
    gap: 10,
  },
  emptyText: {
    fontSize: 13,
    color: ENUMERATOR_THEME.colors.success,
    fontWeight: '600',
    textAlign: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.textPrimary,
    flex: 1,
  },
  priorityBadge: {
    backgroundColor: ENUMERATOR_THEME.colors.dangerBg,
    borderColor: ENUMERATOR_THEME.colors.dangerBorder,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: ENUMERATOR_THEME.borderRadius.full,
  },
  priorityBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.dangerText,
  },
  householdInfo: {
    backgroundColor: ENUMERATOR_THEME.colors.subtleBackground,
    padding: 10,
    borderRadius: ENUMERATOR_THEME.borderRadius.lg,
    gap: 4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  idText: {
    fontSize: 12,
    fontWeight: '800',
    color: ENUMERATOR_THEME.colors.accent,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.warningText,
  },
  headName: {
    fontSize: 15,
    fontWeight: '800',
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  locationGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  localityText: {
    fontSize: 12,
    color: ENUMERATOR_THEME.colors.textMuted,
    fontWeight: '500',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: ENUMERATOR_THEME.colors.accent,
    paddingVertical: 10,
    borderRadius: ENUMERATOR_THEME.borderRadius.md,
    gap: 6,
  },
  actionBtnText: {
    color: ENUMERATOR_THEME.colors.textWhite,
    fontSize: 13,
    fontWeight: '700',
  },
  planRouteBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: ENUMERATOR_THEME.colors.accentSubtle,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.accentLight,
    paddingVertical: 10,
    borderRadius: ENUMERATOR_THEME.borderRadius.md,
    gap: 6,
  },
  planRouteBtnText: {
    color: ENUMERATOR_THEME.colors.accent,
    fontSize: 13,
    fontWeight: '700',
  },
});
