import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { ENUMERATOR_THEME } from '@/src/features/enumeration/theme';

interface AdminActionListProps {
  onPressEnumerators: () => void;
  onPressSurveys: () => void;
  onPressReports: () => void;
  onPressHelp: () => void;
  onPressAbout: () => void;
  onPressLogout: () => void;
}

export const AdminActionList: React.FC<AdminActionListProps> = ({
  onPressEnumerators,
  onPressSurveys,
  onPressReports,
  onPressHelp,
  onPressAbout,
  onPressLogout,
}) => {
  const managementActions = [
    {
      label: 'Field Enumerators',
      subtitle: 'Manage enumerator roster & deployments',
      icon: 'account-group-outline',
      onPress: onPressEnumerators,
    },
    {
      label: 'Survey Management',
      subtitle: 'Create, assign & track survey tasks',
      icon: 'clipboard-text-outline',
      onPress: onPressSurveys,
    },
    {
      label: 'Citizen Reports',
      subtitle: 'Review & resolve citizen complaints',
      icon: 'bullhorn-outline',
      onPress: onPressReports,
    },
  ];

  const infoActions = [
    {
      label: 'Help & Support',
      subtitle: 'Contact technical support team',
      icon: 'help-circle-outline',
      onPress: onPressHelp,
    },
    {
      label: 'About DRISHTI',
      subtitle: 'App version, build info & credits',
      icon: 'information-outline',
      onPress: onPressAbout,
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.groupCard}>
        <Text style={styles.groupTitle}>Management</Text>

        {managementActions.map((action, index) => (
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

      <TouchableOpacity
        style={styles.logoutBtn}
        onPress={onPressLogout}
        activeOpacity={0.8}
      >
        <MaterialCommunityIcons name="logout" size={20} color={ENUMERATOR_THEME.colors.danger} />
        <Text style={styles.logoutText}>Log Out of Admin Account</Text>
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
