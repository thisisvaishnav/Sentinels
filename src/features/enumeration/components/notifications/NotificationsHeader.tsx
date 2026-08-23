import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ENUMERATOR_THEME } from '../../theme';

interface NotificationsHeaderProps {
  unreadCount: number;
  totalCount: number;
  onMarkAllAsRead: () => void;
  onClearAll: () => void;
}

export const NotificationsHeader: React.FC<NotificationsHeaderProps> = ({
  unreadCount,
  totalCount,
  onMarkAllAsRead,
  onClearAll,
}) => {
  const router = useRouter();

  const handleClearAllConfirm = () => {
    if (totalCount === 0) return;
    Alert.alert(
      'Clear All Notifications',
      'Are you sure you want to delete all field notifications? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear All', style: 'destructive', onPress: onClearAll },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => router.back()}
        activeOpacity={0.8}
      >
        <Ionicons name="arrow-back" size={20} color={ENUMERATOR_THEME.colors.textPrimary} />
      </TouchableOpacity>

      <View style={styles.titleWrap}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>Notifications</Text>
          {unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadBadgeText}>{unreadCount} unread</Text>
            </View>
          )}
        </View>
        <Text style={styles.subtitle}>Field dispatches, alerts & zone updates</Text>
      </View>

      <View style={styles.actionsRow}>
        {unreadCount > 0 && (
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={onMarkAllAsRead}
            activeOpacity={0.8}
            accessibilityLabel="Mark all as read"
          >
            <MaterialCommunityIcons
              name="email-open-outline"
              size={18}
              color={ENUMERATOR_THEME.colors.accent}
            />
          </TouchableOpacity>
        )}

        {totalCount > 0 && (
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={handleClearAllConfirm}
            activeOpacity={0.8}
            accessibilityLabel="Clear all notifications"
          >
            <Ionicons name="trash-outline" size={18} color={ENUMERATOR_THEME.colors.danger} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: ENUMERATOR_THEME.colors.cardBackground,
    borderBottomWidth: 1,
    borderBottomColor: ENUMERATOR_THEME.colors.border,
    gap: 12,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: ENUMERATOR_THEME.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
  },
  titleWrap: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  unreadBadge: {
    backgroundColor: ENUMERATOR_THEME.colors.accentSubtle,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.accentLight,
  },
  unreadBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: ENUMERATOR_THEME.colors.accent,
  },
  subtitle: {
    fontSize: 11,
    color: ENUMERATOR_THEME.colors.textMuted,
    fontWeight: '500',
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  iconBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: ENUMERATOR_THEME.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
  },
});
