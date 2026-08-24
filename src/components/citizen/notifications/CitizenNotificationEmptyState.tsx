import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { AppColors } from '@/constants/colors';
import { CitizenNotificationFilterCategory } from './citizenNotificationTypes';

interface CitizenNotificationEmptyStateProps {
  category: CitizenNotificationFilterCategory;
  hasSearchQuery: boolean;
  onClearFilters: () => void;
}

export const CitizenNotificationEmptyState: React.FC<CitizenNotificationEmptyStateProps> = ({
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
        color={AppColors.textMuted}
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
          ? 'Scheme updates, eligibility alerts, and progress milestones will appear here.'
          : category === 'Unread'
          ? 'All your notifications have been read and reviewed.'
          : 'There are currently no alerts under this category.'}
      </Text>

      {(hasSearchQuery || category !== 'All') && (
        <TouchableOpacity style={styles.resetBtn} onPress={onClearFilters} activeOpacity={0.8}>
          <Ionicons name="refresh" size={14} color={AppColors.blue} />
          <Text style={styles.resetBtnText}>Reset Search & Filters</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: AppColors.bgCard,
    borderRadius: 0,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: AppColors.border,
    gap: 8,
    marginHorizontal: 16,
    marginVertical: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: '800',
    color: AppColors.textPrimary,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 11,
    color: AppColors.textMuted,
    textAlign: 'center',
    lineHeight: 16,
  },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColors.bgSubtle,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 0,
    borderWidth: 1,
    borderColor: AppColors.border,
    gap: 6,
    marginTop: 4,
  },
  resetBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: AppColors.blue,
  },
});
