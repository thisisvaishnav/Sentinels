import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { AssignedZoneInfo } from '../types';
import { ENUMERATOR_THEME } from '../theme';

interface AssignedZoneSectionProps {
  zone: AssignedZoneInfo;
}

export const AssignedZoneSection: React.FC<AssignedZoneSectionProps> = ({ zone }) => {
  const router = useRouter();

  const handleViewRoute = () => {
    router.push('/(enumerator)/assigned-zone');
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <MaterialCommunityIcons name="map-marker-path" size={24} color={ENUMERATOR_THEME.colors.accent} />
        <View style={styles.headerText}>
          <Text style={styles.sectionTitle}>Assigned Zone</Text>
          <Text style={styles.zoneName}>{zone.zoneName}</Text>
        </View>
      </View>

      <Text style={styles.subAreaText}>{zone.subArea}</Text>

      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Households</Text>
          <Text style={styles.statValue}>{zone.totalHouseholds}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Completed</Text>
          <Text style={styles.statValue}>{zone.completedHouseholds}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Coverage</Text>
          <Text style={[styles.statValue, { color: ENUMERATOR_THEME.colors.accent }]}>{zone.coveragePercentage}%</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.routeBtn} onPress={handleViewRoute} activeOpacity={0.8}>
        <Ionicons name="navigate-outline" size={18} color={ENUMERATOR_THEME.colors.textWhite} />
        <Text style={styles.routeBtnText}>View Route</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: ENUMERATOR_THEME.colors.cardBackground,
    borderRadius: ENUMERATOR_THEME.borderRadius.xl,
    padding: 18,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
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
    color: ENUMERATOR_THEME.colors.textMuted,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  zoneName: {
    fontSize: 17,
    fontWeight: '800',
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  subAreaText: {
    fontSize: 13,
    color: ENUMERATOR_THEME.colors.textSecondary,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: ENUMERATOR_THEME.colors.subtleBackground,
    borderRadius: ENUMERATOR_THEME.borderRadius.md,
    padding: 12,
    justifyContent: 'space-around',
  },
  statBox: {
    alignItems: 'center',
    gap: 2,
  },
  statLabel: {
    fontSize: 11,
    color: ENUMERATOR_THEME.colors.textMuted,
    fontWeight: '500',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  routeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: ENUMERATOR_THEME.colors.accent,
    paddingVertical: 12,
    borderRadius: ENUMERATOR_THEME.borderRadius.md,
    gap: 8,
  },
  routeBtnText: {
    color: ENUMERATOR_THEME.colors.textWhite,
    fontSize: 14,
    fontWeight: '700',
  },
});
