import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { ENUMERATOR_THEME } from '../../theme';

interface AnomalyEmptyStateProps {
  totalRecordsAnalyzed: number;
}

export const AnomalyEmptyState: React.FC<AnomalyEmptyStateProps> = ({ totalRecordsAnalyzed }) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconCircleSuccess}>
        <MaterialCommunityIcons name="shield-check-outline" size={44} color={ENUMERATOR_THEME.colors.success} />
      </View>
      <Text style={styles.title}>No Anomalies Detected</Text>
      <Text style={styles.description}>
        Current household records do not contain issues matching the configured validation rules.
      </Text>

      <View style={styles.scannedBadge}>
        <Ionicons name="checkmark-done" size={14} color={ENUMERATOR_THEME.colors.success} />
        <Text style={styles.scannedText}>{totalRecordsAnalyzed} Records Analyzed Cleanly</Text>
      </View>
    </View>
  );
};

interface AnomalyFilterEmptyStateProps {
  onClearFilters: () => void;
}

export const AnomalyFilterEmptyState: React.FC<AnomalyFilterEmptyStateProps> = ({
  onClearFilters,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconCircleSubtle}>
        <Ionicons name="filter-outline" size={36} color={ENUMERATOR_THEME.colors.textMuted} />
      </View>
      <Text style={styles.title}>No Anomalies Found</Text>
      <Text style={styles.description}>
        No anomalies match the selected category filter or search query.
      </Text>
      <TouchableOpacity style={styles.clearBtn} onPress={onClearFilters} activeOpacity={0.8}>
        <Ionicons name="refresh" size={14} color={ENUMERATOR_THEME.colors.textWhite} />
        <Text style={styles.clearBtnText}>Reset Category & Search</Text>
      </TouchableOpacity>
    </View>
  );
};

export const AnomalyLoadingState: React.FC = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={ENUMERATOR_THEME.colors.accent} />
      <Text style={styles.loadingTitle}>Analyzing Household Store...</Text>
      <Text style={styles.description}>Executing local deterministic detection rules.</Text>
    </View>
  );
};

interface AnomalyErrorStateProps {
  onRetry: () => void;
}

export const AnomalyErrorState: React.FC<AnomalyErrorStateProps> = ({ onRetry }) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconCircleDanger}>
        <MaterialCommunityIcons name="alert-outline" size={40} color={ENUMERATOR_THEME.colors.dangerText} />
      </View>
      <Text style={styles.title}>Analysis Error</Text>
      <Text style={styles.description}>
        Unable to analyze household records. Please verify local dataset and try again.
      </Text>
      <TouchableOpacity style={styles.retryBtn} onPress={onRetry} activeOpacity={0.8}>
        <Ionicons name="refresh-outline" size={16} color={ENUMERATOR_THEME.colors.textWhite} />
        <Text style={styles.retryBtnText}>Retry Analysis</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    gap: 10,
    backgroundColor: ENUMERATOR_THEME.colors.cardBackground,
    borderRadius: ENUMERATOR_THEME.borderRadius.lg,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
    marginHorizontal: 16,
    marginTop: 12,
  },
  iconCircleSuccess: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: ENUMERATOR_THEME.colors.successBg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.successBorder,
  },
  iconCircleSubtle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: ENUMERATOR_THEME.colors.subtleBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircleDanger: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: ENUMERATOR_THEME.colors.dangerBg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.dangerBorder,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  loadingTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  description: {
    fontSize: 13,
    color: ENUMERATOR_THEME.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
  scannedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: ENUMERATOR_THEME.colors.successBg,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: ENUMERATOR_THEME.borderRadius.full,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.successBorder,
    marginTop: 4,
  },
  scannedText: {
    fontSize: 12,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.successText,
  },
  clearBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: ENUMERATOR_THEME.colors.accent,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: ENUMERATOR_THEME.borderRadius.md,
    marginTop: 6,
  },
  clearBtnText: {
    color: ENUMERATOR_THEME.colors.textWhite,
    fontSize: 12,
    fontWeight: '700',
  },
  retryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: ENUMERATOR_THEME.colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: ENUMERATOR_THEME.borderRadius.md,
    marginTop: 6,
  },
  retryBtnText: {
    color: ENUMERATOR_THEME.colors.textWhite,
    fontSize: 12,
    fontWeight: '700',
  },
});
