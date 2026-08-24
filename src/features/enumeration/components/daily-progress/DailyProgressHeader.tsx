import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ENUMERATOR_THEME } from '../../theme';

interface DailyProgressHeaderProps {
  onRefresh?: () => void;
  isOffline?: boolean;
}

export const DailyProgressHeader: React.FC<DailyProgressHeaderProps> = ({
  onRefresh,
  isOffline = false,
}) => {
  const router = useRouter();

  // Dynamic Date string in local device time
  const todayDateString = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.push('/(enumerator)/dashboard');
    }
  };

  return (
    <View style={styles.headerContainer}>
      <View style={styles.topRow}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={handleBack}
          activeOpacity={0.7}
          accessibilityLabel="Go back"
        >
          <Ionicons name="arrow-back" size={22} color={ENUMERATOR_THEME.colors.textPrimary} />
        </TouchableOpacity>

        <View style={styles.titleWrap}>
          <Text style={styles.brandSubtitle}>LOKVISION FIELD OPERATIONAL STATUS</Text>
          <Text style={styles.titleText}>Daily Progress</Text>
        </View>

        <View style={styles.actionsWrap}>
          {onRefresh && (
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={onRefresh}
              activeOpacity={0.7}
              accessibilityLabel="Refresh progress data"
            >
              <Ionicons name="refresh" size={20} color={ENUMERATOR_THEME.colors.accent} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.metaRow}>
        <View style={styles.dateBadge}>
          <MaterialCommunityIcons
            name="calendar-month-outline"
            size={16}
            color={ENUMERATOR_THEME.colors.accent}
          />
          <Text style={styles.dateText}>{todayDateString}</Text>
        </View>

        <View style={styles.statusBadge}>
          <View style={[styles.statusDot, isOffline ? styles.dotOffline : styles.dotOnline]} />
          <Text style={styles.statusText}>{isOffline ? 'Offline Activity' : 'Local Activity'}</Text>
        </View>
      </View>

      <Text style={styles.subtitleText}>Today{"'"}s field activity and completion status</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: ENUMERATOR_THEME.colors.cardBackground,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: ENUMERATOR_THEME.colors.border,
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
  brandSubtitle: {
    fontSize: 9,
    fontWeight: '800',
    color: ENUMERATOR_THEME.colors.accent,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  titleText: {
    fontSize: 20,
    fontWeight: '800',
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  actionsWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionBtn: {
    width: 38,
    height: 38,
    borderRadius: ENUMERATOR_THEME.borderRadius.md,
    backgroundColor: ENUMERATOR_THEME.colors.accentSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 8,
  },
  dateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: ENUMERATOR_THEME.colors.accentSubtle,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: ENUMERATOR_THEME.borderRadius.full,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.accentLight,
  },
  dateText: {
    fontSize: 12,
    fontWeight: '700',
    color: ENUMERATOR_THEME.colors.accent,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: ENUMERATOR_THEME.colors.subtleBackground,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: ENUMERATOR_THEME.borderRadius.full,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  dotOnline: {
    backgroundColor: ENUMERATOR_THEME.colors.success,
  },
  dotOffline: {
    backgroundColor: '#D97706',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    color: ENUMERATOR_THEME.colors.textSecondary,
  },
  subtitleText: {
    fontSize: 13,
    color: ENUMERATOR_THEME.colors.textSecondary,
    fontWeight: '500',
  },
});
