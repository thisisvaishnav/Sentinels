import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ENUMERATOR_THEME } from '@/src/features/enumeration/theme';

export const SecurityCard: React.FC = () => {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <MaterialCommunityIcons name="shield-lock-outline" size={20} color={ENUMERATOR_THEME.colors.accent} />
        <Text style={styles.cardTitle}>Security</Text>
      </View>

      <View style={styles.list}>
        <TouchableOpacity style={styles.item} activeOpacity={0.7}>
          <View style={styles.iconWrap}>
            <MaterialCommunityIcons name="key-outline" size={18} color={ENUMERATOR_THEME.colors.textSecondary} />
          </View>

          <View style={styles.textWrap}>
            <Text style={styles.itemLabel}>Change Password</Text>
            <Text style={styles.itemSubtitle}>Update your admin account password</Text>
          </View>

          <View style={styles.chevronWrap}>
            <MaterialCommunityIcons name="chevron-right" size={18} color={ENUMERATOR_THEME.colors.textMuted} />
          </View>
        </TouchableOpacity>

        <View style={styles.divider} />

        <View style={styles.infoRow}>
          <View style={styles.iconWrap}>
            <MaterialCommunityIcons name="login" size={18} color={ENUMERATOR_THEME.colors.textSecondary} />
          </View>

          <View style={styles.textWrap}>
            <Text style={styles.itemLabel}>Last Login</Text>
            <Text style={styles.itemSubtitle}>25 Aug 2026, 09:15 AM</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.infoRow}>
          <View style={styles.iconWrap}>
            <MaterialCommunityIcons name="devices" size={18} color={ENUMERATOR_THEME.colors.textSecondary} />
          </View>

          <View style={styles.textWrap}>
            <Text style={styles.itemLabel}>Active Sessions</Text>
            <Text style={styles.itemSubtitle}>1 device currently signed in</Text>
          </View>

          <View style={styles.sessionBadge}>
            <Text style={styles.sessionBadgeText}>Current</Text>
          </View>
        </View>
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
  infoRow: {
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
  chevronWrap: {
    padding: 2,
  },
  divider: {
    height: 1,
    backgroundColor: ENUMERATOR_THEME.colors.subtleBackground,
    marginLeft: 44,
  },
  sessionBadge: {
    backgroundColor: ENUMERATOR_THEME.colors.accentSubtle,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: ENUMERATOR_THEME.borderRadius.sm,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.accentLight,
  },
  sessionBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.accent,
  },
});
