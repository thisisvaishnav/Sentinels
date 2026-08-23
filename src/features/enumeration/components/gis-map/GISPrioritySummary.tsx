import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ENUMERATOR_THEME } from '../../theme';

interface GISPrioritySummaryProps {
  highPriorityCount: number;
  urgentNeedsCount: number;
  needsVerificationCount: number;
  missingCount: number;
  onFilterPriority: () => void;
  isPriorityActive: boolean;
}

export const GISPrioritySummary: React.FC<GISPrioritySummaryProps> = ({
  highPriorityCount,
  urgentNeedsCount,
  needsVerificationCount,
  missingCount,
  onFilterPriority,
  isPriorityActive,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.titleGroup}>
          <MaterialCommunityIcons name="shield-alert-outline" size={20} color={ENUMERATOR_THEME.colors.danger} />
          <Text style={styles.title}>Priority Summary</Text>
        </View>
        <TouchableOpacity
          style={[styles.toggleBtn, isPriorityActive && styles.toggleBtnActive]}
          onPress={onFilterPriority}
          activeOpacity={0.8}
        >
          <Text style={[styles.toggleBtnText, isPriorityActive && styles.toggleBtnTextActive]}>
            {isPriorityActive ? 'Showing Priority Only' : 'Filter Priority'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={[styles.statBadge, { backgroundColor: '#FEF2F2', borderColor: '#FECACA' }]}>
          <Text style={[styles.statValue, { color: '#DC2626' }]}>{highPriorityCount}</Text>
          <Text style={styles.statLabel} numberOfLines={1}>High Priority</Text>
        </View>

        <View style={[styles.statBadge, { backgroundColor: '#FFFBEB', borderColor: '#FDE68A' }]}>
          <Text style={[styles.statValue, { color: '#D97706' }]}>{urgentNeedsCount}</Text>
          <Text style={styles.statLabel} numberOfLines={1}>Urgent Needs</Text>
        </View>

        <View style={[styles.statBadge, { backgroundColor: '#EFF6FF', borderColor: '#BFDBFE' }]}>
          <Text style={[styles.statValue, { color: '#2563EB' }]}>{needsVerificationCount}</Text>
          <Text style={styles.statLabel} numberOfLines={1}>Needs Review</Text>
        </View>

        <View style={[styles.statBadge, { backgroundColor: '#FDF2F8', borderColor: '#FBCFE8' }]}>
          <Text style={[styles.statValue, { color: '#DB2777' }]}>{missingCount}</Text>
          <Text style={styles.statLabel} numberOfLines={1}>Missing Flag</Text>
        </View>
      </ScrollView>
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  toggleBtn: {
    backgroundColor: ENUMERATOR_THEME.colors.subtleBackground,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: ENUMERATOR_THEME.borderRadius.md,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
  },
  toggleBtnActive: {
    backgroundColor: ENUMERATOR_THEME.colors.danger,
    borderColor: ENUMERATOR_THEME.colors.danger,
  },
  toggleBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.textSecondary,
  },
  toggleBtnTextActive: {
    color: ENUMERATOR_THEME.colors.textWhite,
  },
  scrollContent: {
    gap: 8,
    paddingRight: 8,
  },
  statBadge: {
    width: 100,
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderRadius: ENUMERATOR_THEME.borderRadius.md,
    borderWidth: 1,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '800',
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: ENUMERATOR_THEME.colors.textMuted,
    marginTop: 2,
    textAlign: 'center',
  },
});
