import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ENUMERATOR_THEME } from '../../theme';
import { ZoneAreaItem } from '../../types';

interface Props {
  areas: ZoneAreaItem[];
  onAreaSelect?: (areaName: string) => void;
}

export function AreaCoverageList({ areas, onAreaSelect }: Props) {
  // Sort areas by lowest coverage percentage first
  const sortedAreas = [...areas].sort((a, b) => {
    const covA = a.totalHouseholds > 0 ? (a.completedHouseholds / a.totalHouseholds) * 100 : 0;
    const covB = b.totalHouseholds > 0 ? (b.completedHouseholds / b.totalHouseholds) * 100 : 0;
    return covA - covB;
  });

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.titleWrap}>
          <MaterialCommunityIcons name="layers-triple-outline" size={22} color={ENUMERATOR_THEME.colors.accent} />
          <Text style={styles.cardTitle}>Coverage by Area</Text>
        </View>

        <Text style={styles.subtitle}>Lowest coverage first</Text>
      </View>

      <View style={styles.areasList}>
        {sortedAreas.map((area) => {
          const remaining = Math.max(0, area.totalHouseholds - area.completedHouseholds);
          const percent =
            area.totalHouseholds > 0
              ? Math.round((area.completedHouseholds / area.totalHouseholds) * 100)
              : 0;

          const isLow = percent < 45;

          return (
            <TouchableOpacity
              key={area.id}
              style={styles.areaCard}
              onPress={() => onAreaSelect?.(area.name)}
              activeOpacity={0.7}
            >
              <View style={styles.areaTopRow}>
                <View style={styles.nameWrap}>
                  <Text style={styles.areaName}>{area.name}</Text>
                  {isLow && (
                    <View style={styles.lowBadge}>
                      <Text style={styles.lowBadgeText}>Low Coverage</Text>
                    </View>
                  )}
                </View>
                <Text style={[styles.percentVal, isLow && styles.textDanger]}>{percent}%</Text>
              </View>

              <View style={styles.track}>
                <View
                  style={[
                    styles.fill,
                    { width: `${percent}%` },
                    isLow && styles.fillDanger,
                  ]}
                />
              </View>

              <View style={styles.areaBottomRow}>
                <Text style={styles.countDetail}>
                  <Text style={styles.countHighlight}>{area.completedHouseholds}</Text> / {area.totalHouseholds} completed
                </Text>

                <Text style={styles.remainingText}>{remaining} remaining</Text>
              </View>
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  subtitle: {
    fontSize: 11,
    fontWeight: '600',
    color: ENUMERATOR_THEME.colors.textMuted,
  },
  areasList: {
    gap: 10,
  },
  areaCard: {
    backgroundColor: ENUMERATOR_THEME.colors.subtleBackground,
    borderRadius: ENUMERATOR_THEME.borderRadius.md,
    padding: 12,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
    gap: 8,
  },
  areaTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  nameWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  areaName: {
    fontSize: 13,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  lowBadge: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: ENUMERATOR_THEME.borderRadius.sm,
  },
  lowBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#991B1B',
  },
  percentVal: {
    fontSize: 14,
    fontWeight: '800',
    color: ENUMERATOR_THEME.colors.accent,
  },
  textDanger: {
    color: '#DC2626',
  },
  track: {
    height: 6,
    backgroundColor: ENUMERATOR_THEME.colors.border,
    borderRadius: ENUMERATOR_THEME.borderRadius.full,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: ENUMERATOR_THEME.colors.accent,
    borderRadius: ENUMERATOR_THEME.borderRadius.full,
  },
  fillDanger: {
    backgroundColor: '#DC2626',
  },
  areaBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  countDetail: {
    fontSize: 11,
    color: ENUMERATOR_THEME.colors.textSecondary,
    fontWeight: '500',
  },
  countHighlight: {
    fontWeight: '800',
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  remainingText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#D97706',
  },
});
