import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/adminTheme';

interface AssignedZoneCardProps {
  zone: string;
  ward: string;
  area: string;
  households: number;
  completed: number;
  coverage: number;
  onPress?: () => void;
  onRoutePress?: () => void;
}

export default function AssignedZoneCard({
  zone,
  ward,
  area,
  households,
  completed,
  coverage,
  onPress,
  onRoutePress,
}: AssignedZoneCardProps) {
  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.7} onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Ionicons name="map" size={20} color={COLORS.accent} />
          <View>
            <Text style={styles.label}>ASSIGNED ZONE</Text>
            <Text style={styles.zoneTitle}>{zone} · {ward}</Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} />
      </View>

      <Text style={styles.area}>{area}</Text>

      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Households</Text>
          <Text style={styles.statValue}>{households}</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Completed</Text>
          <Text style={styles.statValue}>{completed}</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Coverage</Text>
          <Text style={[styles.statValue, styles.statCoverage]}>{coverage}%</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.routeBtn} activeOpacity={0.7} onPress={onRoutePress}>
        <Ionicons name="navigate" size={18} color={COLORS.textOnPrimary} />
        <Text style={styles.routeBtnText}>View Route Map</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 14,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.accent,
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  zoneTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  area: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.accentSoft,
    borderRadius: 12,
    padding: 14,
    justifyContent: 'space-around',
  },
  stat: {
    alignItems: 'center',
    gap: 4,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  statCoverage: {
    color: COLORS.accent,
  },
  routeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.accent,
    borderRadius: 12,
    paddingVertical: 14,
    gap: 8,
  },
  routeBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textOnPrimary,
  },
});
