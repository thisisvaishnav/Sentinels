import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { NotificationFilterCategory } from '../../types/notificationTypes';
import { ENUMERATOR_THEME } from '../../theme';

interface NotificationEmptyStateProps {
  category: NotificationFilterCategory;
  hasSearchQuery: boolean;
  onClearFilters: () => void;
}

export const NotificationEmptyState: React.FC<NotificationEmptyStateProps> = ({
  category,
  hasSearchQuery,
  onClearFilters,
}) => {
  return (
    <View style={styles.card}>
      <MaterialCommunityIcons
        name={
          hasSearchQuery
            ? 'magnify-remove-outline'
            : category === 'Unread'
            ? 'email-check-outline'
            : 'bell-sleep-outline'
        }
        size={36}
        color={ENUMERATOR_THEME.colors.textMuted}
      />

      <Text style={styles.title}>
        {hasSearchQuery
          ? 'No matching notifications found'
          : category === 'All'
          ? "You're all caught up!"
          : category === 'Unread'
          ? 'No unread notifications'
          : `No ${category.toLowerCase()} notifications`}
      </Text>

      <Text style={styles.subtitle}>
        {hasSearchQuery
          ? 'Try adjusting your search terms or selecting another category.'
          : category === 'All'
          ? 'New dispatches, supervisor assignment updates, and field alerts will appear here.'
          : category === 'Unread'
          ? 'All your field notifications have been read and reviewed.'
          : 'There are currently no alerts under this category for your assigned zone.'}
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
