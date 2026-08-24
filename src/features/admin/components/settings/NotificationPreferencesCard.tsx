import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ENUMERATOR_THEME } from '@/src/features/enumeration/theme';

interface NotificationPreference {
  id: string;
  label: string;
  subtitle: string;
  icon: string;
  enabled: boolean;
}

const DEFAULT_PREFERENCES: NotificationPreference[] = [
  {
    id: 'enumerator_updates',
    label: 'Enumerator Updates',
    subtitle: 'Status changes, location pings & assignments',
    icon: 'account-group-outline',
    enabled: true,
  },
  {
    id: 'report_alerts',
    label: 'Report Alerts',
    subtitle: 'New citizen reports & priority escalations',
    icon: 'bullhorn-outline',
    enabled: true,
  },
  {
    id: 'system_notifications',
    label: 'System Notifications',
    subtitle: 'App updates, maintenance & sync status',
    icon: 'cog-outline',
    enabled: false,
  },
  {
    id: 'priority_alerts',
    label: 'Priority Alerts',
    subtitle: 'Critical issues requiring immediate action',
    icon: 'shield-alert-outline',
    enabled: true,
  },
  {
    id: 'email_notifications',
    label: 'Email Notifications',
    subtitle: 'Daily summary reports to registered email',
    icon: 'email-outline',
    enabled: false,
  },
];

export const NotificationPreferencesCard: React.FC = () => {
  const [preferences, setPreferences] = useState(DEFAULT_PREFERENCES);

  const togglePreference = (id: string) => {
    setPreferences((prev) =>
      prev.map((pref) => (pref.id === id ? { ...pref, enabled: !pref.enabled } : pref))
    );
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <MaterialCommunityIcons name="bell-outline" size={20} color={ENUMERATOR_THEME.colors.accent} />
        <Text style={styles.cardTitle}>Notification Preferences</Text>
      </View>

      <View style={styles.list}>
        {preferences.map((pref) => (
          <View key={pref.id} style={styles.item}>
            <View style={styles.iconWrap}>
              <MaterialCommunityIcons name={pref.icon as any} size={18} color={ENUMERATOR_THEME.colors.textSecondary} />
            </View>

            <View style={styles.textWrap}>
              <Text style={styles.itemLabel}>{pref.label}</Text>
              <Text style={styles.itemSubtitle}>{pref.subtitle}</Text>
            </View>

            <Switch
              value={pref.enabled}
              onValueChange={() => togglePreference(pref.id)}
              trackColor={{ false: ENUMERATOR_THEME.colors.border, true: ENUMERATOR_THEME.colors.accentLight }}
              thumbColor={pref.enabled ? ENUMERATOR_THEME.colors.accent : ENUMERATOR_THEME.colors.textMuted}
            />
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: ENUMERATOR_THEME.colors.cardBackground,
    borderRadius: ENUMERATOR_THEME.borderRadius.xl,
    padding: 16,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
    gap: 14,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: ENUMERATOR_THEME.colors.subtleBackground,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  list: {
    gap: 4,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    gap: 12,
  },
  iconWrap: {
    width: 32,
    height: 32,
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
  itemLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  itemSubtitle: {
    fontSize: 11,
    color: ENUMERATOR_THEME.colors.textMuted,
  },
});
