import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ENUMERATOR_THEME } from '../../theme';

interface VerificationHeaderProps {
  pendingCount: number;
  totalRecordsCount: number;
  onRefresh: () => void;
}

export const VerificationHeader: React.FC<VerificationHeaderProps> = ({
  pendingCount,
  totalRecordsCount,
  onRefresh,
}) => {
  const router = useRouter();

  return (
    <View style={styles.headerContainer}>
      <View style={styles.topRow}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={22} color={ENUMERATOR_THEME.colors.textPrimary} />
        </TouchableOpacity>

        <View style={styles.titleWrap}>
          <View style={styles.brandBadge}>
            <MaterialCommunityIcons name="clipboard-check" size={14} color={ENUMERATOR_THEME.colors.accent} />
            <Text style={styles.brandText}>LOKVISION FIELD VERIFICATION</Text>
          </View>
          <Text style={styles.pageTitle}>Pending Verification</Text>
        </View>

        <TouchableOpacity style={styles.refreshBtn} onPress={onRefresh} activeOpacity={0.7}>
          <Ionicons name="refresh-outline" size={20} color={ENUMERATOR_THEME.colors.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* Subtitle & Local Storage Status */}
      <View style={styles.statusSubBar}>
        <View style={styles.statusDotWrap}>
          <View style={styles.pulseDot} />
          <Text style={styles.statusText}>
            Local Storage · {totalRecordsCount} Records Loaded
          </Text>
        </View>
        <View style={styles.countPill}>
          <Text style={styles.countPillText}>{pendingCount} Require Check</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: ENUMERATOR_THEME.colors.cardBackground,
    borderBottomWidth: 1,
    borderBottomColor: ENUMERATOR_THEME.colors.border,
    paddingTop: 8,
    paddingBottom: 12,
    paddingHorizontal: 16,
    gap: 10,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: ENUMERATOR_THEME.borderRadius.md,
    backgroundColor: ENUMERATOR_THEME.colors.subtleBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleWrap: {
    alignItems: 'center',
  },
  brandBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  brandText: {
    fontSize: 10,
    fontWeight: '800',
    color: ENUMERATOR_THEME.colors.accent,
    letterSpacing: 0.8,
  },
  pageTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  refreshBtn: {
    width: 38,
    height: 38,
    borderRadius: ENUMERATOR_THEME.borderRadius.md,
    backgroundColor: ENUMERATOR_THEME.colors.subtleBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusSubBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: ENUMERATOR_THEME.colors.background,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: ENUMERATOR_THEME.borderRadius.md,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
  },
  statusDotWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: ENUMERATOR_THEME.colors.accent,
  },
  statusText: {
    fontSize: 11,
    color: ENUMERATOR_THEME.colors.textSecondary,
    fontWeight: '600',
  },
  countPill: {
    backgroundColor: ENUMERATOR_THEME.colors.accentSubtle,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: ENUMERATOR_THEME.borderRadius.full,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.accentLight,
  },
  countPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.accent,
  },
});
