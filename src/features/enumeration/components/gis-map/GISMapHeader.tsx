import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ENUMERATOR_THEME } from '../../theme';

interface GISMapHeaderProps {
  isOnline: boolean;
  lastSynced: string;
  onRefresh: () => void;
  isRefreshing?: boolean;
}

export const GISMapHeader: React.FC<GISMapHeaderProps> = ({
  isOnline,
  lastSynced,
  onRefresh,
  isRefreshing = false,
}) => {
  const router = useRouter();

  return (
    <View style={styles.header}>
      <View style={styles.topRow}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.back()}
          activeOpacity={0.7}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="arrow-back" size={22} color={ENUMERATOR_THEME.colors.textPrimary} />
        </TouchableOpacity>

        <View style={styles.titleContainer}>
          <Text style={styles.title}>GIS Field Map</Text>
          <Text style={styles.subtitle}>Assigned zone coverage & household locations</Text>
        </View>

        <TouchableOpacity
          style={[styles.refreshBtn, isRefreshing && styles.refreshingBtn]}
          onPress={onRefresh}
          disabled={isRefreshing}
          activeOpacity={0.7}
        >
          <Ionicons
            name="refresh-outline"
            size={20}
            color={ENUMERATOR_THEME.colors.accent}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.statusRow}>
        <View style={styles.badgeGroup}>
          <View
            style={[
              styles.statusDot,
              { backgroundColor: isOnline ? ENUMERATOR_THEME.colors.success : ENUMERATOR_THEME.colors.warning },
            ]}
          />
          <Text style={styles.statusText}>
            {isOnline ? 'Online Sync Active' : 'Offline Mode (Local Storage)'}
          </Text>
        </View>

        <View style={styles.syncGroup}>
          <MaterialCommunityIcons name="clock-outline" size={14} color={ENUMERATOR_THEME.colors.textMuted} />
          <Text style={styles.syncText}>Synced {lastSynced}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: ENUMERATOR_THEME.colors.cardBackground,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: ENUMERATOR_THEME.colors.border,
    gap: 10,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: ENUMERATOR_THEME.borderRadius.md,
    backgroundColor: ENUMERATOR_THEME.colors.subtleBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  subtitle: {
    fontSize: 12,
    color: ENUMERATOR_THEME.colors.textMuted,
    fontWeight: '500',
  },
  refreshBtn: {
    width: 36,
    height: 36,
    borderRadius: ENUMERATOR_THEME.borderRadius.md,
    backgroundColor: ENUMERATOR_THEME.colors.accentSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.accentLight,
  },
  refreshingBtn: {
    opacity: 0.6,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: ENUMERATOR_THEME.colors.subtleBackground,
  },
  badgeGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: ENUMERATOR_THEME.colors.textSecondary,
  },
  syncGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  syncText: {
    fontSize: 11,
    color: ENUMERATOR_THEME.colors.textMuted,
    fontWeight: '500',
  },
});
