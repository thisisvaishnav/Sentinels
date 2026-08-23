import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ENUMERATOR_THEME } from '../../theme';

interface FieldActivitySummaryCardProps {
  totalHouseholds: number;
  missingReportsCount: number;
  priorityTasksCount: number;
}

export const FieldActivitySummaryCard: React.FC<FieldActivitySummaryCardProps> = ({
  totalHouseholds,
  missingReportsCount,
  priorityTasksCount,
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <MaterialCommunityIcons name="history" size={20} color={ENUMERATOR_THEME.colors.accent} />
        <Text style={styles.cardTitle}>Field Activity Overview</Text>
      </View>

      <View style={styles.activityGrid}>
        <View style={styles.activityItem}>
          <View style={[styles.iconBox, { backgroundColor: '#ECFDF5' }]}>
            <MaterialCommunityIcons name="home-city-outline" size={18} color={ENUMERATOR_THEME.colors.success} />
          </View>
          <View style={styles.textWrap}>
            <Text style={styles.itemValue}>{totalHouseholds}</Text>
            <Text style={styles.itemLabel}>Households Surveyed</Text>
          </View>
        </View>

        <View style={styles.activityItem}>
          <View style={[styles.iconBox, { backgroundColor: '#FFFBEB' }]}>
            <MaterialCommunityIcons name="alert-decagram-outline" size={18} color={ENUMERATOR_THEME.colors.warning} />
          </View>
          <View style={styles.textWrap}>
            <Text style={styles.itemValue}>{missingReportsCount}</Text>
            <Text style={styles.itemLabel}>Missing Reports</Text>
          </View>
        </View>

        <View style={styles.activityItem}>
          <View style={[styles.iconBox, { backgroundColor: '#FEF2F2' }]}>
            <MaterialCommunityIcons name="shield-alert-outline" size={18} color={ENUMERATOR_THEME.colors.danger} />
          </View>
          <View style={styles.textWrap}>
            <Text style={styles.itemValue}>{priorityTasksCount}</Text>
            <Text style={styles.itemLabel}>Priority Tasks</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: ENUMERATOR_THEME.colors.cardBackground,
    borderRadius: ENUMERATOR_THEME.borderRadius.xl,
    padding: 16,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
    gap: 14,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  activityGrid: {
    gap: 10,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ENUMERATOR_THEME.colors.background,
    borderRadius: ENUMERATOR_THEME.borderRadius.lg,
    padding: 12,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
    gap: 12,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: ENUMERATOR_THEME.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textWrap: {
    flex: 1,
  },
  itemValue: {
    fontSize: 16,
    fontWeight: '800',
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  itemLabel: {
    fontSize: 12,
    color: ENUMERATOR_THEME.colors.textSecondary,
    fontWeight: '500',
  },
});
