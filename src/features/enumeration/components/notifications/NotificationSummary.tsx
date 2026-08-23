import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ENUMERATOR_THEME } from '../../theme';
import { NotificationFilterCategory } from '../../types/notificationTypes';

interface NotificationSummaryProps {
  totalCount: number;
  unreadCount: number;
  priorityCount: number;
  selectedCategory: NotificationFilterCategory;
  onSelectCategory: (category: NotificationFilterCategory) => void;
}

export const NotificationSummary: React.FC<NotificationSummaryProps> = ({
  totalCount,
  unreadCount,
  priorityCount,
  selectedCategory,
  onSelectCategory,
}) => {
  const cards = [
    {
      id: 'All' as NotificationFilterCategory,
      label: 'All Notifications',
      count: totalCount,
      icon: 'bell-ring-outline' as const,
      color: ENUMERATOR_THEME.colors.accent,
      bg: ENUMERATOR_THEME.colors.accentSubtle,
    },
    {
      id: 'Unread' as NotificationFilterCategory,
      label: 'Unread',
      count: unreadCount,
      icon: 'email-alert-outline' as const,
      color: '#D97706',
      bg: '#FEF3C7',
    },
    {
      id: 'Priority' as NotificationFilterCategory,
      label: 'Priority Alerts',
      count: priorityCount,
      icon: 'shield-alert-outline' as const,
      color: '#EF4444',
      bg: '#FEE2E2',
    },
  ];

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContainer}
    >
      {cards.map((c) => {
        const isSelected = selectedCategory === c.id;
        return (
          <TouchableOpacity
            key={c.id}
            style={[styles.card, isSelected && styles.cardSelected]}
            onPress={() => onSelectCategory(c.id)}
            activeOpacity={0.8}
          >
            <View style={styles.topRow}>
              <View style={[styles.iconWrap, { backgroundColor: c.bg }]}>
                <MaterialCommunityIcons name={c.icon} size={18} color={c.color} />
              </View>
              <Text style={[styles.countText, { color: c.color }]}>{c.count}</Text>
            </View>

            <Text style={styles.label} numberOfLines={1}>{c.label}</Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    paddingHorizontal: 16,
    gap: 10,
  },
  card: {
    width: 140,
    backgroundColor: ENUMERATOR_THEME.colors.cardBackground,
    borderRadius: ENUMERATOR_THEME.borderRadius.lg,
    padding: 12,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
    gap: 6,
  },
  cardSelected: {
    borderColor: ENUMERATOR_THEME.colors.accent,
    backgroundColor: ENUMERATOR_THEME.colors.accentSubtle,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconWrap: {
    width: 30,
    height: 30,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countText: {
    fontSize: 18,
    fontWeight: '900',
  },
  label: {
    fontSize: 12,
    fontWeight: '800',
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
});
