import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SyncStatusInfo } from '../types';
import { ENUMERATOR_THEME } from '../theme';

interface SyncStatusSectionProps {
  syncInfo: SyncStatusInfo;
}

export const SyncStatusSection: React.FC<SyncStatusSectionProps> = ({ syncInfo }) => {
  const [pendingCount, setPendingCount] = useState(syncInfo.pendingCount);
  const [lastSync, setLastSync] = useState(syncInfo.lastSynced);
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSyncNow = () => {
    if (pendingCount === 0) {
      Alert.alert('Sync Status', 'All field records are up to date!');
      return;
    }

    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setPendingCount(0);
      setLastSync('Just now');
      Alert.alert('Sync Success', `Successfully synced ${pendingCount} offline records to Lokvision database.`);
    }, 1200);
  };

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View style={styles.iconBox}>
          <MaterialCommunityIcons name="cloud-sync-outline" size={24} color={ENUMERATOR_THEME.colors.accent} />
        </View>

        <View style={styles.textWrap}>
          <Text style={styles.title}>Sync Status</Text>
          <Text style={styles.subtitle}>
            {pendingCount > 0
              ? `${pendingCount} offline records waiting to upload`
              : 'All offline data synchronized'}
          </Text>
          <Text style={styles.lastSyncText}>Last synced: {lastSync}</Text>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.syncBtn, (isSyncing || pendingCount === 0) && styles.syncBtnDisabled]}
        onPress={handleSyncNow}
        disabled={isSyncing}
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: ENUMERATOR_THEME.colors.cardBackground,
    borderRadius: ENUMERATOR_THEME.borderRadius.xl,
    padding: 18,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
    gap: 14,
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
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  subtitle: {
    fontSize: 13,
    color: ENUMERATOR_THEME.colors.textSecondary,
  },
  lastSyncText: {
    fontSize: 11,
    color: ENUMERATOR_THEME.colors.textMuted,
    marginTop: 2,
  },
  syncBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: ENUMERATOR_THEME.colors.accent,
    paddingVertical: 12,
    borderRadius: ENUMERATOR_THEME.borderRadius.md,
    gap: 8,
  },
  syncBtnDisabled: {
    opacity: 0.65,
  },
  syncBtnText: {
    color: ENUMERATOR_THEME.colors.textWhite,
    fontSize: 14,
    fontWeight: '700',
  },
});
