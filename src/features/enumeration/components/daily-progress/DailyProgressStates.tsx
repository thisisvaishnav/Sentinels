import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { ENUMERATOR_THEME } from '../../theme';

interface LoadingStateProps {
  message?: string;
}

export const DailyProgressLoadingState: React.FC<LoadingStateProps> = ({
  message = 'Loading daily field progress...',
}) => (
  <View style={styles.stateContainer}>
    <ActivityIndicator size="large" color={ENUMERATOR_THEME.colors.accent} />
    <Text style={styles.loadingText}>{message}</Text>
  </View>
);

interface ErrorStateProps {
  message?: string;
  onRetry: () => void;
}

export const DailyProgressErrorState: React.FC<ErrorStateProps> = ({
  message = 'Unable to load daily progress. Try again.',
  onRetry,
}) => (
  <View style={styles.stateContainer}>
    <View style={styles.errorIconWrap}>
      <MaterialCommunityIcons name="cloud-off-outline" size={32} color={ENUMERATOR_THEME.colors.danger} />
    </View>
    <Text style={styles.errorTitle}>Connection or Data Error</Text>
    <Text style={styles.errorSubtitle}>{message}</Text>
    <TouchableOpacity
      style={styles.retryBtn}
      onPress={onRetry}
      activeOpacity={0.8}
      accessibilityLabel="Retry loading daily progress"
    >
      <Ionicons name="refresh" size={16} color="#FFFFFF" />
      <Text style={styles.retryBtnText}>Retry</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  stateContainer: {
    flex: 1,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: ENUMERATOR_THEME.colors.background,
  },
  loadingText: {
    fontSize: 14,
    fontWeight: '600',
    color: ENUMERATOR_THEME.colors.textSecondary,
    textAlign: 'center',
  },
  errorIconWrap: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  errorSubtitle: {
    fontSize: 13,
    color: ENUMERATOR_THEME.colors.textMuted,
    textAlign: 'center',
  },
  retryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: ENUMERATOR_THEME.colors.accent,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: ENUMERATOR_THEME.borderRadius.lg,
    marginTop: 8,
  },
  retryBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
