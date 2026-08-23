import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ENUMERATOR_THEME } from '../../theme';

interface Props {
  highPriorityCount: number;
  urgentNeedsCount: number;
  missingReportsCount: number;
  pendingVerificationCount: number;
  onTilePress?: (filterType: string) => void;
}

export function PriorityMetricsSection({
  highPriorityCount,
  urgentNeedsCount,
  missingReportsCount,
  pendingVerificationCount,
  onTilePress,
}: Props) {
  const tiles = [
    {
      id: 'Priority',
      label: 'High Priority',
      count: highPriorityCount,
      icon: 'alert-circle-outline',
      color: '#DC2626',
      bg: '#FEE2E2',
    },
    {
      id: 'Needs Verification',
      label: 'Pending Verification',
      count: pendingVerificationCount,
      icon: 'shield-alert-outline',
      color: '#D97706',
      bg: '#FEF3C7',
    },
    {
      id: 'Urgent',
      label: 'Urgent Needs',
      count: urgentNeedsCount,
      icon: 'heart-flash',
      color: ENUMERATOR_THEME.colors.accent,
      bg: ENUMERATOR_THEME.colors.accentSubtle,
    },
    {
      id: 'Missing',
      label: 'Missing Reports',
      count: missingReportsCount,
      icon: 'file-alert-outline',
      color: '#9333EA',
      bg: '#F3E8FF',
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Field Priority Overview</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {tiles.map((t) => (
          <TouchableOpacity
            key={t.id}
            style={styles.tile}
            onPress={() => onTilePress?.(t.id)}
            activeOpacity={0.7}
          >
            <View style={styles.tileTop}>
              <View style={[styles.iconWrap, { backgroundColor: t.bg }]}>
                <MaterialCommunityIcons name={t.icon as any} size={18} color={t.color} />
              </View>
              <Text style={[styles.tileCount, { color: t.color }]}>{t.count}</Text>
            </View>
            <Text style={styles.tileLabel} numberOfLines={1}>{t.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  scrollContent: {
    gap: 10,
    paddingRight: 16,
  },
  tile: {
    width: 145,
    backgroundColor: ENUMERATOR_THEME.colors.cardBackground,
    borderRadius: ENUMERATOR_THEME.borderRadius.xl,
    padding: 12,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
    gap: 8,
  },
  tileTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: ENUMERATOR_THEME.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tileCount: {
    fontSize: 18,
    fontWeight: '800',
  },
  tileLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: ENUMERATOR_THEME.colors.textSecondary,
  },
});
