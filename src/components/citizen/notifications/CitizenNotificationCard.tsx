import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppColors } from '@/constants/colors';
import { CitizenNotification, CitizenNotificationType } from './citizenNotificationTypes';

interface CitizenNotificationCardProps {
  item: CitizenNotification;
  onPressItem: (item: CitizenNotification) => void;
}

const getTypeIconConfig = (type: CitizenNotificationType) => {
  switch (type) {
    case 'scheme':
      return { name: 'document-text-outline' as const, color: '#0284C7', bg: '#E0F2FE' };
    case 'update':
      return { name: 'checkmark-circle-outline' as const, color: '#059669', bg: '#D1FAE5' };
    case 'alert':
      return { name: 'warning-outline' as const, color: '#EF4444', bg: '#FEE2E2' };
    default:
      return { name: 'information-circle-outline' as const, color: '#64748B', bg: '#F1F5F9' };
  }
};

export const CitizenNotificationCard: React.FC<CitizenNotificationCardProps> = ({
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

      {item.actionLabel && (
        <View style={styles.cardFooter}>
          <View style={styles.actionBtn}>
            <Text style={styles.actionBtnText}>{item.actionLabel}</Text>
            <Ionicons name="chevron-forward" size={12} color={AppColors.blue} />
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: AppColors.bgCard,
    borderRadius: 0,
    padding: 14,
    borderWidth: 1,
    borderColor: AppColors.border,
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
    borderRadius: 0,
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
    backgroundColor: AppColors.blue,
  },
  title: {
    fontSize: 14,
    fontWeight: '800',
    color: AppColors.textPrimary,
  },
  timestamp: {
    fontSize: 10,
    color: AppColors.textMuted,
    fontWeight: '500',
  },
  message: {
    fontSize: 12,
    color: AppColors.textSecondary,
    lineHeight: 17,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: AppColors.border,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  actionBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: AppColors.blue,
  },
});
