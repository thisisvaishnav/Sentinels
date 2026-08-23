import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BlindSpotFilterCategory } from '../../data/blindSpotAdapter';
import { ENUMERATOR_THEME } from '../../theme';

interface BlindSpotEmptyStateProps {
  category: BlindSpotFilterCategory;
  hasSearchQuery: boolean;
  onClearFilters: () => void;
}

export const BlindSpotEmptyState: React.FC<BlindSpotEmptyStateProps> = ({
  category,
  hasSearchQuery,
  onClearFilters,
}) => {
  let message = 'No major blind spots detected. Current household coverage does not show any areas requiring immediate attention.';
  if (hasSearchQuery) {
    message = 'No blind spot areas match your search filter.';
  } else if (category !== 'All') {
    message = `No blind spot areas found with ${category} risk level.`;
  }

  return (
    <View style={styles.card}>
      <View style={styles.iconWrap}>
        <MaterialCommunityIcons name="radar" size={32} color={ENUMERATOR_THEME.colors.accent} />
      </View>

      <Text style={styles.title}>
        {hasSearchQuery || category !== 'All' ? 'No Matching Areas' : 'All Clear — Good Coverage'}
      </Text>

      <Text style={styles.message}>{message}</Text>

      {(hasSearchQuery || category !== 'All') && (
        <TouchableOpacity style={styles.resetBtn} onPress={onClearFilters} activeOpacity={0.8}>
          <Text style={styles.resetText}>Reset Filters</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: ENUMERATOR_THEME.colors.cardBackground,
    borderRadius: ENUMERATOR_THEME.borderRadius.xl,
    padding: 28,
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
    alignItems: 'center',
    gap: 10,
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: ENUMERATOR_THEME.colors.accentSubtle,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.accentLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  message: {
    fontSize: 12,
    color: ENUMERATOR_THEME.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
  resetBtn: {
    backgroundColor: ENUMERATOR_THEME.colors.accent,
    borderRadius: ENUMERATOR_THEME.borderRadius.lg,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginTop: 4,
  },
  resetText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
