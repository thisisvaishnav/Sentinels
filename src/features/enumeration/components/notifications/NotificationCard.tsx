import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { EnumeratorNotification, NotificationType } from '../../types/notificationTypes';
import { ENUMERATOR_THEME } from '../../theme';

interface NotificationCardProps {
  item: EnumeratorNotification;
  onPressItem: (item: EnumeratorNotification) => void;
  onDelete?: (id: string) => void;
}

export const NotificationCard: React.FC<NotificationCardProps> = ({
  item,
  onPressItem,
  onDelete,
}) => {
  const getTypeIconConfig = (type: NotificationType) => {
    switch (type) {
      case 'priority':
        return { name: 'home-alert-outline' as const, color: '#EF4444', bg: '#FEE2E2' };
      case 'blind-spot':
        return { name: 'radar' as const, color: '#F59E0B', bg: '#FEF3C7' };
      case 'anomaly':
        return { name: 'crosshairs-gps' as const, color: '#EC4899', bg: '#FDF2F8' };
      case 'missing':
        return { name: 'file-search-outline' as const, color: '#D97706', bg: '#FEF3C7' };
      case 'verification':
        return { name: 'shield-alert-outline' as const, color: '#3B82F6', bg: '#DBEAFE' };
      case 'coverage':
        return { name: 'chart-line' as const, color: '#10B981', bg: '#D1FAE5' };
      case 'assignment':
        return { name: 'map-marker-path' as const, color: '#8B5CF6', bg: '#F3E8FF' };
      case 'sync':
        return { name: 'sync' as const, color: '#0284C7', bg: '#E0F2FE' };
      case 'survey':
        return { name: 'clipboard-edit-outline' as const, color: '#0284C7', bg: '#E0F2FE' };
      default:
        return { name: 'cog-outline' as const, color: '#64748B', bg: '#F1F5F9' };
    }
  };

  const iconConfig = getTypeIconConfig(item.type);

  return (
    <TouchableOpacity
      style={[
        styles.card,
        !item.read && styles.unreadCard,
      ]}
      onPress={() => onPressItem(item)}
      activeOpacity={0.85}
    >
      <View style={styles.cardHeader}>
        <View style={styles.leftGroup}>
          <View style={[styles.iconWrap, { backgroundColor: iconConfig.bg }]}>
            <MaterialCommunityIcons name={iconConfig.name} size={18} color={iconConfig.color} />
          </View>

          <View style={styles.titleWrap}>
            <View style={styles.titleRow}>
              {!item.read && <View style={styles.unreadDot} />}
              <Text style={styles.title}>{item.title}</Text>
            </View>
            <Text style={styles.timestamp}>{item.timestamp}</Text>
          </View>
        </View>

        {onDelete && (
          <TouchableOpacity
            style={styles.deleteBtn}
            onPress={(e) => {
              e.stopPropagation();
              onDelete(item.id);
            }}
            activeOpacity={0.7}
          >
            <Ionicons name="close-outline" size={16} color={ENUMERATOR_THEME.colors.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      <Text style={styles.message}>{item.message}</Text>

      {/* Footer Tags & Contextual Action Button */}
      <View style={styles.cardFooter}>
        <View style={styles.tagsGroup}>
          {item.priority === 'urgent' || item.priority === 'high' ? (
            <Text style={styles.priorityBadge}>HIGH PRIORITY</Text>
          ) : null}

          {item.householdId && (
            <View style={styles.ctxBadge}>
              <Text style={styles.ctxBadgeText}>{item.householdId}</Text>
            </View>
          )}

          {item.areaId && (
            <View style={styles.ctxBadge}>
              <Text style={styles.ctxBadgeText}>{item.areaId}</Text>
            </View>
          )}
        </View>

        {item.actionLabel && (
          <View style={styles.actionBtn}>
            <Text style={styles.actionBtnText}>{item.actionLabel}</Text>
            <Ionicons name="chevron-forward" size={12} color={ENUMERATOR_THEME.colors.accent} />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: ENUMERATOR_THEME.colors.cardBackground,
    borderRadius: ENUMERATOR_THEME.borderRadius.lg,
    padding: 14,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
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
    borderRadius: ENUMERATOR_THEME.borderRadius.sm,
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
    backgroundColor: ENUMERATOR_THEME.colors.accent,
  },
  title: {
    fontSize: 14,
    fontWeight: '800',
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  timestamp: {
    fontSize: 10,
    color: ENUMERATOR_THEME.colors.textMuted,
    fontWeight: '500',
  },
  deleteBtn: {
    padding: 4,
  },
  message: {
    fontSize: 12,
    color: ENUMERATOR_THEME.colors.textSecondary,
    lineHeight: 17,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: ENUMERATOR_THEME.colors.border,
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
  ctxBadge: {
    backgroundColor: ENUMERATOR_THEME.colors.subtleBackground,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
  },
  ctxBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.textSecondary,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  actionBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: ENUMERATOR_THEME.colors.accent,
  },
});
