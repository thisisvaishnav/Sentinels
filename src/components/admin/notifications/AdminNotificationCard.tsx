import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/adminTheme';
import { AdminNotification, AdminNotificationType } from './adminNotificationTypes';

interface AdminNotificationCardProps {
  item: AdminNotification;
  onPressItem: (item: AdminNotification) => void;
}

const getTypeIconConfig = (type: AdminNotificationType) => {
  switch (type) {
    case 'survey':
      return { name: 'document-text-outline' as const, color: '#0284C7', bg: '#E0F2FE' };
    case 'enumerator':
      return { name: 'people-outline' as const, color: '#059669', bg: '#D1FAE5' };
    case 'system':
      return { name: 'settings-outline' as const, color: '#64748B', bg: '#F1F5F9' };
    case 'alert':
      return { name: 'warning-outline' as const, color: '#EF4444', bg: '#FEE2E2' };
    default:
      return { name: 'information-circle-outline' as const, color: '#64748B', bg: '#F1F5F9' };
  }
};

export const AdminNotificationCard: React.FC<AdminNotificationCardProps> = ({
  item,
  onPressItem,
}) => {
  const iconConfig = getTypeIconConfig(item.type);

  return (
    <TouchableOpacity
      style={[styles.card, !item.read && styles.unreadCard]}
      onPress={() => onPressItem(item)}
      activeOpacity={0.85}
    >
      <View style={styles.cardHeader}>
        <View style={styles.leftGroup}>
          <View style={[styles.iconWrap, { backgroundColor: iconConfig.bg }]}>
            <Ionicons name={iconConfig.name} size={18} color={iconConfig.color} />
          </View>

          <View style={styles.titleWrap}>
            <View style={styles.titleRow}>
              {!item.read && <View style={styles.unreadDot} />}
              <Text style={styles.title}>{item.title}</Text>
            </View>
            <Text style={styles.timestamp}>{item.timestamp}</Text>
          </View>
        </View>
      </View>

      <Text style={styles.message}>{item.message}</Text>

      <View style={styles.cardFooter}>
        <View style={styles.tagsGroup}>
          {item.priority === 'urgent' || item.priority === 'high' ? (
            <Text style={styles.priorityBadge}>HIGH PRIORITY</Text>
          ) : null}

          {item.actionLabel && (
            <View style={styles.actionBtn}>
              <Text style={styles.actionBtnText}>{item.actionLabel}</Text>
              <Ionicons name="chevron-forward" size={12} color={COLORS.accent} />
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 8,
  },
  unreadCard: {
    backgroundColor: '#F0F9FF',
    borderColor: '#BAE6FD',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleWrap: {
    flex: 1,
    gap: 2,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  unreadDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: COLORS.accent,
  },
  title: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  timestamp: {
    fontSize: 10,
    color: COLORS.textMuted,
    fontWeight: '500',
  },
  message: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 17,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  tagsGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  priorityBadge: {
    fontSize: 8,
    fontWeight: '900',
    color: '#EF4444',
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  actionBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.accent,
  },
});
