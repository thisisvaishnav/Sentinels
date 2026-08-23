import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { ENUMERATOR_THEME } from '../../theme';

interface PriorityEmptyStateProps {
  category: string;
  hasSearchQuery: boolean;
  onClearFilters: () => void;
}

export const PriorityEmptyState: React.FC<PriorityEmptyStateProps> = ({
  category,
  hasSearchQuery,
  onClearFilters,
}) => {
  return (
    <View style={styles.card}>
      <MaterialCommunityIcons
        name={hasSearchQuery ? 'magnify-remove-outline' : 'checkbox-marked-circle-outline'}
        size={36}
        color={ENUMERATOR_THEME.colors.textMuted}
      />

      <Text style={styles.title}>
        {hasSearchQuery
          ? 'No matching households found'
          : category === 'All'
          ? 'All priority tasks are completed!'
          : `No ${category.toLowerCase()} households`}
      </Text>

      <Text style={styles.subtitle}>
        {hasSearchQuery
          ? 'Try adjusting your search keywords or filter category.'
          : category === 'High Priority'
          ? 'There are currently no high-priority flagged households in your zone.'
          : category === 'Urgent'
          ? 'No urgent health or ration assistance requests pending.'
          : 'All field tasks under this category have been attended to.'}
      </Text>

      {(hasSearchQuery || category !== 'All') && (
        <TouchableOpacity style={styles.resetBtn} onPress={onClearFilters} activeOpacity={0.8}>
          <Ionicons name="refresh" size={14} color={ENUMERATOR_THEME.colors.accent} />
          <Text style={styles.resetBtnText}>Reset Search & Filters</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: ENUMERATOR_THEME.colors.cardBackground,
    borderRadius: ENUMERATOR_THEME.borderRadius.lg,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
    gap: 8,
    marginHorizontal: 16,
    marginVertical: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: '800',
    color: ENUMERATOR_THEME.colors.textPrimary,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 11,
    color: ENUMERATOR_THEME.colors.textMuted,
    textAlign: 'center',
    lineHeight: 16,
  },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ENUMERATOR_THEME.colors.background,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: ENUMERATOR_THEME.borderRadius.md,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
    gap: 6,
    marginTop: 4,
  },
  resetBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.accent,
  },
});
