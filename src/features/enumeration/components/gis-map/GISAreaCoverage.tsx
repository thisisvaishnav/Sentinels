import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { ZoneAreaItem } from '../../types';
import { ENUMERATOR_THEME } from '../../theme';

interface GISAreaCoverageProps {
  areas: ZoneAreaItem[];
  selectedAreaName: string;
  onSelectArea: (areaName: string) => void;
}

export const GISAreaCoverage: React.FC<GISAreaCoverageProps> = ({
  areas,
  selectedAreaName,
  onSelectArea,
}) => {
  const [expanded, setExpanded] = useState(false);

  // Sort by lowest coverage first
  const sortedAreas = [...areas].sort((a, b) => {
    const covA = a.totalHouseholds > 0 ? (a.completedHouseholds / a.totalHouseholds) * 100 : 0;
    const covB = b.totalHouseholds > 0 ? (b.completedHouseholds / b.totalHouseholds) * 100 : 0;
    return covA - covB;
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.header}
        onPress={() => setExpanded(!expanded)}
        activeOpacity={0.8}
      >
        <View style={styles.titleRow}>
          <MaterialCommunityIcons name="chart-pie" size={18} color={ENUMERATOR_THEME.colors.accent} />
          <Text style={styles.title}>Area Coverage Breakdown</Text>
        </View>
        <Ionicons
          name={expanded ? 'chevron-up' : 'chevron-down'}
          size={18}
          color={ENUMERATOR_THEME.colors.textMuted}
        />
      </TouchableOpacity>

      {expanded && (
        <View style={styles.list}>
          {sortedAreas.map((area) => {
            const coveragePct =
              area.totalHouseholds > 0
                ? Math.round((area.completedHouseholds / area.totalHouseholds) * 100)
                : 0;
            const remaining = Math.max(0, area.totalHouseholds - area.completedHouseholds);
            const isSelected = selectedAreaName === area.name;

            return (
              <TouchableOpacity
                key={area.id}
                style={[styles.areaCard, isSelected && styles.areaCardSelected]}
                onPress={() => onSelectArea(area.name)}
                activeOpacity={0.7}
              >
                <View style={styles.areaInfoRow}>
                  <View style={styles.areaNameGroup}>
                    <Ionicons
                      name="location-sharp"
                      size={16}
                      color={isSelected ? ENUMERATOR_THEME.colors.accent : ENUMERATOR_THEME.colors.textMuted}
                    />
                    <Text style={[styles.areaName, isSelected && styles.areaNameSelected]}>
                      {area.name}
                    </Text>
                  </View>
                  <Text style={styles.coveragePctText}>{coveragePct}%</Text>
                </View>

                <View style={styles.areaProgressRow}>
                  <View style={styles.barTrack}>
                    <View
                      style={[
                        styles.barFill,
                        {
                          width: `${Math.min(100, coveragePct)}%`,
                          backgroundColor:
                            coveragePct < 40
                              ? ENUMERATOR_THEME.colors.danger
                              : coveragePct < 70
                              ? ENUMERATOR_THEME.colors.warning
                              : ENUMERATOR_THEME.colors.success,
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.countText}>
                    {area.completedHouseholds}/{area.totalHouseholds} ({remaining} remaining)
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: ENUMERATOR_THEME.colors.cardBackground,
    borderRadius: ENUMERATOR_THEME.borderRadius.xl,
    padding: 14,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
    gap: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  list: {
    gap: 8,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: ENUMERATOR_THEME.colors.subtleBackground,
  },
  areaCard: {
    backgroundColor: ENUMERATOR_THEME.colors.subtleBackground,
    padding: 10,
    borderRadius: ENUMERATOR_THEME.borderRadius.lg,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
    gap: 6,
  },
  areaCardSelected: {
    backgroundColor: ENUMERATOR_THEME.colors.accentSubtle,
    borderColor: ENUMERATOR_THEME.colors.accentLight,
  },
  areaInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  areaNameGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  areaName: {
    fontSize: 13,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  areaNameSelected: {
    color: ENUMERATOR_THEME.colors.accent,
  },
  coveragePctText: {
    fontSize: 13,
    fontWeight: '800',
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  areaProgressRow: {
    gap: 4,
  },
  barTrack: {
    height: 6,
    backgroundColor: ENUMERATOR_THEME.colors.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
  },
  countText: {
    fontSize: 11,
    fontWeight: '500',
    color: ENUMERATOR_THEME.colors.textMuted,
    textAlign: 'right',
  },
});
