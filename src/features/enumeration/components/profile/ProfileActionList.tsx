import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { ENUMERATOR_THEME } from '../../theme';

interface ProfileActionListProps {
  onPressZone: () => void;
  onPressNotifications: () => void;
  onPressPriorityTasks: () => void;
  onPressHelp: () => void;
  onPressAbout: () => void;
  onPressLogout: () => void;
}

export const ProfileActionList: React.FC<ProfileActionListProps> = ({
  onPressZone,
  onPressNotifications,
  onPressPriorityTasks,
  onPressHelp,
  onPressAbout,
  onPressLogout,
}) => {
  const primaryActions = [
    {
      label: 'Assigned Zone',
      subtitle: 'View active zone boundaries & coverage',
      icon: 'map-marker-path',
      onPress: onPressZone,
    },
    {
      label: 'Notifications',
      subtitle: 'Field alerts, priority updates & sync status',
      icon: 'bell-outline',
      onPress: onPressNotifications,
    },
    {
      label: 'Priority Tasks',
      subtitle: 'Review high priority households & anomalies',
      icon: 'shield-alert-outline',
      onPress: onPressPriorityTasks,
    },
  ];

  const infoActions = [
    {
      label: 'Help & Field Support',
      subtitle: 'Contact supervisor or reported issues',
      icon: 'help-circle-outline',
      onPress: onPressHelp,
    },
    {
      label: 'About Lokvision',
      subtitle: 'App version, build info & enumeration details',
      icon: 'information-outline',
      onPress: onPressAbout,
    },
  ];

  return (
    <View style={styles.container}>
      {/* Navigation Group */}
      <View style={styles.groupCard}>
        <Text style={styles.groupTitle}>Field Navigation</Text>

        {primaryActions.map((action, index) => (
          <TouchableOpacity
            key={index}
            style={styles.actionRow}
            onPress={action.onPress}
            activeOpacity={0.7}
          >
            <View style={styles.iconWrap}>
              <MaterialCommunityIcons name={action.icon as any} size={20} color={ENUMERATOR_THEME.colors.accent} />
            </View>

            <View style={styles.textWrap}>
              <Text style={styles.actionLabel}>{action.label}</Text>
              <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
            </View>

            <Ionicons name="chevron-forward" size={18} color={ENUMERATOR_THEME.colors.textMuted} />
          </TouchableOpacity>
        ))}
      </View>

      {/* Support & System Group */}
      <View style={styles.groupCard}>
        <Text style={styles.groupTitle}>App & System</Text>

        {infoActions.map((action, index) => (
          <TouchableOpacity
            key={index}
            style={styles.actionRow}
            onPress={action.onPress}
            activeOpacity={0.7}
          >
            <View style={styles.iconWrap}>
              <MaterialCommunityIcons name={action.icon as any} size={20} color={ENUMERATOR_THEME.colors.textSecondary} />
            </View>

            <View style={styles.textWrap}>
              <Text style={styles.actionLabel}>{action.label}</Text>
              <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
            </View>

            <Ionicons name="chevron-forward" size={18} color={ENUMERATOR_THEME.colors.textMuted} />
          </TouchableOpacity>
        ))}
      </View>

      {/* Logout Action */}
      <TouchableOpacity
        style={styles.logoutBtn}
        onPress={onPressLogout}
        activeOpacity={0.8}
      >
        <MaterialCommunityIcons name="logout" size={20} color={ENUMERATOR_THEME.colors.danger} />
        <Text style={styles.logoutText}>Log Out of Field Account</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  groupCard: {
    backgroundColor: ENUMERATOR_THEME.colors.cardBackground,
    borderRadius: ENUMERATOR_THEME.borderRadius.xl,
    padding: 16,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
    gap: 12,
  },
  groupTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    gap: 12,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: ENUMERATOR_THEME.borderRadius.md,
    backgroundColor: ENUMERATOR_THEME.colors.subtleBackground,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textWrap: {
    flex: 1,
  },
  actionLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  actionSubtitle: {
    fontSize: 11,
    color: ENUMERATOR_THEME.colors.textMuted,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    borderRadius: ENUMERATOR_THEME.borderRadius.xl,
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 10,
    marginTop: 4,
  },
  logoutText: {
    fontSize: 14,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.danger,
  },
});
