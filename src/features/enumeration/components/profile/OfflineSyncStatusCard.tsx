import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ENUMERATOR_THEME } from '../../theme';

export const OfflineSyncStatusCard: React.FC = () => {
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.iconWrap}>
          <MaterialCommunityIcons name="cloud-sync-outline" size={20} color={ENUMERATOR_THEME.colors.accent} />
        </View>

        <View style={styles.titleWrap}>
          <Text style={styles.title}>Data Status & Sync</Text>
          <Text style={styles.subtitle}>Offline Mode Ready</Text>
        </View>

        <View style={styles.readyBadge}>
          <View style={styles.readyDot} />
          <Text style={styles.readyText}>Local Active</Text>
        </View>
      </View>

      <Text style={styles.description}>
        Your locally saved records and household drafts are securely stored on device. Changes sync automatically when internet connectivity is established.
      </Text>

      <View style={styles.infoFooter}>
        <MaterialCommunityIcons name="shield-check-outline" size={14} color={ENUMERATOR_THEME.colors.textMuted} />
        <Text style={styles.footerText}>Local Field Store: AsyncStorage `@lokvision_`</Text>
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
    gap: 10,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: ENUMERATOR_THEME.borderRadius.lg,
    backgroundColor: ENUMERATOR_THEME.colors.accentSubtle,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.accentLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleWrap: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '600',
    color: ENUMERATOR_THEME.colors.accent,
  },
  readyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: ENUMERATOR_THEME.borderRadius.full,
    borderWidth: 1,
    borderColor: '#A7F3D0',
    gap: 4,
  },
  readyDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: ENUMERATOR_THEME.colors.success,
  },
  readyText: {
    fontSize: 11,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.success,
  },
  description: {
    fontSize: 12,
    color: ENUMERATOR_THEME.colors.textSecondary,
    lineHeight: 18,
  },
  infoFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: ENUMERATOR_THEME.colors.subtleBackground,
  },
  footerText: {
    fontSize: 11,
    color: ENUMERATOR_THEME.colors.textMuted,
  },
});
