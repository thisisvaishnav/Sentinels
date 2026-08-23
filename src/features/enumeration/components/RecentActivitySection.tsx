import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { EnumeratorActivity } from '../types';
import { ENUMERATOR_THEME } from '../theme';

interface RecentActivitySectionProps {
  activities: EnumeratorActivity[];
}

export const RecentActivitySection: React.FC<RecentActivitySectionProps> = ({ activities }) => {
  const getIconConfig = (type: EnumeratorActivity['type']) => {
    switch (type) {
      case 'registered':
        return { name: 'home-plus-outline' as const, color: ENUMERATOR_THEME.colors.success, bg: ENUMERATOR_THEME.colors.successBg };
      case 'verified':
        return { name: 'checkbox-marked-circle-outline' as const, color: ENUMERATOR_THEME.colors.accent, bg: ENUMERATOR_THEME.colors.accentSubtle };
      case 'missing':
        return { name: 'alert-decagram-outline' as const, color: ENUMERATOR_THEME.colors.warning, bg: ENUMERATOR_THEME.colors.warningBg };
      case 'sync':
        return { name: 'cloud-check-outline' as const, color: ENUMERATOR_THEME.colors.accentDark, bg: ENUMERATOR_THEME.colors.accentSubtle };
      default:
        return { name: 'text-box-outline' as const, color: ENUMERATOR_THEME.colors.textMuted, bg: ENUMERATOR_THEME.colors.subtleBackground };
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Recent Activity</Text>

      <View style={styles.list}>
        {activities.map((item) => {
          const config = getIconConfig(item.type);
          return (
            <View key={item.id} style={styles.item}>
              <View style={[styles.iconBox, { backgroundColor: config.bg }]}>
                <MaterialCommunityIcons name={config.name} size={20} color={config.color} />
              </View>

              <View style={styles.textWrap}>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.itemDetail}>{item.detail}</Text>
                <Text style={styles.timestamp}>{item.timestamp}</Text>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  list: {
    backgroundColor: ENUMERATOR_THEME.colors.cardBackground,
    borderRadius: ENUMERATOR_THEME.borderRadius.xl,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
    overflow: 'hidden',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: ENUMERATOR_THEME.colors.border,
    gap: 12,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: ENUMERATOR_THEME.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  textWrap: {
    flex: 1,
    gap: 2,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  itemDetail: {
    fontSize: 13,
    color: ENUMERATOR_THEME.colors.textSecondary,
    lineHeight: 18,
  },
  timestamp: {
    fontSize: 11,
    color: ENUMERATOR_THEME.colors.textMuted,
    marginTop: 2,
  },
});
