import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { ENUMERATOR_THEME } from '@/src/features/enumeration/theme';

interface AppPreference {
  id: string;
  label: string;
  subtitle: string;
  icon: string;
  type: 'toggle' | 'select';
  enabled?: boolean;
  value?: string;
}

const DEFAULT_PREFERENCES: AppPreference[] = [
  {
    id: 'auto_sync',
    label: 'Auto-Sync Data',
    subtitle: 'Automatically sync when connected to internet',
    icon: 'cloud-sync-outline',
    type: 'toggle',
    enabled: true,
  },
  {
    id: 'dark_mode',
    label: 'Dark Mode',
    subtitle: 'Use dark theme across the application',
    icon: 'weather-night',
    type: 'toggle',
    enabled: false,
  },
  {
    id: 'map_provider',
    label: 'Map Provider',
    subtitle: 'Offline vector maps for field operations',
    icon: 'map-outline',
    type: 'select',
    value: 'Vector Maps',
  },
  {
    id: 'language',
    label: 'Language',
    subtitle: 'Display language for the admin interface',
    icon: 'translate',
    type: 'select',
    value: 'English',
  },
  {
    id: 'data_refresh',
    label: 'Data Refresh Interval',
    subtitle: 'How often to check for new data',
    icon: 'refresh-outline',
    type: 'select',
    value: 'Every 15 minutes',
  },
];

export const AppPreferencesCard: React.FC = () => {
  const [preferences, setPreferences] = useState(DEFAULT_PREFERENCES);

  const togglePreference = (id: string) => {
    setPreferences((prev) =>
      prev.map((pref) => (pref.id === id ? { ...pref, enabled: !pref.enabled } : pref))
    );
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <MaterialCommunityIcons name="cog-outline" size={20} color={ENUMERATOR_THEME.colors.accent} />
        <Text style={styles.cardTitle}>App Preferences</Text>
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

            {pref.type === 'toggle' ? (
              <Switch
                value={pref.enabled}
                onValueChange={() => togglePreference(pref.id)}
                trackColor={{ false: ENUMERATOR_THEME.colors.border, true: ENUMERATOR_THEME.colors.accentLight }}
                thumbColor={pref.enabled ? ENUMERATOR_THEME.colors.accent : ENUMERATOR_THEME.colors.textMuted}
              />
            ) : (
              <TouchableOpacity style={styles.selectBtn} activeOpacity={0.7}>
                <Text style={styles.selectValue}>{pref.value}</Text>
                <Ionicons name="chevron-forward" size={14} color={ENUMERATOR_THEME.colors.textMuted} />
              </TouchableOpacity>
            )}
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
  selectBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ENUMERATOR_THEME.colors.background,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: ENUMERATOR_THEME.borderRadius.sm,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
    gap: 4,
  },
  selectValue: {
    fontSize: 11,
    fontWeight: '600',
    color: ENUMERATOR_THEME.colors.textSecondary,
  },
});
