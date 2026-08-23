import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/adminTheme';

export interface Enumerator {
  id: string;
  name: string;
  employeeId: string;
  area: string;
  surveysCompleted: number;
  status: 'active' | 'inactive' | 'on-break';
}

interface EnumeratorCardProps {
  enumerator: Enumerator;
  onViewPress?: (enumerator: Enumerator) => void;
  onMapPress?: (enumerator: Enumerator) => void;
}

const STATUS_CONFIG = {
  active: { label: 'Active', bg: COLORS.successSoft, color: COLORS.success },
  inactive: { label: 'Inactive', bg: COLORS.inactiveLight, color: COLORS.inactive },
  'on-break': { label: 'On Break', bg: COLORS.warningSoft, color: COLORS.warning },
};

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export default function EnumeratorCard({ enumerator, onViewPress, onMapPress }: EnumeratorCardProps) {
  const statusCfg = STATUS_CONFIG[enumerator.status];

  return (
    <View style={styles.card}>
      {/* Top row: avatar + name + status */}
      <View style={styles.topRow}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{getInitials(enumerator.name)}</Text>
        </View>

        <View style={styles.nameBlock}>
          <Text style={styles.name} numberOfLines={1}>{enumerator.name}</Text>
          <Text style={styles.empId}>ID: {enumerator.employeeId}</Text>
        </View>

        <View style={[styles.pill, { backgroundColor: statusCfg.bg }]}>
          <Text style={[styles.pillText, { color: statusCfg.color }]}>{statusCfg.label}</Text>
        </View>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Stats row */}
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Area</Text>
          <Text style={styles.statValue} numberOfLines={1}>{enumerator.area}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Surveys</Text>
          <Text style={styles.statValue}>{enumerator.surveysCompleted}</Text>
        </View>

        {/* Action icons */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.actionBtn}
            activeOpacity={0.6}
            onPress={() => onViewPress?.(enumerator)}
          >
            <Ionicons name="eye-outline" size={18} color={COLORS.accent} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionBtn}
            activeOpacity={0.6}
            onPress={() => onMapPress?.(enumerator)}
          >
            <Ionicons name="map-outline" size={18} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primary,
  },
  nameBlock: {
    flex: 1,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  empId: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 1,
  },
  pill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  pillText: {
    fontSize: 11,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.divider,
    marginVertical: 10,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  statValue: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginTop: 1,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: COLORS.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
