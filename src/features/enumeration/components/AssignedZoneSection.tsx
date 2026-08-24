import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { AssignedZoneInfo } from '../types';
import { ENUMERATOR_THEME, Theme } from '../theme';

interface AssignedZoneSectionProps {
  zone: AssignedZoneInfo;
  theme?: Theme;
  onCardPress?: () => void;
  onViewRoute?: () => void;
}

export const AssignedZoneSection: React.FC<AssignedZoneSectionProps> = ({
  zone,
  theme = ENUMERATOR_THEME,
  onCardPress,
  onViewRoute,
}) => {
  return (
    <TouchableOpacity style={[styles.container, { backgroundColor: theme.colors.cardBackground, borderColor: theme.colors.border }]} onPress={onCardPress} activeOpacity={0.85}>
      <View style={styles.headerRow}>
        <MaterialCommunityIcons name="map-marker-path" size={24} color={theme.colors.accent} />
        <View style={styles.headerText}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textMuted }]}>Assigned Zone</Text>
          <Text style={[styles.zoneName, { color: theme.colors.textPrimary }]}>{zone.zoneName}</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={theme.colors.textMuted} />
      </View>

      <Text style={[styles.subAreaText, { color: theme.colors.textSecondary }]}>{zone.subArea}</Text>

      <View style={[styles.statsRow, { backgroundColor: theme.colors.subtleBackground, borderRadius: theme.borderRadius.md }]}>
        <View style={styles.statBox}>
          <Text style={[styles.statLabel, { color: theme.colors.textMuted }]}>Households</Text>
          <Text style={[styles.statValue, { color: theme.colors.textPrimary }]}>{zone.totalHouseholds}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={[styles.statLabel, { color: theme.colors.textMuted }]}>Completed</Text>
          <Text style={[styles.statValue, { color: theme.colors.textPrimary }]}>{zone.completedHouseholds}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={[styles.statLabel, { color: theme.colors.textMuted }]}>Coverage</Text>
          <Text style={[styles.statValue, { color: theme.colors.accent }]}>{zone.coveragePercentage}%</Text>
        </View>
      </View>

      <TouchableOpacity style={[styles.routeBtn, { backgroundColor: theme.colors.accent, borderRadius: theme.borderRadius.md }]} onPress={onViewRoute} activeOpacity={0.8}>
        <Ionicons name="navigate-outline" size={18} color={theme.colors.textWhite} />
        <Text style={[styles.routeBtnText, { color: theme.colors.textWhite }]}>View Route Map</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    gap: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerText: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  zoneName: {
    fontSize: 17,
    fontWeight: '800',
  },
  subAreaText: {
    fontSize: 13,
  },
  statsRow: {
    flexDirection: 'row',
    padding: 12,
    justifyContent: 'space-around',
  },
  statBox: {
    alignItems: 'center',
    gap: 2,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '500',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  routeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 8,
  },
  routeBtnText: {
    fontSize: 14,
    fontWeight: '700',
  },
});
