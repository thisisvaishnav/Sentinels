import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '@/constants/adminTheme';
import { AdminNotificationFilterCategory } from './adminNotificationTypes';

interface AdminNotificationEmptyStateProps {
  category: AdminNotificationFilterCategory;
  hasSearchQuery: boolean;
  onClearFilters: () => void;
}

export const AdminNotificationEmptyState: React.FC<AdminNotificationEmptyStateProps> = ({
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
        color={COLORS.textMuted}
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
          ? 'New survey updates, enumerator alerts, and system notifications will appear here.'
          : category === 'Unread'
          ? 'All your notifications have been read and reviewed.'
          : 'There are currently no alerts under this category.'}
      </Text>

      {(hasSearchQuery || category !== 'All') && (
        <TouchableOpacity style={styles.resetBtn} onPress={onClearFilters} activeOpacity={0.8}>
          <Ionicons name="refresh" size={14} color={COLORS.accent} />
          <Text style={styles.resetBtnText}>Reset Search & Filters</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 10,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 8,
    marginHorizontal: 16,
    marginVertical: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 11,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 16,
  },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 6,
    marginTop: 4,
  },
  resetBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.accent,
  },
});
