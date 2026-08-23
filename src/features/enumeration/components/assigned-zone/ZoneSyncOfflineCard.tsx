import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { ENUMERATOR_THEME } from '../../theme';

interface Props {
  isOffline: boolean;
  onToggleOffline: () => void;
  lastSyncedText: string;
}

export function ZoneSyncOfflineCard({ isOffline, onToggleOffline, lastSyncedText }: Props) {
  return (
    <View style={styles.container}>
      {/* Offline Mode Banner */}
      {isOffline && (
        <View style={styles.offlineBanner}>
          <Ionicons name="cloud-offline-outline" size={18} color="#92400E" />
          <View style={styles.offlineTextWrap}>
            <Text style={styles.offlineTitle}>Offline Mode Active</Text>
            <Text style={styles.offlineSubtitle}>Zone data shown from latest local device buffer.</Text>
          </View>
          <TouchableOpacity style={styles.toggleBtn} onPress={onToggleOffline} activeOpacity={0.7}>
            <Text style={styles.toggleBtnText}>Go Online</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Sync Status Card */}
      <View style={styles.syncCard}>
        <View style={styles.syncLeft}>
          <MaterialCommunityIcons
            name={isOffline ? 'cloud-off-outline' : 'cloud-check-outline'}
            size={22}
            color={isOffline ? '#D97706' : ENUMERATOR_THEME.colors.success}
          />
          <View>
            <Text style={styles.syncTitle}>
              {isOffline ? 'Sync Paused (Offline)' : 'All Records Synchronized'}
            </Text>
            <Text style={styles.syncSub}>Last sync: {lastSyncedText}</Text>
          </View>
        </View>

        {!isOffline && (
          <TouchableOpacity style={styles.syncBtn} onPress={onToggleOffline} activeOpacity={0.7}>
            <MaterialCommunityIcons name="wifi-off" size={14} color={ENUMERATOR_THEME.colors.textSecondary} />
            <Text style={styles.syncBtnText}>Simulate Offline</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },
  offlineBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    borderRadius: ENUMERATOR_THEME.borderRadius.lg,
    padding: 12,
    borderWidth: 1,
    borderColor: '#FCD34D',
    gap: 10,
  },
  offlineTextWrap: {
    flex: 1,
  },
  offlineTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#92400E',
  },
  offlineSubtitle: {
    fontSize: 11,
    color: '#B45309',
  },
  toggleBtn: {
    backgroundColor: '#D97706',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: ENUMERATOR_THEME.borderRadius.md,
  },
  toggleBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  syncCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: ENUMERATOR_THEME.colors.cardBackground,
    borderRadius: ENUMERATOR_THEME.borderRadius.xl,
    padding: 14,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
  },
  syncLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  syncTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  syncSub: {
    fontSize: 11,
    color: ENUMERATOR_THEME.colors.textMuted,
  },
  syncBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ENUMERATOR_THEME.colors.subtleBackground,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: ENUMERATOR_THEME.borderRadius.md,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
    gap: 4,
  },
  syncBtnText: {
    fontSize: 11,
    fontWeight: '600',
    color: ENUMERATOR_THEME.colors.textSecondary,
  },
});
