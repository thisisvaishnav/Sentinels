import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { ENUMERATOR_THEME } from '../../theme';
import { ZoneAreaItem } from '../../types';

interface Props {
  areas: ZoneAreaItem[];
  onViewPendingPress: (areaName: string) => void;
}

export function RecommendedActionCard({ areas, onViewPendingPress }: Props) {
  if (!areas || areas.length === 0) return null;

  const lowestArea = [...areas].reduce((lowest, current) => {
    const lowestCov = lowest.totalHouseholds > 0 ? (lowest.completedHouseholds / lowest.totalHouseholds) * 100 : 0;
    const currentCov = current.totalHouseholds > 0 ? (current.completedHouseholds / current.totalHouseholds) * 100 : 0;
    return currentCov < lowestCov ? current : lowest;
  }, areas[0]);

  const coveragePercent = lowestArea.totalHouseholds > 0
    ? Math.round((lowestArea.completedHouseholds / lowestArea.totalHouseholds) * 100)
    : 0;
  const unvisitedCount = Math.max(0, lowestArea.totalHouseholds - lowestArea.completedHouseholds);

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.badgeWrap}>
          <MaterialCommunityIcons name="compass-outline" size={18} color={ENUMERATOR_THEME.colors.accent} />
          <Text style={styles.badgeText}>RECOMMENDED NEXT ACTION</Text>
        </View>
      </View>

      <Text style={styles.actionTitle}>Focus Field Visit on {lowestArea.name}</Text>

      <Text style={styles.actionDesc}>
        {unvisitedCount} households remain unvisited in {lowestArea.name}, which currently has the lowest zone coverage ({coveragePercent}%).
      </Text>

      <TouchableOpacity
        style={styles.actionBtn}
        onPress={() => onViewPendingPress(lowestArea.name)}
        activeOpacity={0.8}
      >
        <Ionicons name="filter-outline" size={16} color={ENUMERATOR_THEME.colors.textWhite} />
        <Text style={styles.actionBtnText}>View Pending Households in {lowestArea.name}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: ENUMERATOR_THEME.colors.accentSubtle,
    borderRadius: ENUMERATOR_THEME.borderRadius.xl,
    padding: 16,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.accent,
    gap: 10,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badgeWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: ENUMERATOR_THEME.colors.accent,
    letterSpacing: 0.8,
  },
  actionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  actionDesc: {
    fontSize: 12,
    color: ENUMERATOR_THEME.colors.textSecondary,
    lineHeight: 17,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: ENUMERATOR_THEME.colors.accent,
    height: 42,
    borderRadius: ENUMERATOR_THEME.borderRadius.lg,
    gap: 6,
    marginTop: 2,
  },
  actionBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.textWhite,
  },
});
