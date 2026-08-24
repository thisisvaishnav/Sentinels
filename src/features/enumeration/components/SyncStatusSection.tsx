import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { syncManager } from '../services/syncManager';
import { networkStatusService } from '../services/networkStatus';
import { SyncQueueStats } from '../types/syncTypes';
import { ENUMERATOR_THEME } from '../theme';

interface SyncStatusSectionProps {
  syncInfo?: { pendingCount: number; lastSynced: string };
}

export const SyncStatusSection: React.FC<SyncStatusSectionProps> = () => {
  const router = useRouter();
  const [stats, setStats] = useState<SyncQueueStats>({
    totalCount: 0,
    pendingCount: 0,
    syncingCount: 0,
    syncedCount: 0,
    failedCount: 0,
    lastSyncedText: 'Never',
    isOnline: true,
  });
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  useEffect(() => {
    // Initialize sync manager on mount
    syncManager.initialize();

    const unsubscribe = syncManager.subscribe((updatedStats) => {
      setStats(updatedStats);
      setIsSyncing(syncManager.isCurrentlySyncing());
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleSyncNow = async () => {
    if (stats.pendingCount === 0 && stats.failedCount === 0) {
      Alert.alert('Sync Status', 'All offline field records are fully synchronized!');
      return;
    }

    setIsSyncing(true);
    const result = await syncManager.syncNow();
    setIsSyncing(false);

    if (result.success) {
      Alert.alert('Sync Complete', result.message);
    } else {
      Alert.alert('Sync Status', result.message);
    }
  };

  const handleToggleOnline = () => {
    const nextStatus = networkStatusService.toggleStatus();
    Alert.alert(
      'Network Simulated',
      `Device is now ${nextStatus === 'ONLINE' ? 'Online 🌐' : 'Offline 📡'}`
    );
  };

  return (
    <View style={styles.container}>
      {/* Top Header Row with Online/Offline indicator and Navigation */}
      <View style={styles.topRow}>
        <View style={styles.iconBox}>
          <MaterialCommunityIcons name="cloud-sync-outline" size={24} color={ENUMERATOR_THEME.colors.accent} />
        </View>

        <View style={styles.textWrap}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>Sync Status</Text>
            <TouchableOpacity onPress={handleToggleOnline} activeOpacity={0.7}>
              <View
                style={[
                  styles.networkBadge,
                  stats.isOnline ? styles.badgeOnline : styles.badgeOffline,
                ]}
              >
                <View
                  style={[
                    styles.dot,
                    stats.isOnline ? styles.dotOnline : styles.dotOffline,
                  ]}
                />
                <Text
                  style={[
                    styles.networkText,
                    stats.isOnline ? styles.textOnline : styles.textOffline,
                  ]}
                >
                  {stats.isOnline ? 'Online' : 'Offline'}
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          <Text style={styles.subtitle}>
            {!stats.isOnline
              ? 'Device offline · Saved on device'
              : stats.pendingCount > 0
              ? `${stats.pendingCount} offline item(s) waiting to upload`
              : stats.failedCount > 0
              ? `${stats.failedCount} item(s) failed sync`
              : 'All offline data synchronized'}
          </Text>

          <Text style={styles.lastSyncText}>Last synced: {stats.lastSyncedText}</Text>
        </View>
      </View>

      {/* Button Toolbar */}
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[
            styles.syncBtn,
            (isSyncing || !stats.isOnline || (stats.pendingCount === 0 && stats.failedCount === 0)) &&
              styles.syncBtnDisabled,
          ]}
          onPress={handleSyncNow}
          disabled={isSyncing || !stats.isOnline}
          activeOpacity={0.8}
        >
          {isSyncing ? (
            <ActivityIndicator color={ENUMERATOR_THEME.colors.textWhite} size="small" />
          ) : (
            <MaterialCommunityIcons name="cloud-upload-outline" size={18} color={ENUMERATOR_THEME.colors.textWhite} />
          )}
          <Text style={styles.syncBtnText}>
            {isSyncing ? 'Syncing...' : 'Sync Now'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.detailsBtn}
          onPress={() => router.push('/(enumerator)/sync')}
          activeOpacity={0.8}
        >
          <Ionicons name="list-outline" size={16} color={ENUMERATOR_THEME.colors.accent} />
          <Text style={styles.detailsBtnText}>Queue List</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: ENUMERATOR_THEME.colors.cardBackground,
    borderRadius: ENUMERATOR_THEME.borderRadius.xl,
    padding: 16,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
    gap: 12,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: ENUMERATOR_THEME.borderRadius.lg,
    backgroundColor: ENUMERATOR_THEME.colors.accentSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textWrap: {
    flex: 1,
    gap: 2,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  networkBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: ENUMERATOR_THEME.borderRadius.full,
  },
  badgeOnline: {
    backgroundColor: ENUMERATOR_THEME.colors.successBg,
  },
  badgeOffline: {
    backgroundColor: ENUMERATOR_THEME.colors.warningBg,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  dotOnline: {
    backgroundColor: ENUMERATOR_THEME.colors.success,
  },
  dotOffline: {
    backgroundColor: ENUMERATOR_THEME.colors.warning,
  },
  networkText: {
    fontSize: 11,
    fontWeight: '700',
  },
  textOnline: {
    color: ENUMERATOR_THEME.colors.successText,
  },
  textOffline: {
    color: ENUMERATOR_THEME.colors.warningText,
  },
  subtitle: {
    fontSize: 12,
    color: ENUMERATOR_THEME.colors.textSecondary,
  },
  lastSyncText: {
    fontSize: 11,
    color: ENUMERATOR_THEME.colors.textMuted,
  },
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  syncBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: ENUMERATOR_THEME.colors.accent,
    paddingVertical: 10,
    borderRadius: ENUMERATOR_THEME.borderRadius.md,
    gap: 6,
  },
  syncBtnDisabled: {
    opacity: 0.6,
  },
  syncBtnText: {
    color: ENUMERATOR_THEME.colors.textWhite,
    fontSize: 13,
    fontWeight: '700',
  },
  detailsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: ENUMERATOR_THEME.colors.accentSubtle,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: ENUMERATOR_THEME.borderRadius.md,
    gap: 6,
  },
  detailsBtnText: {
    color: ENUMERATOR_THEME.colors.accent,
    fontSize: 13,
    fontWeight: '700',
  },
});
